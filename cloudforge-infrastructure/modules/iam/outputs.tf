output "cluster_role_arn" {
  description = "ARN of the EKS Cluster IAM Role"
  value       = aws_iam_role.cluster.arn
}

output "cluster_role_name" {
  description = "Name of the EKS Cluster IAM Role"
  value       = aws_iam_role.cluster.name
}

output "node_role_arn" {
  description = "ARN of the EKS Managed Node Group IAM Role"
  value       = aws_iam_role.node.arn
}

output "node_role_name" {
  description = "Name of the EKS Managed Node Group IAM Role"
  value       = aws_iam_role.node.name
}

output "s3_access_policy_arn" {
  description = "ARN of the S3 workload IAM Policy"
  value       = aws_iam_policy.s3_access.arn
}

output "sqs_access_policy_arn" {
  description = "ARN of the SQS workload IAM Policy"
  value       = aws_iam_policy.sqs_access.arn
}
