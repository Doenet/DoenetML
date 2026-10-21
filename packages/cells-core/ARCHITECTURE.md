# Architecture

A DoenetML core organized around a flat array of `f64` **cells** rather than
around components. Components and props are a naming layer over cell
indices; the dependency graph is a list of **instructions**, each an
operator that computes derived cells from other cells and may carry an
inverse. This file is the map. `CONTEXT.md` defines the vocabulary,
`docs/adr/` records why things are the way they are. The core was built in
numbered rounds (plans 2 to 8) before it joined this repository; where an
ADR or a comment cites a plan by number, it means that round's brief and
measurements, which are not in this repository.

## The pipeline

```
 DoenetML source
       │  @doenet/parser (scripts/parse-dast.mjs) → JSON or binary CDST
       ▼
 ┌───────────┐
 │ dast/     │  Dast: flat, columnar nodes and one string table
 └─────┬─────┘
       ▼
 ┌─────────────────────────────┐
 │ compile/   plan: DAST →     │  once per load (ADR 0015); uses components/
 │            templates, plans │
 │            check: probe,    │  every error found here (ADR 0014)
 │            box, lint        │
 └─────────────┬───────────────┘
               │ Compiled (kept for rebuilds)
               │                    ┌──────────────── rebuild ───────────────┐
               ▼                    │                                        │
 ┌──────────────────────────────────┴┐                                       │
 │ build/     reads the Session      │  at load and on every count change    │
 │  expand/   templates →            │  once per scope (document, iterations)│
 │            components, slots      │                                       │
 │  emit.rs   slots → cells,         │                                       │
 │            instructions           │                                       │
 └─────────────┬─────────────────────┘                                       │
               │ BuildOutput                                                 │
               ▼                                                             │
 ┌─────────────────────────────┐                                             │
 │ program/   schedule:        │  Program: instructions in evaluation order  │
 │            topological sort │                                             │
 └─────────────┬───────────────┘                                             │
               ▼                                                             │
 ┌─────────────────────────────┐   a repeat count changed: build again ──────┘
 │ document/  Document         │   (the same Compiled, the Session)
 │  cells + program +          │
 │  component table + DAST     │◄──── Request / PointRequest from a renderer
 └─────────────┬───────────────┘
               │ request()
               ▼
 ┌─────────────────────────────┐
 │ tick/  sticky snap → invert │  → TickOutcome: changed cells, dropped
 │        → recompute          │    requests, whether it rebuilt
 └─────────────────────────────┘
```

The work splits by when it happens. **Build time** (`dast`, `components`,
`build`, `program`) does all the string work and all the reasoning about
the document's shape. **Tick time** (`tick`) only reads the scheduled
`Program` and writes cells. A tick never consults components, tag names or
the DAST, with one exception: the sticky-group pre-pass reads the
component table (`document/sticky.rs`).

## The main types

