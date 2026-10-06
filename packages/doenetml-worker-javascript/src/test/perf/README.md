# Performance harness

Measures what a document makes the JavaScript core create, and how long it takes. It is the control for the component- and dependency-reduction work tracked in [#2125](https://github.com/Doenet/DoenetML/issues/2125); this directory is [#2126](https://github.com/Doenet/DoenetML/issues/2126).

Everything runs through the workspace test script, which rebuilds the Rust WASM first. A bare `vitest` does not, and then measures the previous build.

## The gate: `census.test.ts`

Sixteen one-construct documents (`MICRO_DOCUMENTS` in `fixtures.ts`), each snapshotted in `__snapshots__/census.test.ts.snap`: components by type, shadowing components, attribute components, `_copy` count, state variables allocated and resolved, dependencies. Component counts are deterministic for a given build, so a snapshot change is a change to what the core creates for a reference, an attribute or a repeat iteration. A change to a base class or to dependency setup looks different: `stateVariables` or `dependencies` moves in every entry at once while `components` and `byType` stay put. That is the expected shape of such a change, and the same update applies. It runs in the ordinary CI test groups.

When the change is intended, update the snapshot deliberately and paste the before/after rows in the PR:

```bash
npm run test -w @doenet/doenetml-worker-javascript -- --run src/test/perf/census.test.ts -u
```

## The instrument: `perf-bench.test.ts`

Loads each fixture once and reports the census, the wall-clock load time, the core's per-phase timings (`core.loadPhaseTimings`, recorded by `ComponentBuilder.addComponents` on the initial build) and the Rust resolver's call counts and times across the WASM boundary. For the drag fixture (`dot-plot-drag-50`, the 50-point dot plot `drag-bench.test.ts` drags) it then drags the point the fixture names (`Ps[1].P`) 25 times with transient `movePoint` actions, as the renderer sends on every pointermove, checks that the point moved, and reports the median wall-clock cost of one awaited move. That covers the state update and the renderer pull for visible graphs; the rest of the renderer update is deferred to a timer by design and is not in the number.

```bash
PERFBENCH_RESULT=/tmp/perf-bench.json \
    npm run test -w @doenet/doenetml-worker-javascript -- --run src/test/perf/perf-bench.test.ts
```

| variable                   | effect                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| `PERFBENCH_RESULT=<path>`  | required; the JSON result, one entry per fixture                   |
| `PERFBENCH_SUMMARY=<path>` | also append a markdown summary (CI points this at the job summary) |
| `PERFBENCH_ONLY=<regex>`   | only the fixtures whose name matches, e.g. `dot-plot-2`            |
| `PERFBENCH_PROFILE=1`      | CPU-profile each load and include self-time tables (slower)        |

Fixtures (`benchFixtures()`): the [#2023](https://github.com/Doenet/DoenetML/issues/2023) dot plot at 1, 2 and 4 plots, the 50-point drag dot plot from `drag-bench.test.ts`, the 150-iteration repeat document from `memory-bench.test.ts`, and the three author-reported slow documents of [#2101](https://github.com/Doenet/DoenetML/issues/2101) under `fixtures/`. The micro-documents are included as well, so one run gives the whole table.

Times are wall-clock milliseconds in node, not the browser worker. Compare ratios between runs on the same machine; do not compare against absolute numbers quoted in an issue. CI runs the bench on every pull request and writes the table to the job summary (the `Perf Bench` job), with the JSON as an artifact. The job asserts that every fixture loads without `_error` components and that the instrumentation came back populated (every phase recorded, resolver calls counted, a drag measured and the point moved on the drag fixture); counts and times are never asserted.

## Reading a profile

`profile.ts` reports _self_ time by file and function. Inclusive time is deliberately left out: the core's work crosses many `await`s and sampled stacks do not connect across them, so inclusive figures come out small and misleading.

## Helpers

- `census.ts`: `censusOfCore(core)` for the full census, `censusSummary` for the snapshotted subset, `listComponents(core)` for a one-line-per-component view of a small document, `censusMarkdownTable` for a table.
- `load-timing.ts`: `measureLoad(doenetML)` wraps `createTestCore` with the resolver timers.
- `profile.ts`: `profileAsync(fn)` and `formatProfile`.
- `fixtures.ts`: the documents.
