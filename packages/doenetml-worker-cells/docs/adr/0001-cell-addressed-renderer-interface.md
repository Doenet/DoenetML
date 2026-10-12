# Cell-addressed renderer interface

The current DoenetML core talks to renderers in component vocabulary: it sends
changed `for_render` props per component and receives named actions such as
`point.move {x, y}`. This prototype instead addresses the renderer boundary by
cell in both directions. The renderer reads values through a `Float64Array`
view over the core's cell array (zero copy when the core runs on the main
thread, `SharedArrayBuffer` when in a worker), receives a one-time render
manifest mapping each rendered prop to cell indices, and is told after each
tick which cell indices changed. Writes are requests of the form
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

- The renderer must know cell indices; it gets them from the render manifest
  rather than from prop names at update time.
- Any future worker deployment needs COOP/COEP headers for `SharedArrayBuffer`.
- Named actions, if reintroduced, become a thin table in the web layer, not a
  core concept.
