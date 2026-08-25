variable "environment" {
  description = "Deployment environment name (e.g. dev, prod)"
  type        = string
}

variable "project_name" {
  description = "Project prefix for repository naming"
  type        = string
  default     = "cloudforge"
}

variable "repository_names" {
  description = "List of ECR repository service names to create"
  type        = list(string)
  default     = ["frontend", "backend", "worker"]
}

variable "image_tag_mutability" {
  description = "The tag mutability setting for the repository. Must be one of: MUTABLE or IMMUTABLE"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Indicates whether images are scanned after being pushed to the repository"
  type        = bool
  default     = true
}

variable "max_image_count" {
  description = "Maximum number of tagged images to retain in repository before lifecycle expiration"
  type        = number
  default     = 30
}

variable "untagged_image_expiration_days" {
  description = "Days after which untagged images will be expired by lifecycle policy"
  type        = number
  default     = 7
}
