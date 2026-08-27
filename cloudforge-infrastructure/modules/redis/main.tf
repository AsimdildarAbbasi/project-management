# -----------------------------------------------------------------------------
# 1. ElastiCache Subnet Group (Private Subnets)
# -----------------------------------------------------------------------------
resource "aws_elasticache_subnet_group" "this" {
  name        = "${var.name_prefix}-redis-subnet-group"
  description = "Subnet group for Redis cluster in private subnets"
  subnet_ids  = var.private_subnet_ids

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-subnet-group"
  })
}

# -----------------------------------------------------------------------------
# 2. Redis Security Group (Restricted to EKS Node Security Group)
# -----------------------------------------------------------------------------
resource "aws_security_group" "redis" {
  name        = "${var.name_prefix}-redis-sg"
  description = "Security group for ElastiCache Redis allowing traffic only from EKS nodes"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow Redis access exclusively from EKS worker nodes"
    from_port       = var.port
    to_port         = var.port
    protocol        = "tcp"
    security_groups = [var.app_security_group_id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis-sg"
  })
}

# -----------------------------------------------------------------------------
# 3. Amazon ElastiCache Redis Cluster (Cost-conscious Single Node for Dev)
# -----------------------------------------------------------------------------
resource "aws_elasticache_cluster" "this" {
  cluster_id           = "${var.name_prefix}-redis"
  engine               = "redis"
  engine_version       = var.engine_version
  node_type            = var.node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = var.port
  subnet_group_name    = aws_elasticache_subnet_group.this.name
  security_group_ids   = [aws_security_group.redis.id]

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-redis"
  })
}
