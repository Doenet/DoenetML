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

# How often the wait below reports that it is still waiting, in seconds. Only
# affects log volume.
_REGISTRY_REPORT_INTERVAL=60

# The version the registry currently serves for a tag, or empty if it cannot be
# read. Asks the registry's dist-tags endpoint rather than `npm view`, which
# answers from the local metadata cache and can report a version that is
# already stale by the time it is read.
_registry_tag_version() {
    local package="$1" tag="$2" body status
    body="$(mktemp)"
    status=0
    curl -fsS --retry 3 --retry-delay 2 --max-time 30 \
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
#
# The budget is wall-clock (`SECONDS`) rather than a count of sleeps, so a slow
# or hanging registry read spends the timeout instead of extending it.
wait_for_registry_tag() {
    local package="$1" tag="$2" version="$3"
    local started=${SECONDS}
    local deadline=$((SECONDS + REGISTRY_POLL_TIMEOUT))
    local next_report=0 seen elapsed

    echo "Waiting for npm to finish processing ${package}@${version}..."
    while true; do
        seen="$(_registry_tag_version "${package}" "${tag}" || true)"
        elapsed=$((SECONDS - started))
        if [[ "${seen}" == "${version}" ]]; then
            echo "  registry serves ${package}@${tag} => ${version} (after ${elapsed}s)"
            return 0
        fi
        if [[ ${SECONDS} -ge ${deadline} ]]; then
            echo "Error: ${package}@${tag} still resolves to '${seen:-<none>}' after" >&2
            echo "       ${elapsed}s; expected ${version}. Not purging: a purge now would" >&2
            echo "       re-cache the previous release for another 12 hours." >&2
            echo "       Check that ${version} published and that the ${tag} dist-tag was" >&2
            echo "       moved to it; if npm is merely slow, re-running this step is safe." >&2
            return 1
        fi
        if [[ ${elapsed} -ge ${next_report} ]]; then
            echo "  ${package}@${tag} still => ${seen:-<none>} (${elapsed}s elapsed)"
            next_report=$((elapsed + _REGISTRY_REPORT_INTERVAL))
        fi
        sleep "${REGISTRY_POLL_INTERVAL}"
    done
}

# Ask jsDelivr to drop its cached copy of one URL. Non-fatal on failure: the
# retry loop in `purge_and_verify` is there for exactly this, and the purge API
# is rate-limited, so one refused request should cost an attempt rather than
# the release.
_purge_url() {
    if curl -fsS --retry 3 --retry-delay 2 --max-time 60 "${1}" -o /dev/null; then
        echo "  purge   ${1}"
        return 0
    fi
    echo "  FAILED  purge ${1}" >&2
    return 1
}

_fetch_cdn() {
    curl -fsS --retry 3 --retry-delay 2 --max-time 120 \
        "https://cdn.jsdelivr.net/npm/${1}" -o "${2}"
}

# Whether the floating tag now serves the same bytes as the immutable pinned
# version. Compares content rather than looking for a version string: the
# pinned URL names one npm release and cannot drift, so matching it is the
# whole property, and it holds for assets with no version string in them.
#
# Exit status: 0 they match, 1 the tag is serving something else, 2 one of the
# two fetches failed — which says nothing either way, and must not be reported
# as staleness.
_tag_serves_version() {
    local package="$1" tag="$2" version="$3" path="$4"
    local from_tag from_version status=0

    from_tag="$(mktemp)"
    from_version="$(mktemp)"
    if ! _fetch_cdn "${package}@${tag}/${path}" "${from_tag}" ||
        ! _fetch_cdn "${package}@${version}/${path}" "${from_version}"; then
        status=2
    elif ! cmp -s "${from_tag}" "${from_version}"; then
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
    local attempt path result stale unreachable purge_failures=0

    # A purge that verifies nothing is the failure mode this whole file exists
    # to remove, so refuse to be that rather than exiting 0 on an empty list.
    if [[ ${#VERIFY_PATHS[@]} -eq 0 ]]; then
        echo "Error: purge_and_verify called with no VERIFY_PATHS; there would be" >&2
        echo "       nothing to confirm the purge against, and the step would pass" >&2
        echo "       whether or not ${tag} moved. Set VERIFY_PATHS as a bash array." >&2
        return 1
    fi

    for ((attempt = 1; attempt <= PURGE_ATTEMPTS; attempt++)); do
        echo "Purging ${package}@${tag} (attempt ${attempt}/${PURGE_ATTEMPTS})..."
        purge_failures=0
        _purge_url "https://purge.jsdelivr.net/npm/${package}@${tag}" ||
            purge_failures=$((purge_failures + 1))
        for path in "${PURGE_PATHS[@]}"; do
            _purge_url "https://purge.jsdelivr.net/npm/${package}@${tag}/${path}" ||
                purge_failures=$((purge_failures + 1))
        done

        stale=""
        unreachable=""
        for path in "${VERIFY_PATHS[@]}"; do
            result=0
            _tag_serves_version "${package}" "${tag}" "${version}" "${path}" || result=$?
            case ${result} in
                0) echo "  ok      ${path}" ;;
                1)
                    echo "  stale   ${path}"
                    stale="${stale} ${path}"
                    ;;
                *)
                    echo "  ERROR   ${path} (could not be fetched)"
                    unreachable="${unreachable} ${path}"
                    ;;
            esac
        done

        if [[ -z "${stale}" && -z "${unreachable}" ]]; then
            echo "${package}@${tag} now serves ${version}."
            return 0
        fi
        if [[ ${attempt} -lt ${PURGE_ATTEMPTS} ]]; then
            echo "  retrying in ${PURGE_RETRY_DELAY}s..."
            sleep "${PURGE_RETRY_DELAY}"
        fi
    done

    echo "Error: could not confirm ${package}@${tag} serves ${version}, after" >&2
    echo "       ${PURGE_ATTEMPTS} purge attempts." >&2
    if [[ -n "${stale}" ]]; then
        echo "  Still serving an older release:${stale}" >&2
        echo "  ${version} is published and reachable at its pinned URL; only the" >&2
        echo "  floating tag is behind, and it will stay behind until the edge TTL" >&2
        echo "  expires (12 hours) or a purge lands." >&2
    fi
    if [[ -n "${unreachable}" ]]; then
        echo "  Could not be fetched from the CDN:${unreachable}" >&2
        echo "  Either jsDelivr is unwell or ${version} does not contain these files." >&2
        echo "  Check https://cdn.jsdelivr.net/npm/${package}@${version}/ by hand." >&2
    fi
    if [[ ${purge_failures} -gt 0 ]]; then
        echo "  ${purge_failures} purge request(s) were refused on the last attempt;" >&2
        echo "  jsDelivr rate-limits them, so waiting and re-running may be enough." >&2
    fi
    echo "  Re-run this step, or purge by hand:" >&2
    echo "    curl https://purge.jsdelivr.net/npm/${package}@${tag}/<file>" >&2
    return 1
}
