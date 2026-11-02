# PreFigure on AWS Lambda: Complete Setup Guide

This guide documents deploying `prefigure` to AWS Lambda as a container image, with hybrid caching (RAM + DynamoDB).

Quick endpoint verification commands are maintained in `ENDPOINT_TESTING.md`.

## Before Running the Deploy Script

### 1. Start Docker Desktop

Open Docker Desktop (press the Super/Windows key, type "Docker", select Docker Desktop). Wait until the Docker Desktop icon in the system tray shows it is running.

Verify Docker is ready:

```bash
docker info
```

### 2. Log in to AWS

Authenticate your AWS CLI session.

Log in:

```bash
aws login
```

Verify you are logged in:

```bash
aws sts get-caller-identity
```

- The verify command returns JSON with `Account` and `Arn`.
- If you see a session expired error, run `aws login` again.
- The deployment script also performs this check and exits early with login instructions if not authenticated.

Optional checks:

- Show configured profiles:

  aws configure list-profiles

- Confirm default region:

  aws configure get region --profile default

## Quick Upgrade Checklist

For routine releases:

1. Start Docker Desktop (Super/Windows key → "Docker" → Docker Desktop)
2. Log in to AWS: `aws login`
3. Run from `prefigure-lambda/`:

```bash
./deploy-prefigure-release.sh --version 0.5.15 --smoke-test
```

That command handles ECR login, build, push, Lambda update, wait, and an optional smoke test.

---

## API response contract (current)

The Lambda endpoint returns JSON and treats `foo.xml` (annotations) as optional.

- **Success (`200`)**
  - `svg`: always present on success
  - `annotationsXml`: annotation XML string or `null`
  - `annotationsGenerated`: `true` when annotations exist
  - `cached`: whether result came from cache
  - `hash`: cache key

- **Client/build issues (`400`/`422`)**
  - `400` with `errorCode` of:
    - `invalid_encoding`
    - `empty_body`
  - `422` with `errorCode` of:
    - `build_failed` (prefig exited non-zero)
    - `svg_missing` (prefig exited zero but no SVG output)

- **Diagnostics on failures**
  - `prefigReturnCode`, `command`, `cwd`, `stdout`, `stderr`
  - Add query param `?debug=1` to include `work_dir_contents` and `output_dir_contents`.

---

## 1. One-Time Infrastructure Setup

Complete these once per environment/account.

### 1.1 Project files

Use this folder:

```text
prefigure-lambda/
├── app.py
├── Dockerfile
├── ENDPOINT_TESTING.md
├── PreFigure on AWS Lambda: Complete Setup.md
└── test-prefigure.html
```

### 1.2 Dockerfile (build recipe)

The Dockerfile handles all runtime dependency installation:

- OS/build dependencies (`dnf` packages)
- `liblouis` source build/install
- `pycairo` install
- pinned `prefig` install
- `prefig init`

Canonical file: `prefigure-lambda/Dockerfile`

Current pinning pattern:

```dockerfile
ARG PREFIG_VERSION=0.5.15
ENV PREFIG_CACHE_VERSION=${PREFIG_VERSION}
RUN pip install "prefig[pycairo]==${PREFIG_VERSION}"
```

This keeps deployed prefigure version and cache versioning aligned.

### 1.3 DynamoDB table (persistent L2 cache)

Create table:

- Table name: `PrefigureCache`
- Partition key: `xml_hash` (String)

Enable TTL:

- TTL attribute: `expiration_time`

### 1.4 IAM permissions (least privilege)

Grant the Lambda execution role access to the cache table.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-2:[YOUR_ACCOUNT_ID]:table/PrefigureCache"
    }
  ]
}
```

### 1.5 Handler behavior summary

Canonical implementation: `prefigure-lambda/app.py`

- Hybrid cache: RAM (L1) + DynamoDB (L2)
- Cache key salt derives from `PREFIG_CACHE_VERSION`, with fallback to installed `prefig` metadata
- `foo.svg` required for success; `foo.xml` optional
- Error semantics:
  - `400`: `invalid_encoding`, `empty_body`
  - `422`: `build_failed`, `svg_missing`
- `?debug=1` adds directory listings in error payloads

Example success payload:

```json
{
  "cached": false,
  "hash": "...",
  "annotationsXml": null,
  "svg": "<svg ...>",
  "annotationsGenerated": false
}
```

---

## 2. Per-Release Upgrade Procedure

Use this each time you upgrade prefigure (for example 0.5.15 -> 0.5.16).

### 2.1 Change pinned version

Either:

- edit Dockerfile default:

```dockerfile
ARG PREFIG_VERSION=0.5.15
```

or pass the version at build time:

```bash
docker build --build-arg PREFIG_VERSION=0.5.15 ...
```

No app.py cache constant edit is required; cache version follows `PREFIG_CACHE_VERSION` from the image.

### 2.2 Build and push a versioned image

Run from `prefigure-lambda/` and replace `ACCOUNT_ID`.

```bash
# 1) Login to ECR
aws ecr get-login-password --region us-east-2 \
  | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com

# 2) Build (provenance=false is required for Lambda container images)
docker build --provenance=false --platform linux/amd64 \
  --build-arg PREFIG_VERSION=0.5.15 \
  -t prefigure-repo:0.5.15 .

# 3) Tag and push
docker tag prefigure-repo:0.5.15 \
  ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:0.5.15
docker push ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:0.5.15
```

### 2.3 Update Lambda to new image

```bash
aws lambda update-function-code \
  --function-name prefigure-function \
  --image-uri ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:0.5.15

aws lambda wait function-updated --function-name prefigure-function
```

### 2.4 Validate deployment

Run checks from `ENDPOINT_TESTING.md`:

- success path (`200`, non-empty `svg`)
- malformed XML path (`422`, diagnostics present)
- cache sanity (second identical request should typically return cached result)

### 2.5 Rollback (if needed)

Point Lambda back to the previous known-good image tag:

```bash
aws lambda update-function-code \
  --function-name prefigure-function \
  --image-uri ACCOUNT_ID.dkr.ecr.us-east-2.amazonaws.com/prefigure-repo:<previous-tag>
```

### 2.6 Automated script (recommended)

Use `deploy-prefigure-release.sh` to run the release flow end-to-end.

Examples:

```bash
# Standard release
./deploy-prefigure-release.sh --version 0.5.15

# Release plus endpoint smoke test
./deploy-prefigure-release.sh --version 0.5.15 --smoke-test

# Dry run (print commands only)
./deploy-prefigure-release.sh --version 0.5.15 --dry-run
```

Key options:

- `--version` (required): prefigure version to pin and deploy
- `--region`: defaults to `us-east-2`
- `--account-id`: optional (auto-detected via `aws sts get-caller-identity`)
- `--ecr-repo`: defaults to `prefigure-repo`
- `--lambda-function`: defaults to `prefigure-function`
- `--endpoint`: endpoint used by `--smoke-test` (defaults to `https://prefigure.doenet.org/build`)

---

## 3. Checking the Deployed Version

To check which prefigure version is currently running:

```bash
curl https://prefigure.doenet.org/version
```

Example response:

```json
{"version": "0.5.15"}
```

Or via AWS CLI (no deployment needed):

```bash
aws lambda get-function --no-cli-pager --function-name prefigure-function --query 'Code.ImageUri' --output text
```

## 4. Manual Smoke Test

```bash
curl -X POST https://prefigure.doenet.org/build \
  -H "Content-Type: application/xml" \
  --data-binary @test.xml
```

For browser testing, use `test-prefigure.html`.
