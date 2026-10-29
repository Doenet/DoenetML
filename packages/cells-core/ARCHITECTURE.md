# Architecture

This is the map of the cells core. `CONTEXT.md` defines the vocabulary and
`docs/adr/` records why things are the way they are. Unless a path says
otherwise, it is relative to `crates/cells-core/src/`.

The core was built in numbered rounds (plans 2 to 8) before it joined this
repository. Where an ADR or a comment cites a plan by number, it means that
round's brief and measurements, which are not in this repository.

## The idea

Most cores are organized around components, each holding its own state
variables. This one is organized around data:

- **Cells.** All document state is one flat array of `f64`. A cell may stand
  for a number, a boolean, a string id or a handle into the symbolic engine.
  Every cell is *essential* (independent state a student's action can
  write, the only thing a write can land on), *fixed* (a constant, an
  author's value no student can change among them), or *derived* (computed
  from other cells).
- **Instructions.** The dependency graph is a list of instructions, each an
  operator bound to its input cells and the cell(s) it writes. Operators may
  carry an inverse, so a request to change a derived cell can be pushed back
  to essential cells.
- **Components and props are only names.** A prop maps to one cell or a list
  of cells; two props that are equal by construction (a reference, a copy)
  share one cell. Components are not nodes in the graph.
- **Only what leaves the core is computed.** An *output* is a prop a
  renderer reads or a score a grader reads. A cell no output reads, and
  the core does not read itself, is *dead*, and a build gives it no cell
  (ADR 0019).

The work splits by when it happens:

- **Build time** does all the string work and all the reasoning about the
  document's shape: parse, compile, build, schedule.
- **Tick time** handles a request from a renderer, on an input's cell, or
  an action (a submit, a trigger). It only reads the
  scheduled program and writes cells. It never consults components, tag
  names or the DAST, with one exception: snapping a sticky group reads the
  component table (`document/sticky.rs`).

## The pipeline

```
 DoenetML source
   │  @doenet/parser (scripts/parse-dast.mjs) → JSON or binary
   ▼
 dast/       Dast: flat, columnar nodes and one string table
   │
   ▼
 compile/    plan: DAST → templates with a plan per prop   once per load
             check: find every error, box failing elements
   │
   │ Compiled (kept by the document for rebuilds)
   ▼
 build/      expand: templates → components, slots         per structure
             emit:   slots → cells, instructions                ▲
   │                                                            │
   │ BuildOutput                                                │
   ▼                                                            │
 program/    schedule: topological sort → Program               │
   │                                                            │
   ▼                                                            │
 document/   Document: cells, program, component table          │
   │            ▲                                               │
   │            └── Request / PointRequest from a renderer      │
   ▼                                                            │
 tick/       snap → invert → recompute  → TickOutcome           │
                 a repeat's count changed: build again ─────────┘
```

### Parse (`dast/`)

The JavaScript parser `@doenet/parser` turns source into a DAST. The core
loads it as JSON (`dast/json.rs`) or in a binary wire format
(`dast/binary.rs`, ADR 0002) into a `Dast`: parallel arrays indexed by
`NodeId` and one string table.

### Compile (`compile/`, ADR 0015)

Runs once per load and depends on the source alone.

- **Lint** (`lint.rs`) is one walk over the DAST for the rules that need
  nothing else, such as the accessibility rules.
