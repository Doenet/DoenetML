/**
 * Feature gates keyed on the standalone-bundle version a viewer selects.
 * The wrapper (this package) and the bundle inside the iframe ship
 * separately — a host may pin `doenetmlVersion` to an old bundle — so
 * wrapper features that need bundle cooperation must check the selected
 * version. (A host-specified `standaloneUrl` carries no version
 * information; callers treat it as modern — hosts shipping a custom URL
 * control both sides.)
 */

// In-place prop updates require a standalone bundle whose
// `renderDoenetViewerToContainer` re-renders against a cached React root
// (v0.7.18+, PR #1131). Calling it repeatedly against an older bundle mounts
// competing React roots on the same container.
const LIVE_UPDATE_MIN_VERSION = [0, 7, 18];

// First release whose standalone bundle acknowledges `SPLICE.flushState`
// (#1468) — required for lossless parking.
const PARK_MIN_VERSION = [0, 7, 21];

/**
 * Whether the standalone version string `version` selects a bundle at least
 * as new as `min`. Missing version parts are npm ranges that jsdelivr
 * resolves to the newest matching release (e.g. "0.7" serves the latest
 * 0.7.x), so they compare as the range's upper bound. Unparseable versions
 * are assumed modern.
 */
function versionAtLeast(version: string, min: number[]): boolean {
    const match = version
        .replace(/^v/, "")
        .match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    if (!match) {
        return true;
    }
    const parts = [match[1], match[2], match[3]].map((p) =>
        p === undefined ? Infinity : parseInt(p, 10),
    );
    for (let i = 0; i < 3; i++) {
        if (parts[i] > min[i]) {
            return true;
        }
        if (parts[i] < min[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Whether the standalone bundle selected by `version` supports live
 * (in-place) prop updates (v0.7.18+, PR #1131's cached React root).
 */
export function versionSupportsLiveUpdates(version: string): boolean {
    return versionAtLeast(version, LIVE_UPDATE_MIN_VERSION);
}

/**
 * Whether the bundle selected by `version` can acknowledge
 * `SPLICE.flushState` (v0.7.21+, #1468). Parking an older bundle would hit
 * the flush timeout and park anyway, losing up to a report-throttle
 * interval (60 s) of work — so such viewers are never parked (they still
 * lazy-mount and obey the boot cap under a windowed `mountPolicy`). Caveat:
 * a dev prerelease published before the feature's first release (e.g.
 * `0.7.20-dev.N` built from a main that already carries it) parses as its
 * `0.7.20` base and compares as too old — pin `standaloneUrl` in that case
 * (custom URLs are assumed modern).
 */
export function versionSupportsParking(version: string): boolean {
    return versionAtLeast(version, PARK_MIN_VERSION);
}
