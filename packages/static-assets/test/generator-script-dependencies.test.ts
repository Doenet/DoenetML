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
 * Each generator therefore declares one wireit dependency:
 * `../doenetml-worker-javascript:build:deps`, a no-command aggregator naming the
 * sibling builds the worker's source needs in order to be importable. The
 * worker's own `build` depends on it too, so the list has exactly one home and
 * cannot drift out of step with what the worker actually needs. Two alternatives
 * were weighed and rejected:
 *
 * - **Depending on `../doenetml-worker-javascript:build`.** Also drift-proof,
 *   but it adds a vite pass — measured at ~11s, on top of a `build:schema` that
 *   takes ~20s from a completely cold cache — to produce a 7 MB bundle these
 *   scripts never load, because they consume the worker's *source*. That is pure
 *   waste on every schema regeneration, which is the inner loop when adding or
 *   documenting a component, and it is at its most expensive exactly when the
 *   worker's source just changed.
 * - **Restating the three sibling builds here** (what earlier revisions of this
 *   PR did, once per generator). It needs no change to another package, but it
 *   puts the same list in four places and needs a test to compare them — the
 *   drift the aggregator makes impossible. A local aggregator in this package
 *   would cut that to two copies, which is still one too many.
 *
 * The aggregator only helps while it stays authoritative, so this test also
 * pins that down: the worker's `build` must name no sibling build directly, or a
 * dependency added there would reach the worker and not the generators. It does
 * not check that the names *inside* `build:deps` resolve: wireit rejects a
 * dangling dependency when the script runs, and `build:deps` is on the worker
 * `build`'s path, which CI runs in the `build` job. (A typo in a list only these
 * generators depended on would have been invisible, since CI never runs
 * `build:assets`.)
 *
 * Two further requirements:
 *
 * - The generators declare **no `files`/`output`**, which is what makes wireit
 *   always re-run them rather than serve them from its cache ("If a script
 *   doesn't have a `files` or `output` list defined at all, then it will
 *   _always_ run" — wireit README, *Incremental build*). The CI
 *   `schema-freshness` job depends on that: comparing the committed schema
 *   against a cached no-op would check nothing.
 * - `@doenet/static-assets`' own `build` is *not* a dependency, yet the
 *   generators do need `dist/atom-database.js` (worker `utils/chemistry.ts`
 *   imports `@doenet/static-assets/atom-database` at runtime). It arrives
 *   transitively: `build:deps` → `../utils:build` → `../parser:build` →
 *   `../static-assets:build`. Declaring it here would be circular in spirit —
 *   `build` consumes `src/generated/*.json`, which is exactly what `build:schema`
 *   writes. If that chain ever breaks the failure is loud (vite's `Failed to
 *   resolve entry for package "@doenet/…"`), not a silent stale read, and CI
 *   runs these scripts without pre-building the workspace so it sees it too.
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

/** The one dependency every generator in this package declares. */
const WORKER_BUILD_DEPS = "../doenetml-worker-javascript:build:deps";

/**
 * How a generator script is recognized: its command runs a file out of this
 * package's `scripts/` directory, whatever runner it uses (`vite-node
 * ./scripts/x.ts`, `tsx scripts/x.ts`, `node --import tsx ./scripts/x.ts`, or
 * any of those chained after another command). A path reaching outside the
 * package (`../../scripts/…`, the repo-wide helpers) is deliberately not a
 * match.
 *
 * Deriving the list rather than hard-coding it means a *newly added* generator
 * is covered on arrival — `build:assets` had this exact gap for as long as it
 * existed and was only noticed by hand, in review. An explicit list plus a test
 * that the list is complete would need this same pattern anyway, and one more
 * place to edit.
 *
 * A script that runs out of `scripts/` without importing worker source is a
 * false positive: it will be asked for a dependency it does not need. The
 * failure messages below say what to do about it.
 */
const GENERATOR_COMMAND = /(?:^|[\s'"])(?:\.\/)?scripts\//;

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

const staticAssetsPkg = readPackageJson(
    path.join(PACKAGES_DIR, "static-assets"),
);
const workerPkg = readPackageJson(
    path.join(PACKAGES_DIR, "doenetml-worker-javascript"),
);

/** The script a wireit dependency names, in either of the two allowed forms. */
function dependencyName(dependency: WireitDependency): string {
    return typeof dependency === "string" ? dependency : dependency.script;
}

function dependenciesOf(pkg: PackageJson, script: string): string[] {
    return (pkg.wireit?.[script]?.dependencies ?? []).map(dependencyName);
}

/** What an npm script runs, looking through the `wireit` indirection. */
function commandOf(pkg: PackageJson, script: string): string {
    const npmCommand = pkg.scripts?.[script] ?? "";
    return npmCommand === "wireit"
        ? (pkg.wireit?.[script]?.command ?? "")
        : npmCommand;
}

const GENERATOR_SCRIPTS = Object.keys(staticAssetsPkg.scripts ?? {}).filter(
    (script) => GENERATOR_COMMAND.test(commandOf(staticAssetsPkg, script)),
);

describe("the worker's build:deps aggregator", () => {
    it("names the sibling builds the worker's source needs", () => {
        // Also keeps the per-generator assertions below from passing against an
        // aggregator that has been emptied or renamed away.
        expect(
            dependenciesOf(workerPkg, "build:deps"),
            "packages/doenetml-worker-javascript's wireit build:deps must list the sibling builds its source needs (../i18n:build, ../utils:build, ../parser:build); the generator scripts in @doenet/static-assets depend on it to get them",
        ).not.toEqual([]);
    });

    it("is the only place the worker's build names a sibling build", () => {
        // Sibling builds reach the generators only through build:deps, so one
        // added straight to `build` would silently leave them behind.
        expect(
            dependenciesOf(workerPkg, "build").filter((name) =>
                name.startsWith("."),
            ),
            "add cross-package dependencies to packages/doenetml-worker-javascript's wireit build:deps rather than to its build, so the generator scripts in @doenet/static-assets get them too",
        ).toEqual([]);
    });
});

describe("generator script wireit wiring", () => {
    it("recognizes the generator scripts", () => {
        // A canary for GENERATOR_COMMAND going stale: matching nothing would
        // make every assertion below disappear rather than fail.
        expect(GENERATOR_SCRIPTS).toEqual(
            expect.arrayContaining([
                "build:schema",
                "build:assets",
                "check:docs-coverage",
            ]),
        );
    });

    for (const script of GENERATOR_SCRIPTS) {
        describe(script, () => {
            const advice = `${script} runs a file from packages/static-assets/scripts/, which is taken to mean it imports worker source. Make it a wireit script depending on ${WORKER_BUILD_DEPS} — or, if it does not import worker source, narrow GENERATOR_COMMAND in this test`;

            it("is a wireit script", () => {
                expect(staticAssetsPkg.scripts?.[script], advice).toBe(
                    "wireit",
                );
                expect(staticAssetsPkg.wireit?.[script]?.command).toBeTruthy();
            });

            it("depends on the worker's build:deps", () => {
                expect(
                    dependenciesOf(staticAssetsPkg, script),
                    advice,
                ).toContain(WORKER_BUILD_DEPS);
            });

            it("declares no files/output so wireit always re-runs it", () => {
                const config = staticAssetsPkg.wireit?.[script];
                expect(config?.files).toBeUndefined();
                expect(config?.output).toBeUndefined();
            });
        });
    }
});
