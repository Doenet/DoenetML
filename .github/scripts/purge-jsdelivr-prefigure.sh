#!/bin/bash
# Purge jsDelivr cache for @doenet/prefigure at a specific version tag.
#
# Usage: purge-jsdelivr-prefigure.sh <tag>
# Example: purge-jsdelivr-prefigure.sh latest

set -e

TAG="${1}"
if [[ -z "${TAG}" ]]; then
    echo "Error: tag argument is required (e.g. 'latest')" >&2
    exit 1
fi

echo "Waiting for npm package propagation before purging jsDelivr cache..."
sleep 15

echo "Purging jsDelivr cache for @doenet/prefigure@${TAG} (package-level)..."
curl -fv "https://purge.jsdelivr.net/npm/@doenet/prefigure@${TAG}" || exit 1

echo "Purging key prefigure assets for @${TAG} tag..."
curl -fv "https://purge.jsdelivr.net/npm/@doenet/prefigure@${TAG}/prefigure.js" || exit 1

echo "Successfully purged jsDelivr cache for @doenet/prefigure@${TAG}"
