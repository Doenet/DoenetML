# @doenet/benchmark

The performance suite: how the JS core, the Rust core and the cells core
compare on tick, load and memory, what each can run, and whether each
meets the product budgets in a real page, and where the cells viewer's load
spends its time, step by step (the trace layer). `METHOD.md` says what is
measured and why; this file says how to run it. The results are in
`results/README.md`, one directory per run.

## A run

A run measures every core on one machine at one commit. Build each core
as `METHOD.md` asks (the Rust core and the cells core in
release), then:

```bash
npm run node -- --machine=<id>      # the comparison and coverage (Node)
npm run render                      # the run's pages and the index
```

`<id>` names the machine: lowercase letters, digits and dashes, the same
every time you run on it. The run lands in
`results/runs/<date>-<id>-<commit>/`; commit it with its pages. A
trace-only run replaces the machine's previous one (`METHOD.md`).

Options: `--cores=javascript,cells` (default all three), and
`--fixtures=depth,rebuild-1000,homework`, a list of fixture names or whole
shapes. `BENCH_SIZES=10,100` replaces the sizes, to check the harness
quickly; such a run is not one to keep.

The driver, `src/run.mjs`, measures each core's adapter floor, then every
fixture across the cores in turn, each in its own process running
`src/measure-one.ts`, prebundled by `scripts/bundle-driver.mjs` into
`packages/doenetml-worker-javascript/.bench/` (rebuilt when a source is
newer) over that package's test utilities (`DOENET_TEST_CORE` selects the
core; the Rust and cells adapters are `test-core-rust.ts` and
`test-core-cells.ts` there). A record in `node.json`:

| Field                             | Meaning                                                                                                                                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                          | `ok`; `unsupported` (the adapter refused the document or the action: a gap, not a failure); `timeout`, with the `stage` that ran out of time (`load` after 120 s, `tick` after 15 s); `error`, with its `message`; `skipped`, with the `reason` (a smaller size of the shape it could not finish, or could barely load). |
| `parse_ms`                        | The text to normalized DAST, by `@doenet/parser` alone.                                                                                                                                                                                                                                                                  |
| `load_ms`                         | `createTestCore` on the text: parse, core construction and the first state.                                                                                                                                                                                                                                              |
| `heap_bytes`                      | JS heap growth across the load, after a forced GC on each side.                                                                                                                                                                                                                                                          |
| `wasm_bytes`                      | Wasm linear memory after the load. The JS core's is the Rust binding its worker holds for DAST normalization.                                                                                                                                                                                                            |
| `warmup_ms`, `samples_ms`         | The warm-up ticks and the timed ticks of the primary action.                                                                                                                                                                                                                                                             |
| `check`                           | The value check: `ok`, the `values` read and the `expected` ones. Real documents have none.                                                                                                                                                                                                                              |
| `state_bytes`, `state_gzip_bytes` | The session's saved state after the ticks. The JS core's is the `coreState` of its persistence payload; `state_envelope_bytes` is the whole payload a host stores.                                                                                                                                                       |
| `error_components`                | Error components in the loaded document, where the core can report them; real documents only, since a shape's value check already says whether the work was done.                                                                                                                                                        |

## The browser layer

```bash
npm run build -w packages/standalone -w packages/cells-viewer -w packages/doenetml-prototype
npm run build:rust-viewer
BENCH_MACHINE=<id> BENCH_CORES=javascript,rust,cells BENCH_FIXTURES=depth,homework npm run browser
BENCH_MACHINE=<id> npm run bundle
npm run render
```

`browser/perf.spec.ts` runs each fixture in each core's viewer under
headless Chromium, into the same day's run for the machine and commit
(`browser.json`): the JS core through the standalone bundle on
`browser/js.html`; the Rust core through the prototype viewer on
`browser/rust-viewer/`, with `browser/rust-adapter.js`; the cells core
through its viewer with `browser/cells-adapter.js`. All three implement one
`window.__bench` protocol (`load`, `locate`, `position`, `act`), served by
`browser/serve.mjs`.

| Field     | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `load_ms` | DoenetML text to first render: for the cells viewer its own `firstRender`; for the JS core from the render call to the first frame after the core is initialized and the fixture's target is in the DOM; for the Rust core to the first frame after its first flat DAST is in the viewer's store and the target is in the DOM.                                                                                                                                             |
| `drag`    | 60 real pointer moves paced at 16 ms. `latency` is, for each frame in which the dragged point moved on screen, the time since the oldest pointer move it answers. `frames / moves` says how many moves got a frame. For the cells core, `cells` adds the viewer's own per-tick core, commit and paint times. The prototype viewer lets JSXGraph move a dragged point before the core answers, so for the Rust core the point's position is the one the core last returned. |
| `steps`   | An action that is not a drag goes through the core (`act`), timed to the next animation frame (`frame`) and to a task after it (`paint`).                                                                                                                                                                                                                                                                                                                                  |

If this machine's Playwright is newer than its installed browsers, set
`BENCH_CHROMIUM` to an installed executable.

`src/bundle.mjs` measures everything a page fetches to render a document,
raw and brotli (quality 11), into the run's `bundle.json`: the JS core's
eager set, the whole standalone dist for context, the Rust wasm alone, the
Rust core's page, and the cells viewer build. A set whose dist is not
built is skipped.

Memory per viewer on a page is `packages/memory-benchmark`
(`--core cells` or `--core rust` for the scenarios with an equivalent).

## The trace layer

```bash
npm run build -w packages/cells-viewer
BENCH_MACHINE=<id> npm run trace
npm run render
```

`browser/trace.spec.ts` loads `homework` in the cells viewer, by
navigation, in every scenario `METHOD.md` describes (visits cold, warm,
hot and edit; the editor page and the viewer alone; CPU ×1 and ×4; the
document at several sizes), and records every step of the load with its
timing and work, and the main thread's work by kind from a Chrome trace,
into the run's `trace.json`. `npm run render` makes `trace.md`: the
waterfall of each visit (`trace-*.svg`), the steps' times side by side
across visits, pages, CPU rates and sizes, and the glossary of what every
step does and where its code is.

| Variable            | Default         | Meaning                                                      |
| ------------------- | --------------- | ------------------------------------------------------------ |
| `BENCH_TRACE_RUNS`  | `5`             | untraced runs per scenario; one traced run is made besides   |
| `BENCH_TRACE_CPU`   | `1,4`           | CPU throttling rates                                         |
| `BENCH_TRACE_SIZES` | `1,4,16`        | the sizes of `homework-x<n>` on the editor page              |
| `BENCH_TRACE_PAGES` | `editor,viewer` | the pages                                                    |

The traced runs' full Chrome traces are in `results/traces/<run>/`
(ignored by git); open one in Chrome's DevTools (Performance, Load
profile) to see every task. The same `cells:` steps show in the
Performance panel when recording the dev page by hand.

## Regressions

`scripts/perf-diff.sh [base] [fixtures]` compares the cells core on a base
commit with the working tree through the Node driver, interleaved, and
prints new/base ratios. Nothing it measures is committed.
