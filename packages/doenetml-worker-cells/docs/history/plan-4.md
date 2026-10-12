# Plan 4: sticky groups

This file records the decisions reached before implementation. Vocabulary is
in `CONTEXT.md` (**Sticky group**). The verdict is in the "Plan 4" section of
`results/NOTES.md`; the chosen wiring, B, is ADR 0007.

## The question

A sticky group is the first relation *across* components. Graph is only a
container, and nothing yet imposes a relation on a container's children. In
the current core, snapping happens inside each member's inverse, in one
request, reading the other members' current values. It never moves a member
nobody asked to move, so on the forward side a sticky group is an identity.

The experiment asks **which of two wirings is simpler, given equal
behavior**:

- **(A) Instruction.** One `Sticky` identity vector op per group. Its inputs
  are every member's coordinates (plus graph bounds when the threshold is
  relative); its outputs are the members' public coordinates. Membership and
  threshold are literal parameters. The multi-output gather hands the inverse
  the requested points; it reads the other members from its own inputs, so the
  inverse stays local. This is the rigid polygon's precedent: the document asked
  for the coupling, so it lives in the graph.
- **(B) Engine pre-pass.** No cells and no instruction. A membership table
  goes to the request engine, which snaps requests on member cells as they enter
  the engine, before inversion. It snaps only requests that enter the engine
  directly. A request that inverts down to a member from a derived cell is not
  treated as a drag, and that difference is recorded as a finding, not
  engineered away.

Both wirings call one shared **snap kernel**: a pure function of member
coordinates, membership, the requested points and the threshold, returning
snapped values. Only the wiring differs, behind a build-time switch.

## Bar for the verdict

These criteria are fixed before building, in priority order:

1. **Oracle parity is a gate.** Both wirings must pass the same tests; if one
   cannot, that is the verdict.
2. **New mechanisms or concepts.** For example, document knowledge in the request
   engine, a new glossary term, or an exception to "every inverse is local".
3. **Existing modules touched**, and lines added outside the kernel.
4. **Performance.** It must fit the interactive tick budget, and it breaks ties
   unless one wiring blows the budget.

The losing wiring is deleted in a final commit that records the numbers.

## Behavior in scope

- **Tier 1.** A dragged point or whole-shape translation snaps vertex-to-vertex,
  vertex-to-edge and edge-to-vertex. For whole shapes, DoenetML's choice of
  translation applies: try each vertex's correction as a shift of the whole
  shape, keep the one that leaves the most vertices exactly on a target, and
  break ties by the smallest shift.
- **Tier 2.** Single-vertex drags of non-rigid shapes. The vertex snaps to a
  vertex or edge, or the edge pivots about its fixed neighbor to pass through
  a vertex.
- **Members.** Points, the polyline/polygon family and line segments are
  members, and only direct graphical children count. Lines and circles join but
  never snap. Members expanded from a `<repeat>` count, since membership is
  computed at build time and a rebuild refreshes it.
- **The dragged member** is any member with a requested coordinate. It is
  excluded as an attractor, together with every member that shares a cell with
  it. This deliberately deviates from DoenetML, which excludes by child index
  only, so a polygon whose vertex is a member point snaps onto itself.
- **Order.** Sticky applies first. A member's own constraint (rigid `Shape`,
  `constrainToGrid`) inverts after the snap and may move it off the target.
- **Attributes.** `threshold` (default 0.5) and `relativeToGraphScales`
  (0.02 × graph bounds; the bounds are cells, so they are inputs) are in scope.

Declared gaps: Tier 3, meaning rigid and similarity single-vertex rotation snapping,
axis-angle snapping, parallel-edge snapping on translate, and
`angleThreshold`. That is most of `stickygroup.test.ts` tests 2–4. Matching
them appears to need DoenetML's `rotationReferenceMapping`, a pre-snap cache
that Plan 3 deliberately did not reproduce. `addChildren` and
`deleteChildren` are also gaps.

## Oracle and harness

The oracle is `stickygroup.test.ts`, run unmodified through the
`cells-prototype-adapter` branch with `DOENET_TEST_CORE=cells`, once per
wiring. Prototype-side Rust tests cover repeat-expanded members and the
shared-cell exclusion rule.

Performance is measured with new fixtures `sticky-100` and `sticky-1000`:
a graph with one sticky group of that many polygons of 4–6 vertices. The
measurement is drag tick time under each wiring against the existing budget. A
linear scan is acceptable if it fits; add a spatial index only if the numbers
demand it.

## Order of work

1. Snap kernel with Rust unit tests (Tier 1, then Tier 2).
2. Wiring A, then the oracle run.
3. Wiring B behind the switch, then the oracle run.
4. Fixtures and benchmarks for both wirings.
5. Verdict in `results/NOTES.md`, ADR, and deletion of the losing wiring.

All work is committed to main.
