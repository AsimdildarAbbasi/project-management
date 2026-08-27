variable "aws_region" {
  type        = string
  description = "AWS region for deployment"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default     = "dev"
}

variable "project_name" {
  type        = string
  description = "Project identifier"
  default     = "cloudforge"
}

variable "github_repo" {
  type        = string
  description = "GitHub repository in format 'owner/repo' for GitHub Actions OIDC federation"
  default     = "AsimdildarAbbasi/project-management"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the CloudForge VPC"
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type        = list(string)
  description = "List of Availability Zones for Multi-AZ deployment"
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for public subnets (ALB / Ingress / NAT Gateways)"
  default     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for private subnets (EKS Node Groups / RDS / Redis)"
  default     = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
}

variable "ecr_repository_names" {
  type        = list(string)
  description = "List of ECR repository service names to create"
  default     = ["frontend", "backend", "worker"]
}

# -----------------------------------------------------------------------------
# EKS Cluster Variables
# -----------------------------------------------------------------------------
variable "eks_cluster_version" {
  type        = string
  description = "Kubernetes version for EKS control plane"
  default     = "1.36"
}

variable "eks_node_instance_types" {
  type        = list(string)
  description = "EC2 instance types for EKS managed node group"
  default     = ["m7i-flex.large"]
}

variable "eks_desired_size" {
  type        = number
  description = "Desired number of worker nodes"
  default     = 2
}

variable "eks_min_size" {
  type        = number
  description = "Minimum number of worker nodes"
  default     = 1
}

variable "eks_max_size" {
  type        = number
  description = "Maximum number of worker nodes"
  default     = 3
}

# -----------------------------------------------------------------------------
# RDS PostgreSQL Variables
# -----------------------------------------------------------------------------
variable "db_name" {
  type        = string
  description = "PostgreSQL default database name"
  default     = "pma_db"
}

variable "db_username" {
  type        = string
  description = "PostgreSQL master username"
  default     = "pma_admin"
}

variable "db_instance_class" {
  type        = string
  description = "RDS DB instance class"
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  type        = number
  description = "Allocated storage size in GB"
  default     = 20
}

variable "db_max_allocated_storage" {
  type        = number
  description = "Maximum storage limit in GB for autoscaling"
  default     = 50
}

variable "db_engine_version" {
  type        = string
  description = "PostgreSQL engine version"
  default     = "16.3"
}

# -----------------------------------------------------------------------------
# ElastiCache Redis Variables
# -----------------------------------------------------------------------------
variable "redis_node_type" {
  type        = string
  description = "ElastiCache Redis node type"
  default     = "cache.t3.micro"
}

variable "redis_port" {
  type        = number
  description = "Port number for Redis"
  default     = 6379
}

variable "redis_engine_version" {
  type        = string
  description = "Redis engine version"
  default     = "7.1"
}

# -----------------------------------------------------------------------------
# SQS Queue Variables
# -----------------------------------------------------------------------------
variable "sqs_visibility_timeout_seconds" {
  type        = number
  description = "Visibility timeout in seconds for background jobs queue"
  default     = 60
}

variable "sqs_message_retention_seconds" {
  type        = number
  description = "Message retention in seconds for background jobs queue"
  default     = 345600 # 4 days
}

variable "sqs_receive_wait_time_seconds" {
  type        = number
  description = "Receive message wait time in seconds for long polling"
  default     = 20
}

variable "sqs_max_receive_count" {
  type        = number
  description = "Max delivery attempts before routing to Dead Letter Queue"
  default     = 3
}

