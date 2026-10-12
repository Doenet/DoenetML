# Plan 7: a renderer that looks like Doenet's, and what it costs

This file records the decisions reached before implementation. There is no
separate brief; the request was "the renderer is now the bottleneck; explore
ways to make it faster, and make the output look the same as Doenet's
renderers." Vocabulary is in `CONTEXT.md` (**Renderer**, **Component
renderer**). The verdict goes in the "Plan 7" section of `results/NOTES.md`.

## The questions

1. How fast is a renderer that looks like Doenet's (JSXGraph) on the fixtures
   where the plain SVG renderer is already the limit?
2. How much of that cost is JSXGraph, and how much is the update path around
   it?
3. Where should speed work go next, if anywhere?

## Background found before planning

- **The prototype renderer** is React 19 with per-cell subscriptions
  (`useCell` over `useSyncExternalStore`), 32-ary child chunking, and children
  keyed by stable identity (DAST node plus scope). Graphs are hand-drawn
  SVG at 400×400. Math is plain text.
- **Where it is the limit** (main thread, p50; `results/raw/e2e-2026-10-03`
  and `-10-09`): `fanout-10000` drag 69 ms commit / 124 ms frame;
  `repeat-10000` rebuild 270 ms commit (core 18 ms); `hidden-1000` toggle
  23 ms commit for one changed cell; `wording-10000` choice flip 573 ms
  commit; first render of `fanout-10000` 219 ms.
- **Doenet's renderers** (`~/doenet/ml/packages/doenetml/src/Viewer/renderers/`):
  React 19 with Redux, one lazy-loaded `.tsx` per component type, JSXGraph
  1.12.2 for graphs.
  - Graph children update JSXGraph in the render body
    (`coords.setCoordinates`, `visProp` writes, `setAttribute` only on change,
    then `el.update()` and `board.updateRenderer()` per component).
  - Points are a fixed visible point plus an invisible draggable shadow
    point; drags send `movePoint` with `transient`/`skippable`, and the
    visible point moves when core answers.
  - Core coalesces: skippable actions are dropped while one is in flight;
    the dragged component's update is sent first and the rest after 150 ms
    of quiet (`RendererInstructionBuilder.ts`).
  - Look: `DEFAULT_STYLE_VALUES` (`utils/src/style/styleDefinitionHelpers.ts`)
    and the palette in `utils/src/style/palettes/default.ts`; attribute
    builders in `renderers/utils/buildGraphicalAttributes.ts`; axes in
    `renderers/utils/jsxgraph.ts`. Graph defaults: -10..10, navigation shown,
    no grid, 425 px square.
  - Known slow paths noted in comments: `setAttribute({visible})`, label
    updates.
- **The baseline harness** (`web/baseline/measure.mjs`) already loads Doenet's
  standalone bundle and draws real JSXGraph boards, but forces `.jxgbox` to
  400×400 in its CSS.

## Decisions

- **Staged.** Port first, measure the gap against the SVG renderer on the
  same fixtures, then decide where speed work goes.
- **JSXGraph itself, for graphical components only.** Graph, point, line,
  line segment, circle, polygon. MathJax, MathQuill and the text-flow
  components are a later round; until then `mathchain` and `wording` numbers
  are not comparable with Doenet.
- **Renderer switch.** `?renderer=svg|jsxgraph|jsxgraph-canvas`, next to the
  existing `eval`/`backend` switches. SVG stays as the comparison and
  fallback. The canvas option is JSXGraph's own `renderer: "canvas"`, to show
  how much the DOM costs.
- **Thin component renderers, look copied verbatim.** The JSXGraph component
  renderers are written over `useCell`. Copied from Doenet, with the source
  commit in a header comment: `DEFAULT_STYLE_VALUES` and palette, the line and
  filled-shape attribute builders, `normalizePointSize`/`normalizePointStyle`,
  the axis builders and the `initBoard` options.
- **React for the document tree; graph children bypass React.** Inside a
  board, each JSXGraph element subscribes to its cells and updates JSXGraph
  directly.
- **Every tick is fully consistent.** No coalescing of requests and no
  deferred updates for non-dragged components (Doenet's 150 ms lag is not
  copied). Within a tick, each board redraws once: elements update their
  coordinates, and a tick-end hook on `CellStore` calls
  `board.updateRenderer()`. Doenet's redraw-per-element pattern is measured
  once on `fanout-1000` for comparison.
- **Parity scope.** Axes, ticks, navigation buttons, 425 px default size,
  style 1, and pan/zoom (a request on the graph's `xmin`/`xmax` cells, already
  gated by `fixAxes`). Postponed: `styleNumber`, grid, dark mode, labels
  (a known JSXGraph slow path, to be measured separately).
- **Drags copy Doenet.** Shadow-point pattern and Doenet's drag threshold;
  a drag is a synchronous request on the `x`/`y` cells; lines, segments,
  circles and polygons translate as in `lineFamilyDragHandlers`.
- **Rebuilds keep JSXGraph elements.** Elements are kept by stable key and
  only re-bind their cell subscriptions, inside `board.suspendUpdate()`.
- **Parity check.** A `web/baseline/screenshots.mjs` renders about six small
  documents (point, segment, line through two points, circle, polygon,
  panned graph) in Doenet's standalone bundle (without the 400×400 override)
  and in each prototype renderer, and writes side-by-side PNGs to `results/`.
  Judged by eye, not a CI gate.

## Measurement

Main-thread mode only (worker modes add one vsync, which is not a renderer
question). All five workloads are reported for each renderer: drag frame
with N moving elements, structural rebuild, show/hide churn, first render,
and a single drag in a large document.

Fixtures: `points-1000/10000`, `fanout-1000/10000`, `repeat-100/1000/10000`,
`hidden-1000`, the plan 3 line, circle and polygon fixtures, and
`chain-100000`.

The bar, at realistic size:

- drag: frame p90 under 50 ms with 1,000 moving elements in one graph;
- rebuild: structural tick under 50 ms at `repeat-1000`;
- single drag in a large document: frame p50 under 16 ms.

The 10k-in-one-graph fixtures are stress data, not a gate.

## If JSXGraph misses the bar

Decided after the numbers. First fallback: work inside JSXGraph
(low-quality rendering during drags, as Doenet's `itemsRenderedLowQuality`
does; skipping offscreen elements). A custom canvas or WebGL renderer with
Doenet's look only if the JSXGraph canvas renderer also misses.

## Records

An ADR once the measurements are in, on graph children updating JSXGraph
directly rather than through React. The verdict goes in `results/NOTES.md`
"Plan 7"; the `RESULTS.md` tables stay generated.
