variable "project" {
  description = "prefix"
  type        = string
  default     = "jmil"
}

variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "image_tag" {
  type = string
}

variable "desired_count" {
  description = "ECS tasks limit"
  type        = number
  default     = 1
}

variable "db_name" {
  type    = string
  default = "jmil"
}

variable "db_username" {
  type    = string
  default = "jmil"
}

variable "github_repo" {
  type    = string
  default = "j-said/JmilWebsite"
}

variable "alert_email" {
  type = string
}

variable "api_min_count" {
  description = "Autoscaling minimum for the API service"
  type        = number
  default     = 1
}

variable "api_max_count" {
  description = "Autoscaling maximum for the API service (lab limit: 4)"
  type        = number
  default     = 4
  validation {
    condition     = var.api_max_count <= 4
    error_message = "The lab allows at most 4 instances."
  }
}

variable "cpu_target" {
  description = "Target average CPU (%) for target tracking"
  type        = number
  default     = 60
}

variable "cache_enabled" {
  description = "Serve GET /products cache-aside from Redis"
  type        = bool
  default     = true
}

variable "scheduled_scaling" {
  description = "Day/night minimum capacity (2 by day, 1 at night)"
  type        = bool
  default     = false
}

variable "worker_processing_seconds" {
  description = "Simulated slow step per message in the queue worker"
  type        = number
  default     = 1
}

variable "domain_name" {
  description = "Custom domain; empty = *.cloudfront.net"
  type        = string
  default     = ""
}

variable "route53_zone_id" {
  description = "Route 53 zone for domain_name; empty = manual DNS"
  type        = string
  default     = ""
}

variable "alb_cloudfront_only" {
  description = "ALB reachable only from CloudFront"
  type        = bool
  default     = true
}
