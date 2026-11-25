# A point's constraints are one operator, applied in order

Status: proposed 2026-11-25. Decides how the cells core applies a point's
constraints (`<constrainTo>`, `<attractTo>`, `<constrainToGrid>`,
`<attractToGrid>`, `<constrainToGraph>`, `<constrainToInterior>`), which it
had refused when a point had more than one, and what `constraintUsed` is.

## Context

The current core applies a point's constraints in document order, each to
the previous one's result (`constraints.js`, `constraintResults`), and
applies them again in the inverse: a drag writes the constrained point to
the point's unconstrained coordinates, which the forward pass constrains
again. For constraints that are idempotent together (a grid, then a line)
the second pass changes nothing; for two that are not (two grids with
different offsets) it does, and `point.test.ts` ("two contradictory
grids") holds the result. `constraintUsed` is true when any constraint
*applied*, in each constraint's own sense: a grid whenever its result is a
number, an attraction within its threshold, a constraint to components
whenever one has a nearest point, the interior of a shape also when the
point is inside it.

The cells core planned one constraint as its own wiring: a grid as five
scalar operators, an attraction as a projection and an `Attract`
operator, a constraint to a component as the projection its type
declares. Chaining those per constraint would invert in the opposite
order (the last constraint's inverse runs first) and could not say
whether a constraint applied.

The user decided (sweep 4) to follow the current core: constraints apply
in document order, each to the previous one's result, and
`constraintUsed` is true if any of them was used.

## Decision

1. **A point's constraints are one vector operator, `VecOp::Constrain`**,
   over the
   point's coordinates as asked and a *constraint program*: each
   constraint a code and its operands, all of them inputs, the codes
   constant ones (`program/constrain.rs`). It outputs the constrained
   point and `constraintUsed` (0/1). Its inverse writes the requested
   point constrained, so a drag comes to rest where the constraints put
   it and is constrained again when read, as in the current core.
2. **What a component a point may be constrained to is, its type
   declares** (`constrain_target { ports: [x1, y1, x2, y2], shape: Segment
   }`, `{ polygon: true, vertices: 3 }`): a line, a segment, a ray, a
   point, a circle, a polygon or a polyline, each a target of the program.
   Several references in one `<constrainTo>` are several targets, the
   nearest one winning. A constraint's parameters are attributes (a grid's
   `dx`, an attraction's `threshold`), bound or literal.
3. **The graph a constraint reads is the point's nearest enclosing graph**:
   `<constrainToGraph>` its bounds, a `relativeToGraphScales` constraint
   its width and height as scales, planned where the point is. Outside a
   graph, `<constrainToGraph>` holds nothing.
4. **`constraintUsed` follows the current core's sense of "used"**: a
   constraint that applied, whether or not it moved the point (a point on
   its grid uses the grid). A point without constraints is not used.
5. **A function's graph stays its own wiring**: a point with one
   constraint to a function (or a curve given by one, a parabola) rides
   its graph as before (ADR 0049), `constraintUsed` 1. Among other
   constraints or targets it is refused.

## Considered options

- **One operator per constraint, chained.** Rejected: its inverse applies
  the constraints last to first, unlike the current core, and a chain has
  no place for "any applied".
- **The program as the operator's own data** (codes inside the `VecOp`).
  Rejected: a fixed-size array of codes in every `VecOp` grows every
  vector instruction, and the operators' size is measured (`program/`
  keeps eval arms apart for speed). Codes as constant inputs cost a few
  pooled constants per document.

## Consequences

- `VecOp::Constrain { n_in }` reads at most `MAX_VEC_IN` inputs, so a
  point's constraints may read at most 62 values besides its coordinates
  (a polygon of 25 vertices, say); more is refused.
- `VecOp::ProjectLine`, `ProjectCircle` and `Attract` no longer plan a
  constraint; `ProjectLine` and `Turn` still serve an angle between lines.
- A point, an endpoint and an equilibrium point have `constraintUsed`
  (computed only when read) and `draggable` (ADR 0070: a 0/1 cell the
  bridge checks before it turns a drag into requests; one pooled constant
  for a document's draggable points). A vector's `draggable`,
  `headDraggable` and `tailDraggable` move to ADR 0070's rule, the ends'
  flags following the vector's unless given.
- Not done: a constraint's targets written as elements
  (`<attractTo><point>(1,-7)</point></attractTo>`, `<intersection>`
  children), a repeat's components as targets, `<constraintUnion>` and
  `<attractToConstraint>`, a curve that is no function as a target, and
  three coordinates. A bare extend of a constrained point shares the
  referent's constrained value, where the current core constrains the copy
  again in its own graph.
