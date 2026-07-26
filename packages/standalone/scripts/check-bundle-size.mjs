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
 *    arrangement is a bug rather than a judgement call.
 *  - The size budgets in `bundle-budgets.json` catch the general case the
 *    first check cannot see — a heavy dependency, a duplicated copy of
 *    something that is not wasm. They are expected to be raised as the project
 *    grows; the point is that raising one lands in the diff.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const BUDGETS_FILE = path.join(PACKAGE_ROOT, "bundle-budgets.json");

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

const budgets = JSON.parse(fs.readFileSync(BUDGETS_FILE, "utf-8"));
const problems = [];
const report = [];

let totalWasmUris = 0;
let totalBigBlobs = 0;

for (const [relative, budget] of Object.entries(budgets.files)) {
    const file = path.join(PACKAGE_ROOT, relative);
    if (!fs.existsSync(file)) {
        problems.push(
            `${relative} does not exist — build the package before checking its size ` +
                `(\`npm run build -w @doenet/standalone\`).`,
        );
        continue;
    }

    const contents = fs.readFileSync(file, "utf-8");
    const size = Buffer.byteLength(contents);
    const wasmUris = contents.match(WASM_URI)?.length ?? 0;
    const bigBlobs = countBigBlobs(contents);
    totalWasmUris += wasmUris;
    totalBigBlobs += bigBlobs;

    report.push(
        `  ${relative}\n` +
            `      ${mib(size)} of ${mib(budget.maxBytes)} budget` +
            `  (${((size / budget.maxBytes) * 100).toFixed(1)}%)` +
            `, ${wasmUris} wasm URI(s), ${bigBlobs} inlined blob(s)`,
    );

    if (size > budget.maxBytes) {
        problems.push(
            `${relative} is ${mib(size)}, over its ${mib(budget.maxBytes)} budget by ` +
                `${mib(size - budget.maxBytes)}.\n` +
                `    If the growth is intended, raise "maxBytes" for this file in\n` +
                `    packages/standalone/bundle-budgets.json in the same commit, so the\n` +
                `    increase is visible in review. If it is not intended, something was\n` +
                `    pulled in twice — compare against the previous build before raising it.`,
        );
    }
}

// The core belongs to the worker, exactly once. `doenet-standalone.js` should
// carry no copy of it at all.
if (totalWasmUris !== 1 || totalBigBlobs !== 1) {
    problems.push(
        `Expected exactly one inlined wasm blob across the standalone output, in the\n` +
            `    worker bundle. Found ${totalWasmUris} wasm data-URI(s) and ${totalBigBlobs} large inlined\n` +
            `    blob(s). More than one means the Rust core was bundled twice, which adds\n` +
            `    megabytes; one in doenet-standalone.js means it leaked out of the worker.`,
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
