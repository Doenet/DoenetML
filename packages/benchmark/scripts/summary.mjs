// Print the latest results as one table: the last record per (fixture,
// core) in a results file, one row per fixture, one column group per core.
//   node scripts/summary.mjs [results/raw/node-<date>.jsonl]
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { packageRoot } from "../src/fixtures.mjs";

const dir = resolve(packageRoot, "results/raw");
const file = process.argv[2] ?? resolve(dir, readdirSync(dir).filter((f) => f.startsWith("node-")).sort().at(-1));
const last = new Map();
for (const line of readFileSync(file, "utf8").split("\n").filter(Boolean)) {
    const r = JSON.parse(line);
    last.set(`${r.fixture}|${r.core}`, r);
}
const cores = ["javascript", "rust", "cells"];
const fixtures = [...new Set([...last.values()].map((r) => r.fixture))].sort();
const ms = (x) => (x == null ? "" : x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));
const mb = (x) => (x == null ? "" : (x / 1e6).toFixed(1));
function cell(r) {
    if (!r) return "";
    if (r.status === "timeout") return `> 60 s (${r.stage})`;
    if (r.status === "unsupported") return "unsupported";
    if (r.status === "error") return "error";
    const step = r.steps?.[0];
    const parts = [`load ${ms(r.load_ms)}`, step ? `tick ${ms(step.p50_ms)}` : ""];
    if (r.structural?.[0]) parts.push(`rebuild ${ms(r.structural[0].p50_ms)}`);
    parts.push(`mem ${mb(r.heap_bytes + r.wasm_bytes)}MB`);
    if (r.timed_out_at) parts.push("(errors unchecked)");
    return parts.filter(Boolean).join(", ");
}
console.log(`${file}\n`);
console.log(["fixture", ...cores].join(" | "));
for (const f of fixtures) console.log([f, ...cores.map((c) => cell(last.get(`${f}|${c}`)))].join(" | "));
