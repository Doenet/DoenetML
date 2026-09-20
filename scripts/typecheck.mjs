#!/usr/bin/env node
/**
 * Run `tsc --noEmit` over every workspace package that has a root
 * `tsconfig.json`, and fail if any of them reports an error.
 *
 * Why this exists: nothing else in CI type-checks. `Lint Typescript Code` is
 * Prettier plus a filename-collision check, and the packages that build with
 * `vite build` *log* their `vite-plugin-dts` diagnostics and exit 0 — so a
 * type error can sit in the tree indefinitely. Twenty-two of them did, in
 * `packages/doenetml`, introduced by one commit and found only by a reviewer
 * running `tsc` by hand two commits later.
 *
 * It runs in the Build job because the root `paths` mapping resolves
 * `@doenet/<name>` to `packages/<name>/dist`, so type-checking needs a completed build.
 *
 * Packages are discovered rather than listed, so a new package is gated the
 * day it is added. `KNOWN_UNCLEAN` below is the debt: each entry is a package
 * that does not type-check today, with the count at the time it was recorded.
 * Fixing one means deleting its line — do not add to this list to make a new
 * error go away.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Packages excluded from the gate because they have pre-existing type errors,
 * none of which is in the way of any current work. The counts were measured on
 * 2026-08-15 with TypeScript as pinned in the root lockfile, and total 59.
 *
 * Each entry is checked, not trusted: an excluded package is still type-checked
 * below, and the run fails if one of them now comes back *clean*. Naming the
 * cause is therefore a description rather than a promise — but it is what tells
 * the next reader whether the debt is worth paying, so it has to be true.
 */
const KNOWN_UNCLEAN = new Map([
    [
        "doenetml-worker-javascript",
        "35 errors in core/CompositeExpander.ts and core/StateVariableDefinitionFactory.ts: 23 implicit-`any` (TS70xx) in the state-variable machinery, and 12 real mismatches (10 × TS2339 `Property 'returnDependencies' does not exist`, one TS2345, one TS2554)",
    ],
    [
        "vscode-extension",
        '18 errors in the preview-window React code, all of them TS2812/TS2584/TS2304/TS2552 from a missing `dom` in that package\'s own `lib` (`["es2020", "WebWorker"]`) — a tsconfig fix rather than code to write',
    ],
    [
        "utils",
        "2 errors: a spread into mathjs `lcm`, and `import type { mod as ModType }` used without `typeof`",
    ],
    [
        "parser",
        "2 errors: `DastNodes` has no `data` property, which plugin-mark-blank-lines writes to",
    ],
    [
        "test-cypress",
        "2 errors: an untyped custom Cypress command, and a Button prop mismatch",
    ],
]);

const packagesDir = join(repoRoot, "packages");
const packages = readdirSync(packagesDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => existsSync(join(packagesDir, name, "tsconfig.json")))
    .sort();

const skipped = [];
const failed = [];
const nowClean = [];

for (const name of packages) {
    const excluded = KNOWN_UNCLEAN.has(name);
    process.stdout.write(`type-checking packages/${name} ... `);
    let error;
    try {
        execFileSync(
            "npx",
            ["tsc", "--noEmit", "-p", join("packages", name, "tsconfig.json")],
            { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] },
        );
    } catch (e) {
        error = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();
    }
    if (excluded) {
        // Excluded packages are type-checked too, and the *absence* of errors
        // is what fails: see the note on `nowClean` below.
        process.stdout.write(error ? "not gated\n" : "CLEAN\n");
        (error ? skipped : nowClean).push(name);
    } else {
        process.stdout.write(error ? "FAILED\n" : "ok\n");
        if (error) {
            failed.push({ name, out: error });
        }
    }
}

if (skipped.length > 0) {
    console.log(
        `\nNot gated (pre-existing errors):\n${skipped
            .map((n) => `  packages/${n} — ${KNOWN_UNCLEAN.get(n)}`)
            .join("\n")}`,
    );
}

// A stale entry is its own kind of rot: it silently un-gates a package that
// someone has already cleaned up. There are two ways for one to go stale, and
// the likelier of them is not the package disappearing — it is somebody fixing
// the errors and not deleting the line, after which the package is never gated
// again and the next regression in it lands unnoticed. So an excluded package
// is run like any other and failed when it comes back clean; the exclusion list
// cannot outlive what it excuses.
const stale = [...KNOWN_UNCLEAN.keys()].filter((n) => !packages.includes(n));
if (stale.length > 0) {
    console.error(
        `\nKNOWN_UNCLEAN names a package that no longer exists (or has no tsconfig.json): ${stale.join(", ")}`,
    );
    process.exit(1);
}

if (nowClean.length > 0) {
    console.error(
        `\n${nowClean.length} package(s) in KNOWN_UNCLEAN now type-check clean — ` +
            `delete their entries so they are gated from now on:\n${nowClean
                .map((n) => `  packages/${n}`)
                .join("\n")}`,
    );
    process.exit(1);
}

if (failed.length > 0) {
    console.error(`\n${failed.length} package(s) failed to type-check:\n`);
    for (const { name, out } of failed) {
        console.error(`--- packages/${name} ---\n${out}\n`);
    }
    process.exit(1);
}

console.log(
    `\n${packages.length - skipped.length} package(s) type-check clean.`,
);
