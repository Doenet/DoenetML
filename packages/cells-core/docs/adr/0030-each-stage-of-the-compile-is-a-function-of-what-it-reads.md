# Each stage of the compile is a function of what it reads

Status: proposed 2026-11-02. Steps 1 to 7 are done; see Migration. Amends ADR
0027 and ADR 0029 in how their stages are written, not in what any stage
does.

ADR 0027 and ADR 0029 split the compile into stages (outline, parse,
plan, link, seal, then the abstract build), each reading only what earlier
stages finished. That rule is stated, not shown: every stage but sealing
is a method on one `Compiler`, and every one can read and write every
field of it. This ADR makes each stage a function whose arguments are
what it reads and whose result is what it makes, as sealing already is
(`seal::Seal`). What a stage reads is then the signature of a function,
not something found by searching for the fields it touches.

## Context

ADR 0027, step 6, did this for sealing alone, and the rest stayed one
object. Reading the compile after ADR 0029 shows where that costs.

### Stages hand over through fields

What one stage gives the next is a field of `Compiler` that the later
stage empties with `mem::take`: outlining fills `pending_elems`,
`pending_macros`, `container_copies` and `math_texts`; planning fills
`shares` and `referent_readers`, which linking drains; parsing fills
`parsed_maths`, which planners read. Several fields serve one stage and
live for all of them (`expanding`, `expanded`, `cloned_sources`,
`extend_refs`). `compile/mod.rs` now lists, for each field, the stage
that writes it and the stages that read it (step 1); the list is long
because nothing in the types keeps it short.

### A method's stage is not visible

Eleven files add methods to `Compiler`, by topic (`copies.rs`,
`attrs.rs`, `refs.rs`, ...), so no file and no type says which stage a
method runs in. Some run in several: `plan_ref` in outlining (a
container copy's `extend`, through `plan_extend`), parsing (a math's
`$ref`s) and planning; `plan_extend` and `referent_type` in outlining
and planning. Outlining also does planning's work: it wires a
`<repeatForSequence>`'s value element and an unnormalized document's
props, and pushes `RefPlan`s (`own_prop_plan`).

### The element set grows while planning

ADR 0027 says the element set is complete once outlining ends. It is
not: an `<answer>`'s planner pushes its `response` and `mathInput`
elements (`answer.rs`, `add_response`). Nothing reads them across
elements, so no order bug follows, but a reader of `Compiled` after
outlining cannot trust its element count.

### Plans are edited after they are made

Outlining overwrites a `<math>`'s `component_type` with the type its text
settles (`settle_outline`). An element's `extend` is set by outlining for
a container copy and by planning for the rest. `elem_shape` rewrites a
`RefPlan` already cached in `extend_refs`, adding the referent's default
prop (`r.prop = Some(dp)`). `PlanCtx::parsed_math` removes a parse error
from `parsed_maths` as it reads it.

### There are six ways to box

An element that fails is boxed by one of:

1. `push_error_elem`, when outlining, for a node an earlier compile
   boxed or an element that fails before it is pushed, and when
   planning, for a `$ref` child that cannot be planned;
2. `box_in_place`, when outlining, planning or linking;
3. `fail_at` and `failed_node`, when `box_in_place` cannot (a clone was
   made of what is under it, or it has no node): the compile restarts;
4. sealing's `Failure`, which restarts;
5. an unread attribute (ADR 0021), found by `plan_and_check` in
   `check.rs` after the stages, which restarts;
6. the abstract build's `Failure`, which restarts.

Four places guard with `Err(e) if self.failed_node.is_some() => return
Err(e)` (`add_elem`, `plan_elem`, `plan_all`, `expand_container_copy`),
so once one failure restarts the compile, every later one passes through
unboxed: how a failure is handled depends on the failures before it.
ADR 0027 meant the abstract build's retry to be the only one.

## Decision

Each stage is a function. Its arguments are what it reads, borrowed
immutably when it only reads them; its result is what it makes, a type
named for the stage. Nothing a stage makes for one later stage is stored
where every stage can reach it.

```
outline(dast, boxed)               -> Outline
parse(&Outline, &mut Refs)         -> Parsed
plan(&Outline, &Parsed, &mut Refs) -> Planned
link(&mut Planned)                 -> ()
seal(&mut Planned, &Outline)       -> Sealed        (as now)
```

