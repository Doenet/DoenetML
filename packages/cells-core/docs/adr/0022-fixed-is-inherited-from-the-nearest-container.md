# `fixed` is inherited from the nearest container that gives it

Status: accepted 2026-10-29.

An element's `fixed` is its own when it writes one, else the nearest
element around it that writes one: a `<graph fixed>` holds every point in
it, a `<group fixed="false">` inside releases the points in the group,
and a point's own `fixed="false"` releases that point. The chain runs
through the repeats and choices around the element's template to the
document, and a flag given by a reference (`fixed="$b"`) means what it
means where it was written, however deep the element that inherits it.
`fixLocation` is inherited the same way and holds a *located* type, one
whose every value is a location (a point, a circle, a line, a segment, a
polygon, a polyline), as `fixed` does; on any other type it has nothing
to hold. A graph's `fixAxes` stays its own.

We chose this because it is what DoenetML promises its authors
(`inherited-attributes.md`, CTX-5 and CTX-1, both Tier 1): an attribute on
a container applies to what is inside it, and an item inside opts out
with its own. The cells core had applied `fixed` only to the element
that wrote it, so `<graph fixed>` drew draggable points
(`docs/principles-alignment.md` §3.3). The compile is the right place to
inherit: a container's chain is static, an element's ancestors in its
template are its `name_scope` chain and the template's parent continues
it, so the fold costs nothing at tick time, and the one hold mechanism
`fixed` already had does the rest.

## Considered options

- Combining every flag on the chain (an OR of the container's and the
  item's). Rejected: an item's own `fixed="false"` could then never
  release it from a fixed container, which the principles and the
  current core both allow. Nearest wins, as the current core's
  `contextAttribute.js` does; the principles' table says "own setting
  overrides".
- Re-planning an inherited reference where the item sits. Rejected: a
  `$b` in `<graph fixed="$b">` would then bind to a nearer `b` inside a
  repeat body, the same wrong binding `docs/principles-alignment.md` §3.2
  finds in `extend`. The reference is planned where the container sits
  and reached from the item by adding the template hops between them to
  its plan.
- Holding `fixLocation` through a per-prop `location` mark. Deferred: in
  this core a geometry element's state is its location and nothing else
  (a label is text, `hide` is not writable), so a type-level flag says
  the same with no per-prop bookkeeping. When a type gains location
  state beside other state (an input with an anchor), the mark can
  replace the flag.

## Consequences

- `Compiler::plan_hold(t, e)` takes the element and walks the chain
  (`nearest_attr`).
- *Amended 2026-10-29.* `fixed` is a fact beside an element's plans, not
  a rewrite of them. The attributes that hold an element are one table,
  `HOLD_ATTRS` in `compile/fix.rs` (its name, whether it is inherited,
  the types it holds); `plan_elem` records each element's `Hold` beside
  its plans, whatever planned it, and the build holds every cell of a held
  element (`Program::holds`), which the inversion checks before it writes
  or inverts through a cell. A held slot that would share another
  element's cell gets its own (`OpSpec::Copy`). Before, `fixed` moved each
  writable source to a hidden slot behind a `Hold` instruction, so an
  element had its planner's plan and `fixed`'s, and code reading a plan
  had to know which to read; each planning path applied it itself, and two
  never did (a type with a planner of its own, such as `<math>`, and an
  `extend` of a prop), and the list of sources it moved had missed an
  unbound `<mathInput>`'s essential math. Now there is one plan per slot
  and no list: every cell of a held element is held. The table has one
  test, `every_hold_attribute_holds_as_its_row_says`, which names no
  component. A literal `fixed` holds by a constant flag, so the classing
  (ADR 0018) makes the values fixed cells, as `Fix::Literal` did; one
  constant flag cell is added per document that has one. An own-only
  attribute (`fixAxes`) is looked up only on a type it holds, so `<point
  fixAxes>` is refused (ADR 0021).
- `fixLocation` is read on every type, so a container may carry it for
  the shapes inside; a type that is neither located nor a container
  accepts it with no effect, which is the attribute's meaning there.
- A type says it is located in its `component!` block (`flags: [copyable,
  located]`).
- `disabled`, `hide` and `styleNumber` are not inherited by this ADR:
  `disabled` needs a cell inputs refuse on and the renderer shows, `hide`
  is folded by the bridge when it draws (a hidden subtree is left out),
  and `styleNumber` is read only by the viewer from an element's own
  literal attributes. They are the rest of step 3 in
  `docs/principles-alignment.md` §6.
