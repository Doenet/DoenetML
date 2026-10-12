// Baseline: load the same generated documents in the CURRENT DoenetML core
// (the standalone bundle from the sibling checkout, JS core) in headless
// Chromium, time startup, then time `movePoint` actions and a real pointer
// drag. Writes results/raw/baseline-<date>.json.
//
// Run from web/: node baseline/measure.mjs [spec,spec,...]
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
const SPECS = (process.argv[2] ?? process.env.CELLS_BASELINE_FIXTURES ?? "points-100,points-1000,points-10000,chain-100,chain-1000,chain-10000,fanout-100,fanout-1000").split(",");
const STEPS = 120;

if (!existsSync(resolve(standalone, "doenet-standalone.js"))) {
  console.error(`no standalone bundle at ${standalone}; build it with: npm run build -w @doenet/standalone (in ${doenetml})`);
  process.exit(2);
}

const MIME = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".map": "application/json", ".html": "text/html", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf" };

const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/standalone/style.css">
<script type="module" src="/standalone/doenet-standalone.js"></script>
<style>body{margin:16px} .jxgbox{width:400px;height:400px}</style>
</head><body><div id="viewer"></div>
<script>
window.__state = { init: null, error: null };
window.__load = async (spec) => {
  const source = await (await fetch("/doc?spec=" + encodeURIComponent(spec))).text();
  await new Promise((ok) => { const h = setInterval(() => { if (window.renderDoenetViewerToContainer) { clearInterval(h); ok(); } }, 20); });
  const t0 = performance.now();
  window.renderDoenetViewerToContainer(document.getElementById("viewer"), source, {
    addVirtualKeyboard: false,
    flags: { allowSaveState: false, allowSaveEvents: false, allowLoadState: false, allowLocalState: false, showCorrectness: false, showFeedback: false },
    initializedCallback: () => { window.__state.init = performance.now() - t0; },
    coreStartFailedCallback: (e) => { window.__state.error = String(e); },
  });
};
// Time movePoint actions through the core's own action API, and the DOM
// update that follows (last attribute mutation on the graph's ellipses).
window.__actions = async (name, steps) => {
  const idx = await window.resolvePath1(name);
  const graph = document.querySelector(".jxgbox");
  let lastMutation = 0;
  const obs = new MutationObserver(() => { lastMutation = performance.now(); });
  obs.observe(graph, { attributes: true, subtree: true });
  const samples = [];
  for (let i = 1; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const t = performance.now();
    await window.callAction1({ actionName: "movePoint", componentIdx: idx, args: { x: 5 * Math.sin(a), y: 5 * Math.sin(2 * a) } });
    const core = performance.now() - t;
    await new Promise((r) => requestAnimationFrame(r));
    const frame = performance.now() - t;
    samples.push({ core, frame, dom: lastMutation > t ? lastMutation - t : NaN });
  }
  obs.disconnect();
  return samples;
};
// Time slider changeValue actions (the current core's slider inverse, then
// whatever the slider is bound to), alternating between two values. For a
// repeat whose length the slider drives, each action is a structural change.
window.__sliderActions = async (name, values, steps) => {
  const idx = await window.resolvePath1(name);
  const graph = document.querySelector(".jxgbox");
  let lastMutation = 0;
  const obs = new MutationObserver(() => { lastMutation = performance.now(); });
  obs.observe(graph, { attributes: true, childList: true, subtree: true });
  const samples = [];
  for (let i = 1; i <= steps; i++) {
    const t = performance.now();
    await window.callAction1({ actionName: "changeValue", componentIdx: idx, args: { value: values[i % values.length] } });
    const core = performance.now() - t;
    await new Promise((r) => requestAnimationFrame(r));
    const frame = performance.now() - t;
    // Let the DOM settle before the next action.
    await new Promise((r) => setTimeout(r, 20));
    samples.push({ core, frame, dom: lastMutation > t ? lastMutation - t : NaN });
  }
  obs.disconnect();
  return samples;
};
window.__countMutations = (on) => {
  if (on) { window.__mut = 0; window.__obs = new MutationObserver((ms) => { window.__mut++; }); window.__obs.observe(document.querySelector(".jxgbox"), { attributes: true, subtree: true }); }
  else { window.__obs.disconnect(); return window.__mut; }
};
</script></body></html>`;

function legacyDoc(spec) {
  return execFileSync(docgen, ["--legacy", spec], { encoding: "utf8", maxBuffer: 1 << 28 });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(PAGE); }
  if (url.pathname === "/doc") { res.writeHead(200, { "content-type": "text/plain" }); return res.end(legacyDoc(url.searchParams.get("spec"))); }
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

function stats(xs) {
  const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!s.length) return { n: 0, mean: NaN, p50: NaN, p90: NaN, max: NaN };
  const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  return { n: s.length, mean: s.reduce((a, b) => a + b, 0) / s.length, p50: q(0.5), p90: q(0.9), max: s[s.length - 1] };
}

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const results = [];
for (const spec of SPECS) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  page.on("pageerror", (e) => console.log(`  [pageerror] ${e.message.slice(0, 200)}`));
  const t0 = Date.now();
  await page.goto(base + "/", { waitUntil: "load" });
  await page.evaluate((spec) => window.__load(spec), spec);
  try {
    await page.waitForFunction(() => window.__state.init !== null || window.__state.error !== null, null, { timeout: 300_000 });
  } catch {
    console.log(`${spec}: no initializedCallback after ${Date.now() - t0} ms; skipping`);
    results.push({ spec, error: "timeout" });
    await page.close();
    continue;
  }
  const state = await page.evaluate(() => window.__state);
  if (state.error) { console.log(`${spec}: core failed: ${state.error}`); results.push({ spec, error: state.error }); await page.close(); continue; }
  // initializedCallback can fire before the graph is in the DOM; wait for a point.
  try {
    await page.waitForSelector(".jxgbox ellipse", { timeout: 300_000 });
  } catch {
    console.log(`${spec}: initialized after ${state.init.toFixed(0)} ms but no graph point appeared; skipping`);
    results.push({ spec, init_ms: state.init, error: "no graph rendered" });
    await page.close();
    continue;
  }
  const firstPoint = Date.now() - t0;
  const ellipses = await page.locator(".jxgbox ellipse").count();

  if (spec.startsWith("sliderchain") || spec.startsWith("repeat")) {
    // Slider-driven shapes: time the slider's changeValue action instead of movePoint.
    const isRepeat = spec.startsWith("repeat");
    const n = Number(spec.split("-")[1]);
    const values = isRepeat ? [n - 1, n] : [3, 3.5];
    const steps = isRepeat ? 20 : STEPS;
    const actions = await page.evaluate(({ name, values, steps }) => window.__sliderActions(name, values, steps), { name: isRepeat ? "n" : "s", values, steps });
    const r = {
      spec, init_ms: state.init, first_point_ms: firstPoint, ellipses,
      slider: { core: stats(actions.map((s) => s.core)), dom: stats(actions.map((s) => s.dom)), frame: stats(actions.map((s) => s.frame)), structural: isRepeat },
    };
    results.push(r);
    console.log(`${spec}: init ${state.init.toFixed(0)} ms, first point ${firstPoint} ms; slider changeValue${isRepeat ? " (changes N)" : ""} p50 ${r.slider.core.p50.toFixed(2)} ms, dom p50 ${r.slider.dom.p50.toFixed(2)} ms, frame p50 ${r.slider.frame.p50.toFixed(2)} ms`);
    await page.close();
    continue;
  }

  const name = spec.startsWith("chain") ? "p" : "p0";
  const actions = await page.evaluate(({ name, steps }) => window.__actions(name, steps), { name, steps: STEPS });

  // Real pointer drag on p0/p at its known position; count DOM update batches.
  const box = await page.locator(".jxgbox").boundingBox();
  // Points start at known coords: points/fanout p0 at (0,0) or (x,0); chain p at (c, 1).
  // After __actions the point sits where the last action left it: (0, 0) since sin(2π)=0.
  const px = box.x + box.width / 2, py = box.y + box.height / 2;
  await page.evaluate(() => window.__countMutations(true));
  const td = Date.now();
  await page.mouse.move(px, py); await page.mouse.down();
  for (let i = 1; i <= STEPS; i++) await page.mouse.move(px + 100 * Math.sin(i / 10), py + 100 * Math.cos(i / 10));
  await page.mouse.up();
  const dragMs = Date.now() - td;
  const mutations = await page.evaluate(() => window.__countMutations(false));

  const r = {
    spec, init_ms: state.init, first_point_ms: firstPoint, ellipses,
    action: { core: stats(actions.map((s) => s.core)), dom: stats(actions.map((s) => s.dom)), frame: stats(actions.map((s) => s.frame)) },
    drag: { moves: STEPS, wall_ms: dragMs, mutation_batches: mutations, ms_per_move: dragMs / STEPS },
  };
  results.push(r);
  console.log(`${spec}: init ${state.init.toFixed(0)} ms, first point ${firstPoint} ms; movePoint p50 ${r.action.core.p50.toFixed(2)} ms, dom p50 ${r.action.dom.p50.toFixed(2)} ms, frame p50 ${r.action.frame.p50.toFixed(2)} ms; pointer drag ${r.drag.ms_per_move.toFixed(1)} ms/move (${mutations} DOM batches)`);
  await page.close();
}
await browser.close();
server.close();
const dir = resolve(repo, "results/raw");
mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
writeFileSync(resolve(dir, `baseline-${stamp}.json`), JSON.stringify({ date: stamp, steps: STEPS, standalone, results }, null, 1));
console.log(`wrote results/raw/baseline-${stamp}.json`);
