// Browser timings for the SIR simulation (fixtures/sir.doenet): load, a
// drag of the initial-infectives point, typing a parameter, changing the
// number of iterates (a rebuild) and the reset button, per backend.
//
// Run from web/ with the prototype served (pnpm build && pnpm preview):
//   node e2e/sir-perf.mjs
// CELLS_URL overrides the address (default http://localhost:4173);
// CELLS_CHROMIUM the browser (default /opt/pw-browsers/chromium, else
// Playwright's own); CELLS_E2E_BACKENDS the backends (default main,worker-sab).
// Writes results/raw/e2e-sir-<date>.json.
import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const base = process.env.CELLS_URL ?? "http://localhost:4173";
const exe = process.env.CELLS_CHROMIUM ?? "/opt/pw-browsers/chromium";
const BACKENDS = (process.env.CELLS_E2E_BACKENDS ?? "main,worker-sab").split(",");
const LOADS = 5, DRAG_STEPS = 120, TYPES = 10;

function stats(xs) {
  const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
  if (s.length === 0) return { n: 0 };
  const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  const r = (x) => Math.round(x * 100) / 100;
  return { n: s.length, p50: r(q(0.5)), p90: r(q(0.9)), max: r(s[s.length - 1]) };
}
// Typing into an input then leaving it commits it again on blur, a tick
// that changes nothing; those are left out of the typed ticks.
const effective = (samples) => samples.filter((s) => s.changed > 0 || s.rebuilt);
const summary = (samples) => Object.fromEntries(["core", "roundTrip", "commit", "frame", "paint", "changed"].map((k) => [k, stats(samples.map((s) => s[k]))]));

const browser = await chromium.launch(existsSync(exe) ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const ready = () => page.waitForFunction(() => window.__cells?.ready === true, null, { timeout: 120_000 });
const takeSamples = () => page.evaluate(() => {
  const s = window.__cells.store.samples.slice();
  window.__cells.store.samples.length = 0;
  return s;
});
const settle = () => page.evaluate(() => new Promise((ok) => requestAnimationFrame(() => setTimeout(ok, 0))));
/** Type into a named math input and commit, then wait for the tick's frame. */
async function type(name, text) {
  const input = page.locator(`input[data-name="${name}"]`);
  await input.fill(text);
  await input.press("Enter");
  await page.waitForFunction(() => {
    const s = window.__cells.store.samples;
    return s.length > 0 && Number.isFinite(s[s.length - 1].paint);
  });
  await settle();
}

const results = [];
for (const backend of BACKENDS) {
  const url = `${base}/?doc=sir&renderer=jsxgraph&backend=${backend}`;
  const loads = [];
  for (let i = 0; i < LOADS; i++) {
    await page.goto(url);
    await ready();
    loads.push(await page.evaluate(() => window.__cells.timings));
  }
  const r = { backend, load: {} };
  for (const k of ["fetch", "wasmInit", "coreTotal", "manifest", "firstRender"]) r.load[k] = stats(loads.map((t) => t[k]));
  r.load.coreBuild = stats(loads.map((t) => t.core.build));
  r.load.passes = loads[0].core.passes;
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  await settle();

  // Drag the infectives' point (styleNumber 2) up the y-axis and back, by
  // up to 25 px (about 800 people at the default scale). Much further and
  // S_t goes negative and the later iterates overflow, which is the
  // model's own behavior but leaves little to recompute.
  const at = await page.evaluate(() => {
    const comps = window.__cells.store.comps;
    for (let c = 0; c < comps.length; c++) {
      if (comps.componentType(c) === "point" && comps.attr(c, "styleNumber") === "2") return window.__cells.locate(c);
    }
    return null;
  });
  if (!at) throw new Error("no point to drag");
  await takeSamples();
  await page.mouse.move(at[0], at[1]);
  await page.mouse.down();
  for (let i = 1; i <= DRAG_STEPS; i++) {
    await page.mouse.move(at[0], at[1] - 25 * Math.sin((Math.PI * i) / DRAG_STEPS));
    await settle();
  }
  await page.mouse.up();
  await settle();
  r.drag = summary(await takeSamples());

  // A parameter: every iterate recomputes, nothing rebuilds.
  for (let i = 0; i < TYPES; i++) await type("b", i % 2 ? "0.0001" : "0.00012");
  r.typeB = summary(effective(await takeSamples()));

  // The number of iterates: a rebuild of the whole document.
  for (let i = 0; i < TYPES; i++) await type("nIterates", i % 2 ? "200" : "199");
  const rebuilds = effective(await takeSamples());
  r.typeNIterates = summary(rebuilds);
  r.typeNIterates.rebuilt = rebuilds.filter((s) => s.rebuilt).length;

  // Reset parameters, from 100 iterates back to 200 (also a rebuild).
  const resets = [];
  for (let i = 0; i < TYPES / 2; i++) {
    await type("nIterates", "100");
    await takeSamples();
    await page.click("button.triggerSet");
    await page.waitForFunction(() => {
      const s = window.__cells.store.samples;
      return s.length > 0 && Number.isFinite(s[s.length - 1].paint);
    });
    await settle();
    resets.push(...(await takeSamples()));
  }
  r.reset = summary(effective(resets));
  results.push(r);
  console.log(JSON.stringify(r, null, 1));
}
await browser.close();
const dir = resolve(here, "../../results/raw");
mkdirSync(dir, { recursive: true });
const file = resolve(dir, `e2e-sir-${new Date().toISOString().slice(0, 10)}.json`);
writeFileSync(file, JSON.stringify(results, null, 1));
console.log(`wrote ${file}`);
