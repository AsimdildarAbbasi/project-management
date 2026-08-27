# CloudForge Development Environment — Root Composition Layer

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# -----------------------------------------------------------------------------
# 1. Networking Layer (VPC, Subnets, NAT Gateway, Route Tables)
# -----------------------------------------------------------------------------
module "vpc" {
  source = "../../modules/vpc"

  name                 = local.name_prefix
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# -----------------------------------------------------------------------------
# 2. Container Registry (Amazon ECR for frontend, backend, worker)
# -----------------------------------------------------------------------------
module "ecr" {
  source = "../../modules/ecr"

  project_name     = var.project_name
  environment      = var.environment
  repository_names = var.ecr_repository_names
}

# -----------------------------------------------------------------------------
# 3. Object Storage (Amazon S3 for file uploads)
# -----------------------------------------------------------------------------
module "s3" {
  source = "../../modules/s3"

  name_prefix = local.name_prefix
  environment = var.environment
  tags        = local.common_tags
}

# -----------------------------------------------------------------------------
# 4. Asynchronous Messaging (Amazon SQS for background jobs & DLQ)
# -----------------------------------------------------------------------------
module "sqs" {
  source = "../../modules/sqs"

  name_prefix                = local.name_prefix
  visibility_timeout_seconds = var.sqs_visibility_timeout_seconds
  message_retention_seconds  = var.sqs_message_retention_seconds
  receive_wait_time_seconds  = var.sqs_receive_wait_time_seconds
  max_receive_count          = var.sqs_max_receive_count
  tags                       = local.common_tags
}

# -----------------------------------------------------------------------------
# 5. Identity & Access Management (EKS Cluster/Node Roles & Workload Policies)
# -----------------------------------------------------------------------------
module "iam" {
  source = "../../modules/iam"

  name_prefix     = local.name_prefix
  environment     = var.environment
  s3_bucket_arn   = module.s3.bucket_arn
  sqs_queue_arn   = module.sqs.queue_arn
  app_secrets_arn = aws_secretsmanager_secret.app_secrets.arn
  tags            = local.common_tags
}

# -----------------------------------------------------------------------------
# 6. Container Orchestration (Amazon EKS & Managed Node Group)
# -----------------------------------------------------------------------------
module "eks" {
  source = "../../modules/eks"

  cluster_name        = "${local.name_prefix}-eks"
  cluster_version     = var.eks_cluster_version
  vpc_id              = module.vpc.vpc_id
  subnet_ids          = module.vpc.private_subnet_ids
  cluster_role_arn    = module.iam.cluster_role_arn
  node_role_arn       = module.iam.node_role_arn
  node_instance_types = var.eks_node_instance_types
  desired_size        = var.eks_desired_size
  min_size            = var.eks_min_size
  max_size            = var.eks_max_size
  tags                = local.common_tags
}

# -----------------------------------------------------------------------------
# 7. Relational Database (Amazon RDS PostgreSQL in Private Subnets)
# -----------------------------------------------------------------------------
module "rds" {
  source = "../../modules/rds"

  name_prefix           = local.name_prefix
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  app_security_group_id = module.eks.node_security_group_id
  db_name               = var.db_name
  db_username           = var.db_username
  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  engine_version        = var.db_engine_version
  deletion_protection   = false
  skip_final_snapshot   = true
  tags                  = local.common_tags
}

# -----------------------------------------------------------------------------
# 8. In-Memory Caching (Amazon ElastiCache Redis in Private Subnets)
# -----------------------------------------------------------------------------
module "redis" {
  source = "../../modules/redis"

  name_prefix           = local.name_prefix
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  app_security_group_id = module.eks.node_security_group_id
  node_type             = var.redis_node_type
  port                  = var.redis_port
  engine_version        = var.redis_engine_version
  tags                  = local.common_tags
}

# -----------------------------------------------------------------------------
# 9. Application Secrets Manager Container (Prepared for External Secrets Operator)
# -----------------------------------------------------------------------------
resource "random_password" "jwt_secret" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "app_secrets" {
  name                    = "${local.name_prefix}-app-secrets"
  description             = "Application environment secrets for CloudForge microservices"
  recovery_window_in_days = 0

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    NODE_ENV          = "production"
    JWT_SECRET        = random_password.jwt_secret.result
    S3_BUCKET_NAME    = module.s3.bucket_name
    SQS_QUEUE_URL     = module.sqs.queue_url
    REDIS_HOST        = module.redis.redis_endpoint
    REDIS_PORT        = module.redis.redis_port
    DATABASE_URL      = "postgresql://${var.db_username}:REDACTED@${module.rds.db_address}:${module.rds.db_port}/${var.db_name}"
    DB_CREDENTIAL_ARN = module.rds.db_secret_arn
  })
}
