#!/bin/bash
# Purge jsDelivr's cache for @doenet/standalone at a tag, and confirm it took.
#
# Usage: purge-jsdelivr.sh <dist-tag> [version] [extra-spec...]
# Example: purge-jsdelivr.sh dev
#          purge-jsdelivr.sh latest 0.7.24
#          purge-jsdelivr.sh latest "" 0.7
#
# `version` is the release just published, defaulting to the one in the working
# tree — which is what the publish job built and published from. See
# `jsdelivr-purge-lib.sh` for why the purge waits for it rather than sleeping.
#
# `dist-tag` is a real npm dist-tag: it names both a CDN path segment to purge
# and the registry tag to wait on before purging anything.
#
# Each `extra-spec` is a further CDN path segment to purge for the same release,
# for floating URLs that are not dist-tags. The case that needs this is the line
# range: hosts pin `doenetmlVersion="0.7"`, and jsDelivr resolves `@0.7` as an
# npm semver range to the newest 0.7.x and caches that resolution like any other
# floating URL. It cannot be passed as the dist-tag instead, for two reasons —
# npm refuses to create a dist-tag that parses as a semver range, so `0.7` will
# never be one; and the registry wait reads the dist-tags endpoint, so a name
# that is not a dist-tag would never resolve and would fail the step. Hence the
# split: wait on the tag, purge the tag and everything else listed.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./jsdelivr-purge-lib.sh
source "${SCRIPT_DIR}/jsdelivr-purge-lib.sh"

PACKAGE="@doenet/standalone"

TAG="${1}"
if [[ -z "${TAG}" ]]; then
    echo "Error: dist-tag argument is required (e.g. 'dev' or 'latest')" >&2
    exit 1
fi

VERSION="${2:-$(node -p "require('${SCRIPT_DIR}/../../packages/standalone/package.json').version")}"
if [[ -z "${VERSION}" ]]; then
    echo "Error: could not determine the version of ${PACKAGE} to purge for" >&2
    exit 1
fi

# Everything past `version` is an extra spec. `${@:3}` expands to nothing when
# fewer arguments were passed, so the one-argument call `purge-jsdelivr.sh dev`
# needs no guard here and the loops below simply do not run.
EXTRA_SPECS=("${@:3}")

for spec in "${EXTRA_SPECS[@]}"; do
    if [[ -z "${spec}" ]]; then
        echo "Error: extra spec arguments must not be empty" >&2
        exit 1
    fi
done

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

# Both waits are about the release itself rather than any one floating URL, so
# they run once no matter how many specs follow. The registry wait is what makes
# the purges meaningful: until npm serves this version under the tag, purging a
# floating URL only re-fetches the previous release.
wait_for_registry_tag "${PACKAGE}" "${TAG}" "${VERSION}"
wait_for_cdn_version "${PACKAGE}" "${VERSION}"

# Each spec is purged and then verified to serve ${VERSION}, the tag included.
# A failure here is fatal by way of `set -e`, which is the point: a stale line
# range is the same broken embed as a stale dist-tag, for up to the 12-hour edge
# TTL, and it should fail the step rather than pass quietly.
purge_and_verify "${PACKAGE}" "${TAG}" "${VERSION}"
for spec in "${EXTRA_SPECS[@]}"; do
    echo
    purge_and_verify "${PACKAGE}" "${spec}" "${VERSION}"
done
