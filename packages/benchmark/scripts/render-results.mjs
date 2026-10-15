// Render results/RESULTS.md from the latest raw results: the Node table,
// the browser table, memory, bundle size, and results/NOTES.md verbatim.
//   npm run render
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { packageRoot, repoRoot } from "../src/fixtures.mjs";

const dir = resolve(packageRoot, "results/raw");
const latest = (prefix, ext) => readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith(ext)).sort().at(-1);
const jsonl = (file) => (file ? readFileSync(resolve(dir, file), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
/** The last record per (fixture, core): a re-run supersedes. */
const lastBy = (rows) => { const m = new Map(); for (const r of rows) m.set(`${r.fixture}|${r.core}`, r); return m; };
const ms = (x) => (x == null || !Number.isFinite(x) ? "" : x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));
const mb = (x) => (x == null ? "" : (x / 1e6).toFixed(1));
const kb = (x) => (x == null ? "" : x >= 10_000 ? `${(x / 1000).toFixed(1)} KB` : `${x} B`);
const esc = (s) => String(s).replace(/\|/g, "\\|");
const table = (header, rows) => [`| ${header.join(" | ")} |`, `|${header.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`)].join("\n");
const fixtureOrder = (names) => [...names].sort((a, b) => { const ka = key(a), kb = key(b); return ka[0] < kb[0] ? -1 : ka[0] > kb[0] ? 1 : ka[1] - kb[1]; });
const key = (n) => { const m = /^(.*?)-(\d+)$/.exec(n); return m ? [m[1], Number(m[2])] : [n, 0]; };
/** A non-ok cell: the status and the gist of the adapter's message. */
const gist = (m) => (m ?? "").replace(/^\[[^\]]*\] /, "").replace(/\b(load|Error|unsupported): /g, "").replace(/: unknown variant.*$/, "").slice(0, 60);
const blank = (r) => r.status === "timeout" ? `> 60 s at ${r.stage}` : `${r.status}${r.message ? `: ${gist(r.message)}` : ""}`;

const nodeFile = latest("node-", ".jsonl"), browserFile = latest("browser-", ".jsonl"), bundleFile = latest("bundle-", ".jsonl");
const node = lastBy(jsonl(nodeFile)), browser = lastBy(jsonl(browserFile));
const commit = execSync("git rev-parse --short HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
const cpu = (() => { try { return readFileSync("/proc/cpuinfo", "utf8").match(/model name\s*:\s*(.*)/)[1]; } catch { return "unknown"; } })();
const out = [];
out.push(`# Results`, ``, `Rendered by \`scripts/render-results.mjs\` on ${new Date().toISOString().slice(0, 10)} at commit \`${commit}\`. CPU: ${cpu}. Raw records: ${[nodeFile, browserFile, bundleFile].filter(Boolean).map((f) => `\`raw/${f}\``).join(", ")}, \`raw/memory-*.json\`.`, ``);
out.push(`A decision suite comparing the JS core, the Rust core and the cells core (see \`PLAN.md\`). A blank or "unsupported" cell is a result: that core cannot run the document or the action. "> 60 s" is the budget per measurement.`, ``);
out.push(`## Reference budgets`, ``, `Product goals, not gates.`, ``, table(["Measurement", "Budget"], [
    ["Interactive tick, browser frame latency", "16 ms (one vsync)"], ["Structural tick, browser", "50 ms"], ["Load, text to first render, homework page", "100 ms: no loading screen"],
    ["Memory, marginal per viewer on a page", "20 MB"], ["State storage, homework page after the script", "2 KB raw"], ["Bundle, brotli, everything a page fetches", "1 MB"]]), ``);

if (existsSync(resolve(packageRoot, "results/NOTES.md"))) out.push(readFileSync(resolve(packageRoot, "results/NOTES.md"), "utf8").trim(), ``);

