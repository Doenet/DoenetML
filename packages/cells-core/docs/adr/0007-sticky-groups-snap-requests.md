# Sticky groups snap requests before inversion, not through an instruction

A `<stickyGroup>` is the first relation across components. After every build
the document records each group as cells: its members (points, polygons,
line segments, including those a repeat or collect expands to), their
distinct points, the threshold and the enclosing graph's bounds
(`Document::sticky_tables`). When a tick receives requests, a pre-pass
(`Document::snap_sticky`) finds the requests that name a member's cell,
snaps the dragged members against the others with the current core's rule
(`sticky.rs`, a pure function), and rewrites those requests before they are
inverted. Nothing is added to the cell graph or to the inversion engine.

Plan 4 built both this and the alternative behind a switch, over one shared
snap kernel, and decided by criteria fixed in advance (`docs/history/plan-4.md`);
the numbers are in `results/NOTES.md`, "Plan 4".

## Considered options

- **One `Sticky` identity instruction per group** (built and measured, then
  deleted; commit 461639b has it). The members' coordinate cells became the
  instruction's outputs and their former sources its inputs, so the inverse
  saw the other members' values as inputs and stayed local, the rigid
  polygon's precedent. Rejected on the second and third criteria:
  - It limits what documents can say. One instruction couples every member
    to every other, so a member computed from another member
    (`vertices="($A.x+1, $A.y) ..."` with `A` in the group) is a dependency
    cycle. ADR 0006 rejected per-shape instructions for the same reason.
  - It needed new machinery: a builder pass that rewrites sources after
    references resolve (a group may own more points than an element has
    slots), a map keeping moved essential values under their original keys,
    vector instructions with unbounded arity, and a memoized reference
    evaluator. That came to about 320 lines in eight existing modules,
    against about 160 lines in one for the pre-pass.
  - It is slower and larger: 1.2 ms per whole-polygon drag at 1,000
    polygons against 0.4 ms, and 47% more cells, from the copies of every
    coordinate and the member header.
- **Folding snapping into point groups.** Not possible: point groups are a
  property of the request shape and say nothing about the document, while a
  sticky group is something the author wrote.

## Consequences

- Snapping responds to drags as the renderer sends them. A request that
  reaches a member only through inversion (dragging a point defined as
  `$A.x + 1` where `A` is a member) is not snapped. The current core snaps it,
  since snapping lives in each member's inverse there. No oracle test
  exercises this.
- Copies of a group (`<stickyGroup extend="$g2.sg"/>`, a copied graph) that
  have exactly the original's points are recorded once. Snapping is not
  idempotent, so snapping a drag once per copy moved shapes too far (2.55
  instead of 2.25 in the current core's parallel-edge test).
- A member that shares a point with the dragged member (a polygon whose
  vertex is a member point) does not attract it. This deviates from the
  current core, which excludes by child index only and so snaps a polygon
  back onto its own vertex.
- The snap kernel reads the other members' current values and the requested
  ones, and nothing from earlier ticks. Rigid and similarity shapes dragged
  by one vertex are not snapped: the current core does that through
  `rotationReferenceMapping`, a cache of pre-snap vertices (Tier 3, a
  declared gap).
