variable "name_prefix" {
  description = "Name prefix for RDS resources"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where the DB subnet group and security group will be created"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private Subnet IDs for RDS DB Subnet Group"
  type        = list(string)
}

variable "app_security_group_id" {
  description = "Security Group ID of the EKS nodes allowed to connect to PostgreSQL (Port 5432)"
  type        = string
}

variable "db_name" {
  description = "Name of the default PostgreSQL database"
  type        = string
  default     = "pma_db"
}

variable "db_username" {
  description = "Master username for PostgreSQL"
  type        = string
  default     = "pma_admin"
}

variable "instance_class" {
  description = "RDS DB instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "allocated_storage" {
  description = "Allocated storage size in GB"
  type        = number
  default     = 20
}

variable "max_allocated_storage" {
  description = "Maximum storage limit in GB for autoscaling"
  type        = number
  default     = 50
}

variable "engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "16.3"
}

variable "deletion_protection" {
  description = "Enable deletion protection on the database"
  type        = bool
  default     = false
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot before DB deletion in dev"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Tags to apply to RDS resources"
  type        = map(string)
  default     = {}
}
