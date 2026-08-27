variable "name_prefix" {
  description = "Name prefix for IAM resources"
  type        = string
}

variable "environment" {
  description = "Deployment environment name"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 uploads bucket for workload policy generation"
  type        = string
  default     = ""
}

variable "sqs_queue_arn" {
  description = "ARN of the SQS jobs queue for workload policy generation"
  type        = string
  default     = ""
}

variable "app_secrets_arn" {
  description = "ARN of the application Secrets Manager secret"
  type        = string
  default     = ""
}

variable "github_repo" {
  description = "GitHub repository path in format 'owner/repo' for OIDC federation"
  type        = string
  default     = "AsimdildarAbbasi/project-management"

}

variable "tags" {
  description = "Tags to apply to IAM resources"
  type        = map(string)
  default     = {}
}
