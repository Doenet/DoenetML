/**
 * CI guard against a bundle holding more than one copy of `@doenet/i18n`. Run
 * with `npm run check:i18n-instances` from the repo root, after a build.
 *
 * Two copies mean the loaders installed at startup are not the ones the viewer
 * reads, so every language falls back to English without a word — see
 * {@link instanceProblems} for how that shipped in 0.7.22. Every package's
 * `dist/` is scanned rather than a listed few: any bundle combining a prebuilt
 * `@doenet/doenetml` with a source build of this package can hit it, and a new
 * one should not have to remember to opt in.
 *
 * Scans whatever has been built. A package nobody built is not reported as a
 * problem — but the number of packages scanned is printed, and finding nothing
 * at all is a failure rather than a pass, so a run against an empty tree cannot
 * read as a clean bill of health.
 */
import {
    collectDistScripts,
    instanceProblems,
    loaderRegistryMarker,
    SINGLE_INSTANCE_SCRIPT,
} from "./bundleInstances";

const problems: string[] = [];

const marker = loaderRegistryMarker();
if (marker === null) {
    problems.push(
        `Could not find the CATALOG_PATH_PATTERN regex literal in src/load.ts, which is ` +
            `what instances of this package are counted with. Restore it as a literal, or ` +
            `teach loaderRegistryMarker in scripts/bundleInstances.ts to read its new ` +
            `spelling — an uncountable marker would pass every bundle it was shown.`,
    );
}

const scanned = marker === null ? [] : collectDistScripts(marker);
const packages = new Set(scanned.map(({ file }) => file.split("/")[1]));

if (marker !== null && scanned.length === 0) {
    problems.push(
        `No built scripts found under packages/*/dist/. Build before running this ` +
            `(npm run build:all-no-docs); a scan of nothing passes trivially.`,
    );
}
if (!scanned.some(({ file }) => file === SINGLE_INSTANCE_SCRIPT)) {
    // A note rather than a problem: the standalone bundle is the one held to
    // exactly one copy, but plenty of local builds legitimately do not produce
    // it, and CI fails on its absence a step earlier at `check:size`.
    console.log(
        `note: ${SINGLE_INSTANCE_SCRIPT} was not built, so not checked`,
    );
}

problems.push(...instanceProblems(scanned));

if (problems.length > 0) {
    console.error(
        `\ni18n instance check found ${problems.length} problem(s):\n`,
    );
    for (const problem of problems) {
        console.error(`  - ${problem}\n`);
    }
    process.exit(1);
}

console.log(
    `i18n instance check passed: ${scanned.length} script(s) across ` +
        `${packages.size} built package(s), none holding more than one copy of ` +
        `@doenet/i18n.`,
);
