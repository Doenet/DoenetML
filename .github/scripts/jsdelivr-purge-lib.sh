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

# Ask jsDelivr to drop its cached copy of one URL. Non-fatal on its own: the
# purge API is rate-limited, so one refused request should cost an attempt
# rather than the release. `purge_and_verify` is what decides whether a refusal
# that survives every attempt matters.
_purge_url() {
    if curl -fsS --retry 3 --retry-delay 2 --max-time 60 "${1}" -o /dev/null; then
        echo "  purge   ${1}"
        return 0
    fi
    echo "  FAILED  purge ${1}" >&2
    return 1
}

# Fetch one CDN file into `${2}`. Names the URL when it cannot: the caller
# fetches a floating and a pinned URL, and which of the two failed is the
# difference between the tag being unreachable and the release genuinely not
# containing the file — curl's own message says only which error, not which URL.
_fetch_cdn() {
    local url="https://cdn.jsdelivr.net/npm/${1}"
    if ! curl -fsS --retry 3 --retry-delay 2 --max-time 120 "${url}" -o "${2}"; then
        echo "  FAILED  fetch ${url}" >&2
        return 1
    fi
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

# Whether `path` is one of the paths verified after the purge. Verification is
# better evidence than the purge request's own answer — it compares the bytes
# the tag serves against the immutable pinned release — so for a verified path
# it is the comparison that decides, not whether the request was accepted. For
# every other URL the purge request is the only evidence there is.
_is_verify_path() {
    local candidate="$1" path
    for path in "${VERIFY_PATHS[@]}"; do
        if [[ "${path}" == "${candidate}" ]]; then
            return 0
        fi
    done
    return 1
}

# Purge `PURGE_PATHS` (plus the package-level alias) and confirm `VERIFY_PATHS`
# are served at `version` afterwards, retrying the pair a few times before
# giving up. Both are arrays the caller sets; `VERIFY_PATHS` is normally the
# subset small enough to fetch twice per attempt.
#
# Being a subset is why verification passing is not on its own enough to call
# the purge done. The paths left out are the large ones — a multi-megabyte core
# worker, a Pyodide runtime — and a refused purge leaves one of those cached
# from the previous release with nothing downstream to notice, which is the
# silent staleness this file exists to remove. So a purge request that no
# verification covers has to have been accepted as well.
purge_and_verify() {
    local package="$1" tag="$2" version="$3"
    local attempt path result stale unreachable
    local purge_failures=0 unverified_failures=0

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
        unverified_failures=0
        # The package-level alias is its own cache key and nothing below fetches
        # it, so a refusal here is unverified by definition.
        if ! _purge_url "https://purge.jsdelivr.net/npm/${package}@${tag}"; then
            purge_failures=$((purge_failures + 1))
            unverified_failures=$((unverified_failures + 1))
        fi
        for path in "${PURGE_PATHS[@]}"; do
            if ! _purge_url "https://purge.jsdelivr.net/npm/${package}@${tag}/${path}"; then
                purge_failures=$((purge_failures + 1))
                if ! _is_verify_path "${path}"; then
                    unverified_failures=$((unverified_failures + 1))
                fi
            fi
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
            if [[ ${unverified_failures} -eq 0 ]]; then
                echo "${package}@${tag} now serves ${version}."
                return 0
            fi
            echo "  the verified paths are current, but ${unverified_failures} purge request(s)"
            echo "  for paths this run does not verify were refused; retrying those."
        fi
        if [[ ${attempt} -lt ${PURGE_ATTEMPTS} ]]; then
            echo "  retrying in ${PURGE_RETRY_DELAY}s..."
            sleep "${PURGE_RETRY_DELAY}"
        fi
    done

    if [[ -n "${stale}" || -n "${unreachable}" ]]; then
        echo "Error: could not confirm ${package}@${tag} serves ${version}, after" >&2
        echo "       ${PURGE_ATTEMPTS} purge attempts." >&2
    else
        echo "Error: ${package}@${tag} serves ${version} on every verified path, but" >&2
        echo "       ${unverified_failures} purge request(s) for paths this run does not verify" >&2
        echo "       were refused on all ${PURGE_ATTEMPTS} attempts. Those URLs — the ones too" >&2
        echo "       large to fetch twice per attempt — can still be served from the" >&2
        echo "       previous release, which on a floating tag pairs a fresh bundle" >&2
        echo "       with a stale runtime." >&2
    fi
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
