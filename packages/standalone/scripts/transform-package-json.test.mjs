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
 * The behaviour that matters most below is the publishability guard: a package
 * whose bundle imports something by name that an npm consumer cannot install
 * must not be publishable. `@doenet/doenetml` is in exactly that state while
 * `math-expressions` resolves through `"file:../math"`, and shipping it would
 * put an unresolvable import — or a silent fallback to the unrelated
 * `math-expressions@2.x` on npm — into every consumer's build.
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
    it("publishes a package whose externals all have registry ranges", () => {
        const { pkg, warnings } = transform(
            { react: "^19.2.3", "@doenet/utils": "file:../utils" },
            ["react"],
        );

        expect(pkg.private).toBe(false);
        expect(pkg.peerDependencies).toEqual({ react: "^19.2.3" });
        // A `file:` dependency that is *bundled* rather than externalized is
        // fine — it never reaches the tarball.
        expect(pkg.dependencies).toBeUndefined();
        expect(warnings).toEqual([]);
    });

    it("refuses to publish when an externalized dep has a local range", () => {
        const { pkg, warnings } = transform(
            { react: "^19.2.3", "math-expressions": "file:../math" },
            ["react", "math-expressions"],
        );

        expect(pkg.private).toBe(true);
        // The range is still reported, so the built manifest says what is
        // wrong rather than hiding the dependency.
        expect(pkg.peerDependencies).toEqual({
            react: "^19.2.3",
            "math-expressions": "file:../math",
        });
        expect(warnings.join("\n")).toMatch(/math-expressions/);
        expect(warnings.join("\n")).toMatch(/not publishable/);
    });

    it("refuses to publish when an externalized dep has no version at all", () => {
        const { pkg, warnings } = transform({ react: "^19.2.3" }, [
            "react",
            "some-forgotten-dep",
        ]);

        expect(pkg.private).toBe(true);
        expect(pkg.peerDependencies).toEqual({ react: "^19.2.3" });
        expect(warnings.join("\n")).toMatch(/some-forgotten-dep/);
    });

    it("does not let a devDependency shadow the range that ships", () => {
        // The guard reads one range per externalized dep, so the field it reads
        // it from decides whether the guard fires at all. `devDependencies` is
        // the lowest-precedence source: a `math-expressions` devDependency
        // added for tests must not clear a block that `dependencies` still
        // earns.
        const { pkg, warnings } = transformFields(
            {
                dependencies: { "math-expressions": "file:../math" },
                devDependencies: { "math-expressions": "^3.0.0" },
            },
            ["math-expressions"],
        );

        expect(pkg.private).toBe(true);
        expect(pkg.peerDependencies["math-expressions"]).toBe("file:../math");
        expect(warnings.join("\n")).toMatch(/math-expressions/);
    });

    it("falls back to devDependencies when nothing else declares the dep", () => {
        const { pkg } = transformFields(
            { devDependencies: { react: "^19.2.3" } },
            ["react"],
        );

        expect(pkg.private).toBe(false);
        expect(pkg.peerDependencies).toEqual({ react: "^19.2.3" });
    });

    it.each(["link:../math", "portal:../math", "workspace:*", "catalog:"])(
        "treats %s as unpublishable too",
        (range) => {
            const { pkg } = transform({ "math-expressions": range }, [
                "math-expressions",
            ]);
            expect(pkg.private).toBe(true);
        },
    );

    it("becomes publishable again once the dep names a registry range", () => {
        const { pkg, warnings } = transform(
            { react: "^19.2.3", "math-expressions": "^3.0.0" },
            ["react", "math-expressions"],
        );

        expect(pkg.private).toBe(false);
        expect(pkg.peerDependencies["math-expressions"]).toBe("^3.0.0");
        expect(warnings).toEqual([]);
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
 * has to reach it. The guard is only load-bearing if `@doenet/doenetml` hands
 * it the *whole* externalized list: this config used to pass a filtered copy
 * with `math-expressions` removed, precisely because a `file:` range looked
 * wrong in a published manifest, and with that filter in place the transformer
 * sees nothing to complain about and the built package publishes.
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
