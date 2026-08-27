variable "name_prefix" {
  description = "Name prefix for Redis resources"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the Redis subnet group and security group will be created"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private Subnet IDs for ElastiCache Subnet Group"
  type        = list(string)
}

variable "app_security_group_id" {
  description = "Security Group ID of the EKS nodes allowed to connect to Redis (Port 6379)"
  type        = string
}

variable "node_type" {
  description = "ElastiCache node instance type"
  type        = string
  default     = "cache.t3.micro"
}

variable "port" {
  description = "Port number for Redis"
  type        = number
  default     = 6379
}

variable "engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.1"
}

variable "tags" {
  description = "Tags to apply to Redis resources"
  type        = map(string)
  default     = {}
}
