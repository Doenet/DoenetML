# Cells behind the shared renderer interface

Status: proposed 2026-10-28. Steps 1 to 5 are done; see Migration and
Measured. Whether the viewer is retired is still open.
The Measured section is filled in by step 5.

The cells core reaches DoenetML's renderers the way the other two cores
do: as a third core type (`"cells"`) behind the prototype's `CoreWorker`.
The renderer sees flat DAST, each component's props as its component
renderer declares them, and per-component updates after each tick, and it
sends renderer actions (`point.move {x, y}`). A **bridge** in the worker,
in TypeScript, turns the component table and each tick's changed cells
into that, and each renderer action into requests or an action. The core
itself stays cell-addressed: ADR 0001 is still its API, and the bridge is
its one caller in DoenetML.

We chose this because the cells core is meant to replace DoenetML's core
behind DoenetML's renderers, and the prototype's renderers are the ones
that are maintained; a renderer of the core's own (`packages/cells-viewer`)
has no owner once the core ships. The viewer is kept until step 5
compares the two paths, and whether it is retired is decided then.

## Decisions

- **Where the bridge lives.** In `packages/doenetml-worker`, beside the
  JavaScript core's bridge (`flatDastFromJS.ts`). The core gains no
  component vocabulary at its boundary.
- **Prop contracts.** A component's props are whatever its prototype
  component renderer declares: the Rust core's ts-rs types for the
  components that core has (`PointPropsInGraph`), the renderer's own data
  type for the rest (`TextInputData`). A component no renderer draws yet
  gets a contract in the same style when its renderer is ported (step 3).
  As the Rust core does, a component inside a graph gets its in-graph
  props, any other its in-text props.
- **Which cells a contract reads.** Every cell a contract reads is an
  output (ADR 0019): its prop is marked `rendered` in the component's
  definition. In development and in tests the bridge throws on a read of
  any other cell, as `CellStore.checkReads` does in the viewer.
  Presentational fields a cell does not hold (a label, `labelPosition`,
  `asToggleButton`) come from the element's literal attributes and
  children, which are document text, not state.
- **Element ids.** The bridge numbers elements by stable component
  identity (DAST node and scope, or a synthesized component's position
  under its parent), kept for the life of the document. Component indices
  move on a rebuild (ADR 0004); element ids do not, so a rebuild reaches
  the renderer as updates (`newChildren`, changed props, and new elements
  as `newFlatDastElement`), never as a new document.
- **Updates.** The bridge records which cells each element's props and
  children read. After a tick it recomputes the elements that read a
  changed cell (every element after a rebuild) and sends only the props
  whose value changed; a combined prop (`coords`) is sent whole.
- **Renderer actions.** A table keyed by component type and action name
  turns each into requests (a whole-shape drag into one point group) or a
  core action (`submit`, `trigger`). ADR 0018 still decides which cells a
  request may name. An unknown renderer action throws in development and
  tests and is dropped with a warning in production.
- **Components the renderer does not draw.** A component that only
  arranges others (a repeat's iterations, a collect, a group, a reactive
  choice's active case) is replaced by its children; one with no view (an
  award, a `<setup>`) and a hidden one are left out of its parent's
  children.
- **Diagnostics.** An `_error` component becomes an `"error"` element
  with its diagnostic's message; other diagnostics become the root's
  warnings. Accessibility findings are not sent: the renderer has nowhere
  to show them yet.
- **Worker calls.** `setSource`, `setFlags`, `returnDast`,
  `dispatchAction`, `resolvePath` (a name path from the document,
  whatever the origin), `terminate` and `submitAllAnswers`. Flags and
  locale are accepted and ignored; every other call throws "not supported
  by the cells core" until saved state is wired up.
- **The wasm.** The worker is one IIFE file, so the cells core's glue is
  bundled into it, but its `.wasm` is fetched only when a cells core is
  first loaded, from beside the worker script, as the Rust core's is.

## Considered options

