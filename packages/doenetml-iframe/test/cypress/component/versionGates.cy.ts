import {
    versionSupportsLiveUpdates,
    versionSupportsParking,
} from "../../../src/version-gates";

// Version-string gates for wrapper features that need bundle cooperation.
// Missing parts are npm ranges jsdelivr resolves to the newest match, so
// they compare as the range's upper bound; unparseable strings are assumed
// modern.

describe("version gates", () => {
    it("gates live updates at 0.7.18", () => {
        expect(versionSupportsLiveUpdates("0.7.17")).to.eq(false);
        expect(versionSupportsLiveUpdates("0.7.18")).to.eq(true);
        expect(versionSupportsLiveUpdates("0.7.19")).to.eq(true);
        expect(versionSupportsLiveUpdates("0.6.99")).to.eq(false);
        expect(versionSupportsLiveUpdates("1.0.0")).to.eq(true);
    });

    it("gates parking at 0.7.21 (first SPLICE.flushState release)", () => {
        expect(versionSupportsParking("0.7.20")).to.eq(false);
        expect(versionSupportsParking("0.7.21")).to.eq(true);
        expect(versionSupportsParking("0.7.22")).to.eq(true);
        expect(versionSupportsParking("0.8.0")).to.eq(true);
        expect(versionSupportsParking("1.0.0")).to.eq(true);
        expect(versionSupportsParking("0.6")).to.eq(false);
    });

    it("treats missing parts as the range's upper bound", () => {
        // "0.7" pins ^0.7 on jsdelivr — resolves to the newest 0.7.x.
        expect(versionSupportsParking("0.7")).to.eq(true);
        expect(versionSupportsParking("0")).to.eq(true);
        expect(versionSupportsLiveUpdates("0.7")).to.eq(true);
    });

    it("handles v-prefixes, prereleases, and unparseable strings", () => {
        expect(versionSupportsParking("v0.7.21")).to.eq(true);
        expect(versionSupportsParking("v0.7.20")).to.eq(false);
        // A dev prerelease parses as its base triple: 0.7.20-dev.N compares
        // as 0.7.20 even when built from a main that carries the feature —
        // hosts on dev builds pin `standaloneUrl` instead (assumed modern).
        expect(versionSupportsParking("0.7.20-dev.328")).to.eq(false);
        expect(versionSupportsParking("0.7.21-dev.1")).to.eq(true);
        // Unparseable ⇒ assumed modern.
        expect(versionSupportsParking("latest")).to.eq(true);
    });
});
