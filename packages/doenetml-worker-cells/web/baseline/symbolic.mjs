// Plan 5 baseline: the symbolic fixtures in the CURRENT DoenetML core (the
// standalone bundle, whose worker calls math-expressions-rs through wasm),
// in headless Chromium. Times initialization and each fixture's two
// interactions through the core's own actions:
//
// - answers-N: a keystroke in the middle mathInput (`updateRawValue`), the
//   same keystroke committed (`updateRawValue` then `updateValue`), and a
//   submit (`submitAnswer`) after typing a right or wrong answer;
// - curves-N: a committed change of the shared coefficient `a`, and of `b0`;
// - symchain-N: a committed keystroke in `mi`, and a committed change of `t`.
//
// In the current core a keystroke updates only the input's immediate value;
// what reads the input sees the change on commit, so the committed time is
// the one comparable to a prototype keystroke.
//
// Run from web/: node baseline/symbolic.mjs [spec,spec,...]
import { chromium } from "@playwright/test";
import http from "node:http";
import { readFileSync, existsSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const doenetml = process.env.DOENETML_DIR ?? resolve(repo, "../../ml");
const standalone = resolve(doenetml, "packages/standalone/dist");
const docgen = resolve(repo, "target/release/cells-docgen");
const SPECS = (process.argv[2] ?? "answers-10,answers-100,curves-10,curves-100,symchain-10,symchain-100").split(",");
const STEPS = Number(process.env.STEPS ?? 20);

const MIME = { ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".map": "application/json", ".html": "text/html" };

const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/standalone/style.css">
<script type="module" src="/standalone/doenet-standalone.js"></script>
</head><body><div id="viewer"></div>
<script>
window.__state = { init: null, error: null };
window.__load = async (spec) => {
  const source = await (await fetch("/doc?spec=" + encodeURIComponent(spec))).text();
  await new Promise((ok) => { const h = setInterval(() => { if (window.renderDoenetViewerToContainer) { clearInterval(h); ok(); } }, 20); });
  const t0 = performance.now();
  window.renderDoenetViewerToContainer(document.getElementById("viewer"), source, {
    addVirtualKeyboard: false,
    flags: { allowSaveState: false, allowSaveEvents: false, allowLoadState: false, allowLocalState: false, showCorrectness: true, showFeedback: false },
    initializedCallback: () => { window.__state.init = performance.now() - t0; },
    coreStartFailedCallback: (e) => { window.__state.error = String(e); },
  });
};
// Time a list of action batches; each batch is awaited in order and timed
// as one interaction. An untimed batch (setup) may precede it.
window.__time = async (steps) => {
  const out = [];
  for (const { setup, timed } of steps) {
    for (const a of setup) await window.callAction1({ ...a, componentIdx: await window.resolvePath1(a.name) });
    const t = performance.now();
    for (const a of timed) await window.callAction1({ ...a, componentIdx: await window.resolvePath1(a.name) });
    out.push(performance.now() - t);
  }
  return out;
};
</script></body></html>`;

const correct = (i) => { const k = (i % 7) + 1; return [`(x+${k})^2`, `${k}x^2-${k + 1}x+1`, `\\sin(x)^2+${k}`, `(x-${k})(x+${k})`][i % 4]; };
const raw = (name, latex) => ({ name, actionName: "updateRawValue", args: { rawRendererValue: latex } });
const commit = (name) => ({ name, actionName: "updateValue", args: {} });

function interactions(spec) {
  const [shape, size] = spec.split("-");
  const n = Number(size);
  const steps = (f) => Array.from({ length: STEPS }, (_, i) => f(i + 1));
  if (shape === "answers") {
    const k = n >> 1, mi = `mi${k}`, a = `a${k}`;
    return {
      keystroke: steps((i) => ({ setup: [], timed: [raw(mi, `x^2+${i}x+1`)] })),
      "keystroke+commit": steps((i) => ({ setup: [], timed: [raw(mi, `x^2+${i}x+1`), commit(mi)] })),
      submit: steps((i) => ({ setup: [raw(mi, i % 2 ? `${correct(k)}+${i}` : correct(k)), commit(mi)], timed: [{ name: a, actionName: "submitAnswer", args: {} }] })),
    };
  }
  if (shape === "curves") {
    return {
      "drag a": steps((i) => ({ setup: [], timed: [raw("a", String(1 + (i % 100) * 0.01)), commit("a")] })),
      "drag b0": steps((i) => ({ setup: [], timed: [raw("b0", String((i % 100) * 0.01)), commit("b0")] })),
    };
  }
  return {
    keystroke: steps((i) => ({ setup: [], timed: [raw("mi", `x^2+${i}`), commit("mi")] })),
    "drag t": steps((i) => ({ setup: [], timed: [raw("t", String(1 + i * 1e-4)), commit("t")] })),
  };
}

if (!existsSync(resolve(standalone, "doenet-standalone.js"))) {
  console.error(`no standalone bundle at ${standalone}`);
  process.exit(2);
}
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(PAGE); }
  if (url.pathname === "/doc") { res.writeHead(200, { "content-type": "text/plain" }); return res.end(execFileSync(docgen, ["--legacy", url.searchParams.get("spec")], { encoding: "utf8" })); }
  if (url.pathname.startsWith("/standalone/")) {
    const f = resolve(standalone, "." + url.pathname.slice("/standalone".length));
    if (!f.startsWith(standalone) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream", "cache-control": "no-store" });
    return res.end(readFileSync(f));
  }
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s[s.length >> 1]; };
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const results = [];
for (const spec of SPECS) {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message.slice(0, 200)}`));
  await page.goto(base + "/", { waitUntil: "load" });
  await page.evaluate((spec) => window.__load(spec), spec);
  try {
    await page.waitForFunction(() => window.__state.init !== null || window.__state.error !== null, null, { timeout: 600_000 });
  } catch {
    console.log(`${spec}: no initializedCallback; skipping`);
    results.push({ spec, error: "timeout" });
    await page.close();
    continue;
  }
  const state = await page.evaluate(() => window.__state);
  if (state.error) { console.log(`${spec}: ${state.error}`); results.push({ spec, error: state.error }); await page.close(); continue; }
  const row = { spec, init_ms: state.init };
  let line = `${spec.padEnd(14)} init ${state.init.toFixed(0).padStart(7)} ms`;
  for (const [what, steps] of Object.entries(interactions(spec))) {
    const ms = await page.evaluate((steps) => window.__time(steps), steps);
    row[what] = { median_ms: median(ms), mean_ms: ms.reduce((a, b) => a + b, 0) / ms.length, n: ms.length };
    line += ` | ${what} ${median(ms).toFixed(1)} ms`;
  }
  // Sanity: the last submit's credit, read through the core.
  if (spec.startsWith("answers")) {
    const k = Number(spec.split("-")[1]) >> 1;
    row.credit_after_last_submit = await page.evaluate(async (k) => (await window.returnAllStateVariables1?.())?.[await window.resolvePath1(`a${k}`)]?.stateValues?.creditAchieved, k).catch(() => null);
  }
  if (spec.startsWith("symchain")) {
    const n = Number(spec.split("-")[1]);
    row.sanity = await page.evaluate(async (n) => {
      const all = await window.returnAllStateVariables1();
      const sv = async (name) => all[await window.resolvePath1(name)]?.stateValues;
      const show = (v) => JSON.stringify(v?.tree ?? v ?? null).slice(0, 120);
      return { e2: show((await sv("e2"))?.value), last: show((await sv(`m${n - 1}`))?.value) };
    }, n).catch((e) => String(e));
    line += ` | e2 ${row.sanity.e2} m${spec.split("-")[1] - 1} ${row.sanity.last}`;
  }
  console.log(line);
  results.push(row);
  await page.close();
}
await browser.close();
server.close();
mkdirSync(resolve(repo, "results/raw"), { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
writeFileSync(resolve(repo, `results/raw/plan5-baseline-${stamp}.json`), JSON.stringify({ date: stamp, steps: STEPS, standalone, results }, null, 1));
