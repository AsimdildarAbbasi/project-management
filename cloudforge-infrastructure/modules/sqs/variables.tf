variable "name_prefix" {
  description = "Name prefix for SQS queues"
  type        = string
}

variable "visibility_timeout_seconds" {
  description = "The visibility timeout for the main queue in seconds"
  type        = number
  default     = 60
}

variable "message_retention_seconds" {
  description = "The number of seconds Amazon SQS retains a message"
  type        = number
  default     = 345600 # 4 days
}

variable "receive_wait_time_seconds" {
  description = "The time for which a ReceiveMessage call will wait for a message to arrive (long polling)"
  type        = number
  default     = 20
}

variable "max_receive_count" {
  description = "The number of times a message is delivered to the source queue before being moved to the dead-letter queue"
  type        = number
  default     = 3
}

variable "tags" {
  description = "Tags to apply to SQS resources"
  type        = map(string)
  default     = {}
}
