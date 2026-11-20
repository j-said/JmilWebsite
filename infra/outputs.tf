locals {
  alb_url = "http://${aws_lb.main.dns_name}"
}

output "alb_url" {
  description = "public"
  value       = local.alb_url
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

output "frontend_url" {
  value = local.frontend_url
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_id" {
  description = "GitHub → Settings → Variables → CLOUDFRONT_DISTRIBUTION_ID"
  value       = aws_cloudfront_distribution.main.id
}

output "frontend_bucket" {
  description = "GitHub → Settings → Variables → FRONTEND_BUCKET"
  value       = aws_s3_bucket.frontend.bucket
}

output "acm_validation_records" {
  description = "CNAMEs for ACM validation (no Route 53)"
  value = !local.use_route53 ? [
    for dvo in flatten(aws_acm_certificate.frontend[*].domain_validation_options) : {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  ] : []
}
