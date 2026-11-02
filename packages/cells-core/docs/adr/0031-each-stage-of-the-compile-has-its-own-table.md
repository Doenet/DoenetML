# Each stage of the compile has its own table

Status: proposed 2026-11-02. Steps 1 and 2 are done; see Migration. Amended
2026-11-02: the boundaries the tables draw leak in three places (boxing,
the planner context, code more than one stage runs); see "Where the
boundaries leak".

ADR 0030 made each stage of the compile a function of what it reads, and
its results values: outlining's `Outline` and `Settled`, parsing's
`Parsed`, planning's `Planned`. But most of what the stages make is
none of these. It is one row per element, `Elem` (`compile/plan.rs`),
which every stage writes in place: outlining pushes it, planning fills
its plans, linking aliases slots in them, boxing rewrites it, and sealing
gives it a key and a slot offset. So which stage made a field is
something one learns by reading the code, and nothing stops a stage
from writing a field it should only read.

This ADR splits `Elem` into one table per stage, parallel to each
other: row `e` of each is element `e`. A stage fills its own table and
reads earlier ones.

## Context

`Elem`'s fields by the stage that writes them:

| Field | Written by | Read by |
|---|---|---|
| `node`, `name`, `name_scope`, `planned_as`, `cloned` | outline | every later stage, the build |
| `component_type` | outline (a `<math>`'s settled type); boxing (`Error`) | every later stage, the build |
| `children` | outline (`Child::Macro(RefId::NONE)` placeholders); planning (a `$ref` child's plan, or its box); boxing (cleared) | planning, the build |
| `body` | outline (repeat, choice, a collect's type); planning (a collect's `from`, a point list's); boxing (reset) | planning, refs, the build |
| `extend` | outline (a container copy's); planning (the rest's); boxing (cleared) | planning, linking, the build |
| `props`, `n_public`, `hold` | planning; linking (a shared slot's alias); boxing (cleared) | linking, sealing, the build |
| `dead` | boxing | the build |
| `key`, `slot_off` (and the template's `n_slots`) | seal | the build, saved state |

Three things cut across stages:

- **Boxing rewrites what earlier stages made.** A box is an element
  whose `component_type` is `Error`, so boxing an element planned or
  linked overwrites what outlining settled, and clears its children,
  body and extend, which outlining made. Whether an element is a box is
  read off its type.
- **Planning writes into outlining's child lists.** A `$ref` child is a
  `Child::Macro` placeholder outlining leaves in a child list, which
  planning fills with the reference's plan, or replaces with a box.
- **An `extend` is planned by whichever stage needs it first**
  (`plan_extend`): outlining for a container copy, planning for the
  rest.

## Decision

Each template holds one table per stage, each a `Vec` indexed by
`ElemId`:

| Table | Row | Made by |
|---|---|---|
| `elems` | what outlining settles: node, name, name scope, type, the type planned as, whether cloned, children, body shape, extend | outline |
| `plans` | props, `n_public`, hold, what planning adds to a body (a collect's or point list's `from`) | plan (link aliases shared slots in it) |
| `boxes` | live, boxed, or dead (under a box) | boxing, in any stage |
| `sealed` | key, slot offset (and the template's slot count) | seal |

- **A box is a row in `boxes`, not a type.** Boxing no longer rewrites
  outlining's row or clears planning's: an element is a box when its
  `boxes` row says so, and the build makes an `_error` component for it
  and nothing under it. `Compiled` answers what type to read an element
  as (`Error` for a box). An element boxed from the start of a compile
  (an earlier compile's box, a tag outlining cannot read) is outlined as
  `Error` as now, having no other type.
- **A `$ref` child's plan is planning's.** Outlining gives each `$ref`
  child a dense id in its child list (`Child::Macro(MacroId, _)`), and
  planning fills a table of their plans, a reference or the box made for
  one that cannot be planned.
- **Every `extend` is planned when outlining.** Since ADR 0029 a
  reference's plan reads only what outlining settled (types, bodies,
  clones), so outlining can plan every element's `extend` once the walk
  and the container copies are done, and decide its default prop as
  `plan_extend` does now. `extend` joins outlining's row, and a failure
  boxes the element when outlining rather than when planning; the
  diagnostic is the same.
- **Outlining's table is read-only after outlining.** It moves into
  `Settled` while the later stages run, so the borrow checker keeps it
  as outlining left it (ADR 0030), and is put back in `Compiled` with
  the other tables at the end.

`Elem` goes. A reader that wants a stage's facts reads that stage's
table; the build reads all four.

## Where the boundaries leak

Tables alone make a layout, not a wall. Three places cross them, and
each needs its own fix for the split to hold.

### Boxing

Boxing cuts across outlining, planning and linking by design, so it must
write only its own table. Today it writes four things that are not its
own:

- **Outlining's row.** `make_box` sets the type to `Error` and clears
  children, body and extend; `box_in_place` also drops a name the name
  table did not register (`drop_unregistered_name`). That only happens
  to an element whose name was a duplicate, which outlining finds when it
  pushes the element, so outlining drops the name there, and boxing
  never touches the name.
- **A row of outlining's table, added while planning.** A `$ref` child
  that cannot be planned is boxed by pushing a new `_error` element
  (`push_error_elem` in `plan_all`), the one exception to "only
  outlining makes elements" (ADR 0030, step 4). Its box goes in the
  table of `$ref` children's plans instead, and the build makes the
  `_error` component from that. The exception goes.
- **Planning's diagnostics.** The unread-attribute check removes the
  errors and warnings planners reported under what it boxes
  (`box_unread_attributes`). Instead, every diagnostic stays where its
  stage reported it, and the compile leaves out those on dead elements
  once, when it assembles the list, whichever stage boxed them.
- **What a reference plan reads.** `plan_ref` stops a path at a box
  (`component_type == Error`). During planning that reads boxes made so
  far, so a path through an element boxed in place plans differently
  depending on whether it was planned before or after the box: an
  order dependence ADR 0029 meant to remove. `plan_ref` reads no boxes:
  a path continues through a box's outlined row, and the build reads a
  reference into a box or under one as undefined, as it already does
  for an element under a box.

What may read boxes is then two things: linking (`box_readers_of_boxes`),
and `referent_type` while planning, which reads only the boxes outlining
made (an element outlined as `Error`), so that planning, too, is
independent of its own order. A reader of a box made while planning is
boxed when linking, as now.

### The planner context

`PlanCtx` wraps the whole `Compiler`. A planner under `components/`
reaches it only through `PlanCtx`'s methods, which is a narrow surface,
but the machinery behind them (`compile/planning/`) is `impl Compiler`
and can write anything: it indexes the templates directly in some 70
places, and writes `ChoiceDef`s, which outlining made. Until planning
runs against a view of its own, the tables are a layout.

The view is a `Planning` struct, and `PlanCtx` wraps it rather than
`Compiler`. It holds, read-only, outlining's table, `Settled` and
`Parsed`; and, writable, planning's table, the reference arena and
expressions (append-only), `Planned`, its caches and its warnings.
Planning's machinery is `impl Planning`. It does not box: a planner
returns its error, and `plan_elem`, outside the view, boxes. An owner
planning what it owns (ADR 0029: an answer its awards, a repeat its
iteration elements) writes those rows of planning's table, and no
others. What a choice's planner decides moves from `ChoiceDef` to
planning's table.

### Code more than one stage runs

`plan_ref` runs while outlining (a container copy's `extend`, an
answer's whens), parsing (a math's `$ref`s) and planning. It must read
only what every one of them has: the name table and outlining's rows
(and a choice's branches, which outlining makes). Today it also:

- **Expands container copies** (`outlined_elem`): a path through a copy
  not yet given its clones expands it first. That is outlining's work,
  done from inside the shared function, and a no-op afterwards. Instead
  `plan_ref` reports the copy it needs (an error naming it), and
  outlining's expansion expands that copy and plans the reference
  again; a copy reached again while it expands is still a cycle.
- **Reads planning's substitutions** (`ref_subst`: `$mi` in a `<when>`
  is the answer's submitted response). That substitution is planning's
  and moves to planning's view, which checks it before calling the
  shared function.
- **Writes outlining's `ChoiceDef`** (`iface_step` appends to `used`,
  the interface names references use, in first-use order). Which
  reference is planned first depends on the stage and the order, so the
  list does too. A step into an interface names the interface name by
  its name-table id, and sealing makes `used` from every reference plan,
  in the order they were planned.
- **Reads boxes**, above.

What `plan_ref` writes is then the reference arena (append-only) and
`prop_sels`, a cache of a function of the source alone.

## Considered options

- **One table per stage across the whole compile, rather than per
  template.** Fewer `Vec`s, but every reader would index by (template,
  element) into a flat table through an offset per template, where a
  template's tables are what a build stamps one at a time. Per template
  matches how everything reads them.
- **Keep `Elem` and document who writes each field.** ADR 0030's step 1
  did this for `Compiler`; it showed what was wrong without stopping
  it. The table is where the stages' writes are kept apart, so that is
  where the split pays.
- **Keep boxes as a type.** Fewer readers to change, but boxing would
  still overwrite outlining's row, and outlining's table could not be
  read-only.

## Consequences

- Which stage made a fact is the table it is in. A stage cannot write
  an earlier one's table: outlining's by the borrow checker, sealing's
  and planning's by being made only where their stage runs.
- A box keeps what outlining and planning made of it, which the build
  ignores. Diagnostics of a box are unchanged.
- The build reads four rows where it read one. The tables are indexed
  the same way, so this is the same number of lookups into smaller rows.
- `ChoiceDef` mixes stages the same way (outlining's branches and
  weights, sealing's interface); it is left for later.

## Migration

Each step lands alone, with the golden diff unchanged unless it says
otherwise.

1. **Sealing's table.** `key` and `slot_off` leave `Elem` for
   `Template::sealed`, a `Vec<Sealed>` that sealing makes, and the
   template's slot count goes with them. Done.
2. **Boxes.** `Template::boxes`, a `Vec<BoxState>` (`Live`, `Boxed`,
   `Dead`), replaces a box's `Error` type and `dead`; boxing writes
   nothing else of any stage's (no `make_box` clearing, no
   `drop_unregistered_name` outside outlining); diagnostics on dead
   elements are left out once, at the end; `plan_ref` reads no boxes,
   and `referent_type` reads only outlining's while planning. Readers
   ask whether an element is a box (`Compiled::is_box`) and what type to
   read it as.
   Done. A `BoxState::Boxed` row holds the box as the build sees it
   (`Elem::as_box`: type `Error`, its node and name, nothing else), the
   stage that boxed it, and whether it is dead; sealing and the build
   read `Template::row`, which is that row for a box and the element's own
   otherwise, and nothing reads `Elem::dead`, which is gone. The checks
   for a box are `Template::is_box` and `is_dead`. A box a reader of its
   referent's type may see is `Compiler::is_visible_box`: while planning,
   only one outlining made; `read_referent` finds the referent's element
   with `ref_target`, since a box made in place keeps its outlined type.
   `plan_ref` stops a path only at an element outlined as `Error`, which
   has no children to go on to; through any other box the path goes on,
   and the build reads what is under it as undefined. Boxing's report
   rule is `drop_reports_of_boxes`, run once at the end of the compile: a
   box keeps its own error and loses its warnings, and what is under it
   loses both. That is what the unread-attribute check did for its own boxes. For a box made while planning or linking, its own warnings, and the errors and warnings of what is under it, reported before it was boxed, are now left out too, where they were reported before; no test or golden document has such a report.
   Tests: a box keeps outlining's row (`compile/boxes.rs`), and a
   reference through a box made while planning and a copy of what is
   under it give the same values and diagnostics in either order
   (`tests/diagnostics.rs`).
3. **`$ref` children.** Dense ids in child lists, and a table of their
   plans that planning fills, a box among them; planning makes no
   element, and the debug assertion of ADR 0030 loses its exception.
4. **`plan_ref` reads only outlining's facts.** Container copies are
   expanded by outlining when a reference reports one it needs;
   `ref_subst` moves out of it; an interface step names its name by id,
   and sealing makes `used`.
5. **Planning's table.** `props`, `n_public`, `hold`, a body's `from`
   and what a choice's planner decides leave `Elem` and `ChoiceDef` for
   `Template::plans`.
6. **Every `extend` planned when outlining.** `extend` joins outlining's
   row.
7. **Planning's view.** `Planning`, holding outlining's table, `Settled`
   and `Parsed` read-only and planning's table writable; `PlanCtx` wraps
   it, and planning's machinery is `impl Planning`. Outlining's table
   moves into `Settled` while the later stages run.
