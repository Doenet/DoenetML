/**
 * Tests for the repo-root `scripts/transform-package-json.ts`, which turns a
 * workspace `package.json` into the manifest that ships inside a published
 * `dist/`.
 *
 * The file under test lives at the repo root because five packages' vite
 * configs import it, and the repo root is not itself a workspace, so it has no
 * `npm test` of its own. This package's vitest is the one that already owns
 * build-tooling tests (`check-bundle-size.test.mjs`), and it consumes the
 * transformer too, so the tests ride along here.
 *
 * What it does that matters: it promotes every externalized dependency to a
 * `peerDependencies` entry, copying the range the source manifest declares —
 * the bundle keeps a bare `import ... from "<dep>"`, so the consumer's
 * installer has to satisfy it — and strips the workspace-only fields. Which
 * *field* a range is read from decides what ships, so that precedence is
 * pinned below.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { createPackageJsonTransformer } from "../../../scripts/transform-package-json";

const REPO_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../..",
);

/**
 * A minimal source manifest. `name` must be a package the transformer can
 * resolve, because it locates the package root to rewrite relative paths;
 * `@doenet/standalone` is this package itself.
 *
 * `fields` may name any of `dependencies` / `peerDependencies` /
 * `devDependencies`, because which field a range is declared in decides which
 * one the transformer reads.
 */
function sourceManifest(fields) {
    return JSON.stringify({
        name: "@doenet/standalone",
        version: "1.2.3",
        private: true,
        files: ["/dist"],
        exports: { ".": { import: "./dist/index.js" } },
        scripts: { build: "vite build" },
        wireit: {},
        ...fields,
    });
}

/**
 * Run the transformer as `viteStaticCopy` would and parse the result.
 * `fields` is the dependency-declaring part of the source manifest, so a test
 * can put a range in `devDependencies` instead of `dependencies`.
 */
function transformFields(fields, externalDeps) {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
        const output = createPackageJsonTransformer({ externalDeps })(
            sourceManifest(fields),
            path.join(REPO_ROOT, "packages/standalone/package.json"),
        );
        return {
            pkg: JSON.parse(output),
            warnings: warn.mock.calls.map((call) => call.join(" ")),
        };
    } finally {
        warn.mockRestore();
    }
}

/** The common case: everything declared as a plain `dependencies` entry. */
function transform(dependencies, externalDeps) {
    return transformFields({ dependencies }, externalDeps);
}

describe("createPackageJsonTransformer", () => {
    it("promotes an externalized dep to a peer dependency", () => {
        const { pkg, warnings } = transform(
            { react: "^19.2.3", "@doenet/utils": "file:../utils" },
            ["react"],
        );

        expect(pkg.peerDependencies).toEqual({ react: "^19.2.3" });
        // A dependency that is *bundled* rather than externalized never
        // reaches the tarball, whatever its range.
        expect(pkg.dependencies).toBeUndefined();
        expect(warnings).toEqual([]);
    });

    it("copies the declared range verbatim, whatever its shape", () => {
        // The transformer does not judge the range — that is the release
        // order's job, not the build's (see the plan document). What it must
        // do is emit the range the manifest actually declares, so that what
        // ships is what someone can read in `package.json`.
        for (const range of ["^3.0.0", "file:../math", "workspace:*"]) {
            const { pkg } = transform({ "math-expressions": range }, [
                "math-expressions",
            ]);
            expect(pkg.peerDependencies["math-expressions"]).toBe(range);
        }
    });

    it("does not let a devDependency shadow the range that ships", () => {
        // One range per externalized dep is read, and `devDependencies` is the
        // lowest-precedence source — the one field a consumer's installer
        // never sees. A `math-expressions` devDependency added for tests must
        // not become the published peer range.
        const { pkg } = transformFields(
            {
                dependencies: { "math-expressions": "file:../math" },
                devDependencies: { "math-expressions": "^3.0.0" },
            },
            ["math-expressions"],
        );

        expect(pkg.peerDependencies["math-expressions"]).toBe("file:../math");
    });

    it("falls back to devDependencies when nothing else declares the dep", () => {
        const { pkg } = transformFields(
            { devDependencies: { react: "^19.2.3" } },
            ["react"],
        );

        expect(pkg.peerDependencies).toEqual({ react: "^19.2.3" });
    });

    it("warns, and emits no entry, when an externalized dep declares no range", () => {
        const { pkg, warnings } = transform({ react: "^19.2.3" }, [
            "react",
            "some-forgotten-dep",
        ]);

        expect(pkg.peerDependencies).toEqual({ react: "^19.2.3" });
        expect(warnings.join("\n")).toMatch(/some-forgotten-dep/);
    });

    it("does not carry the source manifest's private flag into the tarball", () => {
        // Every published package in this repo is `"private": true` at the
        // root so that a stray `npm publish` from the workspace does nothing.
        // The built manifest is the one that gets published, so the flag must
        // not survive the transform.
        const { pkg } = transform({ react: "^19.2.3" }, ["react"]);

        expect(pkg.private).toBeUndefined();
    });

    it("strips the workspace-only fields", () => {
        const { pkg } = transform({ react: "^19.2.3" }, ["react"]);

        expect(pkg.scripts).toBeUndefined();
        expect(pkg.wireit).toBeUndefined();
        // `dependencies` are bundled, so they must not reappear as an install
        // the consumer has to perform.
        expect(pkg.dependencies).toBeUndefined();
        expect(pkg.name).toBe("@doenet/standalone");
        expect(pkg.version).toBe("1.2.3");
    });
});

/**
 * The tests above pin the transformer; these pin the one configuration that
 * has to reach it. `math-expressions` must stay in `@doenet/doenetml`'s
 * externalized list and must carry a declared range, because that pair is what
 * puts it into the published manifest's `peerDependencies`. This config once
 * passed a *filtered* copy of the list with `math-expressions` removed, which
 * dropped the seam out of the published manifest entirely — the tarball kept
 * the bare import and told nobody about it.
 *
 * Read from source rather than from a build, so the assertion holds without
 * building `@doenet/doenetml` first.
 */
describe("packages/doenetml externalizes the math seam and declares it", () => {
    const configSource = readFileSync(
        path.join(REPO_ROOT, "packages/doenetml/vite.config.ts"),
        "utf8",
    );
    const manifest = JSON.parse(
        readFileSync(
            path.join(REPO_ROOT, "packages/doenetml/package.json"),
            "utf8",
        ),
    );

    /** The `EXTERNAL_DEPS = [...]` array literal, parsed. */
    const externalDeps = JSON.parse(
        configSource
            .match(/const EXTERNAL_DEPS = (\[[^\]]*\])/)[1]
            .replace(/,\s*\]$/, "]"),
    );

    it("externalizes math-expressions", () => {
        expect(externalDeps).toContain("math-expressions");
    });

    it("passes the unfiltered list to the package.json transformer", () => {
        expect(configSource).toMatch(
            /createPackageJsonTransformer\(\{\s*externalDeps: EXTERNAL_DEPS,?\s*\}\)/,
        );
    });

    it("declares a range for every externalized dep", () => {
        const declared = {
            ...manifest.devDependencies,
            ...manifest.peerDependencies,
            ...manifest.dependencies,
        };
        expect(externalDeps.filter((dep) => !declared[dep])).toEqual([]);
    });
});
