# -----------------------------------------------------------------------------
# 1. Random Unique Suffix for Global Bucket Naming
# -----------------------------------------------------------------------------
resource "random_id" "suffix" {
  byte_length = 4
}

# -----------------------------------------------------------------------------
# 2. Amazon S3 Uploads Bucket
# -----------------------------------------------------------------------------
resource "aws_s3_bucket" "this" {
  bucket        = "${var.name_prefix}-uploads-${random_id.suffix.hex}"
  force_destroy = var.environment == "dev" ? true : false

  tags = merge(var.tags, {
    Name        = "${var.name_prefix}-uploads-${random_id.suffix.hex}"
    Environment = var.environment
  })
}

# -----------------------------------------------------------------------------
# 3. Block All Public Access & Enforce Ownership
# -----------------------------------------------------------------------------
resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# -----------------------------------------------------------------------------
# 4. Server-Side Encryption (AES256)
# -----------------------------------------------------------------------------
resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# -----------------------------------------------------------------------------
# 5. Bucket Versioning
# -----------------------------------------------------------------------------
resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Enabled"
  }
}

# -----------------------------------------------------------------------------
# 6. CORS Configuration for Web Client File Uploads
# -----------------------------------------------------------------------------
resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# -----------------------------------------------------------------------------
# 7. Lifecycle Configuration (Clean incomplete multipart uploads)
# -----------------------------------------------------------------------------
resource "aws_s3_bucket_lifecycle_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    id     = "abort-incomplete-multipart-uploads"
    status = "Enabled"

    filter {}

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}
