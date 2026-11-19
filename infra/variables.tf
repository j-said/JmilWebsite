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

variable "cache_enabled" {
  description = "Serve GET /products cache-aside from Redis"
  type        = bool
  default     = true
}

variable "worker_processing_seconds" {
  description = "Simulated slow step per message in the queue worker"
  type        = number
  default     = 1
}