- **Plan** walks the DAST and produces a `Template` for the document, each
  repeat body and each choice branch. Every prop in a template has a
  `Source` (a literal, a default, an operator over references, a math
  expression, ...) and every reference a `RefPlan`, its path. Nothing in a
  plan names an
  iteration, so string work happens once per template element, not once per
  stamped copy. Each element is planned by its component type's planner
  (see [Add a component type](#add-a-component-type)).
- **Check** (`check.rs`, ADR 0012, ADR 0014) finds every error the document
  can have. It builds the plans once through the **probe**
  (`build/probe.rs`), which folds every iteration into one and builds
  every option of every select, so its graph holds every edge any count or
  pick could create. It rejects any dependency loop that could close at
  some count, records what every build reads (below) and the document's
  structural depth, then discards that build. Every document is probed,
  with or without repeats: a load is one sequence of steps. An element
  that fails to build is *boxed*; see
  [An element cannot be built](#an-element-cannot-be-built).

The result is `Compiled` (`plan.rs`): the templates, their plans, the
probe's records and the source's diagnostics, the probe's warnings
included.

### Build (`build/`)

Turns the compile into cells and instructions for one particular
structure: a particular iteration count for every repeat and a particular
draw for every select.

- **Expand** (`build/expand/`) stamps each template into components once per
  *scope* (the document, and each iteration of each repeat) and resolves
  references to slots.
- **Emit** (`build/emit.rs`) merges aliased slots into cells with a
  union-find, numbers the cells (essential, then fixed, then derived) and
  binds operators to them as instructions. A value slot (a literal or a
  default) is essential only when a student's action can write it (ADR
  0018): `build/writable.rs` walks back from every input prop through the
  inputs each inverse may write. The probe runs the walk and records the
  writable template slots in `Compiled` (a `Record`), and every build
  classes by that record, so a slot's class is the same in every build. A
  class is computed only when it is live (ADR 0019): `build/live.rs`
  walks back from every root (the rendered props of rendered components,
  scores, inputs, what an action or snapping reads, repeat counts)
  through every input of every instruction. The probe records the live
  template slots in `Compiled::live` as it records the writable ones; a
  class the record cannot name (a synthesized component's, such as a
  choice's interface) is live when something live reads it. A dead class
  gets no cell: its props name the one dead cell, a fixed NaN, and its
  instruction is never bound. A live instruction that would read the dead
  cell fails the build (`Error::Unchecked`). `LoadOptions::prune` off
  computes every class.

A build learns the document's structure only through the **structure view**
(`View`, `build/view.rs`): iteration counts, which iteration or item an
index names, a collect's count, a select's options. A real build uses the
`Stamped` view, which answers from the counts it was asked for; the check
uses the probe. Because the cycle check reasons about the probe, any
structural read that bypasses the view is one the cycle check cannot see.

A build reads the `Session` (`session.rs`) and returns the next one. The
session is everything that survives across builds: the scope table, every
essential value keyed by (scope, template slot), runtime strings, the
random seed and the math engine. Since the old session is untouched until
a build succeeds, a failed rebuild leaves the document as it was.

### Schedule (`program/`)

`BuildOutput::schedule` sorts the instructions topologically
(`Program::schedule`) into a `Program` and produces a `Document`.

### Document (`document/`)

A `Document` is a loaded document: the cells and what each holds
(`value_types`), the program and its symbolic state, the
`ComponentTable` and the string table, all of which one build made and a
rebuild replaces; and the session, what the load fixed (`Loaded`: the
compile, the keys, the source's literal attributes for a renderer) and how
ticks recompute, which a rebuild carries. It is the API that the wasm
binding and the tests use.

### Tick (`tick/`)

Handles a request: snap, invert, write essential cells, recompute what is
downstream, and report a `TickOutcome`. See
[A user drags a point](#a-user-drags-a-point).

## What happens when…

### A document loads

`Document::load` (`document/load.rs`):

1. The bytes become a `Dast`.
2. The compile runs once: lint, plan, check. The check's probe also
   records which template slots are writable (ADR 0018) and which are
   live (ADR 0019), which every build reads, and the structural depth,
   which bounds the passes below.
3. Builds run from the compile, each at the counts it is asked for, until
   the structure settles. After each build the document computes every
   derived cell once; if a repeat's `count` cell now disagrees with the
   number of iterations it was built with, the build runs again at the new
   counts. `LoadTimings::passes` records how many builds it took.

### A user drags a point

`Document::request` and its variants (`document/request.rs`):

1. The renderer sends requests addressed by cell index (ADR 0001). A
   request on a cell that is not interactive (`document/interactive.rs`,
   a bit per cell made with each build) is refused (ADR 0018), and
   infinite values are dropped.
2. Requests on members of a sticky group are snapped (`document/sticky.rs`,
   `tick/snap.rs`, ADR 0007).
3. `tick::invert::invert_requests` walks each request backwards through the
   inverses of the instructions that produced its cell, until it lands on
   essential cells. Dragged point groups are kept together (ADR 0003,
   ADR 0006).
4. The essential writes are applied and the document's `Evaluator`
   (`tick/eval.rs`) recomputes. By default this is `DirtyClosure`, which runs
   only the instructions downstream of a changed cell; `FullRecompute` runs
   all of them and can be selected with `set_evaluator`.
5. The `TickOutcome` lists the cells that changed and the requests that
   were dropped.

### A repeat's count changes

When a tick leaves a structural cell, such as a repeat's count, out of step
with the structure, it calls `Document::rebuild` (ADR 0004). This builds the
whole document again from the `Compiled` kept at load, at the counts the
count cells now hold. No lint, plan or check runs again.

Because scope ids are stable, an iteration that comes back gets its old
essential values, and its nested repeats get the counts they last asked for
(`Session::counts`), so a rebuild usually settles in one pass. In the
outcome, `rebuilt` is set (cell indices are new), and
`rebuild_passes` says how many builds it took. If the rebuild fails, the
document is unchanged and `rebuild_error` says why.

### An element cannot be built

Errors are a build product, not a failure (ADR 0013). When the compiler or
builder raises an error, it records the innermost element it concerns. The
check *boxes* that element: it recompiles as an `_error` element with no
name, children or props, and the check builds again until every element
builds. Only an error with no element to box, a dependency cycle, fails the
load.

`Document::diagnostics` lists, in node order, the lint findings plus the
errors and warnings of the elements that built.

An element is also boxed for an attribute nothing read while the document
was planned and checked (ADR 0021): the core ignores no attribute
silently. `Dast::attr` records every lookup; after a compile and its
check succeed, every element outside the boxes with an attribute never
looked up, and not one a renderer reads (`PRESENTATION_ATTRS`, a type's
`presentation`), is boxed, all of them at once, and the compile runs
again.

Every error depends on the source alone (ADR 0014), and the probe stands
for every count and every pick, so the check finds every error at load.
Later builds never find a new one: a build's error type
(`build::BuildError`) has no variant for an author's mistake, and a build
that hits one anyway fails with `BuildError::Unchecked` instead of boxing
mid-session.

### The language server asks for diagnostics

`diagnose` (`compile/check.rs`) runs the compile's check without loading a
document. Its result is a function of the DAST alone, at any seed and any
count, and equals what a load reports.

### An answer is submitted

`Document::submit` (`document/sections.rs`) is an action, not a request (ADR
0018): the core copies the response into the answer's `submitted` cell and
counts the submission as one tick, through the same inversion a request
uses, and credit recomputes through the cells that
`build/expand/scoring.rs` wired. The props it writes are marked
`written_by_action`, not `interactive`, so no renderer can set them.
`Document::trigger` (`document/request.rs`), a `<triggerSet>`'s press, is
the other action: it sets each `<updateValue>`'s target.

## The main types

| Type | Where | What it is |
|---|---|---|
| `Dast` | `dast/mod.rs` | The parsed source in parallel arrays indexed by `NodeId`. |
| `ComponentType`, `ComponentDef`, `PropDef` | `components/` | The tag vocabulary: each type's props, where each prop's value comes from (an attribute, its children, an operator over its own props, or its planner), its flags and its planner. |
| `Compiled`, `Template` | `compile/plan.rs` | The compile's output: one template per document, repeat body and choice branch, with a plan for every prop and reference. Made once per load. |
| `View`, `Stamped` | `build/view.rs` | The structure view through which a build reads counts, indexed referents and select options. The probe (`build/probe.rs`) is the other implementation. |
| `BuildOutput` | `build/mod.rs` | Cells, instructions and the component table of one build, before scheduling. |
| `Session`, `Counts` | `session.rs` | What survives every build: scopes, essential values, strings, seed, math engine; and the counts a build stamps. |
| `Structure` | `build/structure.rs` | What one build made: its repeats and its essential cells' keys. |
| `Program`, `Instr`, `Op`, `VecOp` | `program/` | The instruction set. `Op` (`scalar.rs`) is a scalar operator with its evaluation and inverse; `VecOp` (`vector.rs`) reads and writes several cells; symbolic operators call the math engine. A `Program` is read-only while a tick runs; what its symbolic instructions keep between runs is a `SymState` beside it in the document. |
| `Document` | `document/mod.rs` | A loaded document and the API to it. `output_cells` and `is_live` (`document/outputs.rs`) say what leaves it and what it computes. |
| `Renders`, `Live` | `components/mod.rs`, `build/mod.rs` | Where a component type is drawn (always, never, only in a graph), which decides whether its `rendered` props are outputs; and a build's bit per cell of what it computes (ADR 0019). |
| `CellIdx`, `CompIdx`, `NodeId`, `StrId`, `ScopeId`, `OperandIdx`, `MemoIdx`, and the compile's and build's ids (`TemplateId`, `ElemId`, `RefId`, `ChoiceId`, `ElemKey`, `ExprId`, `SlotId`, `Handle`) | `index.rs` | Positions in the cells, the component table, the DAST, a string table, the session's scopes, a program's operands and its symbolic memo, and the like, each its own type over a `u32` made by `index_type!` (`index()` reads the position), so one cannot be passed for another. A text cell holds a `StrId` as its value (`StrId::to_value`). Two lists mix kinds of entry and say so in their types: a child list's `ChildEntry` (`document/table.rs`) is a component or a text child's string, and a literal attribute's `AttrValue` (`dast/attrs.rs`) is a string or text the attributes keep. A math's leaves say what they are by type: `Expr<L>` and `sym::Tree<L>` hold `RefId`s in the compile, `SlotId`s in a build, `CellIdx`s once emit rebinds them. |
| `ComponentTable` | `document/table.rs` | Components in columns: type, name, parent, children, the component each reference refers to (`referent`, ADR 0024), and the cell index of each prop. `prop_cells` lists those indices one component after another, starting at `prop_base[c]` (ADR 0016); the cells they name are not contiguous, since emit orders cells by kind and aliased props share a cell. What references and renderers read. |
| `Request`, `PointRequest`, `TickOutcome` | `tick/` | A tick's input (set a cell; move points together) and its result. |
| `Evaluator`, `Recompute` | `tick/eval.rs` | A recompute strategy: `DirtyClosure` or `FullRecompute`; `Recompute` is the document's setting of which one a tick uses. |
| `Diagnostic` | `diagnostics.rs` | An error, warning or lint finding, tied to a DAST node (ADR 0013). |
| `Engine`, `Tree`, `Tape` | `sym/` | The symbolic engine behind math cells: math-expressions-rs called directly (ADR 0008, ADR 0011). A math cell holds a handle into it. `Tape` compiles a curve of fixed shape to numeric steps. |

## Where to change things

### Add a component type

A component type is one `component!` block (`components/define.rs`) in one
of the family directories under `components/`: `containers/`, `geometry/`,
`inputs/`, `structure/` or `values/`.

**A type built entirely from its prop table** (attributes, children,
defaults, and operators over its own props) goes in an inline module of the
family's `mod.rs`:

```rust
pub mod clamped {
    use super::*;

    component! {
        /// `<clamped lo="0" hi="1">`: its `value` held between `lo` and `hi`.
        tags: ["clamped"],
        flags: [copyable],
        default_prop: clamped,
        props {
            value: attr(0.0),
            lo: attr(0.0),
            hi: attr(1.0),
            atLeastLo: computed(OpSpec::Max, [value, lo]),
            clamped: computed(OpSpec::Min, [atLeastLo, hi]),
        }
        planner: Props,
    }
}
```

Then register it with one line in the `component_types!` list in
`components/mod.rs`: `Clamped => values::clamped::DEFINITION,`. Nothing else
is needed; a request on `clamped` inverts through the operators' own
inverses. If other code reads a prop by position, name it in the module
(`pub const VALUE: usize = Props::AT.value;`) and re-export the module from
`components/prop.rs`.

**A type whose wiring depends on which attributes the author gave** names a
planner of its own as the block's last section:

- `Plan(plan)` to return the element's plan, with the copy rules
  (`extend`), `fixed` and its list's length applied around it
  (`plan_with_extend`, `compile/copies.rs`); the points, lines and circle
  are planned this way,
- `PropsThen(plan)` to adjust the plan the prop table produces (reached
  through `Props::AT`),
- `Whole(plan)` to plan the element entirely.

Such a type lives in its own file, block and planner together (for
example `values/text.rs`, registered as `values::text::DEFINITION`).
`geometry/circle.rs` and `geometry/line.rs` are the models. A planner is a
function given a `PlanCtx`: it reads the source, plans the attributes and
children it asks for, and sets its props from a `Props<Wire>` struct
literal (`ElemWiring::set_public`, ADR 0016). Rules for planners:

- Use only what `compile/api.rs` exports. Logic two planners both need
  belongs in `compile/` behind `api.rs`, once. Behavior a family shares
  belongs in the family's `mod.rs`.
- A type built on shared machinery (answers, selects) has a thin planner
  that names that machinery and keeps its own decisions, such as what it
  refuses, in its file (`values/answer.rs`, `structure/select.rs`).
- Declare the type's *shared state*, which a copy shares with its original
  unless it overrides it, in the block (`shared_state { CX, CY, R }`; see
  `CONTEXT.md`).
- Declare the attributes the planner reads itself (`attributes { center,
  radius, through }`) and name them by their handles (`attr::radius`):
  `ctx.scalar(attr::radius)` to read one, and
  `Wire::essential_from(shared_state::R, attr::radius, v)` to say it gave
  a piece of shared state, which a copy giving the same attribute keeps
  as its own. State from the element's own children is `Given::Children`,
  from its referent's `Given::Referent`.
- A `<label>` or `<shortDescription>` child is a component of the element
  on every type, for the renderer to read (ADR 0024); a planner reading
  its element children passes over them (`ctx.is_presentation_child`).
- What an extend omits comes from its referent, planned where the
  referent sits (ADR 0023): `ctx.attr`, `ctx.scalar`, `ctx.flag`,
  `ctx.tuple` and the rest pick the referent's scope for the referent's
  attributes and children, so a planner reading `ctx.base()`'s children
  need not think about it.
- `fixed` is applied around the planner, not by it (`plan_with_extend`,
  `plan_attrs`): the element's own, else the nearest container's (ADR
  0022), as `Hold`s on every slot a request could write through. A type
  whose every value is a location says `located` among its flags, and
  `fixLocation` then holds it the same way.
- A combination of attributes the planner cannot honor is a warning
  (`PlanCtx::warn`), never a silent NaN: what it cannot define is
  `Wire::undefined` (or `Source::undefined`) of what `warn` returns. A
  value not given (an attribute's default, an emptied input, an entry
  past a tuple's end) is `NO_VALUE` or `Wire::absent()`. `Wire::fixed`
  refuses NaN, and a test (`components/mod.rs`) finds any `f64::NAN` a
  component writes.
- An attribute the planner never looks up is refused: the check boxes any
  element carrying an attribute nothing read while the document was
  planned (`compile/check.rs`, ADR 0021), so an author's attribute never
  does nothing silently. Reading an attribute (`ctx.attr`, `d.attr`) is
  what accepts it; an attribute a renderer reads from the literal
  attributes instead, and the core never does, is declared in the block
  (`presentation { to }`) or, for one every type may carry, in
  `PRESENTATION_ATTRS` (`components/mod.rs`).

The renderer for the new type goes in `packages/cells-viewer/src/renderers/`.
Mark every prop it requests `interactive` in the block (`value: attr(0.0) {
interactive }`; a list whose points it drags, `interactive: true`): these
are the document's inputs (ADR 0017), and the core refuses a request on any
other (ADR 0018), which the viewer's test (`src/interactive.test.tsx`)
catches first. A prop an action writes instead is `written_by_action`. A
spec reaches a prop no renderer requests (a circle's `radius`) through an
input bound to it, `<mathInput bindValueTo="$c.radius"/>`, as a document
does; never mark a prop interactive for its spec. Mark every prop the
renderer reads `rendered` (a list whose points it draws, `rendered:
true`), a score a grader reads `score`, and a prop an action reads
`read_by_action`; a type drawn only in a graph, or nowhere, says so with
`renders: InGraph` or `renders: Never`. These are the document's outputs
(ADR 0019), and the viewer's test fails on a renderer's read of any
other cell.

### Add an operator

Add one entry to `scalar_ops!` in `program/scalar.rs` (ADR 0016) giving its
inputs and literal parameters, its evaluation, and its inverse, declared
`exact`, `projection` or `drops`. The macro (`program/ops.rs`) generates the
`Op` and `OpSpec` variants and every match arm. The tests in
`program::scalar::inverses` check each inverse against what its entry
declares, over a fixed table of values and the entry's parameter `samples`,
and that it writes only an input it declares (`OpSpec::writes`, ADR 0018:
an `exact` or `projection` inverse its first, a `drops` one none). The
compile finds what a student can write by those declarations, so a vector
operator declares its own in `VecOp::writes`, the last column of the table
in `program/vector.rs`, checked by the `writes` tests there.

A document reaches an operator through a component's prop table or planner,
or through math lowering (`build/expand/math.rs`). Operators over several
cells are `VecOp`s in `program/vector.rs`.

### Change how a request inverts

Scalar inverse rules are `Op::invert`, vector rules `VecOp::invert`. The
engine that orders requests and keeps point groups together is
`tick/invert.rs`.

### Change what a renderer reads

The wasm binding is `crates/cells-wasm/src/lib.rs`; it exposes zero-copy
views of the cells and the component table (ADR 0001). The React side is
`packages/cells-viewer/src/`, and the core runs on the main thread. Graphs
are JSXGraph boards (`renderers/jsxgraph/`, ADR 0010) whose elements read
cells directly and redraw once per tick; Doenet's styling is copied into
`jsxgraph/doenet.ts`. A renderer reads only outputs: a prop it starts
reading is marked `rendered` in its type's block in the same change, or
the core does not compute it, and the viewer's test, which checks every
`CellStore.get` and `subscribe`, fails first (ADR 0019).

## The other crates

- `crates/cells-wasm`: the browser binding.
- `crates/cells-docgen`: the synthetic DoenetML generator behind the
  fixtures.
- `crates/cells-bench`: fixture helpers, the `stats` binary, and the
  `golden` example behind `scripts/golden-diff.sh`. Performance across
  cores is measured in `packages/benchmark`.

## Checking a change

- `cargo test` runs the unit and integration tests. Many check the scheduled
  program against `testing/reference.rs`, a naive recursive evaluator that
  ignores the schedule.
- `testing/dast.rs` builds a DAST in Rust, for a unit test of the core that
  needs neither the parser nor node; `tests/dast_builder.rs` checks it
  against the parser.
- `tests/specs/` holds the component specs (`testing/spec.rs`, ADR 0016),
  laid out as `src/components/` is: `tests/specs/geometry/circle.rs` is the
  spec of `components/geometry/circle.rs`, and a type defined in its family's
  `mod.rs` (the slider) has a file of its own (`tests/specs/inputs/slider.rs`).
  Each `spec!` case gives DoenetML, a sequence of requests, and the values an
  author should see after each. Every case is also checked against the
  reference evaluator and the component's cost snapshot in
  `tests/specs/snapshots/`. `SPEC_UPDATE=1` rewrites a snapshot; review the
  change alongside the code that caused it. A new component comes with its
  spec: a unit test (`components/mod.rs`) fails for one without, unless
  it is in `WITHOUT_SPEC`, a list that only shrinks; writing a listed
  type's spec means taking it off the list.
- `tests/every_count.rs` builds every golden document and fixture at
  iteration counts 0 to 4 and four seeds, and checks that a document that
  passed the cycle check never fails a build with a cycle or an unsettled
  structure. It also checks each build against the probe's graph
  (`build/coverage.rs`): every dependency must be one the probe has, with a
  label its iterations satisfy. This tests the assumptions the cycle check
  rests on directly, instead of waiting for a missed cycle. The same holds
  for the classing (ADR 0018): at each count and seed, nothing a build's
  own walk finds writable is missing from the probe's record, and every
  request on an interactive cell, submit and trigger, made with every value
  essential (`LoadOptions::classify` off), writes only cells the record
  makes essential.
- A test of a component requests only what a renderer would, through an
  input where none does. A test of the core's machinery (an inversion
  through a `<number>`, a forced count) uses `testing::request_unchecked`,
  and, where no input reaches its document, loads with the classing off.
  A test that reads a prop no renderer reads (a circle's diameter, a
  line's slope) loads unpruned (`test_utils::load_unpruned`), as the
  JavaScript worker's parity harness does; a spec reads an unpruned
  document and ticks a pruned one beside it, which must agree on every
  live cell (`testing::live_cells_agree`), and its cost snapshot is the
  pruned one's.
- `tests/live.rs` checks the live record (ADR 0019) at every golden
  document and `sir.doenet`, four seeds and counts 0 to 4: nothing a
  build's own walk finds live is missing from it, every output and every
  essential cell is live, and a pruned load and an unpruned one, given
  the same requests, submits and triggers, hold the same value in every
  live cell. `tests/outputs.rs` checks the marks and which components are
  rendered.
- `tests/safe_edits.rs` tests `compare_versions` (ADR 0017) the same way:
  every golden document and a few with inputs of every kind get generated
  edits, and for every edit it calls safe, a generated session's saved
  state, restored into the edited version, must give every input back as
  the student left it (or, where the student left it as it started, the new
  start) and keep every point inside its graph. `SAFE_EDITS_LONG=1` runs
  many more edits and sessions, and `fixtures/sir.doenet`.
- `scripts/golden-diff.sh [base]` compares every component's props, after
  load and after a fixed script of requests, against a base commit, loaded
  unpruned. A refactor should leave it identical.
- `packages/benchmark/scripts/perf-diff.sh [base]` compares speed against a
  base commit, loaded pruned as a browser loads (`CELLS_PRUNE=1`).