| Type | Where | What it is |
|---|---|---|
| `Dast` | `dast/mod.rs` | The parsed source in parallel arrays indexed by `NodeId`. Loaded from JSON (`json.rs`) or the binary wire format (`binary.rs`, ADR 0002). |
| `ComponentType`, `ComponentTypeInfo`, `PropDef` | `components/` | The tag vocabulary: each component type's props, where each prop's value comes from (attribute, default, computed from other props, or planned by the build), and flags. The list of types is `component_types!` in `mod.rs`; each type's definition is in a family file (`geometry.rs`, `inputs.rs`, ...). |
| `Compiler`, `Compiled`, `Template` | `compile/` | The compile stage (ADR 0015): its state and output: one template per repeat body, choice branch and the document, with a *plan* for every prop and reference. Nothing in a plan names an iteration. |
| `Builder` | `build/expand/mod.rs` | The state of expand and emit: components and slots per scope, then cells and instructions. |
| `View`, `Stamped` | `build/view.rs` | The structure view, the one interface through which a build learns iteration counts, indexed referents, a collect's count and a select's options. `Stamped` answers from the counts a build is asked for; the cycle check's probe (`build/probe.rs`) folds every iteration into one. A structural read that bypasses it is one the cycle check cannot model. |
| `BuildOutput` | `build/mod.rs` (`build::build`) | Cells, instructions and the component table, before scheduling. `schedule` turns it into a `Document`. |
| `Compiled` | `compile/plan.rs` | The compile (ADR 0015): templates, plans, the source's diagnostics. Made once per load; kept by a document with a repeat for its rebuilds. |
| `Session`, `Counts`, `Structure` | `session.rs`, `build/structure.rs` | What survives every build: the scope table, every essential value by (scope, template slot), parked restored values, runtime strings, the seed, the math engine (`Session`); the counts a build stamps (`Counts`); what one build made: its repeats and its essential cells' keys (`Structure`). A build reads the session and returns the next one, so a failed rebuild leaves the document as it was. |
| `Program`, `Instr`, `Op`, `VecOp` | `program/` | The instruction set. `Op` (`scalar.rs`) is a bound operator with its evaluation and inverse; vector operators (`vector.rs`) read and write several cells; symbolic ones call the math engine. `Program::value_types` records each cell's value type (`ValueType`): number, text (a string id) or math (a handle). |
| `Document` | `document/mod.rs` | A loaded document: `cells`, `program`, `components` (the `ComponentTable`), the string table, its `Structure`, and the source's literal attributes (`LiteralAttrs`, `dast/attrs.rs`) for a renderer; the DAST itself only through the compile a document with repeats keeps. The API a renderer or test uses. |
| `ComponentTable` | `document/table.rs` | Components in columns: component type, name, parent, children, and each one's prop cells: its type table's, then two per point of its list prop (ADR 0016), up to the next component's `prop_base`; its view shape and number format. What references, the renderer and export read. |
| `Request`, `PointRequest`, `TickOutcome` | `tick/` | A tick's input (set a cell; move points together) and its result. |
| `Diagnostic`, `Kind` | `diagnostics.rs` | What the build reports beyond cells (ADR 0013): kind, code, message, the DAST node. `Error::code` maps an error to its code; `compile/lint.rs` finds the ones that are facts about the DAST alone. |
| `Evaluator` | `tick/eval.rs` | A recompute strategy: `FullRecompute` runs every instruction; `DirtyClosure` only those downstream of a changed cell. A document holds a `Recompute` (the dirty closure unless `set_evaluator` says otherwise), so tests tick as the browser does. |
| `Engine`, `Tree`, `Tape` | `sym/` | The symbolic engine behind math cells, math-expressions-rs called directly (ADR 0008, ADR 0011): a math cell holds a `Handle` into it. `Tree` is the builder's expression; `Tape` (`sym/tape.rs`) is a curve of fixed shape compiled to numeric steps. |

## What happens when…

**A document loads** (`Document::load`, `document/load.rs`). The bytes become
a `Dast`. Then `compile::compile` runs once: **plan** walks the DAST and plans
every element with the planner `planner.rs` names for its type
(`compile/mod.rs`; attributes and math in `attrs.rs`, references in
`refs.rs`, geometric component types in `geometry/`, choices in
`choice.rs`). Expand and emit learn the document's structure only through
the **structure view** (`View`, `build/view.rs`): how many iterations a
repeat is stamped with, which iteration, item or pick an index names, what
a collect's count is, which options a select builds. With a repeat present,
the compile's **check** (`compile/check.rs`, ADR 0012, ADR 0014) builds the
document through the probe view (`build/probe.rs`), which folds every iteration into one and labels
each reference edge with how it moves through the iterations, rejects a
dependency loop that closes at any iteration count, and discards that
build; without one, the one stamped build is the check and the load keeps
it. Then **builds** (`build::build`) run from the compile until the
structure settles, each reading the counts it is asked for through the
`Stamped` view. **Expand** stamps each template into components once per
scope and resolves references to slots (`build/expand/`). **Emit** merges
aliased slots into cells with a union-find, numbers cells (essential,
fixed, then derived) and binds operators into instructions
(`build/emit.rs`). `BuildOutput::schedule` sorts the instructions
topologically (`Program::schedule`), and the document computes every
derived cell once. If a repeat's `count` cell now disagrees with the number
of iterations it was built with, the build runs again at the new counts;
`LoadTimings::passes` counts how many builds it took.

