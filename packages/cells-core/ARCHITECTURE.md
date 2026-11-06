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
  write, the only thing a write can land on), a *constant* (a value no
  tick changes, which depends on the source and its scope alone, an
  author's value no student can change among them; ADR 0028), or *derived*
  (computed from other cells). A constant the same in every instance of
  its template slot is a *document constant*, kept once per session in a
  pool at the front of the cells, so a rebuild makes no cell for one again.
- **Instructions.** The dependency graph is a list of instructions, each an
  operator bound to its input cells and the cell(s) it writes. Operators may
  carry an inverse, so a request to change a derived cell can be pushed back
  to essential cells.
- **Components and props are only names.** A prop maps to one cell or a list
  of cells; two props that are equal by construction (a reference, a copy)
  share one cell, and so do two that apply the same operator to the same
  cells (ADR 0033). Components are not nodes in the graph.
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

Each stage is one function from the type above it to the type
below it; `lib.rs` has the same map with each name linked
(`npm run doc`).

```
 DoenetML source
   │  @doenet/parser (scripts/parse-dast.mjs) → JSON or binary
   ▼
 dast/       dast::load → Dast
             flat, columnar nodes and one string table
   │
   ▼
 compile/    compile::compile(Dast) → Compiled        once per load
             lint → outline → parse → plan → link → seal
             → share → check (over a TemplateGraph)
             Compiled: the source and its Plans, a Template
             per document, repeat body and choice branch
   │
   ▼
 build/      build::build(&Compiled, &Session,        per structure
                          &mut MathStore, &Counts)                ▲
             → BuildOutput                                        │
             expand → resolve → define → emit                     │
   │                                                              │
   ▼                                                              │
 program/    BuildOutput::schedule_built → Program::schedule      │
             → Built { cells, program, components, .. }           │
   │                                                              │
   ▼                                                              │
 document/   Document { built, session, math, loaded }            │
             Document::load runs every stage above                │
   │            ▲                                                 │
   │            └── Request / PointRequest from a renderer        │
   ▼                                                              │
 tick/       Document::request → TickOutcome                      │
             snap → invert → recompute                            │
             a repeat's count changed: Document::rebuild ─────────┘
```

### Parse (`dast/`)

The JavaScript parser `@doenet/parser` turns source into a DAST. The core
loads it as JSON (`dast/json.rs`) or in a binary wire format
(`dast/binary.rs`, ADR 0002) into a `Dast`: parallel arrays indexed by
`NodeId` and one string table.

### Compile (`compile/`, ADR 0015)

Runs once per load and depends on the source alone.

- **Lint** (`lint.rs`) is one walk over the DAST for the rules that need
  nothing else, such as the accessibility rules. It looks attributes up
  with `Dast::attr_peek`, which records no read (ADR 0021), so it runs
  first without changing which attributes are refused (ADR 0027).
- **Plan** walks the DAST and produces a `Template` for the document, each
  repeat body and each choice branch. Every prop in a template has a
  `Source` (a literal, a default, an operator over references, a math
  expression, ...) and every reference a `RefPlan`, its path: steps of a
  kind planning decided, ending at a port resolved on the type the path
  reaches, so the build walks arrays and compares no name (ADR 0032).
  Nothing in a plan names an
  iteration, so string work happens once per template element, not once per
  stamped copy. Each element is planned by its component type's planner
  (see [Add a component type](docs/guide/component.md#add-a-component-type)). The compile runs
  in stages (ADR 0027, ADR 0029, ADR 0030; `Compiler::compile`), each
  returning what it makes for the later ones, each in its own module:
  **outline** (`outline/`) makes every element, template and name,
  settles what a reference reads of each (a `<math>`'s type, a
  `<collect>`'s collected type), gives container copies their clones and
  answers their synthetic children, and plans nothing (ADR 0030);
  **parse** (`parse.rs`) parses every `<math>`'s text once; **plan**
  (`planning/`) plans every element; **link** (`link/`) boxes every
  reader of a box to a fixpoint (every cross-element read is recorded,
  ADR 0032) and every element with an attribute nothing read, and ties
  shared state between plans; **seal** (`seal/`) makes choice
  interfaces, checks arity, assigns keys and slot offsets, and infers
  every port's type (`seal/types.rs`, ADR 0032), a fixpoint over every
  template from the ports' sources and the references between them,
  which every build reads for what a cell holds and whether a math is
  symbolic; **share** (`share.rs`, ADR 0033) makes equal computations one
  cell by an alias in the plans: per template, a union-find over the
  cells the ports will make (a reference by its plan, one that names a
  port of the template as that port, an extend's referent in another
  template through its path), then two derived ports that apply the same
  operator to the same cells, are the same output of equal vector heads,
  or are the same math text, merged to a fixpoint when their cells would
  carry the same request marks, port types and hold; the referent's port,
  else the lowest, is kept. So an extend that overrides nothing an
  instruction reads shares the referent's instruction whatever its
  planner did, and so do two unrelated elements computing the same thing;
  every build and the check's template graph see it as a plan fact,
  and
  no build pays to find it. It also classes the math expressions
  (`Plans::expr_class`), so a build lowers a subexpression two of a
  scope's maths share once (`Builder::lower`); the **check** (below)
  comes last. What more than one stage uses
  has a module of its own (`names.rs`, `refs.rs`, `maths.rs`,
  `source.rs`, `boxes.rs`). A planner reads the
  source and what outlining and parsing made, never another element's plan
  (ADR 0029), so elements are planned in any order: what one shares with
  another (an extend's essential state) is linked once all are planned.
- **Check** (`check.rs`, ADR 0012, ADR 0014) finds every error the document
  can have, all of it over the **template graph** (below), which stands
  for every count and every pick: stamping it fails on an element that
  cannot be built (`Stamp::fail`, which names the element to box), it
  rejects any dependency loop that could close at some count, finds the
  document's structural depth, defines the graph and walks it for what
  every build reads of each port (below), checks the prefill rule,
  evaluates the constants (`compile/graph/eval.rs`, ADR 0037: which ports
  are constants, read only through stable references, and the range of
  each, exactly for a document constant) and checks every load-time
  choice over them, each parameter a constant and every draw in every
  scope possible, recording each `<select>`'s `numToSelect` for the
  builds, and warns of each request no build could land (ADR 0026). It makes no
  program (ADR 0035). Every document goes through the check, with or
  without repeats: a load is one sequence of steps. An element that fails
  to build is *boxed*; see [An element cannot be
  built](docs/guide/what_happens_when.md#an-element-cannot-be-built). The input signature (ADR 0017),
  which compares two versions of a document, is read off the template
  graph's definitions too (`compile/graph/signature.rs`), with an engine
  of its own for what a math value hashes as.

  The **template graph** (`compile/graph/`) stamps every live template once
  from the plans alone, one iteration standing for every iteration of a
  repeat and every option of a select stamped, in the order a build
  resolves: a node per port of every element and of every component the
  stamping makes beside them (a stand-in, a whole pick's stand-in, a
  case, a `$ref` child, a collect's copy, a point list's point), and per
  value a read goes through (a leaf inside math, a choose, a gate), with
  a read per dependency, labelled by how it moves through the iterations
  (`Coord`). It replaced the abstract build, which stamped the document
  through a view that folded every iteration into one (ADR 0032, step 8),
  and was held to that build's graph, definitions, walks, warnings,
  failures and input signature on every document before the build went;
  it keeps that build's order of components, so a message names a
  component as that build did. `tests/every_count.rs` checks that every
  dependency of every build, at every count and seed, is one it has, with
  a label the iterations satisfy. The cycle and count checks run over it
  (`compile/graph/cycles.rs`): a Tarjan walk with a Bellman-Ford per
  component (ADR 0012), the loop on the graph of repeats, and the
  structural depth with its warnings. A cycle is named by its first node
  in the stamping's order that is a named component's port. Every node
  carries its definition as a build's slot carries its source (`Def`),
  and define runs over the graph (`compile/graph/define.rs`):
  cells by a union-find over the aliases, the flags that hold each, the
  author's operators oriented, the prefill rule, and the writable and
  live walks, whose classes become the ports' attributes; the refuse
  warnings are read off the same cells (`compile/graph/refuse.rs`).

Each stage keeps its own table (ADR 0031): a template is outlining's part
(`Outlined`, read-only once outlining is done), boxing's and planning's
(`Tables`) and sealing's (`SealedTemplate`), put together into `Plans`
when the compile is done.

The result is `Compiled` (`plan.rs`): the source and the `Plans` made from
it, which are the templates, their plans, the ports' attributes the
check found and the source's diagnostics, the check's warnings included. The
stages read the source as a borrow, given to each stage that needs it, and
make `Plans`; only the finished `Compiled` owns the source. A build reads
the two as a `CompiledRef`, borrowed: from the check, from the source it
planned, and from a `Compiled` a document keeps (`Compiled::view`).

### Build (`build/`)

Turns the compile into cells and instructions for one particular
structure: a particular iteration count for every repeat and a particular
draw for every select.

- **Expand** (`build/expand/`) stamps each template into components once per
  *scope* (the document, and each iteration of each repeat) and resolves
  references to slots.
- **Define** (`build/define.rs`, ADR 0035) merges aliased slots into cells
  with a union-find and finds the one slot that defines each cell, orients
  the author's operators (ADR 0026), checks the prefill rule (a prefill
  must name a value that is not computed, unless it is a counted value),
  and classes every cell. A given value (an attribute's or a default) is
  essential only when a student's action can write it (ADR 0018):
  `build/writable.rs` walks back from every input prop to where a request
  on each cell goes. Both walks read the cells the slots will make
  (`SlotCells`, `build/slot_cells.rs`) only through a cell's definition
  (`Def`), which defines its two relations once: what it needs (what its
  source reads, and the flags that hold it) and where a request on it goes
  (what its inverse may write, nowhere past a constant hold).
  `Program::needs` is the first over the cells a build made. The check
  runs the same walk over the template graph and marks the writable
  ports, a *port attribute* (`PortAttrs`) kept by template slot in the
  check's table of each template (`Checked`), and every build classes by
  the attributes, so a slot's class is the same in every build. A class is computed only when it is live (ADR
  0019): `build/live.rs` walks back from every root (the rendered props of
  rendered components, scores, inputs, what an action or snapping reads,
  repeat counts) through what each cell needs. The check marks the live
  ports as it marks the writable ones; a class no port names (a
  synthesized component's, such as a choice's interface) is live when
  something live reads it (`Defined::by_attributes`); a build's own
  walks are the tests' check of the attributes. What define makes, `Defined`, is what emit reads. The
  refuse analysis (`program/refuse.rs`) is one rule over a graph that the
  check asks of the template graph's cells (`compile/graph/refuse.rs`)
  and a document asks of its program (`Interactive::refused_bits`).
- **Emit** (`build/emit.rs`) numbers the cells (the constants, with the
  session's pool of document constants first, ADR 0028; then essential;
  then derived), binds operators to them as instructions, seeds values
  and compiles curve tapes. A dead class gets no cell: its props name the
  one dead cell, a constant NaN, and its instruction is never bound. A
  live class that needs the dead cell, an instruction's input or a hold's
  flag, fails the build (`Error::Unchecked`). `LoadOptions::prune` off
  computes every class.

  Emit also makes the constants (ADR 0028). A document constant, by the
  port's attribute (`PortAttrs::DOCUMENT_CONSTANT`), an operator's
  constant and the missing-referent cell name a cell of the session's
  **constant pool**, one per distinct value, which every build starts its
  cells from and appends to; a document constant's cell index is the same in
  every build of the session. Every other constant, a scope constant, gets a
  cell of its own. An instruction whose inputs are all constants made in its
  scope or one around it is **folded** (`Builder::folded_slots`): its
  outputs are numbered among the constants, it is run once as emit ends, and
  the program keeps no instruction for it. A *counted value*, which a build
  counts from the structure it stamped (a collect's count from a repeat, a
  section's number after one), is a derived cell in every build, never a
  constant; the check marks the ports that hold one
  (`PortAttrs::COUNTED`).

A build learns the document's structure from the counts it was asked for
(`Counts`) and the session's seed: how many iterations each repeat has,
and so which iteration or item an index names, what a collect gathers
and what a select draws. The cycle check reasons about the template
graph, which stands for every count and every draw, and
`tests/every_count.rs` holds every build to it; a structural read the
graph does not model is one the cycle check cannot see.

Expand and resolve read the counts; define finds a loop of aliases a gap
in the check (`Unchecked`). Emit reads no structure (ADR 0035). So the
check reads the graph and the cells'
definitions, never a numbered cell or a bound instruction: a rule about
what a cell *is* (its class, what it needs, where a request on it goes,
what an author may reference) belongs in define or before it, and a rule
about how a cell is numbered or an instruction bound belongs in emit. A
diagnostic raised in emit is misplaced, and a structural read in emit is
a bug. A build reads the compile and the session, never the template
graph: what the check hands it is facts about template slots, the port
attributes and the depth, and the graph is dropped with the check
(ADR 0036).

A build reads the `Session` (`session.rs`) and returns the next one. The
session is everything that survives across builds: the scope table, every
essential value keyed by (scope, template slot), runtime strings, the
random seed, the math engine with each constant expression's handle, and
the constant pool. Since the old session is untouched until a build
succeeds, a failed rebuild leaves the document as it was.

### Schedule (`program/`)

`BuildOutput::schedule` sorts the instructions topologically
(`Program::schedule`) into a `Program` and produces a `Document`.

### Document (`document/`)

A `Document` is a loaded document: the cells and what each holds
(`value_types`), the program and its symbolic state, the
`ComponentTable` and the string table, all of which one build made and a
rebuild replaces; and the session, what the load settled (`Loaded`: the
compile, the keys, the source's literal attributes for a renderer) and how
ticks recompute, which a rebuild carries. It is the API that the wasm
binding and the tests use.

### Tick (`tick/`)

Handles a request: snap, invert, write essential cells, recompute what is
downstream, and report a `TickOutcome`. See
[A user drags a point](docs/guide/what_happens_when.md#a-user-drags-a-point).

## The main types

| Type | Where | What it is |
|---|---|---|
| `Dast` | `dast/mod.rs` | The parsed source in parallel arrays indexed by `NodeId`. |
| `ComponentType`, `ComponentDef`, `PropDef` | `components/` | The tag vocabulary: each type's props, where each prop's value comes from (an attribute, its children, an operator over its own props, or its planner), its flags and its planner. |
| `Compiled`, `CompiledRef`, `Plans`, `Template` | `compile/plan.rs` | The compile's output: the source and its `Plans`, one template per document, repeat body and choice branch, with a plan for every prop and reference. Made once per load. A build reads it as a `CompiledRef`. |
| `TemplateGraph` | `compile/graph/mod.rs` | Every live template stamped once from the plans: ports and the values stamped beside them, and what each reads, labelled by how it moves through the iterations (`Coord`). Every node defined as a build's slot is (ADR 0032, step 8): what the check's stamping failures, cycle check, define, walks, refuse warnings and the input signature read; every build is held to it (`tests/every_count.rs`). |
| `Defined` | `build/define.rs` | What define made of a build's resolved slots: the cells they will make (`SlotCells`) and each slot's class, essential and live, by the ports' attributes the compile keeps (ADR 0035). What emit reads. |
| `BuildOutput` | `build/mod.rs` | Cells, instructions and the component table of one stamped build, before scheduling. |
| `Session`, `Counts`, `Pool` | `session.rs` | What survives every build: scopes, essential values, strings, seed, the constant pool (ADR 0028); and the counts a build stamps. |
| `MathStore` | `session.rs` | The math engine and the handles of the source's constant expressions, which the document owns beside the session and lends to each build and tick (ADR 0015's amendment of 2026-11-05). |
| `Structure` | `build/structure.rs` | What one build made: its repeats and its essential cells' keys. |
| `Program`, `Instr`, `Op`, `VecOp` | `program/` | The instruction set. `Op` (`scalar.rs`) is a scalar operator with its evaluation and inverse; `VecOp` (`vector.rs`) reads and writes several cells; symbolic operators call the math engine. A `Program` is read-only while a tick runs; what its symbolic instructions keep between runs is a `SymState` beside it in the document. |
| `Document`, `Built` | `document/mod.rs` | A loaded document and the API to it: what one build made (`Built`, which a rebuild replaces and the document reads as), the session, the math and what the load settled. `output_cells` and `is_live` (`document/outputs.rs`) say what leaves it and what it computes. |
| `Renders`, `Live` | `components/mod.rs`, `build/mod.rs` | Where a component type is drawn (always, never, only in a graph), which decides whether its `rendered` props are outputs; and a build's bit per cell of what it computes (ADR 0019). |
| `CellIdx`, `CompIdx`, `NodeId`, `StrId`, `ScopeId`, `OperandIdx`, `MemoIdx`, `SymIdx`, and the compile's and build's ids (`TemplateId`, `ElemId`, `RefId`, `ChoiceId`, `ElemKey`, `ExprId`, `SlotId`, `Handle`) | `index.rs` | Positions in the cells, the component table, the DAST, a string table, the session's scopes, a program's operands, its symbolic instructions and its symbolic memo, and the like, each its own type over a `u32` made by `index_type!` (`index()` reads the position), so one cannot be passed for another. A text cell holds a `StrId` as its value (`StrId::to_value`). Two lists mix kinds of entry and say so in their types: a child list's `ChildEntry` (`document/table.rs`) is a component or a text child's string, and a literal attribute's `AttrValue` (`dast/attrs.rs`) is a string or text the attributes keep. A math's leaves say what they are by type: `Expr<L>` and `sym::Tree<L>` hold `RefId`s in the compile, `SlotId`s in a build, `CellIdx`s once emit rebinds them. |
| `ComponentTable` | `document/table.rs` | Components in columns: type, name, parent, children, the component each reference refers to (`referent`, ADR 0024), and the cell index of each prop. `prop_cells` lists those indices one component after another, starting at `prop_base[c]` (ADR 0016); the cells they name are not contiguous, since emit orders cells by kind and aliased props share a cell. What references and renderers read. |
| `Request`, `PointRequest`, `TickOutcome` | `tick/` | A tick's input (set a cell; move points together) and its result. |
| `Recompute`, `DirtyClosure` | `tick/eval.rs` | The document's setting of how a tick recomputes: every instruction, or the dirty closure of what changed, whose tables are `DirtyClosure`. |
| `Diagnostic` | `diagnostics.rs` | An error, warning or lint finding, tied to a DAST node (ADR 0013). |
| `Engine`, `Tree`, `Tape` | `sym/` | The symbolic engine behind math cells: math-expressions-rs called directly (ADR 0008, ADR 0011). A math cell holds a handle into it. `Tape` compiles a curve of constant shape to numeric steps. |

## Where to change things

The reading paths, by what you came to do, are chapters of the crate's
rustdoc (`npm run doc`, the `_guide` module), each a file under
`docs/guide/`:

- [`renderer.md`](docs/guide/renderer.md): drawing a loaded document,
  and changing what a renderer reads.
- [`component.md`](docs/guide/component.md): adding a component type or
  an operator, and changing how a request inverts.
- [`compile.md`](docs/guide/compile.md): the compile's stages, each
  stage's module, entry and table, boxing and the retry.
- [`what_happens_when.md`](docs/guide/what_happens_when.md): a document
  loads, a user drags a point, a repeat's count changes, an element
  cannot be built, the language server asks for diagnostics, an answer is
  submitted.

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
- A component's spec (`testing/spec.rs`, ADR 0016) sits beside its
  definition: `components/geometry/circle.spec.rs` is the spec of
  `components/geometry/circle.rs`, which includes it as a test-only module
  (`#[path = "circle.spec.rs"] mod spec;`); a type defined in its family's
  `mod.rs` (the slider) has its spec beside that `mod.rs`
  (`components/inputs/slider.spec.rs`), included there.
  Each `spec!` case gives DoenetML, a sequence of requests, and the values an
  author should see after each. Every case is also checked against the
  reference evaluator and the component's cost snapshot in
  `components/snapshots/`. `SPEC_UPDATE=1` rewrites a snapshot; review the
  change alongside the code that caused it. A new component comes with its
  spec: a unit test (`components/mod.rs`) fails for one without (or with a
  spec file its definition does not include), unless
  it is in `WITHOUT_SPEC`, a list that only shrinks; writing a listed
  type's spec means taking it off the list.
- `tests/every_count.rs` builds every golden document and fixture at
  iteration counts 0 to 4 and four seeds, and checks that a document that
  passed the cycle check never fails a build with a cycle or an unsettled
  structure. It also checks each build against the template graph
  (`build/coverage.rs`): every dependency must be one the template graph
  has, with a label its iterations satisfy. This tests the assumptions the
  cycle check rests on directly, instead of waiting for a missed cycle. The
  same holds for the classing (ADR 0018): at each count and seed, nothing a
  build's own walk finds writable is a port the check did not mark
  writable, and every request on an interactive cell, submit and trigger, made
  with every value essential (`LoadOptions::classify` off), writes only
  cells the attributes make essential. And for the constants (ADR 0028): a slot
  that is a constant in one build of a scope is the same constant in every
  build of it, at every count, and a document constant the same in every
  scope of its template.
- `tests/constants.rs` counts each document's constants and pool, and
  checks that a full recompute changes no constant, that a folded curve is
  still drawn, and that a document constant keeps its pooled cell through
  rebuilds; `tests/live.rs` checks that folding, like pruning, changes no
  live value (`LoadOptions::fold` off against on), and so does sharing
  (`LoadOptions::share`, the compile's share stage off, ADR 0033).
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
- `tests/live.rs` checks the live attribute (ADR 0019) at every golden
  document and `sir.doenet`, four seeds and counts 0 to 4: nothing a
  build's own walk finds live is missing from it, every output and every
  essential cell is live, every live cell's `Program::needs` is live, a
  cell a constant flag holds takes no request, and a pruned load and an unpruned one, given
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
- `scripts/tick-diff.sh [base]` and `scripts/load-diff.sh [base]` compare
  a tick and a load, natively, against a base commit, over the synthetic
  shapes of `cells-bench`. A change to the compile or the build records
  both in its ADR: a pass that makes a tick cheaper is paid for at every
  load, and the load is where it shows. `docs/load-cost.md` has the load's
  history and where its time goes.
- `npm run doc` builds the contributor docs as CI does, with private
  items and warnings denied, so a broken intra-doc link fails;
  `npm run doc:public` builds the API alone, what `cells-wasm`, the
  bridge and a test author read, where `missing_docs` is denied too: a
  `pub` item is API (`unreachable_pub` refuses one that is not), and it
  has a doc. The `_guide` chapters (`docs/guide/`) are in both. Every `impl` block of
  a type whose methods span files (`Compiler`, `Builder`, `Stamp`,
  `Seal`, `Document`, `Built`) carries a doc comment naming the stage or
  role it serves and what it reads and writes: rustdoc shows it as a
  heading over the block's methods on the type's page, in an order the
  heading cannot rely on.
