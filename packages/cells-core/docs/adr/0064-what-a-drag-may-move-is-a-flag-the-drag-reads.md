# What a drag may move is a flag the drag reads

Status: proposed 2026-11-24. Decides how the cells core honors a shape's
`draggable` and the flag of its parts (`verticesDraggable` on the polygon
family, `endpointsDraggable` on a segment), which the current core has
and the cells core refused as unread attributes. Leaves ADR 0022 (`fixed`
and `fixLocation` hold every cell of an element) as it is.

## Context

The current core reads these flags in its move actions only:
`movePolygon` returns without a change when one vertex is dragged and
`verticesDraggable` is false, or more than one (the whole shape) and
`draggable` is false (`Polygon.js`, `Polyline.js`, `Rectangle.js`);
`moveLineSegment` reads `endpointsDraggable` and `draggable` the same way.
Nothing else reads them. A `<mathInput bindValueTo="$R.width"/>` still
resizes a rectangle that is not draggable, and a point bound to a vertex
still moves it. `verticesDraggable` defaults to `draggable`. Both may be
bound (`draggable="$b"`) and are public state variables.

ADR 0022's hold is the other way a write is refused here: a held element
refuses every request on any of its cells, whoever asks. It cannot say
what these flags say. A vertex drag and a whole drag request the same
cells (the list's points), so a hold cannot let one through and not the
other; and a hold would refuse the bound input the current core lets
write.

## Decision

1. **The flags are values the core computes, and nothing in the core
   holds by them.** A type that has them declares each as a prop (a 0/1
   cell, `rendered`): `draggable` from its attribute (a `Flag`, true by
   default, bound or literal), the parts' flag from its attribute, else an
   alias of `draggable`. An attribute kind `OptFlag` reads a flag that may
   be absent, for the planner to default (`geometry/drag.rs`).
2. **The drag reads them.** A renderer's drag is turned into requests by
   the bridge (ADR 0020), which reads the flag first, as the current
   core's move action does: one part dragged needs the parts' flag, more
   than one `draggable`; a drag either forbids changes nothing
   (`actions.ts`, `gated`). The renderer also receives both flags, to
   offer only the drags they allow.
3. **A request is not a drag.** A request on a vertex from anything but a
   renderer's drag (a bound input, a point bound to a vertex, an
   `<updateValue>`) is not refused by these flags. `fixed` and
   `fixLocation` (ADR 0022) still hold everything.

## Considered options

- **A hold, as `fixed` is.** Rejected: it cannot tell a vertex drag from a
  whole drag, and refuses writes the current core allows.
- **A presentation attribute the bridge reads as written**, as a vector's
  `headDraggable` is today. Rejected for these types: `draggable="$b"`
  must follow `$b`, and the flags are public values a document reads.
- **A core action per drag (`movePolygon` as an ADR 0040 action).**
  Deferred: every drag of a shape is a bridge resolver today; moving them
  into the core is a change of its own, and would read the same flags.

## Consequences

- The polygon, triangle, rectangle and regular polygon declare
  `draggable` and `verticesDraggable`. One constant cell per shape (the
  default flag), the second an alias.
- The cells viewer's renderers do not read the flags yet; the prototype's
  renderers receive them through the contracts.
- A point's `draggable`, a vector's `draggable`, `headDraggable` and
  `tailDraggable` (a presentation attribute today) and a polyline's can
  move to this rule when their types are next touched.