**A user drags a point** (`Document::request` and friends,
`document/request.rs`). The renderer sends cell-addressed requests
(ADR 0001). Infinite values are dropped. Requests on a sticky group's
members are snapped (`document/sticky.rs`, `tick/snap.rs`, ADR 0007).
`tick::invert::invert_requests` walks requests backwards through the
producing instructions' inverses until they land on essential cells,
keeping dragged point groups together (ADR 0003, ADR 0006). The essential
writes are applied, and the document's evaluator recomputes what is
downstream: the dirty closure, whose tables are built on the first tick
and dropped by a rebuild, which keeps the choice of strategy. The
`TickOutcome` lists the cells that changed and the requests that were
dropped.

**A structural cell changes**, such as a repeat's count. The tick finds the
structure unsettled after recomputing and calls `Document::rebuild`, which
builds the whole document again from the compile it kept at load
(`Document::compiled`, ADR 0015) at the counts the count cells hold,
reading the document's `Session` (ADR 0004): no compile, lint or check runs
again, and nothing leaves the document until the new one is ready (the
math engine, which the session holds, may grow). Scope ids are stable, so an iteration that comes
back gets its old values, and its nested repeats the counts they last
asked for (`Session::counts`), so the rebuild settles in one pass;
`TickOutcome::rebuild_passes` says how many it took. The outcome's `rebuilt` is set and cell indices
are new. If the rebuild fails, the document is left as it was and
`rebuild_error` says why.

**An element cannot be built** (ADR 0013). The compiler or the builder
raises an error and records the innermost element it is about;
`compile::compile` (`compile/check.rs`) boxes that node, so it compiles as an
`_error` element with no name, no children and no props, and builds
again until every element builds. The findings of `lint` (`compile/lint.rs`, one
walk over the DAST before any compile: the accessibility rules), the
errors and the warnings of the elements that built are
`Document::diagnostics`, in node order; the errors seed the boxes of
every rebuild. An error with no element, a cycle, still fails the load.
Only a document's first build finds errors (ADR 0014; `compile::compile`
compiles and boxes, `build::build` only stamps):
every error depends on the source alone, so the probe, standing for every
count and every pick, finds them all at load, and a later build that
finds one fails with `BuildError::Unchecked` rather than boxing mid-session:
a build's error type (`build::BuildError`) has no variant for an author's
error.

**The language server asks for every diagnostic** (`diagnose`,
`compile/check.rs`): the compile's check without the load, through the
same probe, which builds every option of every select. Its list is a
function of the DAST alone, at any seed and any count, and equals a
load's (ADR 0014's amendment).

**An answer is submitted** (`Document::submit`, `document/sections.rs`). This
is an ordinary request: the response handle is copied into the answer's
`submitted` cell, and credit recomputes through the cells that
`build/expand/scoring.rs` wired.

## Where to change things

**Add a component type.** A type is defined in one of the family files in
`components/` (`containers.rs`, `geometry.rs`, `inputs.rs`, `structure.rs`,
`values.rs`), written with the builders in `components/define.rs`:

```rust
/// `<clamped lo="0" hi="1">`: its `value` held between `lo` and `hi`.
pub(super) const CLAMPED: ComponentTypeInfo = info(&["clamped"], CLAMPED_PROPS)
    .copyable()
    .default_prop("clamped");

const CLAMPED_PROPS: &[PropDef] = &props([
    attr("value", 0.0),
    attr("lo", 0.0),
    attr("hi", 1.0),
    computed("atLeastLo", OpSpec::Max, &["value", "lo"]),
    computed("clamped", OpSpec::Min, &["atLeastLo", "hi"]),
]);
```

Then add one line to the `component_types!` list in `components/mod.rs`
(`Clamped => values::CLAMPED,` with a one-line doc). The build then fails
until the type has an arm in `Compiler::planner`
(`compile/planner.rs`); for this one it is `K::Clamped => Props`,
planned from its prop table. If code reads a prop by position, name it
beside the table
(`pub mod clamped { pub const VALUE: usize = at(CLAMPED_PROPS, "value"); }`)
and re-export it from `components/prop.rs`. A type whose props are
attributes, children, defaults or chains of operators over its other props
needs nothing else: a request on `clamped` inverts through the chain by
the operators' own inverses. A type whose wiring depends on which
attributes the author gave gets a planner of its own, named in its
`planner` arm: `Geometric` for a shape (see `geometry/`), `PropsThen` to
adjust the table's plan, or `Whole`. A planner names its props through
`typed_props!` beside the table and returns them as a `Props<Planned>`
struct literal, a slot's plan with the role a copy shares it by
(`compile/geometry/circle.rs`, ADR 0016); a combination of attributes it
cannot honor is a warning (`Compiler::warn`), never a silent NaN. The
renderer side is in `packages/cells-viewer/src/renderers/`.

