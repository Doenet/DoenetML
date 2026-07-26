/**
 * Guards the built standalone bundles against silent growth, and against the
 * specific way they have grown before: a second copy of the Rust core.
 *
 * The core ships as a single base64 `data:application/wasm` URI inlined into
 * the worker bundle — roughly 8.6 MB of the worker's 14.2 MB. When a build or
 * dependency change causes that blob to be emitted twice, or to be pulled into
 * `doenet-standalone.js` as well, the bundle grows by megabytes and nothing
 * fails. That has happened more than once.
 *
 * Two checks, doing different jobs:
 *
 *  - The placement check needs no threshold and never needs adjusting. The
 *    core is meant to sit in {@link WASM_CORE_SCRIPT} and nowhere else, and any
 *    other arrangement is a bug rather than a judgement call. It scans *every*
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
 * unusable, or when the core is not inlined exactly once in the right script.
 *
 * The exported helpers exist so `check-bundle-size.test.mjs` can exercise the
 * decision logic without a build, against synthetic bundles and throwaway
 * budgets files; only `main()` reads the real `dist/`.
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

/**
 * The one emitted script that is supposed to carry the inlined core. It is
 * copied here from `@doenet/doenetml-worker` by `viteStaticCopy` in
 * `vite.config.ts`; if that destination changes, change this key and the
 * matching one in `bundle-budgets.json` together.
 */
export const WASM_CORE_SCRIPT = "dist/doenetml-worker/index.js";

/** A base64 run long enough that nothing but an embedded binary explains it. */
const BIG_BLOB_MIN = 1_000_000;
const WASM_URI = /data:application\/wasm;base64/g;
/** Emitted JavaScript, in any extension a bundler might choose. */
const SCRIPT_EXTENSION = /\.[cm]?js$/;

/**
 * Count maximal base64 runs of at least {@link BIG_BLOB_MIN} characters.
 *
 * Scanned by hand rather than with `/[A-Za-z0-9+/]{1000000,}/`, which throws
 * `RangeError: Maximum call stack size exceeded` on a string this size — the
 * bundles are ~15 MB and the engine backtracks itself to death. A single pass
 * costs nothing and cannot blow up.
 */
