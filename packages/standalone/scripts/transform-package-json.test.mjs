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
import { describe, expect, it, vi } from "vitest";
import { createPackageJsonTransformer } from "../../../scripts/transform-package-json";

/**
 * A minimal source manifest. `name` must be a package the transformer can
 * resolve, because it locates the package root to rewrite relative paths;
 * `@doenet/standalone` is this package itself.
 */
function sourceManifest(dependencies) {
    return JSON.stringify({
        name: "@doenet/standalone",
        version: "1.2.3",
        private: true,
        files: ["/dist"],
        exports: { ".": { import: "./dist/index.js" } },
        scripts: { build: "vite build" },
        wireit: {},
        dependencies,
    });
}

/** Run the transformer as `viteStaticCopy` would and parse the result. */
function transform(dependencies, externalDeps) {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
        const output = createPackageJsonTransformer({ externalDeps })(
            sourceManifest(dependencies),
            "/home/nykamp/src/DoenetML3/packages/standalone/package.json",
        );
        return {
            pkg: JSON.parse(output),
            warnings: warn.mock.calls.map((call) => call.join(" ")),
        };
    } finally {
        warn.mockRestore();
    }
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

    it.each(["link:../math", "portal:../math", "workspace:*"])(
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
