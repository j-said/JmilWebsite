# API: keep average CPU around the target.
resource "aws_appautoscaling_target" "api" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.api.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = var.api_min_count
  max_capacity       = var.api_max_count
}

resource "aws_appautoscaling_policy" "api_cpu" {
  name               = "${var.project}-api-cpu-target"
  policy_type        = "TargetTrackingScaling"
  service_namespace  = aws_appautoscaling_target.api.service_namespace
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension

  target_tracking_scaling_policy_configuration {
    target_value = var.cpu_target

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    scale_out_cooldown = 60
    scale_in_cooldown  = 180 # removing tasks too early hurts users more than an extra task
  }
}

# Day/night minimum (bonus task 8).

resource "aws_appautoscaling_scheduled_action" "api_day" {
  count              = var.scheduled_scaling ? 1 : 0
  name               = "${var.project}-api-day"
  service_namespace  = aws_appautoscaling_target.api.service_namespace
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  schedule           = "cron(0 8 * * ? *)"
  timezone           = "Europe/Kyiv"

  scalable_target_action {
    min_capacity = 2
    max_capacity = var.api_max_count
  }
}

resource "aws_appautoscaling_scheduled_action" "api_night" {
  count              = var.scheduled_scaling ? 1 : 0
  name               = "${var.project}-api-night"
  service_namespace  = aws_appautoscaling_target.api.service_namespace
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  schedule           = "cron(0 22 * * ? *)"
  timezone           = "Europe/Kyiv"

  scalable_target_action {
    min_capacity = 1
    max_capacity = var.api_max_count
  }

  depends_on = [aws_appautoscaling_scheduled_action.api_day]
}

# Worker: scale on queue length (bonus task 6).

resource "aws_appautoscaling_target" "worker" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.worker.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  min_capacity       = 1
  max_capacity       = 4
}

resource "aws_appautoscaling_policy" "worker_out" {
  name               = "${var.project}-worker-scale-out"
  policy_type        = "StepScaling"
  service_namespace  = aws_appautoscaling_target.worker.service_namespace
  resource_id        = aws_appautoscaling_target.worker.resource_id
  scalable_dimension = aws_appautoscaling_target.worker.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Maximum"

    # Bounds are relative to the alarm threshold of 20 messages.
    step_adjustment { # 20..100
      metric_interval_lower_bound = 0
      metric_interval_upper_bound = 80
      scaling_adjustment          = 1
    }
    step_adjustment { # 100+
      metric_interval_lower_bound = 80
      scaling_adjustment          = 2
    }
  }
}

resource "aws_appautoscaling_policy" "worker_in" {
  name               = "${var.project}-worker-scale-in"
  policy_type        = "StepScaling"
  service_namespace  = aws_appautoscaling_target.worker.service_namespace
  resource_id        = aws_appautoscaling_target.worker.resource_id
  scalable_dimension = aws_appautoscaling_target.worker.scalable_dimension

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 120
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "queue_backlog_high" {
  alarm_name          = "${var.project}-orders-backlog-high"
  alarm_description   = "Orders are piling up: add workers"
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  dimensions          = { QueueName = aws_sqs_queue.orders.name }
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 20
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_appautoscaling_policy.worker_out.arn]
}

resource "aws_cloudwatch_metric_alarm" "queue_backlog_empty" {
  alarm_name          = "${var.project}-orders-backlog-empty"
  alarm_description   = "Queue empty for 3 minutes: remove workers"
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  dimensions          = { QueueName = aws_sqs_queue.orders.name }
  statistic           = "Maximum"
  period              = 60
  evaluation_periods  = 3
  threshold           = 1
  comparison_operator = "LessThanThreshold"
  treat_missing_data  = "breaching" # an idle queue stops sending metrics
  alarm_actions       = [aws_appautoscaling_policy.worker_in.arn]
}
