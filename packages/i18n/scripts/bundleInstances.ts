/**
 * Counting instances of this package inside built bundles.
 *
 * The pure half of `check-bundle-instances.ts`, kept apart so the tests can
 * exercise the decisions without a build — the same split `catalogUtils.ts`
 * has with `lint-catalogs.ts`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const I18N_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
export const PACKAGES_DIR = path.resolve(I18N_ROOT, "..");
export const LOAD_MODULE_FILE = path.join(I18N_ROOT, "src", "load.ts");

/**
 * The script that installs the locale loaders and renders the viewer that
 * reads them, and so must hold exactly one instance rather than at most one.
 * The one bundle where a second copy is not merely wasteful but breaking.
 */
export const SINGLE_INSTANCE_SCRIPT =
    "packages/standalone/dist/doenet-standalone.js";

/** Emitted JavaScript, in any extension a bundler might choose. */
const SCRIPT_EXTENSION = /\.[cm]?js$/;

/** The `CATALOG_PATH_PATTERN` declaration in `src/load.ts`. */
const MARKER_DECLARATION = /^const CATALOG_PATH_PATTERN = (\/.+\/);$/m;

/**
 * The regex literal `src/load.ts` matches catalog paths with, read out of the
 * source so the marker cannot drift away from the module it stands for.
 *
 * A regex literal is what makes a usable marker: a minifier renames every
 * binding around it and rewrites the code, but it can only copy the pattern
 * through verbatim. Counting it counts instances of the module that owns the
 * loader registry.
 *
 * @returns the pattern's source text, or `null` if `load.ts` no longer spells
 *   it as a literal — which the caller reports rather than skipping, since a
 *   marker nothing can find would pass every bundle it was shown.
 */
export function loaderRegistryMarker(
    loadModuleFile: string = LOAD_MODULE_FILE,
): string | null {
    if (!fs.existsSync(loadModuleFile)) {
        return null;
    }
    const match = MARKER_DECLARATION.exec(
        fs.readFileSync(loadModuleFile, "utf-8"),
    );
    return match ? match[1] : null;
}

/** Non-overlapping occurrences of a fixed string. */
export function countInstances(text: string, marker: string): number {
    return text.split(marker).length - 1;
}

/** One emitted script and how many copies of this package it holds. */
export type ScannedScript = { file: string; instances: number };

/**
 * Every emitted script under `packages/*` /`dist/`, with its instance count,
 * keyed by a repo-relative path with forward slashes on every platform.
 *
 * Only `dist/`, so a dev build (`dist-dev/`) or a test fixture cannot fail the
 * check for something nobody ships. Source maps are skipped by the extension
 * test: a map embeds the sources it maps, so it would count the marker again
 * for a perfectly correct build.
 */
export function collectDistScripts(
    marker: string,
    packagesDir: string = PACKAGES_DIR,
): ScannedScript[] {
    const scanned: ScannedScript[] = [];
    if (!fs.existsSync(packagesDir)) {
        return scanned;
    }
    for (const pkg of fs.readdirSync(packagesDir, { withFileTypes: true })) {
        const distDir = path.join(packagesDir, pkg.name, "dist");
        if (!pkg.isDirectory() || !fs.existsSync(distDir)) {
            continue;
        }
        for (const entry of fs.readdirSync(distDir, {
            withFileTypes: true,
            recursive: true,
        })) {
            if (!entry.isFile() || !SCRIPT_EXTENSION.test(entry.name)) {
                continue;
            }
            const file = path.join(entry.parentPath, entry.name);
            scanned.push({
                file: `packages/${pkg.name}/dist/${path
                    .relative(distDir, file)
                    .split(path.sep)
                    .join("/")}`,
                instances: countInstances(
                    fs.readFileSync(file, "utf-8"),
                    marker,
                ),
            });
        }
    }
    return scanned;
}

/**
 * Problems with how many copies of `@doenet/i18n` the built bundles hold.
 *
 * More than one in a single script is not merely wasteful, it is broken. The
 * loaders that reach the served catalogs are module-level state, installed
 * once at startup; a viewer compiled against a *second* instance of that
 * module reads that instance's registry, which nothing ever fills. Its verdict
 * is that no catalog is loadable, and since an unreachable catalog is a
 * deliberate, silent fall back to English, the bundle renders every language in
 * English while behaving in every other way as though it were translated. That
 * is what shipped in `@doenet/standalone@0.7.22`: `src/index.tsx` imported the
 * setter from `@doenet/i18n` while the viewer carried the copy inside
 * `@doenet/doenetml`. Reaching both through one entry point is the fix, and the
 * invariant it restores is countable — which is the point of checking it here,
 * since nothing about the failure is visible in a size budget (a second copy is
 * a few KB), in a source-built test (where there is only ever one instance), or
 * on screen.
 *
 * Judged per script rather than per package, because a script is the unit that
 * shares a module registry. A package that emits both a bundle and a worker
 * holds a copy in each, correctly: the worker is its own realm and resolves its
 * own catalogs.
 *
 * {@link SINGLE_INSTANCE_SCRIPT} is held to exactly one rather than at most
 * one — zero would mean the loader machinery had been tree-shaken out of the
 * one bundle whose whole locale story runs through it.
 *
 * @param scanned emitted scripts, from {@link collectDistScripts}.
 */
export function instanceProblems(scanned: ScannedScript[]): string[] {
    const problems = scanned
        .filter(({ instances }) => instances > 1)
        .map(
            ({ file, instances }) =>
                `${file} holds ${instances} copies of @doenet/i18n, so the loaders installed ` +
                `at startup are not the ones the viewer reads, and every language would ` +
                `silently render in English. Import setLocaleLoaders from the same ` +
                `@doenet/doenetml entry point the viewer comes from rather than from ` +
                `@doenet/i18n.`,
        );
    const single = scanned.find(({ file }) => file === SINGLE_INSTANCE_SCRIPT);
    if (single && single.instances === 0) {
        problems.push(
            `${SINGLE_INSTANCE_SCRIPT} holds no copy of @doenet/i18n at all, so either the ` +
                `loader machinery was tree-shaken out of the one bundle that installs it, or ` +
                `the marker this is counted with stopped surviving minification. Either way ` +
                `the count means nothing until it is understood.`,
        );
    }
    return problems;
}