export function countBigBlobs(text) {
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
 * Every emitted script under `dist/`, keyed by its path relative to the
 * package root (matching the keys in `bundle-budgets.json`).
 *
 * Deliberately limited to scripts. Source maps (`*.js.map`) embed the very
 * blob they map, so counting them would report the core twice for a correct
 * build, and `dist/style.css` legitimately carries a ~1 MB base64 run of its
 * own (an inlined SVG webfont) that the blob heuristic cannot tell apart from
 * wasm. Only a script can actually execute a duplicated Rust core.
 */
function collectEmittedScripts() {
    const scripts = new Map();
    if (!fs.existsSync(DIST_DIR)) {
        return scripts;
    }
    for (const entry of fs.readdirSync(DIST_DIR, {
        withFileTypes: true,
        recursive: true,
    })) {
        if (!entry.isFile() || !SCRIPT_EXTENSION.test(entry.name)) {
            continue;
        }
        const file = path.join(entry.parentPath, entry.name);
        const buffer = fs.readFileSync(file);
        const contents = buffer.toString("utf-8");
        // Keyed with forward slashes on every platform, so the keys in
        // `bundle-budgets.json` match on Windows too.
        const relative = path
            .relative(PACKAGE_ROOT, file)
            .split(path.sep)
            .join("/");
        scripts.set(relative, {
            size: buffer.length,
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
 *
 * @returns the `files` entries, as `[relativePath, budget]` pairs.
 */
export function loadBudgets(budgetsFile = BUDGETS_FILE) {
    let parsed;
    try {
        parsed = JSON.parse(fs.readFileSync(budgetsFile, "utf-8"));
    } catch (e) {
        throw new Error(
            `Could not read ${path.relative(PACKAGE_ROOT, budgetsFile)}: ${e.message}`,
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

/**
 * Describe a script whose inlined-blob count is not what it should be.
 *
 * `expected` is 1 for {@link WASM_CORE_SCRIPT} and 0 for everything else, so
 * the two wordings cover every script.
 */
function blobPlacementProblem(relative, emitted, expected) {
    const observed =
        `${emitted.wasmUris} wasm data-URI(s) and ` +
        `${emitted.bigBlobs} large inlined blob(s)`;
    if (expected === 1) {
        return (
            `${relative} should carry the Rust core exactly once, but has ${observed}.\n` +
            `    Zero means the core stopped being inlined — the worker would then have to\n` +
            `    fetch it at runtime, which standalone hosting cannot do. More than one\n` +
            `    means it was bundled twice, which adds megabytes.`
        );
    }
    return (
        `${relative} should carry no inlined binary — the Rust core belongs to\n` +
        `    ${WASM_CORE_SCRIPT} alone — but has ${observed}.\n` +
        `    A wasm URI here means the core leaked out of the worker or was bundled\n` +
        `    twice. A large blob without one means some other multi-megabyte asset is\n` +
        `    now inlined into JavaScript. Either way it should be a deliberate change.`
    );
}

/**
 * Compare the emitted scripts against the budgets, without touching the disk
 * or the process.
 *
 * @param budgets `[relativePath, budget]` pairs, as returned by
 *   {@link loadBudgets}.
 * @param scripts the emitted scripts, as returned by
 *   {@link collectEmittedScripts}.
 * @returns `report` lines describing every emitted script, and `problems`
 *   describing everything that should fail the build.
 */
export function findProblems(budgets, scripts) {
    const problems = [];
    const report = [];

    for (const [relative, budget] of budgets) {
        const emitted = scripts.get(relative);
        if (!emitted) {
            // "Build the package" is the right advice only when there is no
            // build. If other scripts were emitted and the core-carrying one
            // was not, the build ran and the file moved — say that once, in
            // the more specific message below, instead of twice and wrongly.
            if (relative !== WASM_CORE_SCRIPT || scripts.size === 0) {
                problems.push(
                    `${relative} does not exist — build the package before checking its size ` +
                        `(\`npm run build -w packages/standalone\`).`,
                );
            }
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
                `${relative} is ${mib(emitted.size)} (${emitted.size} bytes), over its ` +
                    `${mib(budget.maxBytes)} budget by ${mib(emitted.size - budget.maxBytes)}.\n` +
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

    // Where the core sits, not just how many copies exist: a single copy in
    // the wrong script is as much a bug as two copies, and a total-only count
    // cannot tell them apart.
    for (const [relative, emitted] of scripts) {
        const expected = relative === WASM_CORE_SCRIPT ? 1 : 0;
        if (emitted.wasmUris !== expected || emitted.bigBlobs !== expected) {
            problems.push(blobPlacementProblem(relative, emitted, expected));
        }
    }
    // An unbuilt `dist/` has no scripts to check, and the budget loop above has
    // already said to build; only complain about the core going missing once
    // there is a build to complain about.
    if (scripts.size > 0 && !scripts.has(WASM_CORE_SCRIPT)) {
        problems.push(
            `${WASM_CORE_SCRIPT} was not emitted, so nothing carries the Rust core.\n` +
                `    The worker bundle is copied into \`dist/\` by vite.config.ts; if it moved,\n` +
                `    update WASM_CORE_SCRIPT in this script and the key in bundle-budgets.json.`,
        );
    }

    return { report, problems };
}

function main() {
    const budgets = loadBudgets();
    const scripts = collectEmittedScripts();
    const { report, problems } = findProblems(budgets, scripts);

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

// Only when run as a command; importing this module (from its test) must not
// check the real `dist/` or exit the process.
if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    try {
        main();
    } catch (e) {
        // A configuration error is a failure of the check, not a stack trace to
        // decipher in a CI log.
        console.error(
            `\nbundle size check could not run:\n\n  - ${e.message}\n`,
        );
        process.exit(1);
    }
}
