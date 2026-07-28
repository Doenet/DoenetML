#!/bin/bash
# Pin the Doenet site's tracked DoenetML version to a concrete published version.
#
# Called by publish.yml after a dev or production npm publish. POSTs to the
# site's /api/info/updateTrackedDoenetmlVersion endpoint, which updates the
# doenetmlVersions row that tracks the given npm dist-tag so the jsDelivr bundle
# URL becomes immutable (browser-cacheable) instead of a moving tag — users get
# the new bundle without clearing their cache.
#
# Environment:
#   SECRET  - shared bearer secret (repo secret DOENET_VERSION_UPDATE_SECRET)
#   TAG     - npm dist-tag being pinned: "dev" or "latest"
#   VERSION - concrete version just published (e.g. 0.7.21 or 0.7.21-dev.343)
#
# Production (doenet.org) is REQUIRED: a failure fails the job so GitHub notifies
# and the job can be re-run. dev3 is BEST-EFFORT because it auto-scales to zero
# and may be asleep when a publish happens.

set -u

if [[ -z "${SECRET:-}" ]]; then
    echo "::error::DOENET_VERSION_UPDATE_SECRET is not set — add it as a repository secret"
    exit 1
fi
if [[ -z "${TAG:-}" || -z "${VERSION:-}" ]]; then
    echo "::error::TAG and VERSION must both be set (TAG='${TAG:-}', VERSION='${VERSION:-}')"
    exit 1
fi

# $1 = site base URL, $2 = required ("true" fails the job on error)
post() {
    local url="$1" required="$2"
    echo "Pinning ${TAG} -> ${VERSION} on ${url} ..."
    if curl -fsS --connect-timeout 15 --max-time 60 \
        -X POST "${url}/api/info/updateTrackedDoenetmlVersion" \
        -H "Authorization: Bearer ${SECRET}" \
        -H "Content-Type: application/json" \
        -d "{\"tag\":\"${TAG}\",\"version\":\"${VERSION}\"}"; then
        echo ""
        echo "  updated ${url}"
    elif [[ "${required}" == "true" ]]; then
        echo ""
        echo "::error::Failed to pin DoenetML version on ${url}"
        exit 1
    else
        echo ""
        echo "::warning::Failed to pin DoenetML version on ${url} (best-effort; the site may be asleep)"
    fi
}

post "https://doenet.org" true
post "https://dev3.doenet.org" false

echo "Done."
