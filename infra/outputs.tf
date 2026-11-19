output "alb_url" {
  description = "public"
  value       = "http://${aws_lb.main.dns_name}"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "ecs_cluster" {
  value = aws_ecs_cluster.main.name
}

output "ecs_service" {
  value = aws_ecs_service.api.name
}

output "github_deploy_role_arn" {
  description = "GitHub → Settings → Variables → AWS_ROLE_ARN"
  value       = aws_iam_role.github_deploy.arn
}

output "db_endpoint" {
  value = aws_db_instance.main.address
}

output "redis_endpoint" {
  value = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "order_queue_url" {
  value = aws_sqs_queue.orders.url
}

output "dashboard_url" {
  value = "https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#dashboards/dashboard/${aws_cloudwatch_dashboard.main.dashboard_name}"
}
