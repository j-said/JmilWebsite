resource "aws_sqs_queue" "orders_dlq" {
  name                      = "${var.project}-orders-dlq"
  message_retention_seconds = 14 * 24 * 3600
}

resource "aws_sqs_queue" "orders" {
  name = "${var.project}-orders"

  # Must be longer than processing one batch, or the message comes back while still in work.
  visibility_timeout_seconds = 60
  message_retention_seconds  = 24 * 3600
  receive_wait_time_seconds  = 10
  sqs_managed_sse_enabled    = true

  # After 5 failed tries the message goes to the DLQ.
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.orders_dlq.arn
    maxReceiveCount     = 5
  })
}
