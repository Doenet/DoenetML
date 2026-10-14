# Cell-addressed renderer interface

The current DoenetML core talks to renderers in component vocabulary: it sends
changed `for_render` props per component and receives named actions such as
`point.move {x, y}`. This prototype instead addresses the renderer boundary by
cell in both directions. The renderer reads values through a `Float64Array`
view over the core's cell array, reads the component table (the columnar
map from each component and prop to its cells) through views of the same
kind, and is told after each tick which cell indices changed. Writes are requests of the form
`(cell_index, value)`; the core inverts from whatever cell is named, derived or
essential, to the essential cells beneath it.

We chose this because the point of the experiment is to see what performance a
data-organized graph allows, and the per-prop message path is one of the costs
being tested. It keeps the core free of component vocabulary on both the read
and write paths, which is the symmetry break the prototype is exploring.

## Considered options

- Keep the existing `FlatDastElementUpdate` and named-action format and map to
  cells inside the core. Rejected: it hides the main potential win (zero-copy
  reads) behind serialization, and a named-action layer is a lookup table that
  can be added on top later if wanted.

## Consequences

- The renderer must know cell indices; it gets them from the component
  table rather than from prop names at update time.
- The core runs on the main thread. A worker deployment was built and
  measured (plan 2, `results/NOTES.md`): 1 to 10 ms of latency per tick and
  one vsync, with `SharedArrayBuffer` and `postMessage` transports within
  noise of each other. The core's own share of a tick is under 3 ms at
  100,000 cells, so the worker bought nothing, and both transports were
  removed in the October 2026 cleanup.
- Named actions, if reintroduced, become a thin table in the web layer, not a
  core concept.
