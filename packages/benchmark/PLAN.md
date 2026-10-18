# Plan 8: the performance suite

This file records the decisions reached before implementation, in a
grilling session on 2026-10-14. The request: five measurements matter for
DoenetML (update time, load time, memory, state storage size, bundle size);
decide which performance tests are actually needed. They may be fewer than
the cells prototype had, and different.

## The questions

1. Which of the prototype's measurements survive, now that the questions
   they answered (plans 2 through 6, before the core joined this repository) are
   settled?
2. How do the three cores (the JS core in `doenetml-worker-javascript`, the
   Rust core in `doenetml-worker-rust`, the cells core in `cells-core`)
   compare on the five measurements, on documents Doenet actually needs?
3. What does each measurement mean precisely: where the clock starts, what
   "the state" is, what "the bundle" is, which memory?

## Background found before planning

- **The prototype's suite** (then in `packages/cells-core/crates/cells-bench`
  and a Playwright spec in the cells viewer, both deleted in step 6 below): three criterion benches
  (startup, tick, rebuild) sweeping about 25 fixture shapes by size,
  evaluator and wire format; a `regress` example printing load, tick and
  bytes per fixture as JSON lines; `scripts/perf-diff.sh` running it on a
  base commit and the working tree; `sir_perf` for one document; a
  Playwright spec sampling core, React commit and frame latency per drag
  step. Nothing measures state storage or bundle size.
- **The Rust core computes nothing in production.** The parity dashboard
  (`packages/rust-parity`, 2026-09-25) reports 0 of 266 components
  complete and 18 partial. The viewer forces the JS core and uses the Rust
  wasm only for DAST normalization and name resolution. It has criterion
  benches on thousand-chain and thousand-star documents and a PreTeXt
  sample article (`lib-doenetml-core/benches/samples`).
- **One core-only driver already exists.** The JS worker's test suite runs
  against any of the three cores through a shared interface (load a
  document, request an action, read state): `test-core-rust.ts` and
  `test-core-cells.ts` in `packages/doenetml-worker-javascript/src/test/utils`,
  selected by `DOENET_TEST_CORE`. Two gated vitest benchmarks sat beside
  them, also deleted in step 6: `drag-bench.test.ts` (50-point dot plot) and
  `memory-bench.test.ts` (Node heap on a Venn document and a 150-iteration
  repeat).
- **Saved state in the JS core** is produced by `buildDocStatePayload` in
  `src/core/StatePersistence.ts`: `coreState` is JSON of essential
  state-variable changes keyed by component id, plus a core-info blob.
  The cells core has `set_essential` but no serialization.
- **`packages/memory-benchmark`** measures proportional set size over the
  whole Chromium process tree (Linux only) and main-realm JS heap, under
  embedding scenarios (N viewers direct, in iframes, cross-origin, shared
  worker) and a document-scaling `repeat-S` scenario. It is hardwired to
  the standalone viewer and the JS core.
- **Bundle budgets** are raw bytes in `packages/standalone/bundle-budgets.json`
  and are checked in CI: about 4.5 MB for the eager chunk, 7.4 MB for the
  worker, 11.5 MB for the single-file variant. The cells viewer build is a
  2.6 MB wasm plus 1.2 MB of JS, unbudgeted; the wasm size suggests
  wasm-opt is still off and symbols are in. Nothing timing-related runs in
  CI.
- **The 2026-10-09 prototype results** are frozen in the prototype's
  `RESULTS.md`, which is not in this repository; they are the cross-check
  for the first run.

## Decisions

### Purpose

- **A maintained decision suite, not a regression gate.** It compares the
  three cores and is re-run as the cells core closes gaps (lists,
  choiceInput, chart); raw results are committed so the tables stay
  current. Decision sweeps for a single architectural question are written
  when the question arises and discarded with it, as the prototype did.
- **No pass/fail on timings.** Product budgets appear on the tables as
  reference lines. The only check that fails is bundle size, which already
  exists.

### Layers

- **Core-only in Node, all three cores,** through the shared test-core
  interface. This is the apples-to-apples comparison.
- **Browser end-to-end through Playwright, all three cores,** each
  through its own viewer: the Rust core through the prototype viewer
  (`packages/doenetml-prototype`), which renders its flat DAST. (Added
  2026-10-16; the first runs left the Rust core to the core-only tables.) The standalone viewer gets an opt-in timing
  hook, behind a flag, equivalent to the cells viewer's `window.__cells`
  (ready, locate a component, per-tick samples), so the two columns mean
  the same thing. If a hook in the shipped package is unwelcome, the
  fallback is Playwright timing pointer event to paint, which gives frame
  latency only.

### Corpus

- **Real documents, one size each:** `sir` (simulation, repeat-heavy),
  `adventure` (conditional content), the Venn document from the JS memory
  bench (graph with answers), the PreTeXt sample article (prose, what
  PreTeXt embeds), and a homework page of a dozen problems with math
  inputs and answers, written for the suite unless an existing one is
  named.
- **Synthetic shapes, three sizes each:** chain (depth), fanout (breadth),
  repeat (rebuild), symbolic chain, answers. One shape per mechanism; the
  other prototype shapes answered settled questions. The Rust core's
  thousand-chain and thousand-star documents join this set so it has rows
  it can run.
