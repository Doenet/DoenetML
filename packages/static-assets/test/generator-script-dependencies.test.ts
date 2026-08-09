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
 * `@doenet/doenetml-worker-javascript`'s own `build`. We mirror that list
 * rather than depending on `../doenetml-worker-javascript:build` because these
 * scripts consume the worker's *source*: its bundle is never loaded, and
 * building it (plus the Rust/WASM core it pulls in) would add minutes to a
 * command that takes ~20s from a completely cold cache. The price of mirroring
 * is that the list can drift when the worker gains a dependency, and this test
 * is what makes that drift fail loudly instead of silently.
 *
 * Two further requirements this test pins down:
 *
 * - The generators declare **no `files`/`output`**, which is what makes wireit
 *   always re-run them rather than serve them from its cache. The CI
 *   `schema-freshness` job depends on that: comparing the committed schema
 *   against a cached no-op would check nothing.
 * - `@doenet/static-assets`' own `build` is *not* listed, yet the generators do
 *   need `dist/atom-database.js` (worker `utils/chemistry.ts` imports
 *   `@doenet/static-assets/atom-database` at runtime). It arrives transitively:
 *   `../utils:build` → `../parser:build` → `../static-assets:build`. Listing it
 *   here would be circular in spirit — `build` consumes `src/generated/*.json`,
 *   which is exactly what `build:schema` writes. If that chain ever breaks the
 *   failure is loud (`ERR_MODULE_NOT_FOUND`), not a silent stale read, and CI
 *   runs these scripts without pre-building the workspace so it sees it too.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Scripts in this package that run a generator over worker source. */
const GENERATOR_SCRIPTS = [
    "build:assets",
    "build:schema",
    "check:docs-coverage",
] as const;

type PackageJson = {
    scripts?: Record<string, string>;
    wireit?: Record<
        string,
        {
            command?: string;
            dependencies?: string[];
            files?: string[];
            output?: string[];
        }
    >;
};

function readPackageJson(relativeDir: string): PackageJson {
    return JSON.parse(
        fs.readFileSync(
            path.resolve(__dirname, relativeDir, "package.json"),
            "utf-8",
        ),
    ) as PackageJson;
}

const staticAssetsPkg = readPackageJson("..");
const workerPkg = readPackageJson("../../doenetml-worker-javascript");

/**
 * Wireit dependency names are relative to the package they are declared in.
 * Both packages sit in `packages/`, so the worker's `../i18n:build` and this
 * package's `../i18n:build` name the same script and can be compared directly.
 */
const workerBuildDependencies = workerPkg.wireit?.build?.dependencies ?? [];

describe("generator script wireit wiring", () => {
    it("has dependencies to mirror", () => {
        // If the worker's build ever stops declaring dependencies, the
        // superset assertions below would pass vacuously.
        expect(workerBuildDependencies.length).toBeGreaterThan(0);
    });

    for (const script of GENERATOR_SCRIPTS) {
        describe(script, () => {
            it("is a wireit script", () => {
                expect(staticAssetsPkg.scripts?.[script]).toBe("wireit");
                expect(staticAssetsPkg.wireit?.[script]?.command).toBeTruthy();
            });

            it("declares every build @doenet/doenetml-worker-javascript needs", () => {
                const dependencies =
                    staticAssetsPkg.wireit?.[script]?.dependencies ?? [];
                expect(dependencies).toEqual(
                    expect.arrayContaining(workerBuildDependencies),
                );
            });

            it("declares no files/output so wireit always re-runs it", () => {
                const config = staticAssetsPkg.wireit?.[script];
                expect(config?.files).toBeUndefined();
                expect(config?.output).toBeUndefined();
            });
        });
    }
});