- **Keep the viewer's cell-addressed renderers** (ADR 0001, 0010).
  Rejected as the long-term path: two renderers for one language, one of
  them with no owner. Kept for now as the baseline of the comparison.
- **The bridge on the main thread**, a shim with `CoreWorker`'s shape.
  ADR 0001 measured the worker hop at 1 to 10 ms per tick for under 3 ms
  of core work. Deferred, not rejected: it can replace the worker behind
  the same interface once the comparison says it is worth it.
- **The bridge in Rust**, the core emitting flat DAST. Rejected: it puts
  component vocabulary back into the core's boundary, which ADR 0001
  kept out.
- **Prop shapes of the cells core's own** (plain numbers for a point's
  coordinates). Rejected: the renderers would have to tell the cores
  apart, and the three would stop being interchangeable.

## Migration

1. The bridge and `coreType: "cells"`, on the components both sides draw.
2. The shared graph renderer redraws once per update batch, for all three
   cores, the pattern ADR 0010 measured (`jsxgraph/redraw.ts` in the
   prototype): a batch that creates or removes objects suspends the
   board's updates and runs one full update; any other redraws only the
   objects it changed.
3. Port the renderers the prototype lacks (circle, polygon, polyline, line
   segment, legend, slider, numberInput, mathInput, tuple, sideBySide,
   stack, spreadsheet, hint, ref) and give `line` and `answer`, which were
   stubs, real contracts. Where the JavaScript core already sends a
   component, its contract takes that core's prop names and shapes
   (`numericalPoints`, `legendElements`), so its renderer draws either
   core; a renderer whose element arrives without the props it needs draws
   nothing, as for an element with no renderer. Doenet's styles are not
   ported: every graph element is drawn in one style.
4. Move the viewer's interactive and output checks, its prerender tests
   and the benchmark's hook onto the prototype path. The checks are the
   bridge's (`cells/interactive.test.ts` in the worker): every renderer
   action it knows, on every element of the viewer's interactive document
   and of every golden document. The prerender test is the prototype's
   (`test/cells-prerender.test.tsx`), and it also fails when the bridge
   sends an element no renderer draws. The benchmark's prototype page runs
   the cells core with `?core=cells`, as the core `cells-prototype`.
5. Compare the two paths on the same fixtures and specs; record it below.

## Measured

