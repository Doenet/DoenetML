/**
 * Guards the wireit wiring of the generator scripts in this package.
 *
 * `build:schema`, `build:assets` and `check:docs-coverage` all run scripts that
 * import `createComponentInfoObjects` from `doenetml-worker-javascript/src`
 * (see `scripts/get-schema.ts` and `scripts/check-docs-coverage.ts`). That
 * source resolves `@doenet/utils`, `@doenet/i18n` and `@doenet/parser` to their
 * *built* `dist/` — each exports `"." → "./dist/index.js"` and there is no
 * source alias anywhere in the repo — so running a generator against an
 * unbuilt or stale sibling quietly generates from old code instead of failing.
 * That is how regenerating the schema on top of a new locale catalog could
 * *delete* the entry the branch had just added.
 *
 * Each generator script therefore declares the same wireit `dependencies` as
 * `@doenet/doenetml-worker-javascript`'s own `build`. Depending on
 * `../doenetml-worker-javascript:build` instead would track those transitively
 * and could never drift, and it is not expensive — measured at ~10s of vite on
 * top of a `build:schema` that takes ~20s from a completely cold cache. We
 * mirror anyway because these scripts consume the worker's *source*: its 7 MB
 * bundle is never loaded, so that 10s is pure waste on every schema
 * regeneration, which is the inner loop when adding or documenting a component.
 * The price of mirroring is that the list can drift when the worker gains a
 * dependency, and this test is what makes that drift fail loudly rather than
 * silently. Revisit the trade if the mirroring ever costs more than it saves.
 *
 * The mirror is deliberately verbatim, not minimal. `../utils:build` already
 * pulls in `../parser:build` and `../i18n:build` transitively, so two of the
 * three entries are redundant today — but "the same list the worker declares"
 * is a rule this test can check, and "the minimal list that happens to work"
 * is not. Don't prune it.
 *
 * Three further requirements this test pins down:
 *
 * - The generators declare **no `files`/`output`**, which is what makes wireit
 *   always re-run them rather than serve them from its cache ("If a script
 *   doesn't have a `files` or `output` list defined at all, then it will
 *   _always_ run" — wireit README, *Incremental build*). The CI
 *   `schema-freshness` job depends on that: comparing the committed schema
 *   against a cached no-op would check nothing.
 * - Every declared dependency names a script that actually exists. Wireit
 *   fails loudly on a dangling dependency, but only when the script is run,
 *   and CI never runs `build:assets` — so a typo there would sit unnoticed
 *   until a human ran it.
 * - `@doenet/static-assets`' own `build` is *not* listed, yet the generators do
 *   need `dist/atom-database.js` (worker `utils/chemistry.ts` imports
 *   `@doenet/static-assets/atom-database` at runtime). It arrives transitively:
 *   `../utils:build` → `../parser:build` → `../static-assets:build`. Listing it
 *   here would be circular in spirit — `build` consumes `src/generated/*.json`,
 *   which is exactly what `build:schema` writes. If that chain ever breaks the
 *   failure is loud (vite's `Failed to resolve entry for package "@doenet/…"`),
 *   not a silent stale read, and CI runs these scripts without pre-building the
 *   workspace so it sees it too.
 *
 * Not covered: this package's `test` script, which reaches the same worker
 * source through `scripts/get-schema.ts`, and every other plain `test`/Cypress
 * script in the repo that imports a `@doenet/*` package. Converting those is a
 * separate change, and the blocker is not the one you might expect:
 *
 * - Argument forwarding is fine. `npm run test -- --run <file>` reaches the
 *   underlying command (wireit README, *Extra arguments*), so the targeted-run
 *   workflow survives. On Node 24 it does make wireit emit a `DEP0190`
 *   deprecation warning, because wireit spawns with `shell: true` *and* args.
 * - CI cost is ~nil. Both test jobs already build against the downloaded
 *   `.wireit` cache before testing — `test-main` runs `build:all-no-docs`, and
 *   `test-worker-js` runs `build -w packages/doenetml-worker`, which reaches
 *   `../doenetml-worker-javascript:build` and so the same three packages — so
 *   the dependencies would be fresh by the time a wireit `test` looked.
 * - The real blocker is the terminal. Wireit spawns the command with piped
 *   stdio (`script-child-process.ts` passes no `stdio` option), so the child
 *   sees no TTY and no stdin. These scripts are a bare `vitest`, i.e. watch
 *   mode, whose interactive keypress UI would stop working — for the one
 *   command developers spend all day in. Fixing that likely means splitting
 *   watch and single-run entry points, which is why it is its own change.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGES_DIR = path.resolve(__dirname, "../..");

/** Scripts in this package that run a generator over worker source. */
const GENERATOR_SCRIPTS = [
    "build:assets",
    "build:schema",
    "check:docs-coverage",
] as const;

