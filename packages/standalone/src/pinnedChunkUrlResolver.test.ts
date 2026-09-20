import { describe, expect, it } from "vitest";

import { pinPackageVersion } from "./pinPackageVersion";
import { makePinnedChunkUrlResolver } from "./pinnedChunkUrlResolver";

const PKG = "@doenet/standalone";
const V = "0.7.24";

/** A resolver as a chunk would build one: the real pin, a given self URL. */
function resolver(selfUrl: string) {
    return makePinnedChunkUrlResolver(pinPackageVersion, selfUrl, PKG, V);
}

describe("makePinnedChunkUrlResolver", () => {
    it("pins a chunk reference under a floating jsDelivr tag", () => {
        // The eager chunk, cached from this release but requested through
        // `@latest`, resolves its lazy siblings at its own exact release.
        const resolve = resolver(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/chunks/index-DyVlWbQe.js`,
        );
        expect(resolve("./EditorViewer-Ck2f9ZbP.js")).toBe(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@${V}/chunks/EditorViewer-Ck2f9ZbP.js`,
        );
    });

    it("pins the facade's chunks/ reference the same way", () => {
        // The facade sits at the bundle root; its one reference goes down
        // into chunks/. Same resolver, different join.
        const resolve = resolver(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/doenet-standalone.js`,
        );
        expect(resolve("./chunks/index-DyVlWbQe.js")).toBe(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@${V}/chunks/index-DyVlWbQe.js`,
        );
    });

    it("supplies the version on jsDelivr's bare package path", () => {
        const resolve = resolver(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone/doenet-standalone.js`,
        );
        expect(resolve("./chunks/index-DyVlWbQe.js")).toBe(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@${V}/chunks/index-DyVlWbQe.js`,
        );
    });

    it("pins under unpkg's prefix-less layout", () => {
        const resolve = resolver(
            `https://unpkg.com/@doenet/standalone@latest/doenet-standalone.js`,
        );
        expect(resolve("./chunks/index-DyVlWbQe.js")).toBe(
            `https://unpkg.com/@doenet/standalone@${V}/chunks/index-DyVlWbQe.js`,
        );
    });

    it("resolves an exact-version URL exactly as relative resolution would", () => {
        const selfUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${V}/doenet-standalone.js`;
        expect(resolver(selfUrl)("./chunks/index-DyVlWbQe.js")).toBe(
            new URL("./chunks/index-DyVlWbQe.js", selfUrl).href,
        );
    });

    it("resolves self-hosted and localhost URLs exactly as relative resolution would", () => {
        for (const selfUrl of [
            "https://mycourse.example.edu/doenet/doenet-standalone.js",
            "http://localhost:5173/standalone/doenet-standalone.js",
            "https://deploy-preview-42.example.app/assets/chunks/index-abc.js",
            // A self-hosted node_modules tree: the package name appears in
            // the path with no version, which is not a CDN layout.
            "https://host.example/node_modules/@doenet/standalone/doenet-standalone.js",
        ]) {
            expect(resolver(selfUrl)("./chunks/index-DyVlWbQe.js")).toBe(
                new URL("./chunks/index-DyVlWbQe.js", selfUrl).href,
            );
        }
    });

    it("hands the relative path back unchanged from a blob: base, without throwing", () => {
        // Nothing resolves against an opaque base; the ensuing import() then
        // fails the same way it would have without the resolver.
        const resolve = resolver(
            "blob:https://host.example/6ee7f6a2-8e9f-4c1f-9c1a-2f8b0f6f2b52",
        );
        expect(resolve("./chunks/index-DyVlWbQe.js")).toBe(
            "./chunks/index-DyVlWbQe.js",
        );
    });

    it("does not throw on an unparseable self URL", () => {
        expect(resolver("not a url at all")("./chunks/a.js")).toBe(
            "./chunks/a.js",
        );
    });
});

describe("stringified runtime (how the build injects these functions)", () => {
    // The build injects both functions into emitted chunks via
    // `Function.prototype.toString`, so they must be self-contained: no
    // imports, no references to module-scope bindings, no transpilation
    // helpers (`__name` and friends would be dangling references in a chunk).
    // Round-trip each through its own source text and check behavior, which
    // fails loudly if a free identifier ever creeps in.
    it("pinPackageVersion round-trips through its own source", () => {
        const pin = (0, eval)(
            `(${pinPackageVersion.toString()})`,
        ) as typeof pinPackageVersion;
        expect(
            pin(
                `https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/doenet-standalone.js`,
                PKG,
                V,
            ),
        ).toBe(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@${V}/doenet-standalone.js`,
        );
    });

    it("makePinnedChunkUrlResolver round-trips through its own source", () => {
        const make = (0, eval)(
            `(${makePinnedChunkUrlResolver.toString()})`,
        ) as typeof makePinnedChunkUrlResolver;
        const resolve = make(
            pinPackageVersion,
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@latest/chunks/index-abc.js`,
            PKG,
            V,
        );
        expect(resolve("./Foo-xyz.js")).toBe(
            `https://cdn.jsdelivr.net/npm/@doenet/standalone@${V}/chunks/Foo-xyz.js`,
        );
    });
});
