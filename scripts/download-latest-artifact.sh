#!/usr/bin/env bash
# Download the most recent artifact from GitHub Actions for this repository.
# Usage: ./scripts/download-latest-artifact.sh
# Behavior:
# - Uses GITHUB_TOKEN env var if present; otherwise will try to read from `git config --get github.token`.
# - If workflow is omitted, searches across recent runs for an artifact with the given name.
# - Downloads the most recent successful run's artifact matching the name and extracts it to ./artifacts/<artifact-name>.

REPO=Doenet/DoenetML
ARTIFACT_NAME=build-artifacts
BRANCH=main

GITHUB_TOKEN=${GITHUB_TOKEN:-$(git config --get github.token || true)}
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not set." >&2
  exit 3
fi

API="https://api.github.com"
AUTH_HEADER="Authorization: token $GITHUB_TOKEN"

# Helper to curl JSON with auth
gh_api() {
  local url="$1"
  curl -sSL -H "Accept: application/vnd.github+json" -H "$AUTH_HEADER" "$url"
}

# build URL for recent workflow runs (successful) and search for artifact name
# If workflow provided, restrict to that workflow
runs_url() {
  echo "$API/repos/$REPO/actions/runs?status=success&per_page=50&branch=$(urlencode "$BRANCH")"
}

# urlencode helper
urlencode() {
  local s="$1"
  python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1], safe=''))" "$s"
}

# Require jq
if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required but not installed. Install jq and retry." >&2
  exit 4
fi

echo -e "Using API url: $(runs_url)\n"

runs_json=$(gh_api "$(runs_url)")

# Iterate runs in order, find artifacts for each run
runs_count=$(printf "%s" "$runs_json" | jq -r '.workflow_runs | length')
if [ "$runs_count" -eq 0 ]; then
  echo "No successful workflow runs found matching criteria." >&2
  exit 5
fi

ARTIFACT_URL=""
ARTIFACT_ID=""
RUN_ID=""
for i in $(seq 0 $((runs_count-1))); do
  run_id=$(printf "%s" "$runs_json" | jq -r ".workflow_runs[$i].id")
  # list artifacts for this run
  artifacts_url=$(echo "$API/repos/$REPO/actions/runs/$run_id/artifacts")
  echo -e "Inspecting artifacts at ${artifacts_url}"
  artifacts_json=$(gh_api "$artifacts_url")
  
  match_count=$(printf "%s" "$artifacts_json" | jq -r ".artifacts | map(select(.name==\"$ARTIFACT_NAME\" and .expired==false)) | length")
  if [ "$match_count" -gt 0 ]; then
    echo -e "Found non-expired artifact '$ARTIFACT_NAME' in run $run_id.\n"
    ARTIFACT_ID=$(printf "%s" "$artifacts_json" | jq -r ".artifacts | map(select(.name==\"$ARTIFACT_NAME\" and .expired==false))[0].id")
    ARTIFACT_URL="$API/repos/$REPO/actions/artifacts/$ARTIFACT_ID/zip"
    RUN_ID="$run_id"
    break
  else
    echo -e "Non-expired artifact '$ARTIFACT_NAME' not found in run $run_id. Continuing to next run...\n"
  fi
done

if [ -z "$ARTIFACT_URL" ]; then
  echo "Artifact named '$ARTIFACT_NAME' not found in recent successful runs." >&2
  exit 6
fi

echo -e "Downloading artifact '$ARTIFACT_NAME' from repo $REPO (run $RUN_ID) using URL:"
echo -e "$ARTIFACT_URL\n"

# Use curl with auth to download zip
zip_path=".cache.zip"
curl -sSL -H "$AUTH_HEADER" -H "Accept: application/vnd.github+json" "$ARTIFACT_URL" -o "$zip_path"

if [ ! -s "$zip_path" ]; then
  echo "Download failed or produced empty file: $zip_path" >&2
  exit 7
fi

# Try unzip or bsdtar
if command -v unzip >/dev/null 2>&1; then
  unzip -o "$zip_path" >/dev/null
elif command -v bsdtar >/dev/null 2>&1; then
  bsdtar -xf "$zip_path"
else
  echo "Downloaded artifact to $zip_path. Please extract it manually (no unzip/bsdtar found)." >&2
  exit 0
fi

echo "Extracted artifact from $zip_path"
exit 0
