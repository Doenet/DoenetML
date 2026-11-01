# A planner reads no other element's plan

Status: proposed 2026-10-30. Every migration step is done; the stages
were renamed 2026-11-01 (ADR 0027). Amends ADR 0027:
its rule for planning (each element planned after the plans it reads)
gives way to this one (no element reads another's plan).

Planning an element (the plan stage of ADR 0027) reads the source, the
name table and what outlining made, and nothing another element's
planning makes. What planning needs of another element is either a fact
outlining settles from the source, or a link made once every element is
planned (the link stage, between plan and seal). The one
exception is an owner planning what it owns: an `<answer>` plans its
awards, whens, response and input, and a repeat its iteration elements.

So the elements of the plan stage are independent: they can be planned in any
order, or at once, and no planning order is a fact anything depends on.
ADR 0027's first statement of the rule, that a stage reads only what
earlier stages finished, holds for planning as written.

## What a planner read, and where it comes from now

| A planner read | of another element | Now |
|---|---|---|
| its type | a `<math>`, which is a point when its text is `(a, b)` and a tuple when it has more entries | outlining tokenizes the math's text, its `$ref`s placeholders, and decides the type from the tokens (`math::settled_type`), once |
| its body | a `<collect>` or `<polyline>`, which is indexable (`$c[1]`) and collects one type | outlining sets the collected type, parsing `componentType` once (`collect::collected_type`; a polyline's is `polyline::COLLECTED`); the planner adds only the `from` reference |
| its shared state | an extend's referent, whose essential state a copy with attributes shares (ADR 0023) | the copy names the state (`x` of `$P`), and linking ties the name to the referent's slot |
| its expression | a `<math>` a line's equation inlines (`$m = y` with `$m` standing for `2x`) | parsing parses every math's tokens once, its `$ref`s planned where it sits; the math's planner plans from that parse, and the line inlines it; a math reached twice while inlining is left a cell |
| its clones | a container copy | outlining, already (ADR 0027, step 5) |

A read of another element's source needs no order, since the source is
the outline's, and ADR 0027 already allowed it.

Each of these is decided or parsed once. A math's text is tokenized
once, when outlining, by the one tokenizer of math text (`math_text`), which
leaves `$ref`s as placeholders since names are not all known yet; its
type is decided once, from those tokens; its tokens are parsed once, in
the parse stage, after outlining and before any element is planned, as that type
(an expression, or a tuple's entries). The planner branches on the
type; it does not decide it again. Parsing is ADR 0027's references
stage for the references inside maths; references elsewhere are still
planned as planners ask (ADR 0027, "References").

## What changes

- `planned_elem`, `settled_elem` and the `planning` set go: nothing plans
  an element but planning's walk. A container copy reached while
  outlining expands copies is still expanded first; that is outlining's
  own order.
- A loop of extends with attributes of their own is no loop of plans.
  Each element plans from its own source, and the links made when linking
  are values: a loop among them is a dependency cycle, the build's to
  report, as before ADR 0027.
- Whatever reads a referent's type to plan (an extend, a container copy,
  `<constrainTo>`, a line's direction, `<functionIterates function>`)
  reads it through one function (`referent_type`), which reads the type
  outlining settled and records the read. A box has no type to plan from: a
  reader of one is boxed in turn, its referent's box the cause, at once
  if the referent is already a box, and otherwise when linking, which boxes
  every recorded reader of a box in place whichever was planned first
  (`box_readers_of_boxes`). Linking then ties shared state only between
  elements that are not boxes.
- `box_in_place` no longer needs to restart when something under the box
  was planned: nothing read it. It still restarts when a container copy
  cloned something under the box, since a clone took its type.

## Considered options

- **Keep planning on demand (ADR 0027 as amended).** It works, and it
  orders what reads what. But every planner that reads another element
  must go through the accessor, and nothing enforces that; a read of
  `elems[x]` past it is the order bug ADR 0027 set out to remove. Here
  there is nothing to order.
- **Infer types in a stage of their own, over references.** A math whose
  type followed its references' types would need it. Today it does not:
  the type follows the text alone, and outlining can read it.
- **Inline when linking, over finished plans.** Whether a line's equation is
  linear decides the line's plan, so the line would have to be planned
  again once inlining is done.
- **Inline by parsing the inlined math's source again.** It reads no
  plan, but a math is then parsed twice, by its planner and by each line
  that inlines it, and the two parses must agree. Parsing parses once.

## Consequences

- The type of a `<math>` is known once outlined: keys, references and
  clones all see the settled type, so no reader can see a math that is
  later a point.
- A math's `$ref`s are planned when parsing, before planning; an error among
  them is kept with the parse, and the math's planner reports it, so
  the math is boxed while planning, as before.
- Planning in parallel needs only the compiler's shared tables split, as
  ADR 0027 noted; no order between elements is left to keep.

## Migration

Each step lands alone, with the golden diff unchanged.

1. **Types and bodies when outlining.** Set a `<math>`'s settled type, and a
   `<collect>`'s or `<polyline>`'s collected type, when outlining makes the
   element; the math's planner checks its parse against it. Which
   planner runs is the tag's (`planned_as`), not the settled type's. Done:
   `Compiler::settle_shape` (now `settle_outline`) and `math_shape`; `PlanCtx::expect_type`
   replaces `set_type`.
2. **Shared state linked.** A copy with attributes records what it
   shares by name; linking ties it to the referent's slot. Done:
   `Share`, linked by `Compiler::link_shared_state`. A loop of extends
   with attributes is a dependency cycle again, which fails the load.
3. **Inlining reads the source.** `inline_symbolic_maths` parses the
   inlined math's children instead of reading its plan. Done; the
   golden diff is unchanged.
4. **Plan independently.** Remove the accessors and the `planning` set;
   box an extend of a box when linking; drop `box_in_place`'s restart for a
   planned subtree. Test: every test document's siblings shuffled plan
   to the same values (`tests/plan_order.rs`), with no accessor left to
   make it so. Done: `shaped_elem` (now `outlined_elem`) is outlining's own (a container copy
   expanded before what reads it), `box_extends_of_boxes` (now
   `box_readers_of_boxes`) runs first when linking, and `tests/diagnostics.rs` checks that an extend of an element
   boxed while planning is boxed whichever comes first.
5. **Decide and parse once.** Steps 1 and 3 decided a math's type twice
   (outlining, then the planner, checking) and parsed an inlined math twice
   (its planner, then the line). One tokenizer (`math_text`) feeds both
   the type (`math::settled_type`) and the parse stage (`parse_maths`);
   the planner and the inliner read its `ParsedMath`. One reading
   of math text as a tuple (`expr::tuple_entries`) serves every caller.
   A `<collect>`'s `componentType` is parsed once, when outlining, and an
   error in it boxes the collect there. An element's `extend` is planned once
   (`plan_extend`), whichever stage needs it first; a referent's type is
   read, and a box among referents decided, in one place
   (`referent_type`).
