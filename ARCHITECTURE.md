# Architecture

A DoenetML core organized around a flat array of `f64` **cells** rather than
around components. Components and props are a naming layer over cell
indices; the dependency graph is a list of **instructions**, each an
operator that computes derived cells from other cells and may carry an
inverse. This file is the map. `CONTEXT.md` defines the vocabulary,
`docs/adr/` records why things are the way they are, and `docs/history/`
has the briefs and plans of the rounds that built it.

## The pipeline

```
 DoenetML source
       │  @doenet/parser (scripts/parse-dast.mjs) → JSON or binary CDST
       ▼
 ┌───────────┐
 │ dast/     │  Dast: flat, columnar nodes and one string table
 └─────┬─────┘
       │                    ┌─────────────── load and rebuild ───────────────┐
       ▼                    │                                                │
 ┌──────────────────────────┴──┐                                             │
 │ build/                      │  uses components/ (each type's props)       │
 │  compile/  DAST → templates │  once per document                          │
 │  expand/   templates →      │  once per scope (document, each iteration)  │
 │            components, slots│                                             │
 │  emit.rs   slots → cells,   │                                             │
 │            instructions     │                                             │
 └─────────────┬───────────────┘                                             │
               │ BuildOutput                                                 │
               ▼                                                             │
 ┌─────────────────────────────┐                                             │
 │ program/   schedule:        │  Program: instructions in evaluation order  │
 │            topological sort │                                             │
 └─────────────┬───────────────┘                                             │
               ▼                                                             │
 ┌─────────────────────────────┐   a repeat count changed: build again, ─────┘
 │ document/  Document         │   carrying values over (Carryover)
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
| `Compiler`, `Compiled`, `Template` | `build/compile/` | Compile's state and output: one template per repeat body, choice branch and the document, with a *plan* for every prop and reference. Nothing in a plan names an iteration. |
| `Builder` | `build/expand/mod.rs` | The state of expand and emit: components and slots per scope, then cells and instructions. |
| `BuildOutput` | `build/mod.rs` | Cells, instructions and the component table, before scheduling. `schedule` turns it into a `Document`. |
| `Carryover`, `Structure` | `build/mod.rs`, `build/structure.rs` | What one build hands the next: the scope table, each repeat's iteration count, and every essential value by (scope, template slot), so state survives a rebuild. |
| `Program`, `Instr`, `Op`, `VecOp` | `program/` | The instruction set. `Op` (`scalar.rs`) is a bound operator with its evaluation and inverse; vector operators (`vector.rs`) read and write several cells; symbolic ones call the math engine. |
| `Document` | `document/mod.rs` | A loaded document: `cells`, `program`, `components` (the `ComponentTable`), the string table, its `Structure`, and the DAST it came from. The API a renderer or test uses. |
| `ComponentTable` | `document/table.rs` | Components in columns: component type, name, parent, children, and each one's prop cells. What references and the renderer read. |
| `Request`, `PointRequest`, `TickOutcome` | `tick/` | A tick's input (set a cell; move points together) and its result. |
| `Evaluator` | `tick/eval.rs` | A recompute strategy: `FullRecompute` runs every instruction; `DirtyClosure` only those downstream of a changed cell. |
| `SymEngine` | `crates/cells-sym` | The symbolic math engine behind math cells (ADR 0008). A math cell holds a handle into it. |

## What happens when…

**A document loads** (`Document::load`, `document/load.rs`). The bytes become
a `Dast`. Then `build::build` runs: **compile** walks the DAST once and plans
every element with the planner `planner.rs` names for its type
(`build/compile/mod.rs`; attributes and math in `attrs.rs`, references in
`refs.rs`, geometric component types in `geometry/`, choices in
`choice.rs`). **Expand** stamps each template into components once per
scope and resolves references to slots (`build/expand/`). **Emit** merges
aliased slots into cells with a union-find, numbers cells (essential,
fixed, then derived) and binds operators into instructions
(`build/emit.rs`). `BuildOutput::schedule` sorts the instructions
topologically (`Program::schedule`), and the document computes every
derived cell once. If a repeat's `count` cell now disagrees with the number
of iterations it was built with, the build runs again with a `Carryover`;
`LoadTimings::passes` counts how many builds it took.

**A user drags a point** (`Document::request` and friends,
`document/request.rs`). The renderer sends cell-addressed requests
(ADR 0001). Infinite values are dropped. Requests on a sticky group's
members are snapped (`document/sticky.rs`, `tick/snap.rs`, ADR 0007).
`tick::invert::invert_requests` walks requests backwards through the
producing instructions' inverses until they land on essential cells,
keeping dragged point groups together (ADR 0003, ADR 0006). The essential
writes are applied, and the evaluator recomputes what is downstream. The
`TickOutcome` lists the cells that changed and the requests that were
dropped.

**A structural cell changes**, such as a repeat's count. The tick finds the
structure unsettled after recomputing and calls `Document::rebuild`, which
builds the whole document again from the retained DAST with a
`Carryover` (ADR 0004). Scope ids are stable, so an iteration that comes
back gets its old values. The outcome's `rebuilt` is set and cell indices
are new. If the rebuild fails, the document is left as it was and
`rebuild_error` says why.

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
(`build/compile/planner.rs`); for this one it is `K::Clamped => Props`,
planned from its prop table. If code reads a prop by position, name it
beside the table
(`pub mod clamped { pub const VALUE: usize = at(CLAMPED_PROPS, "value"); }`)
and re-export it from `components/prop.rs`. A type whose props are
attributes, children, defaults or chains of operators over its other props
needs nothing else: a request on `clamped` inverts through the chain by
the operators' own inverses. A type whose wiring depends on which
attributes the author gave gets a planner of its own, named in its
`planner` arm: `Geometric` for a shape (see `geometry/`), `PropsThen` to
adjust the table's plan, or `Whole`. The renderer side is in
`web/src/renderers/`.

**Add an operator.** Add the bound form to `Op` in `program/scalar.rs` with
its `eval` and `invert` arms, and the unbound form to `OpSpec` in
`program/instr.rs` with its `arity` and `bind` arms. To reach it from the
`<op>` tag, map the name in `build/compile/attrs.rs`. Multi-cell operators
are `VecOp`s in `program/vector.rs`.

**Change how a request inverts.** Scalar inverse rules are `Op::invert`;
vector rules are `VecOp::invert`; the engine that orders requests and keeps
point groups together is `tick/invert.rs`.

**Change what a renderer reads.** The wasm binding is
`crates/cells-wasm/src/lib.rs` (zero-copy views of the cells and component
table, ADR 0001); the React side is `web/src/`. Graphs have two renderers,
chosen in `web/src/renderers/kind.ts`: the SVG component renderers in
`web/src/renderers/`, and JSXGraph boards in `web/src/renderers/jsxgraph/`,
whose elements read cells directly and redraw once per tick
(`CellStore.subscribeTickEnd`); Doenet's styling is copied into
`jsxgraph/doenet.ts`.

## The other crates

- `crates/cells-sym`: symbolic math engine A (a flat hash-consed arena) and
  compiled curve tapes, behind the `SymEngine` trait.
- `crates/cells-sym-mer`: engine R, wrapping math-expressions-rs, used as
  engine A's behavior oracle.
- `crates/cells-wasm`: the browser binding.
- `crates/cells-docgen`: the synthetic DoenetML generator behind the
  fixtures and benchmarks.
- `crates/cells-bench`: criterion benches, the `stats` binary, and examples.
  `golden` dumps behavior for `scripts/golden-diff.sh` and `regress` times
  for `scripts/perf-diff.sh`.

## Checking a change

`cargo test` runs the unit and integration tests. Many of them check the
scheduled program against `testing/reference.rs`, a naive recursive
evaluator that does not use the schedule.
`scripts/golden-diff.sh [base]` compares every component's props, after load
and after a fixed script of requests, against a base commit, and
`scripts/perf-diff.sh [base]` compares speed. A refactor should leave the
golden diff identical.
