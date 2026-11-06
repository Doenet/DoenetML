# Changing the compile

For someone changing how the source becomes plans: the compile runs once
per load and depends on the source alone (ADR 0015). Its result,
[`Compiled`](crate::Compiled), is what every build of the document
stamps: one [`Template`](crate::compile::plan::Template) per document,
repeat body and choice branch, with a plan for every prop and a path
through the template nesting for every reference.

## The stages

The compile runs in stages (ADR 0027), each a function of what the
stages before it made (ADR 0030), each writing a table of its own (ADR
0031). [`compile::compile`](crate::compile::compile) is the entry; it
lints, then runs the stages in
[`Compiler::compile`](crate::compile::Compiler::compile), then the check.

| Stage | Module | Entry | Makes | ADR |
|---|---|---|---|---|
| lint | [`compile::lint`](crate::compile::lint) | [`lint`](crate::compile::lint::lint) | findings from the DAST alone; records no read | 0021, 0027 |
| outline | [`compile::outline`](crate::compile::outline) | [`Outlining::outline`](crate::compile::outline::Outlining::outline) | every element, template and name: [`Settled`](crate::compile::Settled), read-only after it, and the work for the stages after it ([`Outline`](crate::compile::Outline)); plans nothing | 0030 |
| parse | [`compile::parse`](crate::compile::parse) | [`Compiler::parse_maths`](crate::compile::Compiler::parse_maths), [`Compiler::parse_records`](crate::compile::Compiler::parse_records) | every `<math>`'s text parsed once, as outlining settled its type, and every element's record: [`Parsed`](crate::compile::parse::Parsed) | 0034 |
| plan | [`compile::planning`](crate::compile::planning) | [`Planning::plan_all`](crate::compile::planning::Planning::plan_all) | every element's plans and hold, every `$ref` child's plan (planning's columns of [`Tables`](crate::compile::plan::Tables)), and [`Planned`](crate::compile::Planned) for linking and sealing | 0029, 0034 |
| link | [`compile::link`](crate::compile::link) | [`Compiler::link`](crate::compile::Compiler::link) | readers of boxes boxed to a fixpoint, elements with an attribute nothing read boxed, shared state tied | 0021, 0032 |
| seal | [`compile::seal`](crate::compile::seal) | [`Seal::run`](crate::compile::seal::Seal::run) | choice interfaces, arity, keys, slot offsets and every port's type: a [`SealedTemplate`](crate::compile::plan::SealedTemplate) per template and a [`ChoiceSeal`](crate::compile::plan::ChoiceSeal) per choice | 0032 |
| share | [`compile::share`](crate::compile::share) | [`Plans::share`](crate::compile::plan::Plans::share) | equal derived ports made aliases, and the expression classes | 0033 |
| check | [`compile::check`](crate::compile::check) | [`template_graph_checked`](crate::compile::graph::template_graph_checked) | over the [`TemplateGraph`](crate::compile::graph::TemplateGraph): the elements that cannot be built, the cycle check, the structural depth, define, each port's attributes ([`Checked`](crate::compile::plan::Checked)), the constants, the load-time choices and the warnings | 0012, 0014, 0035, 0036, 0037 |

Each template is the stages' tables put together once the compile is
done: outlining's part ([`Outlined`](crate::compile::plan::Outlined)),
boxing's and planning's ([`Tables`](crate::compile::plan::Tables)),
sealing's ([`SealedTemplate`](crate::compile::plan::SealedTemplate)) and
the check's ([`Checked`](crate::compile::plan::Checked)).

What more than one stage runs has a module of its own: names
([`compile::names`](crate::compile::names)), reference plans
([`compile::refs`](crate::compile::refs)), math text
([`compile::maths`](crate::compile::maths)), reading the source
([`compile::source`](crate::compile::source),
[`compile::values`](crate::compile::values),
[`compile::record`](crate::compile::record)) and boxing
([`compile::boxes`](crate::compile::boxes)). The readers are methods of
[`Reader`](crate::compile::reader::Reader): the source and what outlining
settled, read-only, which every stage holds or makes. What they write is
an [`Arenas`](crate::compile::reader::Arenas), the reference and
expression arenas and what else only grows, handed to them `&mut`;
boxing's methods are [`Boxes`](crate::compile::boxes::Boxes)'s, handed
the tables they read and write.

## Planning

A planner reads the source and what outlining and parsing made, never
another element's plan (ADR 0029), so elements are planned in any order:
what one shares with another (an extend's essential state) is linked
once all are planned. A planner is a function of its element's record
(ADR 0034) and reaches the compile only through
[`compile::api`](crate::compile::api); see the
[component chapter](crate::_guide::component). Behind
[`PlanCtx`](crate::compile::api::PlanCtx) is planning's view,
[`Planning`](crate::compile::planning::Planning): what outlining settled
and what parsing made, read-only, and planning's table, the boxes and the
arenas, writable (ADR 0031, "The planner context").

## Boxing

An element that fails is *boxed* where it fails (ADR 0027): it is
compiled as an `_error` element with no children or props, it keeps its
name, and what is under it dies with it. Boxing writes only its own table
([`Boxes`](crate::compile::boxes::Boxes), ADR 0031), which the driver
hands to the stages that box (outlining, planning, linking) and to no
other: what outlining and planning made of the element stays as they
made it, and the build reads the box's row instead. Every cross-element
read is recorded, and linking boxes the readers of every box to a
fixpoint (ADR 0032), so a box's readers never stand on what it was.

## The retry

A failure no element can carry in place, one sealing or the check finds,
ends the compile at the next stage boundary as a
[`Failure`](crate::compile::Failure) that names the element to box. The
compile then runs again from outlining with that element's node boxed
from the start, until the check passes. Only a failure with no element
to box, a dependency cycle, fails the load. The diagnostics are the
boxes' errors, the planners' and the check's warnings, and the lint
findings: a function of the source alone (ADR 0014), which
[`diagnose`](crate::diagnose) reports without loading.
