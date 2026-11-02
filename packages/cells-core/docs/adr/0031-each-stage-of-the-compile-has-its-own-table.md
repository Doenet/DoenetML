# Each stage of the compile has its own table

Status: proposed 2026-11-02. Step 1 is done; see Migration.

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

Each step lands alone, with the golden diff unchanged.

1. **Sealing's table.** `key` and `slot_off` leave `Elem` for
   `Template::sealed`, a `Vec<Sealed>` that sealing makes, and the
   template's slot count goes with them. Done.
2. **Boxes.** `Template::boxes`, a `Vec<BoxState>` (`Live`, `Boxed`,
   `Dead`), replaces a box's `Error` type and `dead`; boxing stops
   clearing outlining's and planning's rows, and readers ask whether an
   element is a box (`Compiled::is_box`) and what type to read it as.
3. **`$ref` children.** Dense ids in child lists, and a table of their
   plans that planning fills.
4. **Planning's table.** `props`, `n_public`, `hold` and a body's `from`
   leave `Elem` for `Template::plans`.
5. **Every `extend` planned when outlining.** `extend` joins outlining's
   row.
6. **Outlining's table read-only.** What is left of `Elem` is
   outlining's row; it moves into `Settled` while the later stages run.
