#!/bin/bash
# Purge jsDelivr's cache for @doenet/standalone at a tag, and confirm it took.
#
# Usage: purge-jsdelivr.sh <tag> [version]
# Example: purge-jsdelivr.sh dev
#          purge-jsdelivr.sh latest 0.7.24
#
# `version` is the release just published, defaulting to the one in the working
# tree — which is what the publish job built and published from. See
# `jsdelivr-purge-lib.sh` for why the purge waits for it rather than sleeping.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./jsdelivr-purge-lib.sh
source "${SCRIPT_DIR}/jsdelivr-purge-lib.sh"

PACKAGE="@doenet/standalone"

TAG="${1}"
if [[ -z "${TAG}" ]]; then
    echo "Error: tag argument is required (e.g. 'dev' or 'latest')" >&2
    exit 1
fi

VERSION="${2:-$(node -p "require('${SCRIPT_DIR}/../../packages/standalone/package.json').version")}"
if [[ -z "${VERSION}" ]]; then
    echo "Error: could not determine the version of ${PACKAGE} to purge for" >&2
    exit 1
fi

PURGE_PATHS=(
    "doenet-standalone.js"
    "style.css"
    # The core worker is fetched as its own URL rather than carried inside the
    # bundle (#1465), so it has to be refreshed alongside the bundle: on a
    # floating tag, a fresh bundle paired with the previous release's core is a
    # broken embed. Bundles from #1659 on resolve the worker at their own exact
    # version and no longer rely on this; keep it for the ones already cached
    # from before that.
    "doenetml-worker/index.js"
    # Host pages load the activity coordinator directly by URL, so it is stale
    # on a floating tag until purged too.
    "coordinator.js"
)

# The several hundred message catalogs under `locales/` are deliberately left
# out: a stale catalog costs old wording until the edge TTL expires, not a
# broken embed, which is not worth hundreds of purge requests per release.

VERIFY_PATHS=(
    # The entry is the one file whose staleness decides everything else. Since
    # the bundle was code-split (#1728) it is a small shim that pins its chunks
    # to its own compiled-in version, so an entry a release behind quietly
    # serves that whole release — editor included — however fresh the rest is.
    "doenet-standalone.js"
    "style.css"
    "coordinator.js"
    # `doenetml-worker/index.js` is purged but not verified: it is ~6 MB, which
    # this would fetch twice per attempt, and a modern bundle resolves it at a
    # pinned URL rather than through the tag.
)

wait_for_registry_tag "${PACKAGE}" "${TAG}" "${VERSION}"
purge_and_verify "${PACKAGE}" "${TAG}" "${VERSION}"
