output "db_instance_id" {
  description = "ID of the RDS database instance"
  value       = aws_db_instance.this.id
}

output "db_endpoint" {
  description = "Connection endpoint for the RDS PostgreSQL database"
  value       = aws_db_instance.this.endpoint
}

output "db_address" {
  description = "Hostname of the RDS PostgreSQL database"
  value       = aws_db_instance.this.address
}

output "db_port" {
  description = "Port of the RDS PostgreSQL database"
  value       = aws_db_instance.this.port
}

output "db_name" {
  description = "Name of the default PostgreSQL database"
  value       = aws_db_instance.this.db_name
}

output "db_security_group_id" {
  description = "ID of the security group attached to the RDS instance"
  value       = aws_security_group.rds.id
}

output "db_secret_arn" {
  description = "ARN of the AWS Secrets Manager secret containing database credentials"
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "db_secret_name" {
  description = "Name of the AWS Secrets Manager secret containing database credentials"
  value       = aws_secretsmanager_secret.db_credentials.name
}
