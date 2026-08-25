# CloudForge Development Environment — Root Composition Layer
# Modules will be instantiated and linked here in subsequent phases.

module "vpc" {
  source = "../../modules/vpc"

  name                 = "${var.project_name}-${var.environment}"
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

# module "eks" {
#   source = "../../modules/eks"
# }

module "ecr" {
  source = "../../modules/ecr"
}

# module "rds" {
#   source = "../../modules/rds"
# }

# module "redis" {
#   source = "../../modules/redis"
# }

# module "s3" {
#   source = "../../modules/s3"
# }

# module "sqs" {
#   source = "../../modules/sqs"
# }

# module "iam" {
#   source = "../../modules/iam"
# }
