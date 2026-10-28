# Cells behind the shared renderer interface

Status: proposed 2026-10-28. Steps 1 to 3 of 5 are done; see Migration.
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
  `dispatchAction`, `terminate` and `submitAllAnswers`. Flags and locale
  are accepted and ignored; every other call throws "not supported by the
  cells core" until saved state is wired up.
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
   and the benchmark's hook onto the prototype path.
5. Compare the two paths on the same fixtures and specs; record it below.

## Measured

To be filled in by step 5: first render, drag p50 and p95, and each
tick's time in the core, the bridge, the worker hop, Redux and React, and
the board redraw, for the viewer and for the prototype path.
