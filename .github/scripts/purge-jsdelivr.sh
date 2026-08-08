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
# The core worker is fetched as its own URL rather than carried inside the
# bundle (#1465), so it has to be refreshed alongside the bundle: on a floating
# tag, a fresh bundle paired with the previous release's core is a broken embed.
# Bundles from #1659 on resolve the worker at their own exact version and no
# longer rely on this; keep it for the ones already cached from before that.
curl -fv "https://purge.jsdelivr.net/npm/@doenet/standalone@${TAG}/doenetml-worker/index.js" || exit 1
# Host pages load the activity coordinator directly by URL, so it is stale on a
# floating tag until purged too.
curl -fv "https://purge.jsdelivr.net/npm/@doenet/standalone@${TAG}/coordinator.js" || exit 1

# The several hundred message catalogs under `locales/` are deliberately left
# out: a stale catalog costs old wording until the edge TTL expires, not a
# broken embed, which is not worth hundreds of purge requests per release.

echo "Successfully purged jsDelivr cache for tag @${TAG}"
