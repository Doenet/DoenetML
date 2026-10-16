// Bundle size per core: everything a page fetches to render a document,
// raw and brotli (quality 11, what a CDN serves precompressed). Reads the
// built dists; build them first:
//   npm run build -w packages/standalone -w packages/cells-viewer
//   npm run build:rust-viewer      (the Rust core's page, after building
//                                   packages/doenetml-prototype)
//   node src/bundle.mjs            (appends to results/raw/bundle-<date>.json)
// A set whose dist is not built is skipped with a warning.
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { brotliCompressSync } from "node:zlib";
import { packageRoot, repoRoot } from "./fixtures.mjs";
import { appendRecord, localDate } from "./results.mjs";

const standalone = resolve(repoRoot, "packages/standalone/dist");
const cellsViewer = resolve(repoRoot, "packages/cells-viewer/dist");
const rustViewer = resolve(packageRoot, "browser/rust-viewer/dist");
const coreWorker = resolve(repoRoot, "packages/doenetml-worker/dist");

/** Files matched under a dist root; a `*` matches one hashed segment. */
function files(root, patterns) {
    if (!existsSync(root)) return [];
    const all = readdirSync(root, { recursive: true }).filter((f) =>
        statSync(resolve(root, f)).isFile(),
    );
    return patterns.flatMap((p) => {
        const re = new RegExp(
            "^" +
                p
                    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                    .replace(/\*/g, "[^/]*") +
                "$",
        );
        return all.filter((f) => re.test(f)).map((f) => resolve(root, f));
    });
}

/**
 * The sets. The JS core's eager set is what every embed loads before a
 * document renders: the facade, the eagerly parsed chunk, the stylesheet,
 * the worker and the Rust wasm the worker fetches for DAST normalization.
 * Renderer chunks loaded on demand are left out; the whole dist (without
 * source maps) is given for context. The Rust core is that wasm alone, as
 * it ships inside the JS core's worker, and, separately, the page that runs
 * it: the prototype viewer (browser/rust-viewer) with the core worker it
 * loads, which carries the JS core too since one worker serves both. The
 * cells core is its viewer build.
 */
const SETS = {
    // [dist roots the set reads, the files]
    "javascript (eager set)": () => [
        [standalone],
        files(standalone, [
            "doenet-standalone.js",
            "chunks/index-*.js",
            "style.css",
            "doenetml-worker/index.js",
            "doenetml-worker/lib_doenetml_worker_bg.wasm",
        ]),
    ],
    "javascript (whole dist, no maps)": () => [
        [standalone],
        files(standalone, ["*", "*/*", "*/*/*"]).filter(
            (f) => !f.endsWith(".map"),
        ),
    ],
    "rust (wasm only)": () => [
        [standalone],
        files(standalone, ["doenetml-worker/lib_doenetml_worker_bg.wasm"]),
    ],
    "rust (prototype viewer page)": () => [
        [rustViewer, coreWorker],
        [
            ...files(rustViewer, ["index.html", "assets/*.js", "assets/*.css"]),
            ...files(coreWorker, ["index.js", "lib_doenetml_worker_bg.wasm"]),
        ],
    ],
    "cells (viewer build)": () => [
        [cellsViewer],
        files(cellsViewer, [
            "index.html",
            "assets/*.js",
            "assets/*.wasm",
            "assets/*.css",
        ]),
    ],
};
const date = localDate();
const commit = execSync("git rev-parse --short HEAD", {
    cwd: repoRoot,
    encoding: "utf8",
}).trim();
const cache = new Map();
const measure = (file) => {
    if (!cache.has(file)) {
        const b = readFileSync(file);
        cache.set(file, {
            file: file.replace(repoRoot + "/", ""),
            raw: b.length,
            brotli: brotliCompressSync(b).length,
        });
    }
    return cache.get(file);
};
const mb = (x) => (x / 1e6).toFixed(2).padStart(6);
const records = [];
for (const [set, list] of Object.entries(SETS)) {
    const [roots, setFiles] = list();
    const missing = roots.filter((r) => !existsSync(r));
    if (missing.length) {
        console.warn(`${set}: skipped, not built: ${missing.join(", ")}`);
        continue;
    }
    const rows = setFiles.map(measure);
    const raw = rows.reduce((a, r) => a + r.raw, 0);
    const brotli = rows.reduce((a, r) => a + r.brotli, 0);
    console.log(`${set}: ${mb(raw)} MB raw, ${mb(brotli)} MB brotli`);
    if (rows.length <= 8)
        for (const r of rows)
            console.log(`    ${mb(r.raw)}  ${mb(r.brotli)}  ${r.file}`);
    records.push({
        date,
        commit,
        set,
        raw_bytes: raw,
        brotli_bytes: brotli,
        files: rows,
    });
}
const out = resolve(packageRoot, `results/raw/bundle-${date}.json`);
for (const r of records) appendRecord(out, r);
console.log(`wrote ${out}`);