/** A wireit dependency entry: `"../i18n:build"` or `{ script: "…" }`. */
type WireitDependency = string | { script: string; cascade?: boolean };

type PackageJson = {
    scripts?: Record<string, string>;
    wireit?: Record<
        string,
        {
            command?: string;
            dependencies?: WireitDependency[];
            files?: string[];
            output?: string[];
        }
    >;
};

function readPackageJson(packageDir: string): PackageJson {
    return JSON.parse(
        fs.readFileSync(path.join(packageDir, "package.json"), "utf-8"),
    ) as PackageJson;
}

/**
 * Script names the package in `packageDir` declares — empty when there is no
 * package there at all, so a dependency naming a nonexistent package fails as
 * a missing script rather than as an unhandled `ENOENT`.
 */
function scriptNamesIn(packageDir: string): string[] {
    if (!fs.existsSync(path.join(packageDir, "package.json"))) {
        return [];
    }
    return Object.keys(readPackageJson(packageDir).scripts ?? {});
}

const STATIC_ASSETS_DIR = path.join(PACKAGES_DIR, "static-assets");
const WORKER_DIR = path.join(PACKAGES_DIR, "doenetml-worker-javascript");

const staticAssetsPkg = readPackageJson(STATIC_ASSETS_DIR);
const workerPkg = readPackageJson(WORKER_DIR);

/**
 * Rewrite a wireit dependency into a form that can be compared across
 * packages.
 *
 * Dependency names are resolved relative to the package that declares them:
 * `"../i18n:build"` in `packages/utils` and `"../i18n:build"` in
 * `packages/static-assets` happen to agree, but `"build:wasm"` (a
 * same-package dependency, a form several packages here use) means a different
 * script depending on who wrote it. Resolving to `<package-name>:<script>`
 * makes the comparison mean what it says, and makes a failure message name the
 * script a reader has to go add.
 *
 * The two cases are split exactly as wireit splits them (`analyzer.ts`): a name
 * starting with `"."` is cross-package and divides at its *first* colon;
 * anything else is a script in the declaring package, colons and all.
 */
function canonicalizeDependency(
    dependency: WireitDependency,
    declaringPackageDir: string,
): string {
    const name =
        typeof dependency === "string" ? dependency : dependency.script;
    const separator = name.startsWith(".") ? name.indexOf(":") : -1;
    const relativeDir = separator === -1 ? "." : name.slice(0, separator);
    const script = separator === -1 ? name : name.slice(separator + 1);
    const packageDir = path.resolve(declaringPackageDir, relativeDir);
    return `${path.relative(PACKAGES_DIR, packageDir)}:${script}`;
}

function canonicalDependenciesOf(
    pkg: PackageJson,
    packageDir: string,
    script: string,
): string[] {
    return (pkg.wireit?.[script]?.dependencies ?? []).map((dependency) =>
        canonicalizeDependency(dependency, packageDir),
    );
}

const workerBuildDependencies = canonicalDependenciesOf(
    workerPkg,
    WORKER_DIR,
    "build",
);

describe("generator script wireit wiring", () => {
    it("has dependencies to mirror", () => {
        // If the worker's build ever stops declaring dependencies, the
        // superset assertions below would pass vacuously.
        expect(workerBuildDependencies.length).toBeGreaterThan(0);
    });

    for (const script of GENERATOR_SCRIPTS) {
        describe(script, () => {
            const dependencies = canonicalDependenciesOf(
                staticAssetsPkg,
                STATIC_ASSETS_DIR,
                script,
            );

            it("is a wireit script", () => {
                expect(staticAssetsPkg.scripts?.[script]).toBe("wireit");
                expect(staticAssetsPkg.wireit?.[script]?.command).toBeTruthy();
            });

            it("declares every build @doenet/doenetml-worker-javascript needs", () => {
                expect(dependencies).toEqual(
                    expect.arrayContaining(workerBuildDependencies),
                );
            });

            it("declares only dependencies that exist", () => {
                // A superset assertion alone would accept a typo'd or dangling
                // entry. Wireit rejects those, but only when the script runs.
                for (const dependency of dependencies) {
                    // Canonical form is `<package-dir>:<script>`; directory
                    // names hold no colon, so the first one divides them.
                    const separator = dependency.indexOf(":");
                    expect(
                        scriptNamesIn(
                            path.join(
                                PACKAGES_DIR,
                                dependency.slice(0, separator),
                            ),
                        ),
                        `${dependency} names a script that does not exist`,
                    ).toContain(dependency.slice(separator + 1));
                }
            });

            it("declares no files/output so wireit always re-runs it", () => {
                const config = staticAssetsPkg.wireit?.[script];
                expect(config?.files).toBeUndefined();
                expect(config?.output).toBeUndefined();
            });
        });
    }
});
