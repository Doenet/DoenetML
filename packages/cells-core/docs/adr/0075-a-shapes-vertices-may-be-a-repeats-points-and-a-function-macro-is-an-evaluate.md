# A shape's vertices may be a repeat's points, a function macro is an evaluate, a scan is symbolic per element, and a label is a value

Status: proposed 2026-11-25. Four of sweep 3's gaps, each the user's
decision or a corollary of one: ADR 0041 step 4 (structural sequences) for
`<polyline>` and `<polygon>`, ADR 0043 (an operator is numeric or symbolic
per element) for the list operators, ADR 0024 and ADR 0053 for `$P.label`,
and function macros, which the loader dropped.

## Context

- **`<polyline>`** was a collect of the points `vertices="$name"` named
  (`Machinery::Collect`, `Settle::Collects`): written vertices
  (`vertices="(1,2) (3,4)"`), points (`$A $B`) and copies were refused,
  and nothing but the bridge read its points. A `<polygon>` reads written
  vertices and points, but `vertices="$r"` of a repeat read the repeat as
  one point. The user's decision (sweep 3): a polygon-style `Points`
  attribute may read a structural sequence, a repeat's items, and the
  Collect machinery for polyline goes.
- **`$$f(x)`**: the parser emits a function macro, which `Dast::from_json`
  and `cdast-encode.mjs` read as an unknown node, and every stage skipped:
  a silent wrong answer wherever one was written.
- **`<cumulativeSum>` and its kin** were numeric only, NaN over math.
- **`$P.label`** named nothing: a `<label>` was a `<group>`, which has no
  value, and a group is not copied by reference.

## Decision

1. **A shape over a repeat's points.** A `<polyline>` is a polygon that is
   not closed: the polygon's list, attributes and planner (`plan_vertices`,
   rigid and similar included), `Shape::Open`, and its `length`. A
   `<polyline>` or `<polygon>` whose `vertices` are one reference to a
   repeat-like element whose iterations each hold one point
   (`point_per_iteration`: a `<repeat>` whose body is one `<point>`, a point
   list over a math value, another such shape), or that extends such a
   shape, or is a clone of one in a copied container, is settled once names
   resolve (`settle_over_iterations`, as ADR 0063 settles a list over a
   value) as a repeat-like type of its own (`PolylineOverIterations`,
   `PolygonOverIterations`, `over_iterations:`): `structure: Repeat {
   count: numVertices }`, its count an alias of the source's count (a
   structural cell, so a change is a rebuild), and its item, declared
   `item: Point`, a point per iteration aliasing that iteration's point
   (`$r[i]`'s point, a reference with an `Iter` step, as `<repeat for>`'s
   item is), planned by `Machinery::OverIterations`. A vertex's request
   writes the point it is; the drag flags are the source shape's, else
   true. A clone is keyed by the copy it is in (`repeat_node`), so a copy
   holding two such shapes is refused, as their iterations would share
   that key. A `<repeat>`'s literal `hide` hides it and what it holds.
2. **A function macro is the `<evaluate>` it stands for.** Both loaders
   read `$$f(a, b)` as `<evaluate function="$f" input="a, b"/>`, byte for
   byte (`tests/wire.rs`): the arguments' nodes, then a macro of the path,
   a comma between two arguments, and the element at the function macro's
   place. In text it evaluates and shows its value (an `<evaluate>`'s text
   is its value as its cell holds it). Where an element may not stand it
   is refused where it is written: inside math (its own message) and in an
   attribute, whose literal text and single reference no longer pass over
   an element. Evaluating inside math (`<math>$$f(2) + 1</math>`) would
   need the evaluation as a leaf of the expression, which no planner
   makes.
3. **A scan over math is a list of expressions, decided per element.**
   Each entry is `Flow::HeldOf(expr, numeric)`: the operator expression
   over its prefix (`x`, `x + y`; `min(x, y)`; `y - x`) when the type pass
   types it math, else the scan's number. Every entry's operator
   expression is over all the operands (only its text over the prefix), so
   the type pass types them alike, per element (ADR 0043).
   `forceSymbolic` and `forceNumeric` decide instead. The list's entries
   are math values (`values: number of Math`).
4. **A label is a value.** `<label>` is a type of its own (it was a
   `<group>`): a container that stands as its children, with `value`, its
   children's text joined in the tick (`JoinWith`, empty separator, the
   join ADR 0053 allows: a text piece as written, a reference's or an
   element child's value), missing with an element child that has none (an
   `<m>`). It reads as a `<text>`, so a bare reference to it is its text.
   `$P.label` on a type with no `label` prop names the component's last
   `<label>` child (ADR 0024).

## Considered options

- **A capped list of vertices**, the repeat's points copied into a fixed
  number of cells. Rejected by the user's decision: the count follows the
  repeat, a structural sequence.
- **A function macro as a node kind of its own**, handled by every stage
  that handles a macro. Rejected: every stage would need a case, and an
  `<evaluate>` already is the evaluation; the loaders' desugaring is what
  the other cores do (`ref_expand.rs`, `convertToCopy.ts`).
- **A scan decided from the records**, as a `<sort>` is (ADR 0053).
  Rejected: ADR 0043 decides by the type pass; a math list's entries and
  an unbound math input are math to it, as they are to a `<sum>`.
- **A `label` prop on every type that takes a label.** Rejected: the label
  is a component already (ADR 0024); its text is that component's value.

## Consequences

- `Settle::Collects` and the polyline's collect go; a `<polyline>` over a
  `<collect>` is a static shape of one vertex, refused as a bare reference
  to a collect is. A `<repeat>` of other than one point per iteration
  stays a static vertex too. A polyline is not yet a figure of an
  `<intersection>` or a constraint.
- A shape over a repeat's points has no center, length or list props
  (`$pl.vertices`, `$pl.vertex2`), and no `rigid`: each is an attribute or
  a reference nothing reads, refused where written.
- A scan over a math list of numbers or an unbound math input shows its
  expressions (`1, 1 + 5, 1 + 5 + 2`) where the current core, deciding per
  evaluation, shows numbers: the same consequence ADR 0043 records for a
  `<sum>`. A scan's entries are drawn as math.
- A label's `value` is its text, not the current core's (which wraps math
  in `\( \)`); a label of an `<m>` has no value.
- Found and not done: math text calling a function the lowering does not
  know (`sin`, `sqrt`) or naming `pi` in a number or a point's coordinate
  (`<point>(1, 5 sin(1))</point>`, `<number>sin(1)</number>`) is NaN
  (`Flow::Math`: "lowered if numeric, else NaN"), which several polyline
  and polygon tests over `5 sin($x)` meet; an `Evaluate` of the instantiated
  expression would be the fix.

## Migration

Done 2026-11-25, all four. Tested by `polyline.spec.rs`, `polygon.spec.rs`,
`label.spec.rs`, `scan.spec.rs`, `tests/function_macros.rs`,
`tests/label_references.rs`, `tests/symbolic_operators.rs`,
`tests/wire.rs`, `tests/iterates.rs` and the bridge tests.

The found-and-not-done math text calling a function (`5 sin($x)`, `sin(1)`)
is done by ADR 0083, by lowering rather than an `Evaluate`.

2026-11-26 (ADR 0088): a function macro or `<evaluate>` in math text is
inlined as its function's formula at its inputs when the function is a
plain formula; others stay refused where written.
