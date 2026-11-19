resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project}-cache"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.project}-cache"
  description          = "Cache-aside + idempotency keys for the API"

  engine         = "redis"
  engine_version = "7.1"
  node_type      = "cache.t4g.micro"
  port           = 6379

  # One node is enough: the cache can always be refilled from the DB.
  num_cache_clusters         = 1
  automatic_failover_enabled = false

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.cache.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true # rediss://

  snapshot_retention_limit = 0
  apply_immediately        = true
}

locals {
  redis_url        = "rediss://${aws_elasticache_replication_group.main.primary_endpoint_address}:6379/0"
  cache_cluster_id = tolist(aws_elasticache_replication_group.main.member_clusters)[0]
}
