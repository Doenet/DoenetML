// Differential test: the same slider documents and the same sequence of
// requests, run through the current DoenetML core (standalone bundle in
// headless Chromium) and through the prototype (crates/cells-bench
// examples/scenario_run), comparing the observed values after every step.
//
// Run from web/: node baseline/slider-diff.mjs
// Writes results/raw/slider-diff-<date>.json and prints a per-step table.
import { chromium } from "@playwright/test";
import http from "node:http";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
const doenetml = process.env.DOENETML_DIR ?? resolve(repo, "../../ml");
const standalone = resolve(doenetml, "packages/standalone/dist");
const runner = resolve(repo, "target/release/examples/scenario_run");
if (!existsSync(resolve(standalone, "doenet-standalone.js"))) {
  console.error(`no standalone bundle at ${standalone}`);
  process.exit(2);
}
if (!existsSync(runner)) {
  console.error(`build the prototype runner first: cargo build --release -p cells-bench --example scenario_run`);
  process.exit(2);
}

// Scenarios are written in the prototype's dialect; the current core's
// version replaces numberInput with mathInput (prefill). Steps name a
// slider (driven by its changeValue action) or an input (driven by the
// mathInput's updateRawValue + updateValue actions).
const SCENARIOS = [
  {
    name: "plain slider: snap and clamp",
    doc: `<slider name="s" from="0" to="10" step="1" initialValue="3"/>`,
    observe: ["s"],
    steps: [["s", 3.7], ["s", 15], ["s", -3], ["s", 2.5], ["s", 0.4999], ["s", 7.5], ["s", 3]],
  },
  {
    name: "fractional step: item count",
    doc: `<slider name="s" from="0" to="0.7" step="0.1"/>`,
    observe: ["s"],
    steps: [["s", 0.66], ["s", 0.34], ["s", 0.05], ["s", 2]],
  },
  {
    name: "off-grid initial value",
    doc: `<slider name="s" from="0" to="10" step="2" initialValue="3"/><number name="v">$s</number>`,
    observe: ["s", "v"],
    steps: [["s", 3], ["s", 5]],
  },
  {
    name: "bound to an input: slider writes snapped, input keeps raw",
    doc: `<numberInput name="n" value="2"/><slider name="s" from="0" to="20" step="1" bindValueTo="$n"/>`,
    observe: ["n", "s"],
    steps: [["s", 7.4], ["n", 7.4], ["n", 25], ["s", 7.6], ["n", -3], ["s", 2]],
  },
  {
    name: "bound to a derived number: chain continues into the input",
    doc: `<numberInput name="n" value="1"/><number name="d">2$n</number><slider name="s" from="0" to="20" step="1" bindValueTo="$d"/>`,
    observe: ["n", "d", "s"],
    steps: [["s", 7.4], ["n", 2.3], ["s", 0]],
  },
  {
    name: "slider bound to a slider with a different step",
    doc: `<slider name="fine" from="0" to="10" step="0.5" initialValue="3"/><slider name="coarse" from="0" to="10" step="2" bindValueTo="$fine"/>`,
    observe: ["fine", "coarse"],
    steps: [["coarse", 5.3], ["fine", 3.6], ["coarse", 0], ["fine", 9.9]],
  },
  {
    name: "step bound to another slider",
    doc: `<slider name="st" from="1" to="4" step="1" initialValue="2"/><slider name="s" from="0" to="10" step="$st" initialValue="7"/>`,
    observe: ["st", "s"],
    steps: [["st", 3], ["s", 5], ["st", 1], ["s", 5.4]],
  },
  {
    name: "non-finite requests",
    doc: `<slider name="s" from="0" to="10" step="1" initialValue="4"/>`,
    observe: ["s"],
    steps: [["s", "NaN"], ["s", "Infinity"], ["s", "-Infinity"], ["s", 6]],
  },
  {
    name: "input bound through slider: NaN from an emptied input",
    doc: `<numberInput name="n" value="3"/><slider name="s" from="0" to="10" step="1" bindValueTo="$n"/>`,
    observe: ["n", "s"],
    steps: [["n", "NaN"], ["s", 4]],
  },
];

