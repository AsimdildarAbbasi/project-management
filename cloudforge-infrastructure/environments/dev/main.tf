# CloudForge Development Environment — Root Composition Layer
# Modules will be instantiated and linked here in subsequent phases.

module "vpc" {
    source = "../../modules/vpc"
  
}

# module "eks" {
#   source = "../../modules/eks"
# }

# module "ecr" {
#   source = "../../modules/ecr"
# }

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
