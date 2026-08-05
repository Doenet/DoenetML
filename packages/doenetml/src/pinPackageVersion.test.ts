import { describe, expect, it } from "vitest";

import { pinPackageVersion } from "./global-config";

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

    it("rewrites a partial version, which is a range the CDN resolves", () => {
        expect(
            pin(
                "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7/doenet-standalone.js",
            ),
        ).toBe(
            "https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.23/doenet-standalone.js",
        );
    });

    it("supplies a version where the URL names none", () => {
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
