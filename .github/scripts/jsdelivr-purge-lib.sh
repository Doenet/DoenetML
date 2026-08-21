#!/bin/bash
# Shared helpers for the jsDelivr purge steps that follow an npm publish.
#
# Purging is not fire-and-forget. jsDelivr answers a purge request by dropping
# its cached copy and fetching the file again on the next request — so a purge
# sent before npm has finished making the new version available refetches the
# *previous* one and re-caches it, with a fresh 12-hour edge TTL. The request
# succeeds either way, which is what made this invisible: the release step went
# green while the floating tag stayed a release behind for half a day.
#
# npm does not always publish synchronously. A large package ("Your package is
# being processed and may take a few minutes to become available" — this is
# @doenet/standalone's normal path) is accepted immediately and becomes
# available minutes later. Observed on two consecutive dev releases: `npm
# publish` returned at 08:03:17 and 12:40:57, npm made the version available at
# 08:10:27 and 12:48:07, and the purge — a fixed 15-second sleep after the
# publish — fired at 08:03:52 and 12:41:43. Six and a half minutes early, every
# time.
#
# So: wait for the registry to actually serve the version under the tag, purge,
# and then confirm the tag serves it before calling the step done.

# Poll intervals and limits, overridable for testing.
REGISTRY_POLL_INTERVAL="${REGISTRY_POLL_INTERVAL:-10}"
REGISTRY_POLL_TIMEOUT="${REGISTRY_POLL_TIMEOUT:-1200}"
PURGE_ATTEMPTS="${PURGE_ATTEMPTS:-5}"
PURGE_RETRY_DELAY="${PURGE_RETRY_DELAY:-20}"

# The version the registry currently serves for a tag, or empty if it cannot be
# read. Asks the registry's dist-tags endpoint rather than `npm view`, which
# answers from the local metadata cache and can report a version that is
# already stale by the time it is read.
_registry_tag_version() {
    local package="$1" tag="$2" body status
    body="$(mktemp)"
    status=0
    curl -fsS --max-time 30 \
        "https://registry.npmjs.org/-/package/${package/\//%2f}/dist-tags" \
        -o "${body}" || status=$?
    if [[ ${status} -eq 0 ]]; then
        TAG="${tag}" node -e '
            const tags = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
            process.stdout.write(tags[process.env.TAG] ?? "");
        ' "${body}" || status=$?
    fi
    rm -f "${body}"
    return ${status}
}

# Block until the registry serves `version` under `tag`, i.e. until npm has
# finished processing the publish. Everything downstream is pointless before
# this: a purge would only re-cache the previous release.
wait_for_registry_tag() {
    local package="$1" tag="$2" version="$3"
    local waited=0 seen

    echo "Waiting for npm to finish processing ${package}@${version}..."
    while true; do
        seen="$(_registry_tag_version "${package}" "${tag}" || true)"
        if [[ "${seen}" == "${version}" ]]; then
            echo "  registry serves ${package}@${tag} => ${version} (after ${waited}s)"
            return 0
        fi
        if [[ ${waited} -ge ${REGISTRY_POLL_TIMEOUT} ]]; then
            echo "Error: ${package}@${tag} still resolves to '${seen:-<unreadable>}'" >&2
            echo "       after ${waited}s; expected ${version}. Not purging: doing so" >&2
            echo "       now would re-cache the previous release for another 12 hours." >&2
            return 1
        fi
        sleep "${REGISTRY_POLL_INTERVAL}"
        waited=$((waited + REGISTRY_POLL_INTERVAL))
    done
}

_purge_url() {
    echo "  purge ${1}"
    curl -fsS --max-time 60 "${1}" -o /dev/null
}

# Whether the floating tag now serves the same bytes as the immutable pinned
# version. Compares content rather than looking for a version string: the
# pinned URL names one npm release and cannot drift, so matching it is the
# whole property, and it holds for assets with no version string in them.
_tag_serves_version() {
    local package="$1" tag="$2" version="$3" path="$4"
    local from_tag from_version status=0

    from_tag="$(mktemp)"
    from_version="$(mktemp)"
    curl -fsS --max-time 120 \
        "https://cdn.jsdelivr.net/npm/${package}@${tag}/${path}" -o "${from_tag}" || status=$?
    if [[ ${status} -eq 0 ]]; then
        curl -fsS --max-time 120 \
            "https://cdn.jsdelivr.net/npm/${package}@${version}/${path}" -o "${from_version}" || status=$?
    fi
    if [[ ${status} -eq 0 ]] && ! cmp -s "${from_tag}" "${from_version}"; then
        status=1
    fi
    rm -f "${from_tag}" "${from_version}"
    return ${status}
}

# Purge `PURGE_PATHS` (plus the package-level alias) and confirm `VERIFY_PATHS`
# are served at `version` afterwards, retrying the pair a few times before
# giving up. Both are arrays the caller sets; `VERIFY_PATHS` is normally the
# subset small enough to fetch twice per attempt.
purge_and_verify() {
    local package="$1" tag="$2" version="$3"
    local attempt path stale

    for ((attempt = 1; attempt <= PURGE_ATTEMPTS; attempt++)); do
        echo "Purging ${package}@${tag} (attempt ${attempt}/${PURGE_ATTEMPTS})..."
        _purge_url "https://purge.jsdelivr.net/npm/${package}@${tag}"
        for path in "${PURGE_PATHS[@]}"; do
            _purge_url "https://purge.jsdelivr.net/npm/${package}@${tag}/${path}"
        done

        stale=""
        for path in "${VERIFY_PATHS[@]}"; do
            if _tag_serves_version "${package}" "${tag}" "${version}" "${path}"; then
                echo "  ok      ${path}"
            else
                echo "  stale   ${path}"
                stale="${stale} ${path}"
            fi
        done

        if [[ -z "${stale}" ]]; then
            echo "${package}@${tag} now serves ${version}."
            return 0
        fi
        if [[ ${attempt} -lt ${PURGE_ATTEMPTS} ]]; then
            echo "  retrying in ${PURGE_RETRY_DELAY}s..."
            sleep "${PURGE_RETRY_DELAY}"
        fi
    done

    echo "Error: ${package}@${tag} still serves stale files after ${PURGE_ATTEMPTS} attempts:${stale}" >&2
    echo "       ${version} is published and reachable at its pinned URL; only the" >&2
    echo "       floating tag is behind, and it will stay behind until the edge TTL" >&2
    echo "       expires (12 hours) or a purge lands. Re-run this step, or:" >&2
    echo "         curl https://purge.jsdelivr.net/npm/${package}@${tag}/<file>" >&2
    return 1
}