- **`Outline`** holds the templates and their elements, complete (an
  answer's `response` and `mathInput` are pushed here), the name table,
  every math's tokens, the container copies' clones and every `extend`'s
  `RefPlan`, its default prop already decided (the referent's type and the
  element's are both outlining's). Outlining makes no prop plans.
- **`Parsed`** holds each `<math>`'s parse. Planners read it; none takes
  from it.
- **`Planned`** holds every element's plans and hold, what each copy
  shares, every reader of a referent's type, the boxes made and their
  errors. Read flags are complete when it is returned.
- **`Refs`** is the reference arena, append-only: a stage that plans
  references gets it mutably, and no stage edits a reference already in
  it.

**Boxing has one path.** Every failure while outlining, planning or
linking is boxed where it arises (`box_in_place`), and the stage goes
on. A failure this compile cannot keep (a copy cloned what is under the
element, or the element has no node) is boxed all the same, so the
stage runs over a consistent compile, and is also recorded as the
compile's restart; the compile ends with it at the next stage boundary.
No failure's handling depends on an earlier one. Only `plan_and_check`
compiles again.

**The unread-attribute check is the end of planning**, as ADR 0027
states: it runs when linking, once every element is planned and the
readers of planning's boxes are boxed, and boxes what it finds in
place, like any planner's failure; linking then boxes what read those.
It leaves `check.rs`, and a document with an unread attribute plans
once, not twice.

**Files follow the stages**: `compile/outline/`, `compile/parse.rs`,
`compile/plan/` (the planners' machinery, behind `api.rs` as now),
`compile/link.rs`, `compile/seal.rs`. Code two stages share (the name
table, `plan_ref`) lives in a module of its own that says so.

## Considered options

- **Document the fields and leave the code.** Step 1 does this, and it
  is worth having, but a table kept by hand drifts as fields are added,
  and the compiler does not check it. Kept only as the first step.
- **One context type per stage, over one `Compiler`.** Wrap the shared
  object in views that expose only some fields. Cheaper than moving
  data, but a view still borrows the whole compiler mutably, so what a
  stage *writes* stays unchecked, and that is most of the trouble.
- **Plan elements in parallel now.** ADR 0027 and ADR 0029 left room
  for it. These stages make it possible (planning would read `Outline`
  and `Parsed` only, and each element's result would merge into
  `Planned`), but it is not a goal here: the abstract build, not
  planning, is the expensive stage.

## Consequences

- What a stage reads and writes is its signature, and the compiler
  enforces it. A planner that reads another element's plan (ADR 0029)
  cannot compile, rather than being caught by review.
- The element set is fixed once outlined, as ADR 0027 says, but for
  the box of a `$ref` child that cannot be planned.
- A plan is never edited after it is made, except by linking, whose
  edits are named (a box, a shared slot's alias).
- A document with *n* independent errors and an unread attribute plans
  once.
- `failed_node`, the four guards, `pending_elems`, `pending_macros`,
  `container_copies` and `math_texts` as fields, and `child_scope` go.
- No step changes the golden diff. Step 3 changes diagnostics for a
  document with an unread attribute: what referred into the refused
  element was an unknown reference, a false error, and now reads it as
  any box made in place (ADR 0027).

## Migration

Each step lands alone, with the golden diff unchanged unless it says
otherwise.

1. **Write down who reads what.** Fix the `compile/mod.rs` module doc,
   which still described the compile as plan then check, and document
   every `Compiler` field with the stage that writes it and the stages
   that read it. Done.
2. **One boxing path.** Replace `failed_node` and the four guards with a
   failure value that says whether it was boxed in place or needs a new
   compile; `plan_and_check` is the only caller that compiles again.
   Done: `box_in_place` always boxes, and records a failure it cannot
   keep as `Compiler::restart` (the first, when there are several),
   which `compile_all` checks between stages. `fail_at` and the guards
   are gone; `add_elem`, `add_children`, `plan_elem`, `plan_all` and
   `outline` cannot fail, and `expand_container_copy` fails only on a
   cycle, its reader's failure. The first recorded failure is the one
   that used to pass through, so diagnostics are unchanged:
   `tests/diagnostics.rs` checks a failure under a cloned subtree, while
   outlining and while planning, against the same errors and number of
   plans as before.
3. **Unread attributes at the end of planning.** Run the check over the
   plan stage's read flags and box in place what it finds. Test: a
   document with an unread attribute plans once. Done: `compile/unread.rs`, between linking's two passes of
   `box_readers_of_boxes`. What the refused element's planning reported
   under it (errors, boxes, warnings, its own included) is dropped, as
   when it was boxed from the start of a new compile, and an element the
   check names with no element made for it (a child its parent's planner
   reads) is still boxed by compiling again. One change in diagnostics,
   the cascade ADR 0027 removed for other boxes: with
   `<graph name="g" bogus="1"><point name="A"/></graph>`, `$A.x`
   elsewhere was an unknown reference, since a box made from the start
   has no children, and now reads undefined with no error of its own;
   `<point extend="$A"/>` is boxed with `cells-boxed-referent` instead
   of an unknown reference. `tests/diagnostics.rs` checks this, and the
   restart test now takes two plans, not three.
4. **Outlining makes no plans.** Move the repeat's value wiring and the
   synthetic document's props into their planners, push an answer's
   `response` and `mathInput` when outlining, and decide an extend's
   default prop in `plan_extend`. `elem_shape` stops editing a
   `RefPlan`. Done. A repeat's planner plans its `valueName` and
   `indexName` elements (`plan_iteration_names`), and the synthesized
   root of an unnormalized DAST is planned with every element
   (`plan_synthetic`). Outlining ends by making every answer's synthetic
   children (`add_answer_children`), deciding them from the source as
   `plan_answer` does, and planning the references in its whens to find
   the inputs they read; the planner reuses those references and plans
   the children. They are made after everything else outlining makes, in
   the order the answers were made, which is where planning pushed them,
   so the golden diff is unchanged. Where the planner refuses the answer,
   they die with its box. A debug assertion in `compile_all` checks that
   planning and linking make no element but the box of a `$ref` child
   that cannot be planned, which has no element to be boxed in place.
5. **`outline` returns `Outline`.** Its handover fields leave
   `Compiler`. Done: `Outline` holds the elements to plan, the `$ref`
   children to plan and the math texts to parse, which `compile_all`
   passes to `parse_maths` and `plan_all`; `pending_elems`,
   `pending_macros` and `math_texts` are gone. Outlining's own state (the
   container copies to expand, those expanding and expanded) and the
   `Outline` being filled are an `Outlining` that exists only while
   outlining runs (`Compiler::outlining`), so adding work after it panics
   rather than going unplanned. What outlining settles that later stages
   look up through the planners' context (the name table, an answer's
   responses and when references, the clones made, the extend
   references) stays on `Compiler` until planning takes its inputs as
   arguments (step 7).
6. **`parse` returns `Parsed`**, and planners read it without taking from
   it. Done: `parse_maths` returns `Parsed`, which `compile_all` keeps on
   `Compiler` for the planners to read through their context
   (`Parsed::math`); nothing writes it after. `PlanCtx::parsed_math`
   clones a parse error rather than removing it, so `Error` is now
   `Clone`, its one payload that was not (`Json`'s `serde_json::Error`)
   held in an `Arc`. Passing `Parsed` to planning as an argument is step
   7.
7. **`plan` returns `Planned`**, given `&Outline` and `&Parsed`; `link`
   takes it. `Compiler` is left as planning's own state, or goes. Done,
   with one difference: the planners read what outlining settled and
   parsing made through their context (`PlanCtx` wraps `Compiler`), so
   `Compiler` holds them as shared references (`settled: &Settled`,
   `parsed: &Parsed`), set by `Compiler::compile` once each stage is done,
   rather than taking them as arguments. They cannot be changed through
   those references, which the compiler checks. `Compiler::compile` now
   runs the stages (`compile_all` is gone), since a method cannot lend
   `Compiler` a value it made. `Outline` carries a `Settled`: the name
   table, the clones made, an answer's when references and responses,
   and the referent readers outlining found. `plan_all` returns
   `Planned` (shares, shared state, its referent readers), filled while
   it runs as `Compiler::planning` and passed to `link` and `seal`; the
   name table reaches sealing from `Settled`. What stays on `Compiler`:
   the compile (`Compiled`, the reference arena in it, which every stage
   appends to), the boxes (`errors`, `boxed_here`, `restart`) and
   the caches (`extend_refs`, `string_ids`, `prop_sels`, `ref_subst`). The
   earlier steps' notes name `compile_all`; its body is now
   `Compiler::compile`'s.
8. **Files by stage.** Move the files; `ARCHITECTURE.md` and `CONTEXT.md`
   name the new paths.