**Add an operator.** Add one entry to `scalar_ops!` in
`program/scalar.rs` (ADR 0016): its inputs and literal parameters, its
`<op>` names (the test-only tag, registered under the `testing` feature,
which `cargo test` turns on), its evaluation, and its inverse, declared
`exact`, `projection` or `drops`. The macro (`program/ops.rs`) makes the
`Op` and `OpSpec` variants and every arm; `program::scalar::inverses`
checks the inverse against what the entry declares, over a fixed table
of values and the entry's parameter `samples`. Multi-cell operators are
`VecOp`s in `program/vector.rs`.

**Change how a request inverts.** Scalar inverse rules are `Op::invert`;
vector rules are `VecOp::invert`; the engine that orders requests and keeps
point groups together is `tick/invert.rs`.

**Change what a renderer reads.** The wasm binding is
`crates/cells-wasm/src/lib.rs` (zero-copy views of the cells and component
table, ADR 0001); the React side is `packages/cells-viewer/src/`. The core
runs on the main thread. Graphs are JSXGraph boards
(`renderers/jsxgraph/`, ADR 0010) whose elements read cells directly and
redraw once per tick (`CellStore.subscribeTickEnd`); Doenet's styling is
copied into `jsxgraph/doenet.ts`. A component type with view shapes
(`components/view.rs`, ADR 0016) is drawn by the primitives its shape
names (`renderers/prims.tsx`), which update in place; the build picks each
component's shape (`ComponentTable::shape`), and `tests/view_shapes.rs`
keeps the viewer's copy of the shapes (`src/generated/shapes.ts`)
current. A type without shapes is drawn by its renderer in
`renderers/index.tsx`. Numbers are formatted by the core, never in the
tick (`format.rs`): the build picks each component's format
(`ComponentTable::format`, from `displayDecimals`), and the viewer formats
a tick's changed numbers in one call (`CellStore.formatLater`).

**Change how a document exports.** PreTeXt export (`export.rs`,
`Document::pretext`) writes each shape-drawn component from its shape, one
arm per primitive, with the same formatter; a new primitive needs its arm
there. A spec checks it with `export { "name" = "xml" }`.

## The other crates

- `crates/cells-wasm`: the browser binding.
- `crates/cells-docgen`: the synthetic DoenetML generator behind the
  fixtures.
- `crates/cells-bench`: fixture helpers, the `stats` binary, and the
  `golden` example that dumps behavior for `scripts/golden-diff.sh`.
  Performance is measured across cores by `packages/benchmark`.

## Checking a change

`cargo test` runs the unit and integration tests. Many of them check the
scheduled program against `testing/reference.rs`, a naive recursive
evaluator that does not use the schedule.
`tests/specs/` holds the component specs (ADR 0016, `testing/spec.rs`):
per component, `spec!` cases of DoenetML, requests and the values an
author sees after each, every one also checked against the reference
evaluator and against the component's cost snapshot
(`tests/specs/snapshots/`); `SPEC_UPDATE=1` rewrites a snapshot, whose
change the core team approves.
`tests/every_count.rs` builds every golden document and fixture at
iteration counts 0 to 4 and four seeds and checks that a document the
cycle check passed never fails a build with a cycle or an unsettled
structure. Every one of those builds, and every seed's build of a document
without repeats, is also checked against the probe's graph
(`build/coverage.rs`): each dependency it has must be one the probe has,
with a label its iterations satisfy. That checks the conventions the
compile's cycle check rests on (every structural read goes through the
view, every indexed edge is labelled right) directly, instead of waiting
for a missed cycle.
`scripts/golden-diff.sh [base]` compares every component's props, after load
and after a fixed script of requests, against a base commit, and
`packages/benchmark/scripts/perf-diff.sh [base]` compares speed. A refactor
should leave the golden diff identical.
