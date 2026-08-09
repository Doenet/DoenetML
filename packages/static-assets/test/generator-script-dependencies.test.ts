/**
 * Guards the wireit wiring of the generator scripts in this package.
 *
 * `build:schema`, `build:assets` and `check:docs-coverage` all run scripts that
 * import `createComponentInfoObjects` from `doenetml-worker-javascript/src`
 * (see `scripts/get-schema.ts` and `scripts/check-docs-coverage.ts`). That
 * source resolves `@doenet/utils`, `@doenet/i18n` and `@doenet/parser` to their
 * *built* `dist/` — each exports `"." → "./dist/index.js"`, and nothing in the
 * config these generators run under aliases those specifiers to source — so
 * running a generator against an unbuilt or stale sibling quietly generates from
 * old code instead of failing. That is how regenerating the schema on top of a
 * new locale catalog could *delete* the entry the branch had just added.
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
 * Not covered: this package's own `test` script, which reaches the same worker
 * source through `scripts/get-schema.ts`, or any other plain `test`/Cypress
 * script in the repo that imports a `@doenet/*` package — all of them read the
 * same possibly-stale `dist/`. Converting them is its own change (the blocker
 * is watch mode: wireit spawns with piped stdio, so a wrapped bare `vitest`
 * loses its interactive keypress UI); tracked in Doenet/DoenetML#1675.
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

/** The npm script a wireit dependency names, with its package resolved. */
type ScriptRef = { packageDir: string; script: string };

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
 * Resolve a wireit dependency to the script it names, so that lists declared by
 * two different packages can be compared.
 *
 * A dependency is interpreted relative to whoever declares it: `"../i18n:build"`
 * in `packages/utils` and in `packages/static-assets` agree only by coincidence,
 * and a bare `"build:rust"` — a same-package dependency, a form several packages
 * here use — names a different script depending on who wrote it.
 *
 * The split follows wireit's documented dependency syntax, not an internal of
 * its implementation: "Dependencies can refer to scripts in other npm packages
 * by using a relative path with the syntax `<relative-path>:<script-name>`. All
 * cross-package dependencies should start with a `"."`" (`wireit/schema.json`).
 * So a name starting with `"."` divides at its *first* colon; anything else is a
 * script in the declaring package, colons and all. A cross-package name with no
 * colon at all is a config error wireit rejects outright — here it falls through
 * as an oddly-named same-package script and trips the existence check below.
 */
function resolveDependency(
    dependency: WireitDependency,
    declaringPackageDir: string,
): ScriptRef {
    const name =
        typeof dependency === "string" ? dependency : dependency.script;
    const separator = name.startsWith(".") ? name.indexOf(":") : -1;
    const relativeDir = separator === -1 ? "." : name.slice(0, separator);
    const script = separator === -1 ? name : name.slice(separator + 1);
    return {
        packageDir: path.resolve(declaringPackageDir, relativeDir),
        script,
    };
}

/** `<package-dir>:<script>` — comparable, and readable in a failure message. */
function refKey({ packageDir, script }: ScriptRef): string {
    return `${path.relative(PACKAGES_DIR, packageDir)}:${script}`;
}

function dependenciesOf(
    pkg: PackageJson,
    packageDir: string,
    script: string,
): ScriptRef[] {
    return (pkg.wireit?.[script]?.dependencies ?? []).map((dependency) =>
        resolveDependency(dependency, packageDir),
    );
}

const workerBuildDependencies = dependenciesOf(
    workerPkg,
    WORKER_DIR,
    "build",
).map(refKey);

describe("generator script wireit wiring", () => {
    it("has dependencies to mirror", () => {
        // If the worker's build ever stops declaring dependencies, the
        // superset assertions below would pass vacuously.
        expect(workerBuildDependencies.length).toBeGreaterThan(0);
    });

    for (const script of GENERATOR_SCRIPTS) {
        describe(script, () => {
            const dependencies = dependenciesOf(
                staticAssetsPkg,
                STATIC_ASSETS_DIR,
                script,
            );

            it("is a wireit script", () => {
                expect(staticAssetsPkg.scripts?.[script]).toBe("wireit");
                expect(staticAssetsPkg.wireit?.[script]?.command).toBeTruthy();
            });

            it("declares every build @doenet/doenetml-worker-javascript needs", () => {
                expect(dependencies.map(refKey)).toEqual(
                    expect.arrayContaining(workerBuildDependencies),
                );
            });

            it("declares only dependencies that exist", () => {
                // A superset assertion alone would accept a typo'd or dangling
                // entry. Wireit rejects those, but only when the script runs.
                for (const dependency of dependencies) {
                    expect(
                        scriptNamesIn(dependency.packageDir),
                        `${refKey(dependency)} names a script that does not exist`,
                    ).toContain(dependency.script);
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
