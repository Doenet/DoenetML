To migrate your manual setup to a production-ready CloudFormation stack, you will need to define all the resources (Lambda, Role, DynamoDB, API Gateway, and Domain) in a single YAML template.

Here is the step-by-step guide and the complete CloudFormation template.
Prerequisites

    Docker Image: You must still build and push your Docker image to ECR manually (or via CI/CD) before running this stack, as CloudFormation reads existing images.

    ACM Certificate: You must have the Certificate ARN for prefigure.doenet.org ready (from AWS Certificate Manager).

1. The CloudFormation Template (template.yaml)

Saved file as prefigure-stack.yaml. This template replaces all the manual steps we did earlier.

2. Steps to Deploy
Step 1: Prepare Parameters

You need three pieces of information:

    Image URI: Copy from your docker push command (e.g., 123456789012.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:latest).

    Certificate ARN: Go to AWS Certificate Manager, find the certificate for prefigure.doenet.org, and copy its ARN.

    Hosted Zone ID (Optional): If you manage DNS in Route53, copy the Hosted Zone ID for doenet.org.

Step 2: Deploy Stack

You can deploy this via the AWS Console or CLI.

Option A: AWS CLI (Recommended)
Bash

aws cloudformation deploy \
  --template-file prefigure-stack.yaml \
  --stack-name prefigure-prod \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    ContainerImageUri="[YOUR_IMAGE_URI]" \
    CertificateArn="[YOUR_CERT_ARN]" \
    DomainName="prefigure.doenet.org"

Option B: AWS Console

    Go to CloudFormation > Create stack > With new resources (standard).

    Upload a template file: Select prefigure-stack.yaml.

    Stack name: prefigure-prod.

    Parameters: Paste your Image URI and Cert ARN.

    Capabilities: Check "I acknowledge that AWS CloudFormation might create IAM resources."

    Click Submit.

Step 3: Final DNS Update

If you did not uncomment the Route53 section in the template (or if your DNS is not on Route53):

    Wait for the stack to reach CREATE_COMPLETE.

    Go to the Outputs tab of the stack.

    Find the ApiEndpoint (it will look like https://d-xyz.execute-api...).

    Wait! Actually, for custom domains, you need the API Gateway Domain Name target.

        Go to API Gateway console > Custom domain names.

        Click prefigure.doenet.org.

        Copy the API Gateway Domain Name (e.g., d-12345.execute-api.us-east-2.amazonaws.com).

    Update your DNS provider (Namecheap/GoDaddy) to point prefigure CNAME to that address.

Key Changes from Manual to CloudFormation

    Infrastructure as Code: If you delete the stack, everything (Role, API, DynamoDB table) is cleanly removed.

    Drift Detection: If someone manually changes the IAM role permissions, CloudFormation can detect and fix it.

    IAM Policy: The policy is strictly scoped to the PrefigureCacheTable created within this stack, ensuring perfect isolation.