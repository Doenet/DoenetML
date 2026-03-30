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

echo "Successfully purged jsDelivr cache for tag @${TAG}"
