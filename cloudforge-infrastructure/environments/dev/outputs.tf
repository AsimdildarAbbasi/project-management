# -----------------------------------------------------------------------------
# 1. Networking Outputs (VPC)
# -----------------------------------------------------------------------------
output "vpc_id" {
  description = "ID of the CloudForge VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

output "nat_gateway_id" {
  description = "ID of the NAT Gateway"
  value       = module.vpc.nat_gateway_id
}

# -----------------------------------------------------------------------------
# 2. Container Registry Outputs (Amazon ECR)
# -----------------------------------------------------------------------------
output "ecr_repository_urls" {
  description = "Map of ECR repository URLs for frontend, backend, and worker"
  value       = module.ecr.repository_urls
}

output "ecr_repository_arns" {
  description = "Map of ECR repository ARNs"
  value       = module.ecr.repository_arns
}

# -----------------------------------------------------------------------------
# 3. IAM Outputs
# -----------------------------------------------------------------------------
output "eks_cluster_role_arn" {
  description = "ARN of the EKS Cluster Control Plane IAM Role"
  value       = module.iam.cluster_role_arn
}

output "eks_node_role_arn" {
  description = "ARN of the EKS Worker Node Group IAM Role"
  value       = module.iam.node_role_arn
}

output "backend_workload_policy_arn" {
  description = "ARN of the Backend Workload IAM Policy"
  value       = module.iam.backend_workload_policy_arn
}

output "worker_workload_policy_arn" {
  description = "ARN of the Worker Workload IAM Policy"
  value       = module.iam.worker_workload_policy_arn
}

output "external_secrets_policy_arn" {
  description = "ARN of the External Secrets Operator IAM Policy"
  value       = module.iam.external_secrets_policy_arn
}

output "aws_load_balancer_controller_policy_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM Policy"
  value       = module.iam.aws_load_balancer_controller_policy_arn
}

output "github_actions_role_arn" {
  description = "ARN of the IAM Role assumed by GitHub Actions for ECR image publishing"
  value       = module.iam.github_actions_role_arn
}

# -----------------------------------------------------------------------------
# 4. Amazon EKS Cluster Outputs
# -----------------------------------------------------------------------------
output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "eks_cluster_arn" {
  description = "ARN of the EKS cluster"
  value       = module.eks.cluster_arn
}

output "eks_cluster_endpoint" {
  description = "Endpoint for EKS cluster control plane"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
  sensitive   = true
}

output "eks_cluster_security_group_id" {
  description = "Security group ID attached to the EKS control plane"
  value       = module.eks.cluster_security_group_id
}

output "eks_node_security_group_id" {
  description = "Security group ID attached to the EKS worker nodes"
  value       = module.eks.node_security_group_id
}

output "eks_oidc_provider_arn" {
  description = "ARN of the IAM OIDC Provider for IRSA"
  value       = module.eks.oidc_provider_arn
}

output "eks_oidc_provider_url" {
  description = "URL of the IAM OIDC Provider for IRSA"
  value       = module.eks.oidc_provider_url
}

output "aws_load_balancer_controller_role_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM Role"
  value       = module.eks.aws_load_balancer_controller_role_arn
}

# -----------------------------------------------------------------------------
# 5. Amazon RDS PostgreSQL Outputs
# -----------------------------------------------------------------------------
output "rds_db_endpoint" {
  description = "Connection endpoint for the RDS PostgreSQL database"
  value       = module.rds.db_endpoint
}

output "rds_db_address" {
  description = "Hostname of the RDS PostgreSQL database"
  value       = module.rds.db_address
}

output "rds_db_port" {
  description = "Port of the RDS PostgreSQL database"
  value       = module.rds.db_port
}

output "rds_db_name" {
  description = "Name of the default PostgreSQL database"
  value       = module.rds.db_name
}

output "rds_db_security_group_id" {
  description = "Security group ID attached to the RDS PostgreSQL instance"
  value       = module.rds.db_security_group_id
}

output "rds_db_secret_arn" {
  description = "ARN of the AWS Secrets Manager secret containing RDS credentials"
  value       = module.rds.db_secret_arn
}

# -----------------------------------------------------------------------------
# 6. Amazon ElastiCache Redis Outputs
# -----------------------------------------------------------------------------
output "redis_endpoint" {
  description = "Hostname of the ElastiCache Redis cluster"
  value       = module.redis.redis_endpoint
}

output "redis_port" {
  description = "Port number for the ElastiCache Redis cluster"
  value       = module.redis.redis_port
}

output "redis_security_group_id" {
  description = "Security group ID attached to the Redis cluster"
  value       = module.redis.redis_security_group_id
}

# -----------------------------------------------------------------------------
# 7. Amazon S3 Storage Outputs
# -----------------------------------------------------------------------------
output "s3_bucket_name" {
  description = "Name of the S3 uploads bucket"
  value       = module.s3.bucket_name
}

output "s3_bucket_arn" {
  description = "ARN of the S3 uploads bucket"
  value       = module.s3.bucket_arn
}

output "s3_bucket_domain_name" {
  description = "Regional domain name of the S3 uploads bucket"
  value       = module.s3.bucket_domain_name
}

# -----------------------------------------------------------------------------
# 8. Amazon SQS Messaging Outputs
# -----------------------------------------------------------------------------
output "sqs_queue_url" {
  description = "URL of the main SQS background jobs queue"
  value       = module.sqs.queue_url
}

output "sqs_queue_arn" {
  description = "ARN of the main SQS background jobs queue"
  value       = module.sqs.queue_arn
}

output "sqs_dlq_url" {
  description = "URL of the Dead-Letter Queue (DLQ)"
  value       = module.sqs.dlq_url
}

output "sqs_dlq_arn" {
  description = "ARN of the Dead-Letter Queue (DLQ)"
  value       = module.sqs.dlq_arn
}

# -----------------------------------------------------------------------------
# 9. Application Secrets Outputs
# -----------------------------------------------------------------------------
output "app_secrets_arn" {
  description = "ARN of the AWS Secrets Manager secret containing application environment variables"
  value       = aws_secretsmanager_secret.app_secrets.arn
}

output "app_secrets_name" {
  description = "Name of the AWS Secrets Manager secret containing application environment variables"
  value       = aws_secretsmanager_secret.app_secrets.name
}
