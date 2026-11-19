resource "aws_sns_topic" "alerts" {
  name = "${var.project}-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Task 4: email on overload and a second one when it is back to normal.
resource "aws_cloudwatch_metric_alarm" "api_cpu_high" {
  alarm_name        = "${var.project}-api-cpu-high"
  alarm_description = "API CPU above 70% for 2 minutes, autoscaling is not keeping up"
  namespace         = "AWS/ECS"
  metric_name       = "CPUUtilization"
  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.api.name
  }
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 2
  datapoints_to_alarm = 2
  threshold           = 70
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "missing"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "target_5xx" {
  alarm_name          = "${var.project}-target-5xx"
  alarm_description   = "API returns 5xx"
  namespace           = "AWS/ApplicationELB"
  metric_name         = "HTTPCode_Target_5XX_Count"
  dimensions          = { LoadBalancer = aws_lb.main.arn_suffix }
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 5
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "no_healthy_hosts" {
  alarm_name        = "${var.project}-no-healthy-hosts"
  alarm_description = "Not passing the health check"
  namespace         = "AWS/ApplicationELB"
  metric_name       = "HealthyHostCount"
  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.api.arn_suffix
  }
  statistic           = "Minimum"
  period              = 60
  evaluation_periods  = 2
  threshold           = 1
  comparison_operator = "LessThanThreshold"
  treat_missing_data  = "breaching"
  alarm_actions       = [aws_sns_topic.alerts.arn]
  ok_actions          = [aws_sns_topic.alerts.arn]
}

locals {
  lb      = aws_lb.main.arn_suffix
  cluster = aws_ecs_cluster.main.name
  api     = aws_ecs_service.api.name
  worker  = aws_ecs_service.worker.name

  w = { region = var.region, period = 60, liveData = true, yAxis = { left = { min = 0 } } }
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project}-dashboard"
  dashboard_body = jsonencode({
    widgets = [
      # Task 3: the five required graphs
      {
        type = "metric", x = 0, y = 0, width = 12, height = 6
        properties = merge(local.w, {
          title = "1. API tasks: desired vs running"
          metrics = [
            ["ECS/ContainerInsights", "DesiredTaskCount", "ClusterName", local.cluster, "ServiceName", local.api, { stat = "Maximum", label = "desired" }],
            ["ECS/ContainerInsights", "RunningTaskCount", "ClusterName", local.cluster, "ServiceName", local.api, { stat = "Maximum", label = "running" }],
          ]
          yAxis       = { left = { min = 0, max = var.api_max_count + 1 } }
          annotations = { horizontal = [{ value = var.api_max_count, label = "max" }] }
        })
      },
      {
        type = "metric", x = 12, y = 0, width = 12, height = 6
        properties = merge(local.w, {
          title = "2. API CPU utilization (%)"
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ClusterName", local.cluster, "ServiceName", local.api, { stat = "Average", label = "avg CPU" }],
            ["AWS/ECS", "CPUUtilization", "ClusterName", local.cluster, "ServiceName", local.api, { stat = "Maximum", label = "max task CPU" }],
          ]
          yAxis = { left = { min = 0, max = 100 } }
          annotations = { horizontal = [
            { value = var.cpu_target, label = "scaling target ${var.cpu_target}%" },
            { value = 70, label = "alarm 70%", color = "#d62728" },
          ] }
        })
      },
      {
        type = "metric", x = 0, y = 6, width = 8, height = 6
        properties = merge(local.w, {
          title   = "3. Requests / min"
          metrics = [["AWS/ApplicationELB", "RequestCount", "LoadBalancer", local.lb, { stat = "Sum", label = "requests" }]]
        })
      },
      {
        type = "metric", x = 8, y = 6, width = 8, height = 6
        properties = merge(local.w, {
          title = "4. Latency p95 (s)"
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", local.lb, { stat = "p95", label = "p95" }],
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", local.lb, { stat = "p50", label = "p50" }],
          ]
          annotations = { horizontal = [{ value = 0.5, label = "500 ms" }] }
        })
      },
      {
        type = "metric", x = 16, y = 6, width = 8, height = 6
        properties = merge(local.w, {
          title = "5. 5xx responses / min"
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", local.lb, { stat = "Sum", label = "from app" }],
            ["AWS/ApplicationELB", "HTTPCode_ELB_5XX_Count", "LoadBalancer", local.lb, { stat = "Sum", label = "from ALB" }],
          ]
        })
      },

      # Cache (task 5)
      {
        type = "metric", x = 0, y = 12, width = 8, height = 6
        properties = merge(local.w, {
          title = "Database load: RDS CPU (%) / connections"
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.main.identifier, { stat = "Average", label = "RDS CPU %" }],
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", aws_db_instance.main.identifier, { stat = "Maximum", label = "connections", yAxis = "right" }],
          ]
        })
      },
      {
        type = "metric", x = 8, y = 12, width = 8, height = 6
        properties = merge(local.w, {
          title = "Redis hit rate (%) / commands"
          metrics = [
            ["AWS/ElastiCache", "CacheHitRate", "CacheClusterId", local.cache_cluster_id, { stat = "Average", label = "hit rate %" }],
            ["AWS/ElastiCache", "GetTypeCmds", "CacheClusterId", local.cache_cluster_id, { stat = "Sum", label = "GET cmds", yAxis = "right" }],
          ]
          yAxis = { left = { min = 0, max = 100 } }
        })
      },
      {
        type = "metric", x = 16, y = 12, width = 8, height = 6
        properties = merge(local.w, {
          title = "Response codes / min"
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_2XX_Count", "LoadBalancer", local.lb, { stat = "Sum", label = "2xx" }],
            ["AWS/ApplicationELB", "HTTPCode_Target_4XX_Count", "LoadBalancer", local.lb, { stat = "Sum", label = "4xx" }],
          ]
        })
      },

      # Queue (bonus task 6)
      {
        type = "metric", x = 0, y = 18, width = 12, height = 6
        properties = merge(local.w, {
          title = "Orders queue: waiting messages / worker tasks"
          metrics = [
            ["AWS/SQS", "ApproximateNumberOfMessagesVisible", "QueueName", aws_sqs_queue.orders.name, { stat = "Maximum", label = "waiting" }],
            ["AWS/SQS", "NumberOfMessagesDeleted", "QueueName", aws_sqs_queue.orders.name, { stat = "Sum", label = "processed / min" }],
            ["ECS/ContainerInsights", "RunningTaskCount", "ClusterName", local.cluster, "ServiceName", local.worker, { stat = "Maximum", label = "workers", yAxis = "right" }],
          ]
          annotations = { horizontal = [{ value = 20, label = "scale-out threshold" }] }
        })
      },
      {
        type = "alarm", x = 12, y = 18, width = 12, height = 6
        properties = {
          title = "Alarms"
          alarms = [
            aws_cloudwatch_metric_alarm.api_cpu_high.arn,
            aws_cloudwatch_metric_alarm.target_5xx.arn,
            aws_cloudwatch_metric_alarm.no_healthy_hosts.arn,
            aws_cloudwatch_metric_alarm.queue_backlog_high.arn,
          ]
        }
      },
    ]
  })
}
