/**
 * Guards the built standalone bundles against silent growth, and against the
 * specific way they have grown before: a second copy of the Rust core.
 *
 * The core ships as a single base64 `data:application/wasm` URI inlined into
 * the worker bundle — roughly 8.6 MB of the worker's 14.8 MB. When a build or
 * dependency change causes that blob to be emitted twice, or to be pulled into
 * `doenet-standalone.js` as well, the bundle grows by megabytes and nothing
 * fails. That has happened more than once.
 *
 * Two checks, doing different jobs:
 *
 *  - The duplication check needs no threshold and never needs adjusting. The
 *    wasm blob is meant to exist exactly once, in the worker, and any other
 *    arrangement is a bug rather than a judgement call. It scans *every*
 *    emitted script under `dist/`, not just the budgeted ones, so a copy that
 *    lands in a newly emitted chunk is still caught.
 *  - The size budgets in `bundle-budgets.json` catch the general case the
 *    first check cannot see — a heavy dependency, a duplicated copy of
 *    something that is not wasm. They are expected to be raised as the project
 *    grows; the point is that raising one lands in the diff.
 *
 * Run via `npm run check:size -w packages/standalone`. Exits non-zero, and
 * prints every problem it found rather than just the first, when a bundle is
 * over budget, when a budgeted file is missing, when `bundle-budgets.json` is
 * unusable, or when the wasm blob is not inlined exactly once.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const BUDGETS_FILE = path.join(PACKAGE_ROOT, "bundle-budgets.json");
const DIST_DIR = path.join(PACKAGE_ROOT, "dist");

/** A base64 run long enough that nothing but an embedded binary explains it. */
const BIG_BLOB_MIN = 1_000_000;
const WASM_URI = /data:application\/wasm;base64/g;

/**
 * Count maximal base64 runs of at least {@link BIG_BLOB_MIN} characters.
 *
 * Scanned by hand rather than with `/[A-Za-z0-9+/]{1000000,}/`, which throws
 * `RangeError: Maximum call stack size exceeded` on a string this size — the
 * bundles are ~15 MB and the engine backtracks itself to death. A single pass
 * costs nothing and cannot blow up.
 */
function countBigBlobs(text) {
    let count = 0;
    let run = 0;
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        const isBase64 =
            (c >= 48 && c <= 57) || // 0-9
            (c >= 65 && c <= 90) || // A-Z
            (c >= 97 && c <= 122) || // a-z
            c === 43 || // +
            c === 47; // /
        if (isBase64) {
            run++;
        } else {
            if (run >= BIG_BLOB_MIN) {
                count++;
            }
            run = 0;
        }
    }
    return run >= BIG_BLOB_MIN ? count + 1 : count;
}

