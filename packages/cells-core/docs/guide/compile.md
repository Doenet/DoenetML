# Changing the compile

For someone changing how the source becomes plans: the compile runs once
per load and depends on the source alone (ADR 0015). Its result,
[`Compiled`](crate::Compiled), is what every build of the document
stamps: one [`Template`](crate::compile::ir::Template) per document,
repeat body and choice branch, with a plan for every prop and a path
through the template nesting for every reference.

## The stages

The compile runs in stages (ADR 0027), each a function of what the
stages before it made (ADR 0030), each writing a table of its own (ADR
0031), each a module of [`compile::stages`](crate::compile::stages) with
one entry function; how a stage reads and writes the tables is its
module's own business. [`compile::compile`](crate::compile::compile) is
the entry; it lints, then runs the stages in
[`Compiler::compile`](crate::compile::Compiler::compile), then the check,
and boxes and compiles again until the check passes
([`plan_and_check`](crate::compile::plan_and_check)). What the stages
write and the stages after them and the build read is in
[`compile::ir`](crate::compile::ir).

| Stage | Module | Entry | Makes | ADR |
|---|---|---|---|---|
| lint | [`stages::lint`](crate::compile::stages::lint) | [`lint`](crate::compile::stages::lint::lint) | findings from the DAST alone; records no read | 0021, 0027 |
| outline | [`stages::outline`](crate::compile::stages::outline) | [`outline`](crate::compile::stages::outline::outline) | every element, template and name: [`Settled`](crate::compile::ir::Settled), read-only after it, and the work for the stages after it ([`Outline`](crate::compile::ir::Outline)); plans nothing | 0030 |
| parse | [`stages::parse`](crate::compile::stages::parse) | [`parse`](crate::compile::stages::parse::parse) | every `<math>`'s text parsed once, as outlining settled its type, and every element's record: [`Parsed`](crate::compile::stages::parse::Parsed) | 0034 |
| plan | [`stages::plan`](crate::compile::stages::plan) | [`plan`](crate::compile::stages::plan::plan) | every element's plans and hold, every `$ref` child's plan (planning's columns of [`Tables`](crate::compile::ir::Tables)), and [`Planned`](crate::compile::ir::Planned) for linking and sealing | 0029, 0034 |
| link | [`stages::link`](crate::compile::stages::link) | [`link`](crate::compile::stages::link::link) | readers of boxes boxed to a fixpoint, elements with an attribute nothing read boxed, shared state tied | 0021, 0032 |
| seal | [`stages::seal`](crate::compile::stages::seal) | [`seal`](crate::compile::stages::seal::seal) | choice interfaces, arity, keys, slot offsets and every port's type: a [`SealedTemplate`](crate::compile::ir::SealedTemplate) per template, a [`ChoiceSeal`](crate::compile::ir::ChoiceSeal) per choice, and the [`Keys`](crate::compile::keys::Keys) | 0032 |
| share | [`stages::share`](crate::compile::stages::share) | [`share`](crate::compile::stages::share::share) | equal derived ports made aliases, and the expression classes | 0033 |
| check | [`stages::check`](crate::compile::stages::check) | [`check`](crate::compile::stages::check::check) | over the [`TemplateGraph`](crate::compile::graph::TemplateGraph): the elements that cannot be built, the cycle check, the structural depth, define, each port's attributes ([`Checked`](crate::compile::ir::Checked)), the constants, the load-time choices and the warnings: [`Checks`](crate::compile::stages::check::Checks) | 0012, 0014, 0035, 0036, 0037 |

Each template is the stages' tables put together once the compile is
done: outlining's part ([`Outlined`](crate::compile::ir::Outlined)),
boxing's and planning's ([`Tables`](crate::compile::ir::Tables)),
sealing's ([`SealedTemplate`](crate::compile::ir::SealedTemplate)) and
the check's ([`Checked`](crate::compile::ir::Checked)).

What more than one stage runs is in
[`compile::read`](crate::compile::read), reading the source: names
looked up, reference plans (`refs`), math text (`maths`), literal values
and children (`source`, `values`), point lists, records read from another
template (`rebase`) and an answer's form. The readers are methods of
[`SourceReader`](crate::compile::read::SourceReader): the source and what
outlining settled, read-only. It hands out no row of outlining's tables;
[`Reader`](crate::compile::read::Reader), which every stage but planning
holds or makes, is the readers and the rows. What they write is
an [`Arenas`](crate::compile::read::Arenas), the reference and
expression arenas and what else only grows, handed to them `&mut`. An
element's record ([`compile::ir::record`](crate::compile::ir::record))
and the name table ([`compile::ir::names`](crate::compile::ir::names))
are read the same way, beside the types they make. Boxing's methods are
[`Boxes`](crate::compile::ir::boxes::Boxes)'s, handed the tables they
read and write.

## Planning

A planner reads the source and what outlining and parsing made, never
another element's plan (ADR 0029), so elements are planned in any order:
what one shares with another (an extend's essential state) is linked
once all are planned. A planner is a function of its element's record
(ADR 0034) and reaches the compile only through
[`compile::api`](crate::compile::api); see the
[component chapter](crate::_guide::component). Behind
[`PlanCtx`](crate::compile::api::PlanCtx) is planning's view, `Planning`
([`compile::stages::plan`](crate::compile::stages::plan)): what outlining settled
and what parsing made, read-only, and planning's table, the boxes and the
arenas, writable (ADR 0031, "The planner context").

Planning holds no `Reader`. It reaches a row of outlining's tables
through `Rows` (`stages/plan/rows.rs`), by the relation the read is (ADR
0050, decision 3), and the raw index into a template's rows does not
compile in any other file of `stages/plan/`:

| The accessor | The row | Where the dependency is |
|---|---|---|
| `own_row` | the element being planned | nowhere |
| `enclosing_row`, and the walks on it: `in_graph`, `under_graph`, `nearest_attr` | an ancestor | the tree |
| `owned_row`, `body_rows` | an element under the one planned, which its plan is made of (an answer's input, a choice input's choice, an owned input, a repeat's hidden elements) | the plan, which reads a port of it |
| `referent_row` | an element a reference names, read for more than its type | the plan, where the reference is in a source; else the read list |

None of them records a read. The one recorded read is the readers'
`referent_type`, of a referent's settled type.

## Boxing

An element that fails is *boxed* where it fails (ADR 0027): it is
compiled as an `_error` element with no children or props, it keeps its
name, and what is under it dies with it. Boxing writes only its own table
([`Boxes`](crate::compile::ir::boxes::Boxes), ADR 0031), which the driver
hands to the stages that box (outlining, planning, linking) and to no
other: what outlining and planning made of the element stays as they
made it, and the build reads the box's row instead.

What depends on a box goes with it or reads it as missing, by where the
dependency is (ADR 0050, decision 2):

| The read | Where the dependency is | What boxing does |
|---|---|---|
| Of an ancestor: the graph an element sits in, the nearest container whose `fixed` it inherits (ADR 0022), a provided prop (ADR 0040) | The tree | `box_in_place` boxes everything under the element it boxes |
| One that is in the plan: a port of another element (`Arg::Elem`), a reference in a source | The plan | linking boxes what reads a port of a box (`box_elem_readers_of_boxes`); a reference to a box reads the missing value |
| One that decides the plan and is not in it: a referent's settled type | The read list (`Outline::reads`, `Planned::reads`) | linking boxes the reader, to a fixpoint (`box_readers_of_boxes`) |

A dependency is read off the tree or the plan where they show it, and
recorded only where they do not, so a box's readers never stand on what
it was and no site can forget to record what is read off.

**A new relation between elements says which row it is.** A read of what
encloses an element goes through `enclosing_row` and is the first row. A
source that names another element's port is the second, and needs
nothing. A read of another element that decides the plan and leaves no
port or reference in it is the third: it goes through `referent_type`,
or, if the element is no referent, it is the case the read list would
have to be widened for (ADR 0050, consequences). It adds no mechanism
of its own.

## The retry

A failure no element can carry in place, one sealing or the check finds,
ends the compile at the next stage boundary as a
[`Failure`](crate::compile::Failure) that names the element to box. The
compile then runs again from outlining with that element's node boxed
from the start, until the check passes. A dependency cycle boxes the
component it names (ADR 0013's amendment). Only a failure with no
element to box, a cycle through no component the author wrote, fails
the load. The diagnostics are the
boxes' errors, the planners' and the check's warnings, and the lint
findings: a function of the source alone (ADR 0014), which
[`diagnose`](crate::diagnose) reports without loading.
