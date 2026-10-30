# A planner reads no other element's plan

Status: proposed 2026-10-30. Every migration step is done. Amends ADR 0027:
its rule for pass 3 (each element planned after the plans it reads)
gives way to this one (no element reads another's plan).

Planning an element (pass 3 of ADR 0027) reads the source, the name table
and what pass 1 made, and nothing another element's planning makes. What
pass 3 needs of another element is either a fact pass 1 settles from the
source, or a link pass 4 makes once every element is planned. The one
exception is an owner planning what it owns: an `<answer>` plans its
awards, whens, response and input, and a repeat its iteration elements.

So the elements of pass 3 are independent: they can be planned in any
order, or at once, and no planning order is a fact anything depends on.
ADR 0027's first statement of the rule, that a pass reads only what
earlier passes finished, holds for pass 3 as written.

## What a planner read, and where it comes from now

| A planner read | of another element | Now |
|---|---|---|
| its type | a `<math>`, which is a point when its text is `(a, b)` and a tuple when it has more entries | pass 1 sets it, from the math's own tokens with each `$ref` an opaque atom: `math.rs` decides it from nothing else |
| its body | a `<collect>` or `<polyline>`, which is indexable (`$c[1]`) and collects one type | pass 1 sets the collected type, from the tag and `componentType`; the planner adds the `from` reference |
| its shared state | an extend's referent, whose essential state a copy with attributes shares (ADR 0023) | the copy names the state (`x` of `$P`), and pass 4 links the name to the referent's slot |
| its expression | a `<math>` a line's equation inlines (`$m = y` with `$m` standing for `2x`) | the line reads the math's *source* and parses it, as the math's planner would; a math reached twice while inlining is left a cell |
| its clones | a container copy | pass 1, already (ADR 0027, step 5) |

A read of another element's source needs no order, since the source is
pass 1's, and ADR 0027 already allowed it.

## What changes

- `planned_elem`, `settled_elem` and the `planning` set go: nothing plans
  an element but pass 3's walk. A container copy reached while pass 1
  expands copies is still expanded first; that is pass 1's own order.
- A loop of extends with attributes of their own is no loop of plans.
  Each element plans from its own source, and the links pass 4 makes
  are values: a loop among them is a dependency cycle, the build's to
  report, as before ADR 0027.
- An extend of a box is boxed in pass 4, for every extend at once,
  whichever was planned first: an extend's referent may be boxed in
  pass 3 after the extend was planned. Pass 4 boxes in place, since no
  plan read the extend's. Pass 4 links shared state only between
  elements that are not boxes.
- `box_in_place` no longer needs to restart when something under the box
  was planned: nothing read it. It still restarts when a container copy
  cloned something under the box, since a clone took its type.
- What reads a referent's type to plan (`<constrainTo>`, a line's
  direction, `<functionIterates function>`) reads the type pass 1 gave
  it. When the referent is boxed in pass 3, it reads undefined values,
  as any reference to a box does.

## Considered options

- **Keep planning on demand (ADR 0027 as amended).** It works, and it
  orders what reads what. But every planner that reads another element
  must go through the accessor, and nothing enforces that; a read of
  `elems[x]` past it is the order bug ADR 0027 set out to remove. Here
  there is nothing to order.
- **Infer types in a pass of their own, over references.** A math whose
  type followed its references' types would need it. Today it does not:
  the type follows the text alone, and pass 1 can read it.
- **Inline in pass 4, over finished plans.** Whether a line's equation is
  linear decides the line's plan, so the line would have to be planned
  again once inlining is done. Reading the source is cheaper and needs
  no second plan.

## Consequences

- The type of a `<math>` is known from pass 1 on: keys, references and
  clones all see the settled type, so no reader can see a math that is
  later a point. The math's planner checks that what it parses agrees,
  and a disagreement is a core bug, reported on the element.
- A line's equation that inlines a math plans that math's `$ref`s again
  at the math's scope: the same values, through plans of its own.
- Planning in parallel needs only the compiler's shared tables split, as
  ADR 0027 noted; no order between elements is left to keep.

## Migration

Each step lands alone, with the golden diff unchanged.

1. **Types and bodies in pass 1.** Set a `<math>`'s settled type, and a
   `<collect>`'s or `<polyline>`'s collected type, when pass 1 makes the
   element; the math's planner checks its parse against it. Which
   planner runs is the tag's (`planned_as`), not the settled type's. Done:
   `Compiler::settle_shape` and `math_shape`; `PlanCtx::expect_type`
   replaces `set_type`.
2. **Shared state linked in pass 4.** A copy with attributes records
   what it shares by name; pass 4 links it to the referent's slot. Done:
   `Share`, linked by `Compiler::link_shared_state`. A loop of extends
   with attributes is a dependency cycle again, which fails the load.
3. **Inlining reads the source.** `inline_symbolic_maths` parses the
   inlined math's children instead of reading its plan. Done; the
   golden diff is unchanged.
4. **Plan independently.** Remove the accessors and the `planning` set;
   box an extend of a box in pass 4; drop `box_in_place`'s restart for a
   planned subtree. Test: every test document's siblings shuffled plan
   to the same values (`tests/plan_order.rs`), with no accessor left to
   make it so. Done: `shaped_elem` is pass 1's own (a container copy
   expanded before what reads it), `box_extends_of_boxes` runs first in
   pass 4, and `tests/diagnostics.rs` checks that an extend of an element
   boxed while planning is boxed whichever comes first.
