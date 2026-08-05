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

echo "Purging key prefigure assets for @doenet/prefigure@${TAG}..."
curl -fv "https://purge.jsdelivr.net/npm/@doenet/prefigure@${TAG}/prefigure.js" || exit 1
# Pyodide loads its runtime from `assets/` by URL at run time. These are the
# fixed-name files it fetches; everything else under `assets/` is already
# immutable per build (wheels carry their version in the filename, the bundle's
# own chunks are content-hashed), so no other URL can go stale.
for asset in pyodide.mjs pyodide.asm.js pyodide.asm.wasm pyodide-lock.json python_stdlib.zip; do
    curl -fv "https://purge.jsdelivr.net/npm/@doenet/prefigure@${TAG}/assets/${asset}" || exit 1
done

echo "Successfully purged jsDelivr cache for @doenet/prefigure@${TAG}"