// Node, core only.
const cores = ["javascript", "rust", "cells"];
const fixtures = fixtureOrder(new Set([...node.values()].map((r) => r.fixture)));
const nodeCell = (r, f) => !r ? "" : r.status !== "ok" ? blank(r) : f(r);
out.push(`## Core only, in Node (ms)`, ``, `Each core through the shared test-core interface, one process per measurement (\`src/run.mjs\`). *load* is \`createTestCore\` on the DoenetML text and includes the parse (*parse* alone is the parser); *tick* is the median of the manifest's first step over 20 rounds; *rebuild* the structural step.`, ``);
out.push(table(["fixture", ...cores.flatMap((c) => [`${c} load`, `${c} tick`, `${c} rebuild`])], fixtures.map((f) => [f, ...cores.flatMap((c) => { const r = node.get(`${f}|${c}`); return r?.status === "ok" ? [ms(r.load_ms), ms(r.steps?.[0]?.p50_ms), ms(r.structural?.[0]?.p50_ms)] : [r ? blank(r) : "", "", ""]; })])), ``);
out.push(`### Memory and saved state, in Node`, ``, `*memory* is JS heap growth across the load plus wasm linear memory (the JS core's wasm is the Rust binding its worker holds for DAST normalization). *state* is the session's saved state after the steps, raw / gzipped; for the JS core the \`coreState\` string, with the whole persistence envelope a host stores in parentheses.`, ``);
out.push(table(["fixture", ...cores.flatMap((c) => [`${c} memory MB`, `${c} state`])], fixtures.map((f) => [f, ...cores.flatMap((c) => { const r = node.get(`${f}|${c}`); if (r?.status !== "ok") return ["", ""]; const st = r.state_bytes == null ? "" : `${kb(r.state_bytes)} / ${kb(r.state_gzip_bytes)}${r.state_envelope_bytes ? ` (${kb(r.state_envelope_bytes)})` : ""}`; return [mb(r.heap_bytes + r.wasm_bytes), st]; })])), ``);

// Browser.
const bcores = ["javascript", "cells"];
const bfixtures = fixtureOrder(new Set([...browser.values()].map((r) => r.fixture)));
out.push(`## Browser end to end (headless Chromium, ms)`, ``, `Each fixture in each core's viewer (\`browser/perf.spec.ts\`). *load* is DoenetML text to first render. *drag lag* is, over 60 pointer moves paced at 16 ms, the median time from the oldest unanswered move to the frame that answered it, with how many of the moves got a frame of their own; one vsync is 16.7 ms. *tick* is a step through the core to the next frame; *rebuild* the structural step.`, ``);
out.push(table(["fixture", ...bcores.flatMap((c) => [`${c} load`, `${c} drag lag`, `${c} tick`, `${c} rebuild`])], bfixtures.map((f) => [f, ...bcores.flatMap((c) => {
    const r = browser.get(`${f}|${c}`); if (!r) return ["", "", "", ""]; if (r.status !== "ok") return [blank(r), "", "", ""];
    const drag = r.drag ? (r.drag.latency.n ? `${ms(r.drag.latency.p50_ms)} (${r.drag.frames}/${r.drag.moves})` : `no frames`) : "";
    const tick = r.steps ? r.steps.map((s) => `${s.label.split(" ")[0]} ${ms(s.frame.p50_ms)}`).join(", ") : "";
    return [`${ms(r.load_ms)}${r.timed_out_at ? ` (> 60 s at ${r.timed_out_at})` : ""}`, drag, tick, ms(r.structural?.[0]?.frame.p50_ms)];
})])), ``);

// Memory in the browser.
const memFiles = readdirSync(dir).filter((f) => f.startsWith("memory-") && f.endsWith(".json")).sort();
if (memFiles.length) {
    const byCore = new Map();
    for (const f of memFiles) for (const r of JSON.parse(readFileSync(resolve(dir, f), "utf8"))) byCore.set(`${r.name}|${r.core}`, r);
    const names = [...new Set([...byCore.values()].map((r) => r.name))];
    out.push(`## Memory in the browser (MB)`, ``, `\`packages/memory-benchmark\`: proportional set size over the whole Chromium process tree after a forced GC, per embedding scenario; *blank* is the browser alone. The cells viewer has no embed API, so only the iframe scenarios have an equivalent for it.`, ``);
    out.push(table(["scenario", ...bcores.map((c) => `${c} total PSS`), ...bcores.map((c) => `${c} main-realm JS heap`)], names.map((n) => [n, ...bcores.map((c) => { const r = byCore.get(`${n}|${c}`); return r ? (r.error ? `error: ${r.error.replace(/^Error: /, "").slice(0, 60)}` : r.totalPssMB) : ""; }), ...bcores.map((c) => byCore.get(`${n}|${c}`)?.mainRealmJsHeapMB ?? "")])), ``);
}

// Bundle.
const bundle = jsonl(bundleFile);
if (bundle.length) {
    const last = new Map(); for (const r of bundle) last.set(r.set, r);
    out.push(`## Bundle size`, ``, `Everything a page fetches to render a document, raw and brotli (quality 11), as built at the commit in each record (\`src/bundle.mjs\`).`, ``);
    out.push(table(["set", "raw MB", "brotli MB", "files"], [...last.values()].map((r) => [r.set, mb(r.raw_bytes), mb(r.brotli_bytes), r.files.length])), ``);
}
writeFileSync(resolve(packageRoot, "results/RESULTS.md"), out.join("\n"));
console.log(`wrote ${resolve(packageRoot, "results/RESULTS.md")}`);
