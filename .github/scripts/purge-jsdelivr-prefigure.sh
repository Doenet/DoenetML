#!/bin/bash
# Purge jsDelivr's cache for @doenet/prefigure at a tag, and confirm it took.
#
# Usage: purge-jsdelivr-prefigure.sh <tag> [version]
# Example: purge-jsdelivr-prefigure.sh latest
#
# `version` is the release just published, defaulting to the one in the working
# tree — which is what the publish job built and published from. See
# `jsdelivr-purge-lib.sh` for why the purge waits for it rather than sleeping;
# this package carries a Pyodide runtime and is firmly in the size range npm
# processes asynchronously, so it is exposed to exactly the same race.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./jsdelivr-purge-lib.sh
source "${SCRIPT_DIR}/jsdelivr-purge-lib.sh"

PACKAGE="@doenet/prefigure"

TAG="${1}"
if [[ -z "${TAG}" ]]; then
    echo "Error: tag argument is required (e.g. 'latest')" >&2
    exit 1
fi

VERSION="${2:-$(node -p "require('${SCRIPT_DIR}/../../packages/prefigure/package.json').version")}"
if [[ -z "${VERSION}" ]]; then
    echo "Error: could not determine the version of ${PACKAGE} to purge for" >&2
    exit 1
fi

PURGE_PATHS=("prefigure.js")
# Pyodide loads its runtime from `assets/` by URL at run time. These are the
# fixed-name files it fetches; everything else under `assets/` is already
# immutable per build (wheels carry their version in the filename, the bundle's
# own chunks are content-hashed), so no other URL can go stale.
for asset in pyodide.mjs pyodide.asm.js pyodide.asm.wasm pyodide-lock.json python_stdlib.zip; do
    PURGE_PATHS+=("assets/${asset}")
done

VERIFY_PATHS=(
    "prefigure.js"
    "assets/pyodide.mjs"
    "assets/pyodide-lock.json"
    # `pyodide.asm.js`, `pyodide.asm.wasm` and `python_stdlib.zip` are purged
    # but not verified: tens of megabytes, which this would fetch twice per
    # attempt. They come from the same release as the files above, so a tag
    # serving those at `${VERSION}` has taken the purge.
)

wait_for_registry_tag "${PACKAGE}" "${TAG}" "${VERSION}"
wait_for_cdn_version "${PACKAGE}" "${VERSION}"
purge_and_verify "${PACKAGE}" "${TAG}" "${VERSION}"