- **Blanks are results.** A document a core cannot run is blank with the
  reason (unsupported). A measurement exceeding 60 s is shown as "> 60 s".
- **Per-fixture manifest.** Each fixture carries the drag target (the
  default action) or an override where a drag cannot reach the mechanism:
  typing into a math input for the symbolic chain, submitting for the
  answers shape, changing the count for the repeat. It also names the
  structural change where one exists. The same manifest drives the Node
  driver for all three cores and the browser harness, so rows are
  comparable by construction.

### The five measurements

1. **Update time.** Node: median per-action time for the manifest's action.
   Browser: core time, React commit, and frame latency per step. Structural
   update means the repeat-count rebuild only.
2. **Load time.** Node: text-to-DAST and DAST-to-document as separate
   stages, so a parser regression is not blamed on a core. Browser: text
   to first render.
3. **Memory.** Node: JS heap delta after GC plus wasm memory length, as two
   columns and a sum (the Rust cores keep everything in wasm memory, which
   Node's heap figure omits). Browser: `memory-benchmark` made
   core-selectable, with the JS-core-only scenarios (shared worker) blank
   for cells.
4. **State storage size.** Raw and gzipped bytes of the serialized state
   after the manifest's actions have run (at load both cores are empty).
   The cells core serializes JSON keyed by essential key (DAST node, prop,
   scope id), one entry per changed essential cell, covering dragged
   values, typed inputs, choices and submitted answers; a binary form is a
   follow-up only if the number is bad. The JS core's figure is the byte
   length of its `coreState` string at the same point.
5. **Bundle size.** Raw and brotli bytes of everything a page fetches to
   render a document, per core. Today: standalone's eager chunk plus worker
   plus wasm, against cells-viewer's wasm plus JS. Once the cells core is
   wired into standalone, the number that decides anything is the delta it
   adds, because a page pays for both cores during the transition.

### Reference budgets

Documentation, not gates; revise after the first run.

| Measurement | Budget |
|---|---|
| Interactive tick, browser frame latency | 16 ms (one vsync) |
| Structural tick, browser | 50 ms |
| Load, text to first render, homework page | 100 ms: no loading screen |
| Memory, marginal per viewer on a page | 20 MB |
| State storage, homework page after the script | 2 KB raw |
| Bundle, brotli, everything a page fetches | 1 MB |

### Package and tooling

- **`packages/benchmark`** holds the Node driver, fixtures and manifests,
  the Playwright harness, the renderer, committed raw results (one JSON
  file per run) and the rendered Markdown tables. It is not under any one core
  because it is about three. `memory-benchmark` stays a separate package
  (its axis is embedding, not cores) and gains a core switch.
- **One native driver.** The prototype's `regress` example folds into the
  Node driver's role: one tool prints load, tick, rebuild and memory per
  fixture as JSON records; `perf-diff.sh` becomes a thin wrapper that runs
  it on a base commit and the working tree.
- **Deletions, deferred one commit.** The criterion benches (startup, tick,
  rebuild), `sir_perf`, and `cells-viewer/e2e/perf.spec.ts` are deleted in
  the commit that lands the first table, after one cross-check of the
  cells column against the prototype's `RESULTS.md`.
- **CI.** Only the brotli measurement joins the existing standalone size
  check, with the budget-in-the-diff convention. Timings do not run in
  CI.

## Order of work

1. Manifest format and the corpus (fixtures copied or generated, the
   homework page written).
2. Node driver over the shared test-core interface: update, load stages,
   memory; results as JSON records.
3. State serialization in the cells core; storage-size measurement for
   both cores.
4. Bundle measurement (raw and brotli) and the CI hook.
5. Browser harness: the standalone viewer's timing hook, one Playwright
   spec parameterized by core, `memory-benchmark` core switch.
6. Renderer, first committed run, cross-check against the prototype's tables, delete
   the prototype suites.

## Out of scope

- Comparing evaluators or wire formats; settled in the prototype.
- A binary state format; follow-up only if JSON is too large.
- The delta the cells core adds to standalone; measured when the wiring
  exists.
- Any timing in CI.

## Status (2026-10-15)

All six steps are done; `results/RESULTS.md` holds the first tables and
`results/NOTES.md` the reading of them and the cross-check against the
prototype's tables. Deviations from the plan above: the PreTeXt sample article is
PreTeXt XML, not DoenetML, so a written lesson stands in for it; the
synthetic shapes are generated by the suite itself (`src/generate.mjs`) in
DoenetML every core reads, not by cells-docgen; the Node driver (not a
native binary) is the one driver, and `perf-diff.sh` wraps it; the Rust
core fills cells only where the driver translates the action names its
test adapter forwards unchanged (`move`, `updateImmediateValue`) and the
document avoids math inputs; a `points` shape was added as the one
fixture every core runs. Follow-ups: the delta the cells
core adds to standalone once wired in; state for iterations removed before
a save; a `mod` function in cells math cells so the memory benchmark's
repeat document loads; the saved-state kind of a text answer's submitted
cell (a string id saved as a number); `updateSelectedIndices` in the cells
test adapter for choice inputs; `<em>` and `<styleDefinition>` for the
other two real documents.
