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
    if (r.state_bytes != null) parts.push(`state ${r.state_bytes}B`);
    if (r.timed_out_at) parts.push("(errors unchecked)");
    return parts.filter(Boolean).join(", ");
}
console.log(`${file}\n`);
console.log(["fixture", ...cores].join(" | "));
for (const f of fixtures) console.log([f, ...cores.map((c) => cell(last.get(`${f}|${c}`)))].join(" | "));

// The browser table, from the latest browser-<date>.jsonl, if any.
const browserFile = readdirSync(dir).filter((f) => f.startsWith("browser-")).sort().at(-1);
if (browserFile) {
    const lastB = new Map();
    for (const line of readFileSync(resolve(dir, browserFile), "utf8").split("\n").filter(Boolean)) {
        const r = JSON.parse(line);
        lastB.set(`${r.fixture}|${r.core}`, r);
    }
    const bcores = ["javascript", "cells"];
    const bcell = (r) => {
        if (!r) return "";
        if (r.status !== "ok") return r.status === "timeout" ? `> 60 s (${r.stage})` : r.status;
        const parts = [`load ${ms(r.load_ms)}`];
        if (r.drag) parts.push(r.drag.latency.n ? `drag lag ${ms(r.drag.latency.p50_ms)} (${r.drag.frames}/${r.drag.moves} frames)` : `drag: no frames (${r.drag.moves} moves)`);
        if (r.steps) parts.push(...r.steps.map((s) => `${s.label} ${ms(s.frame.p50_ms)}`));
        if (r.structural?.[0]) parts.push(`rebuild ${ms(r.structural[0].frame.p50_ms)}`);
        if (r.timed_out_at) parts.push(`(> 60 s at ${r.timed_out_at})`);
        return parts.join(", ");
    };
    console.log(`\n${resolve(dir, browserFile)} (ms; drag lag is the time from the oldest unanswered pointer move to the frame that answered it)\n`);
    console.log(["fixture", ...bcores].join(" | "));
    for (const f of [...new Set([...lastB.values()].map((r) => r.fixture))].sort()) {
        console.log([f, ...bcores.map((c) => bcell(lastB.get(`${f}|${c}`)))].join(" | "));
    }
}
