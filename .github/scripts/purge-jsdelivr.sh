#!/bin/bash
# Purge jsDelivr cache for a specific package version tag
#
# Usage: purge-jsdelivr.sh <tag>
# Example: purge-jsdelivr.sh dev
#          purge-jsdelivr.sh latest

set -e

TAG="${1}"
if [[ -z "${TAG}" ]]; then
    echo "Error: tag argument is required (e.g. 'dev' or 'latest')" >&2
    exit 1
fi

echo "Waiting for npm package propagation before purging jsDelivr cache..."
sleep 15

echo "Purging jsDelivr cache for @doenet/standalone@${TAG} (package-level)..."
curl -fv "https://purge.jsdelivr.net/npm/@doenet/standalone@${TAG}" || exit 1

echo "Purging key standalone assets for @${TAG} tag..."
curl -fv "https://purge.jsdelivr.net/npm/@doenet/standalone@${TAG}/doenet-standalone.js" || exit 1
curl -fv "https://purge.jsdelivr.net/npm/@doenet/standalone@${TAG}/style.css" || exit 1
# The core worker is fetched as its own URL, not carried inside the bundle
# (#1465), so refreshing the bundle without it leaves an embed on a floating
# tag driving the previous release's core. Purging one side of a pair that has
# to agree is worse than purging neither.
curl -fv "https://purge.jsdelivr.net/npm/@doenet/standalone@${TAG}/doenetml-worker/index.js" || exit 1

# The message catalogs under `locales/` are not listed. A locale added in a
# release is a URL nothing has cached, so it cannot be stale; only an edit to
# an existing translation can be, and it costs old wording for up to the edge
# TTL rather than a broken embed. There are 528 of them, which is more requests
# per release than that is worth.

echo "Successfully purged jsDelivr cache for tag @${TAG}"
