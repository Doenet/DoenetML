# Graphs are drawn by JSXGraph, with Doenet's look

The viewer draws every graphical component (`graph`, `point`, `line`,
`lineSegment`, `circle`, `polygon`, `polyline`) with JSXGraph 1.12, using
the style constants, attribute builders, axis builders and `initBoard`
options copied from DoenetML's renderers. The document tree is React; inside
a board, each element subscribes to its cells and updates JSXGraph directly,
and the board redraws once per tick from a tick-end hook. The plain SVG
renderer that the first rounds measured against is removed, as are
JSXGraph's canvas backend and Doenet's redraw-per-element update pattern.

We chose this because the cells core is meant to replace DoenetML's core
behind DoenetML's renderers, so the renderer that matters is the one with
Doenet's look and interaction model. Plan 7 (`docs/history/plan-7.md`)
built JSXGraph next to the SVG renderer to measure what the look costs;
this ADR records the measurement and the choice.

## Measured (headless Chromium, main thread, dirty closure, 2026-10-10)

Per drag step, p50 in milliseconds; first render in milliseconds.

| fixture | SVG paint | JSXGraph paint | SVG first render | JSXGraph first render |
|---|---|---|---|---|
| points-1000 | 2.5 | 4.5 | 52 | 403 |
| points-10000 | 10.8 | 43.0 | 170 | 2993 |
| fanout-1000 | 14.8 | 27.0 | 32 | 415 |
| fanout-10000 | 147 | 236 | 182 | 3308 |
| circles3-1000 | 34.6 | 58.7 | 76 | 1374 |
| hidden-1000 | 2.3 | 4.8 | 29 | 345 |

JSXGraph costs 2 to 8 times the SVG renderer per paint and 8 to 18 times at
first render. The core's share of a tick is under 1 ms in every row; the
difference is entirely JSXGraph's element update and the board redraw.

## Considered options

- **JSXGraph's canvas backend.** Measured: slower than its SVG backend on
  every fixture (points-10000: 358 ms per paint against 43 ms), because
  JSXGraph redraws the whole canvas while the SVG backend touches only the
  changed nodes. Rejected.
- **Doenet's update pattern**, a board redraw per changed element from the
  render body. Measured on fanout-1000 and points-1000: 27 ms per paint
  against 4.5 ms, and first render of 15 to 19 seconds against 0.4 seconds,
  because every element's mount triggers a full board update. Rejected.
  The per-tick redraw is the pattern to carry back to DoenetML's renderers.
- **Keep the SVG renderer as a fast path.** Rejected: a second renderer with
  a different look has no owner once the viewer is in the monorepo, and the
  numbers above are the record of what it bought.

## Consequences

- The viewer's first render of a 10,000-element graph is about 3 seconds.
  That is JSXGraph's element creation; startup work, if any, goes there.
- The one fixture that misses a 50 ms budget per step, `fanout-10000`, misses
  it with either renderer; it is a limit on simultaneously moving elements.
- The copied style and axis code (`renderers/jsxgraph/doenet.ts`) names its
  upstream files; in the monorepo those become imports.
- Labels, `styleNumber`, grid and dark mode are still unported.