function legacyDoc(doc) {
  return doc.replace(/<numberInput ([^>]*)value="/g, '<mathInput $1prefill="');
}
function num(v) {
  if (v === "NaN") return NaN;
  if (v === "Infinity") return Infinity;
  if (v === "-Infinity") return -Infinity;
  return v;
}

const MIME = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".map": "application/json", ".html": "text/html", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf" };
const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/standalone/style.css">
<script type="module" src="/standalone/doenet-standalone.js"></script>
</head><body><div id="viewer"></div>
<script>
window.__state = { init: null, error: null };
window.__load = async (source) => {
  await new Promise((ok) => { const h = setInterval(() => { if (window.renderDoenetViewerToContainer) { clearInterval(h); ok(); } }, 20); });
  window.renderDoenetViewerToContainer(document.getElementById("viewer"), source, {
    addVirtualKeyboard: false,
    flags: { allowSaveState: false, allowSaveEvents: false, allowLoadState: false, allowLocalState: false, showCorrectness: false, showFeedback: false },
    initializedCallback: () => { window.__state.init = true; },
    coreStartFailedCallback: (e) => { window.__state.error = String(e); },
  });
};
// Numeric value of a component's "value" state variable; math trees that are
// plain numbers come back as numbers, anything else as null.
window.__read = async (names) => {
  const all = await window.returnAllStateVariables1();
  const out = [];
  for (const name of names) {
    const idx = await window.resolvePath1(name);
    let v = all[idx]?.stateValues?.value;
    if (v && typeof v === "object" && "tree" in v) v = v.tree;
    out.push(typeof v === "number" && Number.isFinite(v) ? v : null);
  }
  return out;
};
window.__step = async (target, value) => {
  const idx = await window.resolvePath1(target);
  const all = await window.returnAllStateVariables1();
  const type = all[idx].componentType;
  if (type === "slider") {
    await window.callAction1({ actionName: "changeValue", componentIdx: idx, args: { value } });
  } else {
    // mathInput: type the text, then commit it.
    await window.callAction1({ actionName: "updateRawValue", componentIdx: idx, args: { rawRendererValue: String(value) } });
    await window.callAction1({ actionName: "updateValue", componentIdx: idx, args: {} });
  }
};
</script></body></html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(PAGE); }
  if (url.pathname.startsWith("/standalone/")) {
    const f = resolve(standalone, url.pathname.slice("/standalone/".length));
    if (existsSync(f)) { res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream" }); return res.end(readFileSync(f)); }
  }
  res.writeHead(404); res.end();
});
await new Promise((ok) => server.listen(0, ok));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const results = [];
let mismatches = 0;
const fmt = (v) => (v === null ? "NaN" : Number.isInteger(v) ? String(v) : v.toPrecision(6));
const same = (a, b) => (a === null && b === null) || (a !== null && b !== null && Math.abs(a - b) < 1e-9);

for (const sc of SCENARIOS) {
  // Prototype.
  const proto = JSON.parse(execFileSync(runner, { input: JSON.stringify({ doc: sc.doc, steps: sc.steps.map(([target, value]) => ({ target, value })), observe: sc.observe }), encoding: "utf8" }));
  // Current core.
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message.slice(0, 200)}`));
  await page.goto(base + "/", { waitUntil: "load" });
  await page.evaluate((src) => window.__load(src), legacyDoc(sc.doc));
  await page.waitForFunction(() => window.__state.init !== null || window.__state.error !== null, null, { timeout: 120_000 });
  const err = await page.evaluate(() => window.__state.error);
  if (err) { console.log(`${sc.name}: current core failed: ${err}`); results.push({ name: sc.name, error: err }); await page.close(); continue; }
  await page.waitForTimeout(300);
  const legacy = { initial: await page.evaluate((n) => window.__read(n), sc.observe), steps: [] };
  for (const [target, value] of sc.steps) {
    await page.evaluate(({ t, v }) => window.__step(t, v), { t: target, v: num(value) });
    await page.waitForTimeout(50);
    legacy.steps.push({ values: await page.evaluate((n) => window.__read(n), sc.observe) });
  }
  await page.close();

  console.log(`\n== ${sc.name}  (observe: ${sc.observe.join(", ")})`);
  const row = (label, a, b) => {
    const ok = a.every((x, i) => same(x, b[i]));
    if (!ok) mismatches++;
    console.log(`  ${label.padEnd(22)} proto [${a.map(fmt).join(", ")}]  js [${b.map(fmt).join(", ")}]${ok ? "" : "   <-- differs"}`);
    return ok;
  };
  const rows = [{ label: "initial", ok: row("initial", proto.initial, legacy.initial) }];
  sc.steps.forEach(([target, value], i) => {
    rows.push({ label: `${target} <- ${value}`, ok: row(`${target} <- ${value}`, proto.steps[i].values, legacy.steps[i].values), dropped: proto.steps[i].dropped });
  });
  results.push({ name: sc.name, doc: sc.doc, observe: sc.observe, proto, legacy, rows });
}
await browser.close();
server.close();
const dir = resolve(repo, "results/raw");
mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
writeFileSync(resolve(dir, `slider-diff-${stamp}.json`), JSON.stringify({ date: stamp, results }, null, 1));
console.log(`\n${mismatches} differing step(s); wrote results/raw/slider-diff-${stamp}.json`);
