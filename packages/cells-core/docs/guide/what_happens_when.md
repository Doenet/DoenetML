# What happens when…

For someone tracing what the core does in one situation, from the entry
point a caller reaches to the module that does the work. Each section
names the files it passes through, relative to `crates/cells-core/src/`.

## A document loads

[`Document::load`](crate::Document::load) (`document/load.rs`):

1. The bytes become a [`Dast`](crate::dast::Dast).
2. The compile runs once: lint, plan, check. The check also
   marks which ports are writable (ADR 0018), which are
   live (ADR 0019), which are document constants and which hold counted
   values (ADR 0028), which every build reads, and the structural depth,
   which bounds the passes below.
3. Builds run from the compile, each at the counts it is asked for, until
   the structure settles. After each build the document computes every
   derived cell once; if a repeat's `count` cell now disagrees with the
   number of iterations it was built with, the build runs again at the new
   counts. [`LoadTimings::passes`](crate::LoadTimings::passes) records how many builds it took.

## A user drags a point

[`Document::request`](crate::Document::request) and its variants (`document/request.rs`):

1. The renderer sends requests addressed by cell index (ADR 0001). A
   request on a cell that is not interactive (`document/interactive.rs`,
   a bit per cell made with each build) is refused (ADR 0018), and
   infinite values are dropped.
2. Requests on members of a sticky group are snapped (`document/sticky.rs`,
   `tick/snap.rs`, ADR 0007).
3. [`tick::invert::invert_requests`](crate::tick::invert::invert_requests) walks each request backwards through the
   inverses of the instructions that produced its cell, until it lands on
   essential cells. Dragged point groups are kept together (ADR 0003,
   ADR 0006).
4. The essential writes are applied and the document recomputes as its
   [`Recompute`](crate::Recompute) setting says (`tick/eval.rs`). By default this is the
   [`DirtyClosure`](crate::DirtyClosure), which runs only the instructions downstream of a
   changed cell; [`Recompute::Full`](crate::Recompute::Full) runs all of them and can be selected
   with [`set_evaluator`](crate::Document::set_evaluator).
5. The [`TickOutcome`](crate::TickOutcome) lists the cells that changed and the requests that
   were dropped.

## A repeat's count changes

When a tick leaves a structural cell, such as a repeat's count, out of step
with the structure, it calls [`Document::rebuild`](crate::Document::rebuild) (ADR 0004). This builds the
whole document again from the [`Compiled`](crate::Compiled) kept at load, at the counts the
count cells now hold. No lint, plan or check runs again, and no document
constant is made again: the build starts its cells from the session's
constant pool, whose cells keep their indices (ADR 0028).

Because scope ids are stable, an iteration that comes back gets its old
essential values, and its nested repeats get the counts they last asked for
([`Session::counts`](crate::session::Session::counts)), so a rebuild usually settles in one pass. In the
outcome, `rebuilt` is set (cell indices are new), and
`rebuild_passes` says how many builds it took. If the rebuild fails, the
document is unchanged and `rebuild_error` says why.

## An element cannot be built

Errors are a build product, not a failure (ADR 0013). An element that
fails to plan is *boxed* where it fails (ADR 0027): it is built as an
`_error` element with no children or props, what is under it is never
built, and planning goes on. A box is a row of boxing's own table
([`Tables::boxes`](crate::compile::ir::Tables::boxes), ADR 0031), so what outlining and planning made of the
element stays as they made it; the build reads the box's row
([`Template::row`](crate::compile::ir::Template::row)). Planning goes on, so one compile finds every planning
error; every read of another element's facts is recorded (an extend's of
its referent, a container copy's of what it clones, a clone's of its
original), and linking boxes the readers of every box to a fixpoint (ADR
0032), so a box's readers never stand on what it was. An error the
check raises records the innermost element it concerns, which is boxed
from the start of a new compile, and the check runs again until every
element builds. A box keeps its name (ADR 0027): a reference to it
resolves and reads as undefined, with no diagnostic of its own, and an
extend of it is boxed in turn (`cells-boxed-referent`). Only an error with
no element to box, a dependency cycle, fails the load.

[`Document::diagnostics`](crate::Document::diagnostics) lists, in node order, the lint findings plus the
errors and warnings of the elements that built.

An element is also boxed for an attribute nothing read while the document
was planned (ADR 0021): the core ignores no attribute silently.
[`Dast::attr`](crate::dast::Dast::attr) records every lookup, and a build makes none; once planning
is done, every element outside the boxes with an attribute never looked
up, and not one a renderer reads ([`PRESENTATION_ATTRS`](crate::components::PRESENTATION_ATTRS), a type's
`presentation`), is boxed in place when linking (`compile/stages/link/unread.rs`, ADR
0030), all of them at once, like any failure: what its planning reported
under it is dropped, and a reference into it reads undefined.

Every error depends on the source alone (ADR 0014), and the template
graph stands for every count and every pick, so the check finds every error at
load. Later builds never find a new one: a build's error type
([`build::BuildError`](crate::build::BuildError)) has no variant for an author's mistake, and a build
that hits one anyway fails with [`BuildError::Unchecked`](crate::build::BuildError::Unchecked) instead of boxing
mid-session.

## The language server asks for diagnostics

[`diagnose`](crate::diagnose) (`compile/mod.rs`) runs the compile's check without loading a
document. Its result is a function of the DAST alone, at any seed and any
count, and equals what a load reports.

## An answer is submitted

[`Document::submit`](crate::Document::submit) (`document/sections.rs`) is an action, not a request (ADR
0018): the core copies the response into the answer's `submitted` cell and
counts the submission as one tick, through the same inversion a request
uses, and credit recomputes through the cells that
`build/expand/aggregate.rs` materialized. The props it writes are marked
`written_by_action`, not `interactive`, so no renderer can set them.
[`Document::trigger`](crate::Document::trigger) (`document/request.rs`), a `<triggerSet>`'s press, is
the other action: it sets each `<updateValue>`'s target.
