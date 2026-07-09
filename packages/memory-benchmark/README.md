# @doenet/memory-benchmark

Headless-browser memory benchmark for embedded DoenetML. It serves the built
`@doenet/standalone` bundle locally, loads it in headless Chromium under
several embedding scenarios, and reports steady-state memory per scenario.

This harness produced the baseline numbers in the memory meta-issue,
[Doenet/DoenetML#1441](https://github.com/Doenet/DoenetML/issues/1441). Re-run
it after changes tracked there to measure progress.

## Usage

```bash
# Builds @doenet/standalone first (via wireit), then runs all scenarios
npm run benchmark -w @doenet/memory-benchmark

# Custom instance counts, document-scaling sizes, or a custom document
node src/measure.mjs --counts 1,8
node src/measure.mjs --sizes 25,100,500
node src/measure.mjs --doenetml path/to/doc.doenetml
```

Playwright's Chromium must be installed once: `npx playwright install chromium`.

## Scenarios

| Scenario   | What it models                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------- |
| `blank`    | Browser baseline, no DoenetML                                                                                   |
| `direct-N` | N viewers sharing one realm (`renderDoenetViewerToContainer` on one page)                                       |
| `iframe-N` | N viewers in one iframe each, the way `@doenet/doenetml-iframe` and PreTeXt embed documents                     |
| `repeat-S` | One viewer with a generated `<repeatForSequence>` document of S iterations (≈4S components) — document scaling |

Each scenario runs in a fresh browser instance. The harness waits for every
core to report ready (`initializedCallback`), lets workers/MathJax settle,
forces a GC, then measures.

## Metrics

- **`totalPssMB`** (Linux only, the primary metric): PSS summed over the whole
  browser process tree, from `/proc/<pid>/smaps_rollup`. PSS apportions shared
  pages among sharers, so totals are meaningful across multi-process Chromium.
  Also broken down by process type (`byType`).
- **`mainRealmJsHeapMB`**: the top page realm's `performance.memory` JS heap.
  Note this does *not* include worker heaps, so it dramatically understates
  per-instance cost — use PSS for conclusions.
- **`workers` / `frames`**: live worker and frame counts (each viewer boots a
  core worker; MathJax v4 adds one worker per realm).

The summary printed to stderr includes the **marginal cost per additional
instance** for both embedding styles and the **document-scaling cost** of each
`repeat-S` scenario over the small document — the headline numbers tracked in
Doenet/DoenetML#1441.

## Baseline (2026-07, @doenet/standalone 0.7.20)

| Scenario   | totalPssMB | headline                                        |
| ---------- | ---------- | ----------------------------------------------- |
| blank      | 207        | —                                               |
| direct-1   | 552        | first instance ≈ +345 MB                        |
| iframe-1   | 554        | —                                               |
| direct-4   | 944        | ≈ +131 MB per additional direct instance        |
| iframe-4   | 1153       | ≈ +200 MB per additional iframe instance        |
| repeat-25  | 766        | ~100 components: ≈ +214 MB over the small doc   |
| repeat-250 | 2046       | ~1000 components: ≈ +1494 MB over the small doc |

In the `repeat` scenarios the main realm's JS heap grows only 78 → 93 MB
while the renderer process grows by ~1.5 GB — i.e. essentially all of the
document-scaling cost is inside the core worker, which is what
Doenet/DoenetML#1428–#1431 target.

## Caveats

- PSS requires Linux (`/proc`). On other platforms only the JS-heap metric is
  reported.
- Results vary a few percent run to run; compare like against like on the same
  machine, and prefer the marginal (slope) numbers over absolute totals.
- The default document is small; document-scaling costs (component tree,
  dependency graph in the worker) need a larger `--doenetml` to show up.
