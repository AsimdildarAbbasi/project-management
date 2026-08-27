variable "cluster_name" {
  description = "Name of the Amazon EKS cluster"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version to use for the EKS cluster"
  type        = string
  default     = "1.36"
}

variable "vpc_id" {
  description = "VPC ID where the cluster and nodes will be deployed"
  type        = string
}

variable "subnet_ids" {
  description = "Private Subnet IDs for EKS worker nodes and control plane ENIs"
  type        = list(string)
}

variable "cluster_role_arn" {
  description = "IAM Role ARN for the EKS Control Plane"
  type        = string
}

variable "node_role_arn" {
  description = "IAM Role ARN for the EKS Managed Node Group"
  type        = string
}

variable "node_instance_types" {
  description = "EC2 instance types for EKS worker nodes"
  type        = list(string)
  default     = ["m7i-flex.large"]
}

variable "desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 3
}

variable "enabled_cluster_log_types" {
  description = "List of control plane logging components to enable"
  type        = list(string)
  default     = ["api", "audit", "authenticator"]
}

variable "tags" {
  description = "Tags to apply to EKS resources"
  type        = map(string)
  default     = {}
}
