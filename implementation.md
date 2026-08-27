1. Terraform Foundation
        ↓
2. VPC                    ✅/RESET
        ↓
3. ECR
        ↓
4. IAM
        ↓
5. EKS
        ↓
6. RDS
        ↓
7. S3
        ↓
8. Redis
        ↓
9. SQS
        ↓
10. Kubernetes Application
        ↓
11. ALB / Ingress
        ↓
12. Secrets
        ↓
13. GitHub OIDC
        ↓
14. GitHub Actions
        ↓
15. ArgoCD
        ↓
16. Prometheus
        ↓
17. Grafana
        ↓
18. Loki
        ↓
19. Alerting
        ↓
20. HPA + PDB
        ↓
21. Security hardening
        ↓
22. Failure testing
        ↓
23. Documentation
        ↓
              🚀 CLOUDFORGE COMPLETE




app_secrets_arn = "arn:aws:secretsmanager:us-east-1:125167623870:secret:cloudforge-dev-app-secrets-203nZn"
app_secrets_name = "cloudforge-dev-app-secrets"
aws_load_balancer_controller_policy_arn = "arn:aws:iam::125167623870:policy/cloudforge-dev-aws-load-balancer-controller-policy"
backend_workload_policy_arn = "arn:aws:iam::125167623870:policy/cloudforge-dev-backend-workload-policy"
ecr_repository_arns = {
  "backend" = "arn:aws:ecr:us-east-1:125167623870:repository/cloudforge-dev-backend"
  "frontend" = "arn:aws:ecr:us-east-1:125167623870:repository/cloudforge-dev-frontend"
  "worker" = "arn:aws:ecr:us-east-1:125167623870:repository/cloudforge-dev-worker"
}
ecr_repository_urls = {
  "backend" = "125167623870.dkr.ecr.us-east-1.amazonaws.com/cloudforge-dev-backend"
  "frontend" = "125167623870.dkr.ecr.us-east-1.amazonaws.com/cloudforge-dev-frontend"
  "worker" = "125167623870.dkr.ecr.us-east-1.amazonaws.com/cloudforge-dev-worker"
}
eks_cluster_arn = "arn:aws:eks:us-east-1:125167623870:cluster/cloudforge-dev-eks"
eks_cluster_certificate_authority_data = <sensitive>
eks_cluster_endpoint = "https://B55E089742B7F3069D657AAA2417A5FD.gr7.us-east-1.eks.amazonaws.com"
eks_cluster_name = "cloudforge-dev-eks"
eks_cluster_role_arn = "arn:aws:iam::125167623870:role/cloudforge-dev-eks-cluster-role"
eks_cluster_security_group_id = "sg-06957dc8ac7def3c0"
eks_node_role_arn = "arn:aws:iam::125167623870:role/cloudforge-dev-eks-node-role"
eks_node_security_group_id = "sg-0e684e4ae91d09041"
eks_oidc_provider_arn = "arn:aws:iam::125167623870:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/B55E089742B7F3069D657AAA2417A5FD"
eks_oidc_provider_url = "oidc.eks.us-east-1.amazonaws.com/id/B55E089742B7F3069D657AAA2417A5FD"
external_secrets_policy_arn = "arn:aws:iam::125167623870:policy/cloudforge-dev-external-secrets-policy"
nat_gateway_id = "nat-0ede46b091fdc6c62"
private_subnet_ids = [
  "subnet-0811eb5b63f4aa17d",
  "subnet-09b50b3dd104ead83",
  "subnet-085bedda97e1240e0",
]
public_subnet_ids = [
  "subnet-02d507b7d5e353e69",
  "subnet-06ea4f820a53c9487",
  "subnet-08e88e2d1c78dea39",
]
rds_db_address = "cloudforge-dev-postgres.c2hy4uqa2vws.us-east-1.rds.amazonaws.com"
rds_db_endpoint = "cloudforge-dev-postgres.c2hy4uqa2vws.us-east-1.rds.amazonaws.com:5432"
rds_db_name = "pma_db"
rds_db_port = 5432
rds_db_secret_arn = "arn:aws:secretsmanager:us-east-1:125167623870:secret:cloudforge-dev-rds-credentials-iFJkma"
rds_db_security_group_id = "sg-09c81117faa620e61"
redis_endpoint = "cloudforge-dev-redis.qyio1j.0001.use1.cache.amazonaws.com"
redis_port = 6379
redis_security_group_id = "sg-0fc4f67f3b404be07"
s3_bucket_arn = "arn:aws:s3:::cloudforge-dev-uploads-7e2a76f4"
s3_bucket_domain_name = "cloudforge-dev-uploads-7e2a76f4.s3.us-east-1.amazonaws.com"
s3_bucket_name = "cloudforge-dev-uploads-7e2a76f4"
sqs_dlq_arn = "arn:aws:sqs:us-east-1:125167623870:cloudforge-dev-jobs-dlq"
sqs_dlq_url = "https://sqs.us-east-1.amazonaws.com/125167623870/cloudforge-dev-jobs-dlq"
sqs_queue_arn = "arn:aws:sqs:us-east-1:125167623870:cloudforge-dev-jobs"
sqs_queue_url = "https://sqs.us-east-1.amazonaws.com/125167623870/cloudforge-dev-jobs"
vpc_id = "vpc-0664a00f03328a476"
worker_workload_policy_arn = "arn:aws:iam::125167623870:policy/cloudforge-dev-worker-workload-policy"