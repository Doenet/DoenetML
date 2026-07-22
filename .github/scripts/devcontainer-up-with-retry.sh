#!/usr/bin/env bash
#
# Build and start the devcontainer, retrying transient failures.
#
# The devcontainer image build installs the Node feature, whose install script
# git-clones nvm from github.com. A transient github.com outage makes that clone
# — and therefore the whole `docker buildx build` — fail, which would otherwise
# sink the CI job on a pure network blip (observed: "fatal: unable to access
# 'https://github.com/nvm-sh/nvm/': Failed to connect to github.com port 443").
# Retrying `devcontainer up` a few times with backoff lets a transient failure
# recover instead of failing the run. The retry is scoped to the image build:
# the tests themselves are run once by the caller (via `devcontainer exec`), so
# a genuine test failure is never masked.
#
# Usage:
#   bash .github/scripts/devcontainer-up-with-retry.sh [devcontainer up args...]
#
# All arguments are forwarded verbatim to `devcontainer up` (e.g.
# `--workspace-folder .`).
#
# Configuration (environment variables):
#   DEVCONTAINER_UP_MAX_ATTEMPTS   total attempts before giving up (default 3)
#   DEVCONTAINER_UP_RETRY_DELAY    base backoff delay in seconds (default 30)

set -euo pipefail

max_attempts="${DEVCONTAINER_UP_MAX_ATTEMPTS:-3}"
base_delay="${DEVCONTAINER_UP_RETRY_DELAY:-30}"

attempt=1
while true; do
    echo "=== devcontainer up (attempt ${attempt}/${max_attempts}) ==="
    if devcontainer up "$@"; then
        exit 0
    fi

    if [ "${attempt}" -ge "${max_attempts}" ]; then
        echo "devcontainer up failed after ${max_attempts} attempts" >&2
        exit 1
    fi

    delay=$((base_delay * attempt))
    echo "devcontainer up failed; retrying in ${delay}s..." >&2
    sleep "${delay}"
    attempt=$((attempt + 1))
done
