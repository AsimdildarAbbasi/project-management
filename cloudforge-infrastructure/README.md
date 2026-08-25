# ☁️ CloudForge — Infrastructure as Code (Terraform)

This repository contains the Terraform Infrastructure as Code (IaC) definitions for the **CloudForge** cloud-native SaaS platform on AWS.

## 📂 Directory Structure

```text
cloudforge-infrastructure/
├── environments/
│   └── dev/                       # Development environment root composition
│       ├── main.tf                # Module invocations & wiring
│       ├── variables.tf           # Input variable declarations
│       ├── outputs.tf             # Output definitions
│       ├── providers.tf           # AWS Provider & backend configuration
│       └── terraform.tfvars.example # Example variable values
├── modules/
│   ├── vpc/                       # Multi-AZ VPC, subnets, NAT Gateways
│   ├── eks/                       # EKS Cluster, Node Groups, OIDC
│   ├── ecr/                       # Private container registries
│   ├── rds/                       # Amazon RDS PostgreSQL Multi-AZ
│   ├── redis/                     # Amazon ElastiCache Redis
│   ├── s3/                        # Amazon S3 buckets & policies
│   ├── sqs/                       # Amazon SQS queues & DLQs
│   └── iam/                       # IAM roles, policies, and IRSA bindings
├── .gitignore
└── README.md
```

## 🛠️ Usage Guidelines

1. Copy `terraform.tfvars.example` to `terraform.tfvars` inside the target environment folder:
   ```bash
   cd environments/dev
   cp terraform.tfvars.example terraform.tfvars
   ```
2. Initialize Terraform:
   ```bash
   terraform init
   ```
3. Validate and Plan:
   ```bash
   terraform validate
   terraform plan
   ```
