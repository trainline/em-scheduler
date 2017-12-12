variable package {
  type    = "string"
  default = "out/package/scheduler.zip"
}

variable vpc_id {
  type = "string"
}

variable vpc_subnet_ids {
  type = "list"
}

variable security_group_ids {
  type = "list"
}

variable name {
  type    = "string"
  default = "em-scheduler"
}

variable iam_role_arn {
  type = "string"
}

variable env_vars {
  type = "map"
}

provider "aws" {
  region = "eu-west-1"
}

data "aws_caller_identity" "current" {}

resource "aws_lambda_function" "scheduler" {
  filename         = "${var.package}"
  function_name    = "${var.name}"
  description      = "Turns on/off instances based on instance, asg or environment schedule"
  memory_size      = 320
  timeout          = 30
  role             = "${var.iam_role_arn}"
  handler          = "src/index.handler"
  source_code_hash = "${base64sha256(file("${var.package}"))}"
  runtime          = "nodejs6.10"

  vpc_config {
    subnet_ids         = "${var.vpc_subnet_ids}"
    security_group_ids = ["${var.security_group_ids}"]
  }

  environment {
    variables = "${var.env_vars}"
  }
}

resource "aws_cloudwatch_event_rule" "every_one_minute" {
  name                = "every-minute"
  description         = "1 minute repeating cloudwatch event"
  schedule_expression = "rate(1 minute)"
}

resource "aws_cloudwatch_event_target" "scheduler_cloudwatch_scheduled_trigger" {
  rule      = "${aws_cloudwatch_event_rule.every_one_minute.name}"
  target_id = "em-scheduler-trigger"
  arn       = "${aws_lambda_function.scheduler.arn}"
}

resource "aws_lambda_permission" "scheduler_cloudwatch_scheduled_trigger_permission" {
  statement_id  = "em-scheduler-trigger-permission"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.scheduler.function_name}"
  principal     = "events.amazonaws.com"
  source_arn    = "${aws_cloudwatch_event_rule.every_one_minute.arn}"
}
