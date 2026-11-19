# Queue worker: same image as the API, different command. No load balancer.

resource "aws_iam_role" "worker_task" {
  name               = "${var.project}-ecs-worker-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_tasks_assume.json
}

resource "aws_iam_role_policy" "worker_sqs" {
  name = "consume-orders"
  role = aws_iam_role.worker_task.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:ChangeMessageVisibility",
        "sqs:GetQueueAttributes",
      ]
      Resource = aws_sqs_queue.orders.arn
    }]
  })
}

resource "aws_ecs_task_definition" "worker" {
  family                   = "${var.project}-worker"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.worker_task.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([{
    name      = "worker"
    image     = "${aws_ecr_repository.api.repository_url}:${var.image_tag}"
    essential = true
    command   = ["python", "-m", "app.worker"]

    environment = [
      { name = "ENVIRONMENT", value = "aws" },
      { name = "DB_HOST", value = aws_db_instance.main.address },
      { name = "DB_PORT", value = tostring(aws_db_instance.main.port) },
      { name = "DB_NAME", value = var.db_name },
      { name = "DB_USER", value = var.db_username },
      { name = "REDIS_URL", value = local.redis_url },
      { name = "ORDER_QUEUE_URL", value = aws_sqs_queue.orders.url },
      { name = "AWS_REGION", value = var.region },
      { name = "WORKER_PROCESSING_SECONDS", value = tostring(var.worker_processing_seconds) },
      { name = "WORKER_BATCH_SIZE", value = "5" },
    ]

    secrets = [
      { name = "DB_PASSWORD", valueFrom = "${aws_db_instance.main.master_user_secret[0].secret_arn}:password::" },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.api.name
        awslogs-region        = var.region
        awslogs-stream-prefix = "worker"
      }
    }
  }])
}

resource "aws_ecs_service" "worker" {
  name            = "${var.project}-worker"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.worker.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.worker.id]
    assign_public_ip = true # no NAT gateway, needs a public IP to reach SQS and ECR
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  # The API runs the migrations, so start the worker after it.
  depends_on = [aws_ecs_service.api]
}
