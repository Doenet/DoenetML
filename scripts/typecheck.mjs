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
 * 2026-08-15 with TypeScript as pinned in the root lockfile.
 */
const KNOWN_UNCLEAN = new Map([
    [
        "doenetml-worker-javascript",
        "35 errors, all in core/CompositeExpander.ts and core/StateVariableDefinitionFactory.ts (implicit `any` in the state-variable machinery)",
    ],
    [
        "vscode-extension",
        "18 errors in the preview-window React code and dark-mode-monitor",
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

for (const name of packages) {
    if (KNOWN_UNCLEAN.has(name)) {
        skipped.push(name);
        continue;
    }
    process.stdout.write(`type-checking packages/${name} ... `);
    try {
        execFileSync(
            "npx",
            ["tsc", "--noEmit", "-p", join("packages", name, "tsconfig.json")],
            { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] },
        );
        process.stdout.write("ok\n");
    } catch (e) {
        process.stdout.write("FAILED\n");
        const out = `${e.stdout ?? ""}${e.stderr ?? ""}`.trim();
        failed.push({ name, out });
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
// someone has already cleaned up.
const stale = [...KNOWN_UNCLEAN.keys()].filter((n) => !packages.includes(n));
if (stale.length > 0) {
    console.error(
        `\nKNOWN_UNCLEAN names a package that no longer exists (or has no tsconfig.json): ${stale.join(", ")}`,
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
