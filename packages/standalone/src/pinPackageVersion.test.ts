import { describe, expect, it } from "vitest";

import { pinPackageVersion } from "./pinPackageVersion";

const PKG = "@doenet/standalone";
const V = "0.7.23";

function pin(url: string) {
    return pinPackageVersion(url, PKG, V);
}

describe("pinPackageVersion", () => {
    it("rewrites a floating tag to the exact version", () => {
        expect(
            pin(
                "https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/doenet-standalone.js",
            ),
        ).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/doenet-standalone.js",
        );
    });

    it("puts the assets resolved beside the bundle at that version too", () => {
        // The point of the rewrite: the three siblings this bundle resolves
        // against its own URL — the core worker, the message catalogs, and the
        // base it hands the coordinator for the shared core worker — all land
        // on immutable, same-release URLs.
        const pinned = pin(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/doenet-standalone.js",
        );
        expect(new URL("./doenetml-worker/index.js", pinned).href).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/doenetml-worker/index.js",
        );
        expect(new URL("./locales/", pinned).href).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/locales/",
        );
    });

    it("rewrites a partial version, which is a range the CDN resolves", () => {
        expect(
            pin(
                "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7/doenet-standalone.js",
            ),
        ).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/doenet-standalone.js",
        );
    });

    it("normalizes the `v`-prefixed specifier the iframe wrapper builds", () => {
        // `@doenet/doenetml-iframe` prefixes an autodetected version with "v"
        // (`detectVersionFromDoenetML` -> `"v" + version`). jsDelivr resolves
        // that to the same immutable release as the bare version, so there is
        // no skew to correct here — but it is a *different* URL, and folding
        // the two together is what lets a page mixing autodetected and
        // default-version viewers of one release fetch the ~15 MB worker once
        // rather than twice.
        expect(
            pin(
                "https://cdn.jsdelivr.net/npm/@doenet/standalone@v0.7.23/doenet-standalone.js",
            ),
        ).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/doenet-standalone.js",
        );
    });

    it("supplies a version under jsDelivr's /npm/ prefix, which names none", () => {
        // jsDelivr reads a bare package name as its latest release — floating,
        // so it has to be pinned like any other tag.
        expect(
            pin(
                "https://cdn.jsdelivr.net/npm/@doenet/standalone/doenet-standalone.js",
            ),
        ).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/doenet-standalone.js",
        );
    });

    it("leaves an already-exact version alone", () => {
        const url =
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/doenet-standalone.js";
        expect(pin(url)).toBe(url);
    });

    it("pins a prerelease the same way", () => {
        expect(
            pinPackageVersion(
                "https://cdn.jsdelivr.net/npm/@doenet/standalone@dev/doenet-standalone.js",
                PKG,
                "0.7.24-dev.446",
            ),
        ).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.24-dev.446/doenet-standalone.js",
        );
    });

    it("handles unpkg's layout, which has no /npm/ prefix", () => {
        expect(
            pin(
                "https://unpkg.com/@doenet/standalone@latest/doenet-standalone.js",
            ),
        ).toBe(
            "https://unpkg.com/@doenet/standalone@0.7.23/doenet-standalone.js",
        );
    });

    it("leaves a self-hosted copy alone", () => {
        // Nothing here says which release this is, and guessing would point a
        // host's own deployment at a CDN path that may not exist.
        const url = "https://example.org/assets/doenet-standalone.js";
        expect(pin(url)).toBe(url);
    });

    it("leaves a self-hosted copy that happens to name the package alone", () => {
        // These paths contain the package name, but as a plain directory rather
        // than a CDN's version segment. Rewriting one would send every sibling
        // — the core worker above all — to a URL that does not exist, breaking
        // a working deploy in exactly the way this function exists to prevent.
        for (const url of [
            // Serving `node_modules` straight through.
            "https://example.org/node_modules/@doenet/standalone/doenet-standalone.js",
            // The same tree mapped onto the web root, which is unpkg's shape
            // exactly but for the missing version — so a versionless package
            // name at the root is never read as a CDN's. (unpkg redirects such
            // a URL to its exact version, so a bundle actually loaded from
            // unpkg has an exact `import.meta.url` before this ever runs.)
            "https://example.org/@doenet/standalone/doenet-standalone.js",
            // A vendored copy mirroring the CDN layout under a prefix of the
            // host's own. The `@0.7.20` is deliberately not this bundle's
            // version: only the path root (and jsDelivr's `/npm/`) is read as
            // a version specifier, so the segment survives as the host wrote
            // it rather than being rewritten to the bundle's release.
            "https://example.org/vendor/@doenet/standalone@0.7.20/doenet-standalone.js",
        ]) {
            expect(pin(url)).toBe(url);
        }
    });

    it("does not match a package whose name merely starts the same", () => {
        const url =
            "https://cdn.jsdelivr.net/npm/@doenet/standalone-extras@latest/index.js";
        expect(pin(url)).toBe(url);
    });

    it("rewrites only the segment that names the package", () => {
        // The name appearing again further down the path — as a directory, or
        // in a query — is not a version specifier and must survive.
        expect(
            pin(
                "https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/vendor/@doenet/standalone@latest/x.js",
            ),
        ).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/vendor/@doenet/standalone@latest/x.js",
        );
    });

    it("passes opaque and unparseable bases through", () => {
        // The Cypress component tests and the iframe dev harness boot the
        // bundle from a Blob URL; nothing is beside it and nothing names a
        // version.
        for (const url of [
            "blob:https://example.org/2f8a-4c1e",
            "data:text/javascript,export%20default%201",
            "not a url",
            "",
        ]) {
            expect(pin(url)).toBe(url);
        }
    });

    it("leaves the URL alone when no version is compiled in", () => {
        const url =
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/doenet-standalone.js";
        expect(pinPackageVersion(url, PKG, "")).toBe(url);
    });
});