function mib(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

/**
 * Every `.js` file under `dist/`, keyed by its path relative to the package
 * root (matching the keys in `bundle-budgets.json`).
 *
 * Deliberately limited to scripts. Source maps (`*.js.map`) embed the very
 * blob they map, so counting them would report the core twice for a correct
 * build, and `dist/style.css` legitimately carries a ~1 MB base64 run of its
 * own (an inlined SVG webfont) that the blob heuristic cannot tell apart from
 * wasm. Only scripts can actually ship a duplicated Rust core.
 */
function collectEmittedScripts(dir) {
    const scripts = new Map();
    if (!fs.existsSync(dir)) {
        return scripts;
    }
    for (const entry of fs.readdirSync(dir, {
        withFileTypes: true,
        recursive: true,
    })) {
        if (!entry.isFile() || !entry.name.endsWith(".js")) {
            continue;
        }
        const file = path.join(entry.parentPath, entry.name);
        const contents = fs.readFileSync(file, "utf-8");
        // Keyed with forward slashes on every platform, so the keys in
        // `bundle-budgets.json` match on Windows too.
        const relative = path
            .relative(PACKAGE_ROOT, file)
            .split(path.sep)
            .join("/");
        scripts.set(relative, {
            size: fs.statSync(file).size,
            wasmUris: contents.match(WASM_URI)?.length ?? 0,
            bigBlobs: countBigBlobs(contents),
        });
    }
    return scripts;
}

/**
 * Read `bundle-budgets.json`, rejecting a shape the checks cannot enforce.
 *
 * Without this a typo'd or missing `maxBytes` would compare `size > undefined`,
 * which is `false` — the file would be reported as within a `NaN MiB` budget
 * and the check would pass. A budget that silently stops guarding is worse
 * than no budget at all.
 */
function loadBudgets() {
    let parsed;
    try {
        parsed = JSON.parse(fs.readFileSync(BUDGETS_FILE, "utf-8"));
    } catch (e) {
        throw new Error(
            `Could not read ${path.relative(PACKAGE_ROOT, BUDGETS_FILE)}: ${e.message}`,
        );
    }
    const files = parsed?.files;
    if (typeof files !== "object" || files === null || Array.isArray(files)) {
        throw new Error(
            `bundle-budgets.json must have a "files" object mapping each bundle path ` +
                `to a budget.`,
        );
    }
    const entries = Object.entries(files);
    if (entries.length === 0) {
        throw new Error(
            `bundle-budgets.json lists no files, so nothing would be checked.`,
        );
    }
    for (const [relative, budget] of entries) {
        if (!Number.isFinite(budget?.maxBytes) || budget.maxBytes <= 0) {
            throw new Error(
                `bundle-budgets.json entry "${relative}" needs a positive numeric ` +
                    `"maxBytes"; got ${JSON.stringify(budget?.maxBytes)}.`,
            );
        }
    }
    return entries;
}

function main() {
    const budgets = loadBudgets();
    const scripts = collectEmittedScripts(DIST_DIR);
    const problems = [];
    const report = [];
    let anyBudgetedFileMissing = false;

    for (const [relative, budget] of budgets) {
        const emitted = scripts.get(relative);
        if (!emitted) {
            anyBudgetedFileMissing = true;
            problems.push(
                `${relative} does not exist — build the package before checking its size ` +
                    `(\`npm run build -w packages/standalone\`).`,
            );
            continue;
        }

        report.push(
            `  ${relative}\n` +
                `      ${mib(emitted.size)} of ${mib(budget.maxBytes)} budget` +
                `  (${((emitted.size / budget.maxBytes) * 100).toFixed(1)}%)` +
                `, ${emitted.wasmUris} wasm URI(s), ${emitted.bigBlobs} inlined blob(s)`,
        );

        if (emitted.size > budget.maxBytes) {
            problems.push(
                `${relative} is ${mib(emitted.size)}, over its ${mib(budget.maxBytes)} budget by ` +
                    `${mib(emitted.size - budget.maxBytes)}.\n` +
                    `    If the growth is intended, raise "maxBytes" for this file in\n` +
                    `    packages/standalone/bundle-budgets.json in the same commit, so the\n` +
                    `    increase is visible in review. If it is not intended, something was\n` +
                    `    pulled in twice — compare against the previous build before raising it.`,
            );
        }
    }

    // Emitted scripts nobody has put a ceiling on. Not a failure — a new chunk
    // is a normal thing for the bundler to do — but it is listed so that a
    // chunk quietly growing into a second multi-megabyte payload is visible,
    // and so somebody can decide whether it deserves a budget.
    const budgeted = new Set(budgets.map(([relative]) => relative));
    for (const [relative, emitted] of scripts) {
        if (!budgeted.has(relative)) {
            report.push(
                `  ${relative}\n` +
                    `      ${mib(emitted.size)}, no budget` +
                    `, ${emitted.wasmUris} wasm URI(s), ${emitted.bigBlobs} inlined blob(s)`,
            );
        }
    }

    let totalWasmUris = 0;
    let totalBigBlobs = 0;
    for (const emitted of scripts.values()) {
        totalWasmUris += emitted.wasmUris;
        totalBigBlobs += emitted.bigBlobs;
    }

    // The core belongs to the worker, exactly once. `doenet-standalone.js`
    // should carry no copy of it at all. Only meaningful once the build has
    // actually produced its bundles: on a half-built `dist/` the counts would
    // be zero and the message would blame duplication for a missing build.
    if (
        !anyBudgetedFileMissing &&
        (totalWasmUris !== 1 || totalBigBlobs !== 1)
    ) {
        problems.push(
            `Expected exactly one inlined wasm blob across the standalone scripts, in\n` +
                `    the worker bundle. Found ${totalWasmUris} wasm data-URI(s) and ${totalBigBlobs} large inlined\n` +
                `    blob(s). More than one means the Rust core was bundled twice, which adds\n` +
                `    megabytes; one in doenet-standalone.js means it leaked out of the worker.\n` +
                `    Zero means the core stopped being inlined at all — the worker would\n` +
                `    then have to fetch it at runtime, which standalone hosting cannot do.`,
        );
    }

    console.log("standalone bundle sizes:");
    console.log(report.join("\n"));

    if (problems.length > 0) {
        console.error(`\n${problems.length} problem(s):\n`);
        for (const problem of problems) {
            console.error(`  - ${problem}\n`);
        }
        process.exit(1);
    }

    console.log("\nwithin budget, and the core is inlined exactly once.");
}

try {
    main();
} catch (e) {
    // A configuration error is a failure of the check, not a stack trace to
    // decipher in a CI log.
    console.error(`\nbundle size check could not run:\n\n  - ${e.message}\n`);
    process.exit(1);
}
