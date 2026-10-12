// Visual parity (plan 7): render a handful of small documents in the current
// DoenetML viewer (the standalone bundle from the sibling checkout) and in
// each prototype renderer, and write one side-by-side PNG per document to
// results/screenshots/. Judged by eye; nothing here asserts.
//
// Run from web/ with the prototype served (npm run build && npm run preview):
//   node baseline/screenshots.mjs [name,name,...]
// CELLS_URL overrides the prototype's address (default http://localhost:4173).
import { chromium } from "@playwright/test";
import http from "node:http";
import { readFileSync, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "../..");
// The DoenetML monorepo this package lives in.
const doenetml = process.env.DOENETML_DIR ?? resolve(repo, "../..");
const standalone = resolve(doenetml, "packages/standalone/dist");
const cellsUrl = process.env.CELLS_URL ?? "http://localhost:4173";
const RENDERERS = (process.env.CELLS_RENDERERS ?? "svg,jsxgraph,jsxgraph-canvas").split(",");

/** Small documents both cores accept unchanged. */
export const DOCS = {
  point: `<graph><point x="3" y="4"/><point x="-5" y="-2"/></graph>`,
  offgraph: `<graph><point x="15" y="3"/><point x="-2" y="-14"/><point x="4" y="1"/></graph>`,
  segment: `<graph><lineSegment endpoints="(-6,-3) (4,5)"/></graph>`,
  line: `<graph><point name="a">(-4,-2)</point><point name="b">(3,5)</point><line through="$a $b"/></graph>`,
  circle: `<graph><point name="c">(1,2)</point><circle center="$c" radius="4"/></graph>`,
  polygon: `<graph><polygon vertices="(-6,-4) (5,-3) (2,6) (-4,3)"/></graph>`,
  panned: `<graph xmin="-3" xmax="17" ymin="-5" ymax="15"><point x="3" y="4"/><lineSegment endpoints="(0,0) (10,8)"/></graph>`,
};

if (!existsSync(resolve(standalone, "doenet-standalone.js"))) {
  console.error(`no standalone bundle at ${standalone}; build it with: npm run build -w @doenet/standalone (in ${doenetml})`);
  process.exit(2);
}

const MIME = { ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".map": "application/json", ".html": "text/html", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf" };

// Unlike measure.mjs, no size override: the board keeps Doenet's own default.
const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/standalone/style.css">
<script type="module" src="/standalone/doenet-standalone.js"></script>
<style>body{margin:16px}</style>
</head><body><div id="viewer"></div>
<script>
window.__state = { init: null, error: null };
window.__load = async (source) => {
  await new Promise((ok) => { const h = setInterval(() => { if (window.renderDoenetViewerToContainer) { clearInterval(h); ok(); } }, 20); });
  window.renderDoenetViewerToContainer(document.getElementById("viewer"), source, {
    addVirtualKeyboard: false,
    flags: { allowSaveState: false, allowSaveEvents: false, allowLoadState: false, allowLocalState: false, showCorrectness: false, showFeedback: false },
    initializedCallback: () => { window.__state.init = 1; },
    coreStartFailedCallback: (e) => { window.__state.error = String(e); },
  });
};
</script></body></html>`;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/") { res.writeHead(200, { "content-type": "text/html" }); return res.end(PAGE); }
  if (url.pathname.startsWith("/standalone/")) {
    const f = resolve(standalone, "." + url.pathname.slice("/standalone".length));
    if (!f.startsWith(standalone) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": MIME[extname(f)] ?? "application/octet-stream", "cache-control": "no-store" });
    return res.end(readFileSync(f));
  }
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const doenetBase = `http://127.0.0.1:${server.address().port}`;

const names = (process.argv[2] ?? Object.keys(DOCS).join(",")).split(",");
const out = resolve(repo, "results/screenshots");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function shootDoenet(source) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  page.on("pageerror", (e) => console.log(`  [doenet pageerror] ${e.message.slice(0, 200)}`));
  await page.goto(doenetBase + "/", { waitUntil: "load" });
  await page.evaluate((s) => window.__load(s), source);
  await page.waitForSelector(".jxgbox svg", { timeout: 120_000 });
  // Points, lines and axis ticks settle over a few frames.
  await page.waitForTimeout(1500);
  const png = await page.locator(".jxgbox").first().screenshot();
  await page.close();
  return png;
}

async function shootCells(source, renderer) {
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });
  page.on("pageerror", (e) => console.log(`  [cells pageerror] ${e.message.slice(0, 200)}`));
  await page.goto(`${cellsUrl}/?renderer=${renderer}&blank=1`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__cells !== undefined);
  await page.evaluate((s) => window.__cells.loadSource(s), source);
  await page.waitForFunction(() => window.__cells?.ready === true, null, { timeout: 60_000 });
  await page.waitForTimeout(500);
  const png = await page.locator(renderer === "svg" ? "svg.graph" : ".jxgbox").first().screenshot();
  await page.close();
  return png;
}

// Compose the panels into one PNG in the browser: label above each panel.
async function compose(name, panels) {
  const page = await browser.newPage({ viewport: { width: 2400, height: 700 } });
  const imgs = panels.map(([label, png]) => `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${png.toString("base64")}"></figure>`).join("");
  await page.setContent(`<html><body style="margin:0;background:#eee;font:14px sans-serif"><div id="row" style="display:inline-flex;gap:16px;padding:12px;align-items:flex-start">${imgs}</div><style>figure{margin:0;background:#fff;padding:6px}figcaption{padding-bottom:4px}</style></body></html>`);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  const png = await page.locator("#row").screenshot();
  await page.close();
  writeFileSync(resolve(out, `${name}.png`), png);
}

for (const name of names) {
  const source = DOCS[name];
  if (!source) { console.error(`unknown document ${name}`); continue; }
  const panels = [["Doenet (standalone)", await shootDoenet(source)]];
  for (const r of RENDERERS) {
    try {
      panels.push([`cells: ${r}`, await shootCells(source, r)]);
    } catch (e) {
      console.log(`  ${name} [${r}]: ${String(e).slice(0, 200)}`);
    }
  }
  await compose(name, panels);
  console.log(`${name}: ${panels.length} panels -> results/screenshots/${name}.png`);
}
await browser.close();
server.close();
