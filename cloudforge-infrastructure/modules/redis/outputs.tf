output "redis_endpoint" {
  description = "Hostname of the ElastiCache Redis cluster"
  value       = aws_elasticache_cluster.this.cache_nodes[0].address
}

output "redis_port" {
  description = "Port number for the ElastiCache Redis cluster"
  value       = aws_elasticache_cluster.this.port
}

output "redis_security_group_id" {
  description = "ID of the security group attached to the Redis cluster"
  value       = aws_security_group.redis.id
}

output "redis_cluster_id" {
  description = "ID of the Redis cluster"
  value       = aws_elasticache_cluster.this.cluster_id
}
