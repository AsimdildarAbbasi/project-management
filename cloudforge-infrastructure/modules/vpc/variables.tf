# Input variables for VPC module.
variable "name" {
  description = "Name prefix for CloudForge networking resources"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the CloudForge VPC"
  type        = string
}

variable "availability_zones" {
  description = "Availability Zones used by the VPC"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

data "aws_availability_zones" "available" {
  state = "available"
}