`packages/benchmark/results/runs/2026-10-28-laptop-a528ef710-dirty`
(`browser.json`): headless Chromium on an Intel i7-10510U laptop, the
browser layer's `perf.spec.ts` with the core `cells` (the viewer) and
`cells-prototype` (the prototype's renderers through the bridge), the
code measured being this ADR's step 5 before it was committed. Load is
text to first render. A drag is 61 real pointer moves; its latency is to
the first frame that shows the point moved. Each tick is then split
(`breakdown`, p50 in ms): the core's tick; the bridge's updates; the
worker hop, the rest of the round trip from the action's dispatch to its
answer, which includes waiting behind earlier ticks still in the worker;
React, from the answer (in the viewer, from the board's redraw) to the
commit, store update included; and the board's redraw. In the viewer the
bridge and hop are nil and the board redraws before React commits.

| Fixture | Path | Load ms | Drag p50 / p95 ms | Core | Bridge | Hop | React | Redraw | Tick total |
|---|---|---|---|---|---|---|---|---|---|
| depth-1000 | viewer | 223 | 9.3 / 21.3 | 0.1 | — | — | 3.3 | 0.5 | 3.8 |
| | prototype | 1273 | 34.2 / 114.9 | 0.1 | 5.8 | 2.4 | 19.8 | 0.2 | 27.9 |
| breadth-1000 | viewer | 424 | 12.2 / 22.4 | 0.1 | — | — | 5.9 | 1.2 | 7.3 |
| | prototype | 1500 | 29.7 / 95.0 | 0.1 | 4.8 | 1.9 | 16.0 | 0.1 | 23.3 |
| inversion-1000 | viewer | 352 | 9.3 / 19.8 | 0.1 | — | — | 4.3 | 1.3 | 5.8 |
| | prototype | 1584 | 31.7 / 104.8 | 0.1 | 5.0 | 1.8 | 16.5 | 0.2 | 23.9 |
| symbolic-1000 | viewer | 563 | 56.1 / 103.6 | 39.1 | — | — | 9.0 | 0.8 | 48.4 |
| | prototype | 2201 | 115.2 / 3332.6 | 41.5 | 65.7 | 1909.8 | 19.5 | 0.2 | 2030.1 |
| rebuild-1000 | viewer | 217 | 13.1 / 44.0 | 0.1 | — | — | 0.4 | 0.1 | 0.7 |
| | prototype | 1791 | 82.1 / 235.1 | 2.8 | 15.4 | 28.9 | 7.4 | 0.1 | 55.1 |
| breadth-10000 | viewer | 962 | 83.2 / 111.2 | 0.2 | — | — | 33.8 | 4.4 | 38.6 |
| | prototype | 3219 | 258.2 / 446.9 | 0.3 | 47.3 | 222.3 | 162.6 | 0.2 | 424.9 |
| lesson | viewer | 124 | 2.5 / 5.0 | 0.1 | — | — | 0.7 | 0.2 | 1.0 |
| | prototype | 1024 | 17.7 / 50.3 | 0.1 | 0.1 | 2.3 | 0.8 | 0.1 | 3.3 |
| sir | viewer | 222 | 6.8 / 905.8 | 0.1 | — | — | 3.4 | 1.2 | 4.9 |
| | prototype | 1194 | 34.0 / 267.4 | 0.1 | 1.6 | 1.1 | 7.3 | 0.2 | 10.4 |
| homework | viewer | 158 | (steps) 17.0 | 0.1 | — | — | 0.4 | 0.0 | 0.6 |
| | prototype | 1024 | (steps) 16.5 | 0.1 | 0.1 | 0.2 | 0.4 | 0.0 | 0.7 |

`homework` is typed into and submitted, not dragged: its column is the
p50 to the next frame of typing into its math input, one frame on either
path. At 10,000 elements the prototype path ran out of the 15 s it has for
the drag on depth, inversion and rebuild (the viewer: 80 to 90 ms per
drag step; `rebuild-10000` 2.6 ms); `symbolic-10000` ran out on both.
`venn` is a trigger, which neither adapter carries out.

What the numbers say:

- **The core is the same.** Its share of a tick is equal on both paths.
  Everything the prototype path adds is around it.
- **Load costs about a second more**, a floor whatever the size:
  `homework` is 158 ms in the viewer and 1024 ms through the prototype.
  The worker's own share is small (encode, core and bridge together 47 ms
  for `homework`, 86 ms for `depth-1000`); the rest is starting the
  worker (a 7.8 MB script), fetching the core's WASM and the first render,
  not split further here.
- **A drag is about three times slower at 1,000 elements** (30 to 34 ms
  p50 against 9 to 12 ms), and the largest share is React and the store,
  not the worker: 16 to 20 ms against 3 to 6 ms in the viewer, which
  re-renders the same elements from cells without an immutable store
  update per element. Next come the bridge's diff (about 5 ms) and the
  hop (about 2 ms). The prototype's board redraw is cheaper than the
  viewer's (step 2).
- **At 10,000 elements the prototype path does not keep up.** Each part
  grows with the elements a drag changes (`breadth-10000`: bridge 47 ms,
  React 163 ms), and since the worker serializes ticks, the moves queue
  behind one another: the hop's 222 ms is mostly that wait. Where the
  core itself is slow (`symbolic-1000`, 41 ms a tick), the queue grows to
  seconds, which the viewer, ticking synchronously, never builds.
- **Real documents are fine on both paths**: a tick of `lesson`, `sir`
  or `homework` is under 11 ms p50 end to end through the prototype.

What would close the gap, if the prototype path stays: dropping moves
while a tick is in flight (the queue), a store update per tick rather
than an immutable copy per changed element, a cheaper diff in the bridge
than comparing serialized props, and the bridge on the main thread
(considered above) to remove the hop and the second of load.
