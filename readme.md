# Environment Manager Scheduler

## Getting started

Once you have cloned the repo locally...

```
npm install
```

To build and package the source into a deployable lambda...

```
npm run build
npm run pack
```

To run the tests...

```
npm test
```

To deploy the lambda...

```
terraform apply --var-file={{ENTER VAR FILE PATH}}
```

Example var file...

```
vpc_id = "vpc-wxyz1234"

vpc_subnet_ids = ["subnet-abcdef12", "subnet-abcd6789"]

security_group_ids = ["sg-abcdef123"]

iam_role_arn = "arn:aws:iam::012345678901:role/iam_role_name"

env_vars = {
  CHILD_ACCOUNT_ROLE_NAME = "iam_role_name"
  EM_HOST                 = "https://environment-manager-url"
  EM_USERNAME             = "domain\\username"
  EM_PASSWORD             = "HIwcAYJKoZIhvcNAQcGoGMwYQI..."
  LIMIT_TO_ENVIRONMENT    = "c50"
  ERROR_ON_FAILURE        = "false"
  LIST_SKIPPED_INSTANCES  = "false"
}

```