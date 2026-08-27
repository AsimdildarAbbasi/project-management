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

output "backend_workload_policy_arn" {
  description = "ARN of the Backend Workload IAM Policy"
  value       = aws_iam_policy.backend_workload.arn
}

output "worker_workload_policy_arn" {
  description = "ARN of the Worker Workload IAM Policy"
  value       = aws_iam_policy.worker_workload.arn
}

output "external_secrets_policy_arn" {
  description = "ARN of the External Secrets Operator IAM Policy"
  value       = aws_iam_policy.external_secrets.arn
}

output "aws_load_balancer_controller_policy_arn" {
  description = "ARN of the AWS Load Balancer Controller IAM Policy"
  value       = aws_iam_policy.aws_load_balancer_controller.arn
}

output "github_actions_role_arn" {
  description = "ARN of the IAM Role assumed by GitHub Actions for ECR image publishing"
  value       = aws_iam_role.github_actions_ecr.arn
}

output "github_actions_role_name" {
  description = "Name of the IAM Role assumed by GitHub Actions for ECR image publishing"
  value       = aws_iam_role.github_actions_ecr.name
}
