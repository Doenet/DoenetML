#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Deploy a pinned PreFigure version to AWS Lambda (container image flow).

Usage:
  ./deploy-prefigure-release.sh --version <prefig_version> [options]

Required:
  --version <version>         PreFigure version (example: 0.5.16)

Options:
  --region <aws_region>       AWS region (default: us-east-2)
  --account-id <account_id>   AWS account ID (auto-detected if omitted)
  --ecr-repo <name>           ECR repository name (default: prefigure-repo)
  --lambda-function <name>    Lambda function name (default: prefigure-function)
  --endpoint <url>            Endpoint URL for optional smoke test
                              (default: https://prefigure.doenet.org/build)
  --smoke-test                Run a basic HTTP smoke test after deployment
  --dry-run                   Print commands without executing
  -h, --help                  Show this help message

Examples:
  ./deploy-prefigure-release.sh --version 0.5.16
  ./deploy-prefigure-release.sh --version 0.5.16 --smoke-test
EOF
}

VERSION=""
REGION="us-east-2"
ACCOUNT_ID=""
ECR_REPO="prefigure-repo"
LAMBDA_FUNCTION="prefigure-function"
ENDPOINT_URL="https://prefigure.doenet.org/build"
SMOKE_TEST="false"
DRY_RUN="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version)
      VERSION="${2:-}"
      shift 2
      ;;
    --region)
      REGION="${2:-}"
      shift 2
      ;;
    --account-id)
      ACCOUNT_ID="${2:-}"
      shift 2
      ;;
    --ecr-repo)
      ECR_REPO="${2:-}"
      shift 2
      ;;
    --lambda-function)
      LAMBDA_FUNCTION="${2:-}"
      shift 2
      ;;
    --endpoint)
      ENDPOINT_URL="${2:-}"
      shift 2
      ;;
    --smoke-test)
      SMOKE_TEST="true"
      shift
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  echo "Error: --version is required." >&2
  usage
  exit 1
fi

if [[ -z "$ACCOUNT_ID" ]]; then
  if [[ "$DRY_RUN" == "true" ]]; then
    ACCOUNT_ID="ACCOUNT_ID"
  else
    ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
  fi
fi

if [[ -z "$ACCOUNT_ID" || "$ACCOUNT_ID" == "None" ]]; then
  echo "Error: Could not determine AWS account ID. Provide --account-id." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

IMAGE_TAG="$VERSION"
IMAGE_LOCAL="$ECR_REPO:$IMAGE_TAG"
IMAGE_REMOTE="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG"

run_cmd() {
  echo "+ $*"
  if [[ "$DRY_RUN" == "false" ]]; then
    "$@"
  fi
}

echo "Deploying PreFigure version: $VERSION"
echo "Region: $REGION"
echo "Account ID: $ACCOUNT_ID"
echo "ECR image: $IMAGE_REMOTE"
echo "Lambda function: $LAMBDA_FUNCTION"

if [[ "$DRY_RUN" == "true" ]]; then
  echo "Dry run mode enabled. No commands will be executed."
fi

if [[ "$DRY_RUN" == "false" ]]; then
  if ! aws sts get-caller-identity --no-cli-pager >/dev/null 2>&1; then
    echo "Error: AWS CLI session is not authenticated." >&2
    echo "Run: aws login" >&2
    echo "Then verify with: aws sts get-caller-identity" >&2
    exit 1
  fi

  if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker daemon is not running." >&2
    echo "Start Docker Desktop (Super/Windows key → 'Docker' → Docker Desktop) and wait for it to be ready." >&2
    exit 1
  fi
fi

if [[ "$DRY_RUN" == "false" ]]; then
  aws ecr describe-repositories --region "$REGION" --repository-names "$ECR_REPO" >/dev/null
fi

if [[ "$DRY_RUN" == "false" ]]; then
  aws ecr get-login-password --region "$REGION" \
    | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
else
  echo "+ aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
fi

run_cmd docker build --provenance=false --platform linux/amd64 \
  --build-arg "PREFIG_VERSION=$VERSION" \
  -t "$IMAGE_LOCAL" .

run_cmd docker tag "$IMAGE_LOCAL" "$IMAGE_REMOTE"
run_cmd docker push "$IMAGE_REMOTE"

run_cmd aws lambda update-function-code \
  --no-cli-pager \
  --region "$REGION" \
  --function-name "$LAMBDA_FUNCTION" \
  --image-uri "$IMAGE_REMOTE"

run_cmd aws lambda wait function-updated \
  --no-cli-pager \
  --region "$REGION" \
  --function-name "$LAMBDA_FUNCTION"

echo "Deployment complete."

if [[ "$SMOKE_TEST" == "true" ]]; then
  echo "Running smoke test against: $ENDPOINT_URL"
  TMP_XML="/tmp/prefigure-smoke.xml"
  cat > "$TMP_XML" <<'XML'
<diagram dimensions="(0,0,1,1)">
  <graph></graph>
</diagram>
XML

  if [[ "$DRY_RUN" == "false" ]]; then
    # Check /version endpoint reports expected version
    VERSION_ENDPOINT="${ENDPOINT_URL%/build}/version"
    echo "Checking version endpoint: $VERSION_ENDPOINT"
    VERSION_RESPONSE="$(curl -sS "$VERSION_ENDPOINT")"
    echo "Version endpoint response: $VERSION_RESPONSE"
    DEPLOYED_VERSION="$(echo "$VERSION_RESPONSE" | grep -o '"version": *"[^"]*"' | grep -o '"[^"]*"$' | tr -d '"' || true)"
    if [[ "$DEPLOYED_VERSION" == "$VERSION" ]]; then
      echo "Version check passed: $DEPLOYED_VERSION"
    elif [[ -z "$DEPLOYED_VERSION" ]]; then
      echo "Warning: /version endpoint did not return a version field (response: $VERSION_RESPONSE)" >&2
    else
      echo "Warning: /version returned '$DEPLOYED_VERSION', expected '$VERSION'" >&2
    fi

    HTTP_CODE="$(curl -sS -o /tmp/prefigure-smoke-response.json -w "%{http_code}" \
      -X POST "$ENDPOINT_URL" \
      -H "Content-Type: application/xml" \
      --data-binary @"$TMP_XML")"

    echo "Smoke test HTTP status: $HTTP_CODE"
    echo "Smoke test response saved: /tmp/prefigure-smoke-response.json"

    if [[ "$HTTP_CODE" != "200" ]]; then
      echo "Smoke test failed (expected HTTP 200)." >&2
      exit 1
    fi
  else
    echo "+ curl -X POST $ENDPOINT_URL -H Content-Type: application/xml --data-binary @/tmp/prefigure-smoke.xml"
  fi
fi

echo "Done."
