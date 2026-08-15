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

    it.each([
        "link:../math",
        "portal:../math",
        "workspace:*",
        "catalog:",
        "git+file:../math",
        // npm takes a bare path wherever it takes `file:` — this installs the
        // sibling directory just as `file:../math` does, and a protocol-only
        // guard did not see it.
        "../math",
        "./math",
        "/srv/math",
        // …and a path is not only a slash-or-dot one. Each of these is a
        // `directory` or a local `file` to `npm-package-arg`, so each installs
        // from this machine. `~/…` in particular is the natural way to point at
        // a checkout while debugging, and the spelling closest to one that is
        // *not* local (`~3.0.0`, asserted publishable below).
        "~/src/math-expressions",
        "C:/math",
        "math.tgz",
        // A *bare* path — no leading dot, no `~/`, no drive letter, no `.tgz`.
        // npm reaches these on the branch after `isFileSpec` and
        // `hosted-git-info` have both declined: any protocol-less spec with a
        // separator is a path. Verified against npm 11.12.1, which installs
        // `sub/dir/pkg` as a symlink to that directory. This is the spelling
        // the monorepo would actually write, since every real path in it starts
        // `vendor/` or `packages/`.
        "vendor/math-expressions/packages/math-expressions-js-compat",
        "some/dir/math",
        // One slash, but not a `user/repo` shape: a trailing slash, and a
        // scoped-package-shaped spec, are both directories to npm.
        "math/",
        "@scope/pkg",
        // Whitespace is not an escape, in either direction, and the two
        // directions fail for opposite reasons. A *leading* space would slip
        // past every anchored prefix test, so those run against the trimmed
        // range. A *trailing* one is the subtler case: trimming before the
        // GitHub-shorthand test turned `"vendor/math "` back into a clean
        // `user/repo` shape and called it publishable — but npm does not trim,
        // `hosted-git-info` refuses a spec containing whitespace, and npm
        // 11.12.1 installs `node_modules/math-expressions` as a *dangling*
        // symlink to `vendor/math ` and exits 0.
        " ../math",
        " file:../math",
        " C:/math",
        "vendor/math-expressions ",
        " vendor/math-expressions",
        " vendor/math-expressions ",
        "user/repo ",
        " user/repo",
        "a/b\t",
        // Deliberately stricter than `npm-package-arg`, which reads this as the
        // GitHub shorthand for a repository named `math.tar.gz`. Anyone who
        // writes a `.tar.gz` range means a tarball on this machine.
        "vendor/math.tar.gz",
    ])("treats %s as unpublishable too", (range) => {
        const { pkg } = transform({ "math-expressions": range }, [
            "math-expressions",
        ]);
        expect(pkg.private).toBe(true);
    });

    it.each([
        "^3.0.0",
        "~3.0.0",
        "3.x",
        "*",
        "latest",
        "npm:@scope/math@^3",
        // A tarball a consumer's installer really can fetch. The local-tarball
        // test above must not swallow this one.
        "https://example.com/math-3.0.0.tgz",
        // The one protocol-less spec with a slash that is *not* a path: npm
        // clones it from GitHub, so the bare-path test above must not swallow
        // it either. `#committish` and `#semver:` forms included, since those
        // add the characters that make it look least like a shorthand.
        "user/repo",
        "user/repo#main",
        "user/repo#semver:^3",
        "github:user/repo",
        // The acknowledged limit of the bare-path test, and it matches npm:
        // a *one-slash* path is indistinguishable from that shorthand, so npm
        // clones `github.com/packages/math` rather than installing a directory.
        // It is not a realistic escape — npm resolves a local path relative to
        // the *manifest*, so a path this repo would write from
        // `packages/doenetml/` starts `../`, which is caught above.
        "packages/math",
        // A range with a space in it, which must not be mistaken for a path.
        ">= 1.0.0 || ^2",
        // An scp-style git URL. It carries no `scheme:`, so the protocol test
        // does not see it, and it has a slash with an `@` and a `:` before it,
        // so the GitHub shorthand does not either — but `npa` calls it `git`
        // and any consumer can clone it.
        "git@github.com:user/repo.git",
        "git@gitlab.example.com:group/repo.git#v3",
    ])("still publishes with the registry range %s", (range) => {
        const { pkg } = transform({ "math-expressions": range }, [
            "math-expressions",
        ]);
        expect(pkg.private).toBe(false);
    });

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
