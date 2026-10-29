# Compute only what leaves the core: outputs, decided once per load

Status: proposed 2026-10-28. Every migration step is done; see Migration.

An **output** is a cell whose value leaves the core: a prop a renderer
draws, or a score a grader reads. The compile finds, once per load and per
template slot, every slot an output can read, together with the cells the
core reads itself (inputs, what an action reads, a repeat's count). A slot
outside that set is **dead**: every build gives it no cell and no
instruction. ADR 0018 made the essential cells the smallest state a
student can change; this ADR does the same for the computed cells: only
what someone sees, or what the core needs, is computed.

## Context

A build emits an instruction for every derived prop of every component,
whether or not anything reads it: a line's slope and coefficients when the
graph draws only its points, a circle's area, the 200 samples of a
`<function>` the viewer does not draw, every prop of a component inside
`<setup>`. Each costs a cell and an instruction at every build, and work
at every tick its inputs change. The definitions already say what a
renderer may *write* (`interactive`, ADR 0017 and 0018); nothing says what
it *reads*.

Counted when this was written, at each document's load structure, with a
throwaway test whose roots follow what `packages/cells-viewer` reads
today (`renderers/`), plus every input prop, an answer's responses, an
`<updateValue>`'s `newValue`, every count and every credit. The walk goes
backward from those cells through every input of every instruction. To
estimate what step 3's record costs, a second walk treated a prop as live
in every instance of an element when it is live in one:

| Document | Instructions live / all | Derived cells live / all | Fixed cells dead / all | Components rendered / all |
|---|---|---|---|---|
| choices | 38 / 38 | 38 / 38 | 1 / 39 | 39 / 42 |
| circles | 14 / 58 | 21 / 65 | 12 / 27 | 20 / 20 |
| fixed | 15 / 23 | 15 / 23 | 3 / 16 | 13 / 13 |
| lines | 2 / 26 | 3 / 27 | 1 / 9 | 12 / 12 |
| ops | 17 / 17 | 17 / 17 | 1 / 4 | 25 / 25 |
| polygons | 5 / 5 | 12 / 12 | 1 / 14 | 23 / 23 |
| repeats | 24 / 40 | 24 / 40 | 12 / 42 | 34 / 48 |
| scoring | 25 / 28 | 25 / 31 | 16 / 59 | 23 / 23 |
| slider | 26 / 26 | 26 / 26 | 1 / 10 | 7 / 7 |
| sticky | 1 / 1 | 6 / 6 | 5 / 11 | 16 / 16 |
| symbolic | 10 / 13 | 10 / 411 | 1 / 3 | 13 / 13 |
| golden set | 177 / 275 | 197 / 696 | 54 / 234 | 225 / 242 |
| `sir.doenet` | 2829 / 2829 | 2829 / 2829 | 1823 / 2649 | 1910 / 4952 |

What it shows:

- On the golden set about a third of the instructions are dead: geometry
  computed for props nothing draws (`lines`, `circles`), a repeat's
  unrendered values (`repeats`), and in `symbolic` a function's samples,
  401 of its 411 derived cells.
- On `sir.doenet` every instruction is live: three fifths of its
  components are not rendered, but what is rendered reads all of them.
  What it gains is 1823 of its 2649 fixed cells, author values in
  unrendered components that nothing live reads.
- No essential cell is dead, on any document; step 2 says why that always
  holds.
- The second walk found the same live set as the first on every document:
  at these structures, deciding per template slot cost no precision. It
  approximates the template slot by the element's DAST node and does not
  fold iterations as the probe does, so phase 2 counts it properly.

## Decision

### 1. Outputs

A cell is an output when it is:

- **rendered**: a prop a component renderer reads, of a component that is
  rendered (step 3); or
- **a score**: the `creditAchieved` of the document and of every section
  that aggregates scores, and an answer's `credit`, which a grader or an
  LMS reads per item.

### 2. Roots, and the live set

The core reads some cells itself, at tick time, that are not outputs. With
the outputs they are the **roots**:

- every **input** prop, `interactive` or `written_by_action` (ADR 0018);
- what an **action reads**: an answer's and a `<response>`'s live
  `response`, which a submit copies, and an `<updateValue>`'s `newValue`,
  which a trigger requests;
- every **structural** cell: a repeat's and a function iterate's `count`,
  which the rebuild check compares;
- what snapping reads: every prop of a sticky group and of each of its
  members. The members are rendered today; naming them keeps snapping
  right if one is not.

A slot is **live** when a root reads it, through aliases and through every
input of the instruction that defines it, its hold's flag included. A
vector operator is live when any of its outputs is, and then reads every
input.

Every essential cell is live: an input's request writes only through the
inverses of the instructions above its own cell (ADR 0018, step 1), so
what it writes is an ancestor of a root, and an action's targets are
roots. A tick's inversion reads only the inputs of those same
instructions, and lookahead computes the realized value of requested
points, which are inputs. So nothing a tick reads is dead.

### 3. The definitions say what a renderer reads

Beside `interactive` and `written_by_action`, a prop may be marked:

- `rendered`: a renderer reads it (`x: attr(0.0) { interactive, rendered }`;
  a list ending `rendered: true` has every point rendered);
- `score`: a grader reads it;
- `read_by_action`: an action reads it (an answer's and a `<response>`'s
  `response`, an `<updateValue>`'s `newValue`).

`ComponentType::is_root_prop` reads every flag, and `count_prop`.

Whether a component is rendered is decided by the type and its chain of
parents, declared in the type's block:

- `Renders::Always`, the default; `Never` (a `<setup>`, an `<award>`, a
  `<when>`, a `<response>`, a `<selectFromSequence>`, an `<updateValue>`,
  a `<functionIterates>`, a `<shortDescription>`, a `<function>`); or
  `InGraph`, drawn only with a `<graph>` above it (a line, a segment, a
  circle, a polygon, a polyline, a legend), written `renders: InGraph`
  after the block's `flags`;
- a component is rendered when its type's rule allows it where it is and
  its parent is rendered; the document is. So nothing inside a `<setup>`
  or an `<award>` is.

A dynamic `hide`, or a case that is not active, does not make a component
unrendered: either can change on any tick. Content under a literal
`hide` could be cut, as a later refinement.

The marks are the contract with the renderer, as `interactive` is. The
viewer's test fails when a renderer reads, through the store's `get` or
`subscribe` (which `useCell` and the board's elements read through), a
cell the core does not report as an output, as it fails on a request to
a cell that is not interactive. A renderer added for a
type marks what it reads in the same change: the viewer draws no
`<function>` today, so a function's samples are dead until one does.

### 4. The compile decides, per template slot, once

As ADR 0018 records what is writable, the compile records what is live:

- A document with repeats or selects is checked through the probe, whose
  graph holds every edge any count or pick can create (ADR 0012, ADR 0014),
  and which stamps each template once. Rendering follows the template's
  chain of parents, which the probe stamps as every build does. The walk
  of step 2 runs on the probe's graph, over emit's alias classes, and
  follows a slot's later-iteration sources as the writable walk does.
  `Compiled` records, per template slot, whether its class is live, in a
  record shaped as the writable one (`Classes::Record`: per template, a
  bit per template slot, `slot_off + pi`).
- A document without either has one structure, and its first build is its
  check (ADR 0015): the walk runs on that build's graph and classes its
  slots by it.

A slot live at some count is live in the probe, so the record holds every
slot any build needs. It holds more where an edge exists only at some
counts: every iteration of a template shares its slots, so an output
reading iteration 3's `x` keeps every iteration's `x`. The rebuild runs no
walk.

### 5. A dead slot has no cell

Emit's counting and numbering loops skip a dead slot, as they move an
unwritable value slot to the fixed cells (ADR 0018): no cell, no
instruction, no operands, no symbolic memo. A dead derived slot's
instruction is never bound; a dead fixed slot's value is never stored. Its
entry in `prop_cells` names one shared fixed cell, the **dead cell**, NaN,
so a read of it is in bounds; `Document::is_live` is false for it. A
schedule and a dirty closure built from the program have only live
instructions.

The alias classes are unchanged, so a live slot is never aliased to a dead
one: an alias makes one class, live or not.

### 6. What does not change

- The compile's check, its cycle check and its diagnostics run on the
  unpruned graph: a dead element's errors are reported (ADR 0014).
- The essential cells, their keys and saved state (ADR 0017, 0018): every
  essential cell is live.
- The input signature (ADR 0017) describes the source, not a build, and
  hashes the same with pruning on or off.

### 7. Reading what is not an output

`Document::value`, `Document::rendered_text` and the JavaScript
worker's parity harness read any prop of any component, as the current
core's state variables allow. `LoadOptions::prune`, on by default and
exposed by `cells-wasm`, turned off computes every slot, as before this
ADR; the record is still made, so `Document::is_live` still says which
cells are needed. The viewer loads with it on; the harness and the golden diff with
it off, and the golden diff again with it on, comparing live cells only.

## Considered options

- **Walk each build's own graph** (the first plan). As precise as the
  structure allows, and simple, but it runs at every rebuild, which must
  fit a tick's budget (ADR 0004), and it makes which slots exist a fact
  about a structure rather than the source, the line ADR 0015 and 0018
  keep. It also makes a cell's existence depend on counts, so pruning
  could only skip instructions, not cells.
- **Keep every cell and skip only the dead instructions.** Smaller change:
  numbering is untouched and every prop still reads a cell, stale. Saves
  the tick's work but not the memory, and a stale value read by mistake is
  worse than a NaN known to be dead.
- **Compute a dead cell when it is read.** Keeps `Document::value` exact
  with pruning on, but a lazy path through the program for a reader the
  browser does not have. The off switch serves the readers that need it.
- **Derive `rendered` from the viewer.** One fewer place to keep in step,
  but the core cannot read the viewer, and a second renderer (a server
  renderer, PreTeXt) would have to agree with it anyway; the marks make
  the agreement explicit and the viewer's test enforces it.
- **Skip building elements nothing live reads.** An unrendered element
  with no live slot and no input need not be expanded at all; most of
  `sir.doenet`'s components are unrendered, though how many hold a live
  slot was not counted.
  It changes the component table, which references resolve through, so it
  waits until this ADR's record exists and is measured.
- **Score only the document's credit.** What an LMS needs for one grade,
  but per-item reporting reads every answer's and aggregating section's,
  and those are a few cells.

## Consequences

- A component definition says what a renderer reads, as it says what one
  writes. A renderer reading an unmarked prop fails the viewer's test.
- On the golden set, about a third of the instructions go, and with a
  function's samples most of the derived cells; on `sir.doenet` no
  instruction goes, but almost half its fixed cells do (phase 2 counted
  1220 of 2649, not Context's estimate of seven in ten).
- Cell numbers change wherever a slot is dead, so the golden diff's
  programs change; its values, read with pruning off, do not.
- `Document::value` on a dead prop reads NaN with pruning on. The parity
  harness loads with it off.
- A new renderer, or a new prop a renderer reads, changes what a document
  computes: the mark is load-bearing.

## Migration

Each phase leaves the tree green.

1. **Marks** (step 3). `rendered`, `score` and `read_by_action` in
   `component!`, `renders` in the block, `ComponentType::is_root_prop`.
   The viewer's test fails on a read of a cell the core does not report as
   an output (`output_cells` in `cells-wasm`, from the marks over the
   component table, unpruned). Nothing is pruned.
2. **The record, measured** (steps 2 and 4). `build/live.rs`, beside
   `build/writable.rs`; `Compiled` gains a live record beside the
   writable one (`Classes`), set by the probe in `compile/check.rs` where
   `writable_record` is, and off (every slot live) where the classing is
   off for want of a probe. A census test,
   `tests/live.rs`, prints per document what each build's own walk finds
   live and what the record finds, at counts 0 to 4, and asserts every
   essential cell is live. Settle which template slot a synthesized
   component's slot (a point list's points, a collect's copies) records
   under: none, and a class no slot names is kept.
3. **Prune** (step 5). Emit skips dead slots; the dead cell;
   `LoadOptions::prune`. In `tests/live.rs`,
   for every golden document and `sir.doenet` at counts 0 to 4 and four
   seeds: each build's own walk finds nothing live the record leaves out,
   and after load and after a request on every interactive prop, a submit
   of every answer and a press of every trigger, every live cell holds the
   same value with pruning on and off. Spec cost snapshots move and are
   rewritten with `SPEC_UPDATE=1`, reviewed against the census.
4. **Measured** against the commit before phase 3: `golden-diff.sh` with
   pruning off identical; load, tick, rebuild and memory with
   `perf-diff.sh` and `cells-bench`; the parity dashboard, unchanged with
   the harness loading unpruned.
5. **Docs.** `CONTEXT.md`: *output*, *root*, *live*, *dead cell*, and
   *fixed cell*'s and *derived cell*'s note that a dead one has no cell.
   `ARCHITECTURE.md`: emit, "A document loads", and "Add a component type"
   (mark what the renderer reads). This ADR's status.

Settled while implementing phase 1:

- `Document::output_cells` (`document/outputs.rs`) and
  `rendered_components` compute the outputs from the component table on
  each call; phase 2's record replaces the table walk, and phase 3 keeps
  a bit per cell if a tick needs one.
- A `<choice>` is drawn: its `<choiceInput>` draws its children beside
  each radio button, so it renders as its parent does. The draft listed it
  as never rendered.
- `InGraph` asks for a `<graph>` anywhere above. The viewer passes "in a
  graph" through only some containers (a `<p>`, a `<group>`, a case), so
  the core's rule counts a few components rendered that the viewer does
  not draw, never the other way: a wider rule computes more, not less.
  For the same reason a `<triggerSet>`, which the viewer does not draw in
  a graph, renders always.
- A polyline's `numVertices` is not rendered: its renderer reads its
  children, points that are rendered in a graph.
- The check sits in `CellStore.get` and `subscribe`, on with
  `CellStore.checkReads`, in development and in tests like
  `checkRequests`. The viewer's test renders a document with every
  renderer, then every golden document and `sir.doenet`, uses every
  control, and finds no read of a cell that is not an output; it also
  lists one read per renderer that must happen, as it does for requests.
  Unmarking a point's `hide` fails it on that document and on the
  golden documents that draw points.
- The core's own test, `tests/outputs.rs`, checks the marks, which
  components are rendered, that every score is an output, and that every
  cell `submit` and `trigger` read is marked `read_by_action`.

Settled while implementing phase 2:

- The walk is `build/live.rs`. Emit runs it in the probe, which records
  every template slot whose class is live in `Compiled::live` (a
  `Classes`, as the writable record is), and in the one build of a
  document without repeats or selects. Every other build reads the
  record: a class is live when one of its slots has a template slot the
  record marks, or when none has a template slot to be named by. Each
  build keeps a bit per cell, `Document::is_live` and `live_cells`, which
  phase 3 prunes by; nothing reads them yet. With the `testing` feature
  each build also runs its own walk (`live_cells_walked`), which
  `tests/live.rs` checks the record against.
- A component is rendered when the children lists reach it from the
  document (`ComponentTable::placement`, which `rendered_components` and
  the walk share), as a renderer finds it, not when its chain of parents
  does: a function iterate's tuples name a repeat as their parent but are
  no one's children. Walking parents kept 1206 more cells of `sir.doenet`
  live.
- An input is a root wherever it is, drawn or not: a line outside a graph
  is not drawn, but its points are live. The writable walk starts from
  every input too (ADR 0018), and so every essential cell is live.
- A copy that takes its referent's list (`place_list_copies`) has more
  slots than its element reserves in the template; `Builder::template_slot`
  now names none past that, rather than running into the next element's.
  The writable record never marked those slots, which are aliases; the
  live record does.
- Measured by `tests/live.rs`, at load: the record finds what the build's
  own walk finds on every golden document and `sir.doenet`, and the
  numbers of Context's table but for two documents' fixed cells.
  `sticky.doenet` has 1 dead, not 5: snapping reads every prop of a sticky
  group and of its members. `sir.doenet` has 1220 of 2649 dead, not 1823;
  the rest are its points' `hide`: a polyline's vertices are copies of
  points, which count as rendered in a graph, `hide` with them, though its
  renderer reads only their coordinates.
- At four seeds and every repeat at 0 to 4 iterations, nothing a build's
  own walk finds live is missing from the record, every output and every
  essential cell is live, and the record keeps 8 cells more than the
  builds' walks, all in `repeats.doenet`, over all those builds together.
- A load costs 3% to 12% more, natively (release, best of 15, the commit
  before this phase in a worktree; `sir.doenet` 3.46 ms to 3.89 ms): the
  probe's walk, and every build's lookup of each slot in the record.
  Nothing is pruned yet to pay for it.

Settled while implementing phase 3:

- Emit prunes only outside the probe, whose build is not kept, and only
  when the load asked (`Compiled::prune`, apart from the record, so an
  unpruned load still reports what is live). A dead class's defining slot
  goes nowhere; the dead cell is the first fixed cell, made only when
  some class is dead. A vector output is pruned with its head, whose
  instruction writes it. An essential slot is never pruned; none is dead.
- The walk follows every input, so no live instruction reads a dead cell,
  and the record keeps that in every build (phase 2). Emit checks it as
  it binds each instruction: one that would read the dead cell fails the
  build with `Error::Unchecked`, the load's or a rebuild's, rather than
  compute from NaN. A walk mutated to follow only each operator's first
  input fails `tests/live.rs` that way at load and at rebuild.
- A seed's source must not be computed (ADR 0013's boxed `prefill`). The
  check read the source's cell index; it reads the source's kind now, so
  a seed nothing reads, which has no cell, is checked all the same, and
  the load's errors do not depend on pruning.
- `cells-wasm` loads pruned by `with_seed`, and either way by
  `with_options` and `with_options_and_state`; the JavaScript worker's
  parity harness (`test-core-cells.ts`) loads unpruned. Phase 4 runs it.
- The golden dump (`cells-bench/examples/golden.rs`) loads unpruned, and
  `golden-diff.sh` against phase 2 is identical, values and programs
  (`GOLDEN_OWN=1`: phase 2's harness has no `prune` to set).
- A spec reads a document with every prop computed and ticks a pruned
  one beside it, which must agree on every live cell
  (`testing::live_cells_agree`) and drop the same requests; its cost
  snapshot is the pruned load's. Only the line's and the circle's moved:
  a line given no attributes, 23 cells and 12 instructions before, is 11
  and 0.
- A test that reads a prop no renderer reads loads unpruned
  (`test_utils::load_unpruned`): a circle's diameter, a line's slope and
  coefficients, a document's `percentCreditAchieved`, a function's
  samples and their tapes, `sir.doenet`'s polylines' `numVertices`, and
  `testing::dast::load`'s test-only components. Two tests that compare
  whole cell arrays compare bits, the dead cell being NaN.
- A pruned load against the commit before phase 2, natively as there:
  about 10% faster on `symbolic.doenet`, whose function's samples are
  dead, and within 5% either way elsewhere, `sir.doenet` included. The
  pruning pays back most of what phase 2 added.

Measured in phase 4, against the commit before phase 2 (`42db61a`), unless
it says phase 2's (`6d3f777`):

- **Structure**, natively (`cells-bench`'s `stats`, every generated
  fixture and `sir.doenet`, 49 documents): 0.918 of the cells, 0.980 of
  the instructions and 0.978 of the estimated bytes, and no document
  larger. Where something is dead the gain is large: `curves-100` keeps
  107 of 40,307 cells and none of 400 instructions (0.043 of the bytes),
  `circles3-1000` 1,000 of 5,000 instructions (0.750), `recur-1000` 3,012
  of 10,024 cells (0.807), `sir.doenet` 4,269 of 5,488 cells (0.967);
  elsewhere almost nothing is.
- **A bug it found**: emit sized the cells for the classes it keeps, not
  for the dead cell, whose push then doubled the cell array and its
  defining slots (`repeat-10000`: 1.6 MB of cells for 0.8 MB of values,
  estimated bytes 1.13 of the base). The dead cell is counted with the
  rest now, and `tests/live.rs` checks every build's cells are what emit
  counted.
- **Load**, natively (release, best of 15, three interleaved rounds):
  `curves-100` 0.38, `circles3-1000` and `answers-100` 1.00, `sir.doenet`
  about 1.08, `repeat-10000` 1.04 to 1.17, `recur-1000` about 1.12; the
  golden set as phase 3 measured. A document with repeats pays for the
  probe's walk and every build's lookup of each slot in the record, which
  pruning repays only where much is dead.
- **Tick**, natively (`tick-diff.sh` against phase 2's, seven rounds): the
  same instructions on every shape, which render all they compute, and
  medians within the harness's noise, 0.94 to 1.18 on sub-microsecond
  ticks and 0.94 to 1.15 elsewhere, both ways. Every shape's values
  differed, but only in props pruning leaves dead: loaded unpruned, every
  fingerprint matched the base's, and the fingerprint now hashes live
  props only (`cells_bench::shapes::fingerprint`).
- **Wasm** (`perf-diff.sh`, both sides built without `wasm-opt`): memory
  0.99 to 1.01 on its fixtures once the bug above was fixed, which render
  nearly everything they compute; load and tick varied by 15% to 25%
  between runs against the same base, more than any effect here. The
  benchmark measures the cells core through the parity harness, which
  loads unpruned, so the harness loads pruned when `CELLS_PRUNE=1`, which
  `perf-diff.sh` sets; a core without `LoadOptions::prune` loads as
  before.
- **Parity** (`DOENET_TEST_CORE=cells`, the same harness against phase
  2's core and this one): 566 passed and 4,689 failed on both, the same
  tests. Loaded pruned, 12 more fail, all in `circle.test.ts`, which read
  circle props no renderer reads: the harness stays unpruned.

Settled after the migration (2026-10-28):

- The cross-core benchmark loads the cells core pruned, as a browser
  does: `packages/benchmark`'s driver sets `CELLS_PRUNE=1` for it, so
  `perf-diff.sh` needs no setting of its own. Over its 19 fixtures, every
  status and every value check is the same as loaded unpruned (the one
  check that fails, on `rebuild-100000`, fails both ways: the driver
  cannot resolve its path), and memory is within 1%.
- Left as they are, for now: the record's cost for a document with
  repeats (every build looks each slot up in it, and the probe walks once
  more); content under a literal `hide`, which stays rendered; and a
  polyline's vertices, whose `hide` counts as rendered with their
  coordinates.

## Amendment: one record for every build, 2026-10-29

Every document is probed now (ADR 0015's amendment of the same date), so
every build reads the live record; the one build of a document without
repeats or selects no longer walks for itself. Reading the record in
every build found that a class the record cannot name, a reactive
choice's interface component being synthesized, was taken as live
whatever read it, which computed an interface prop nothing reads from
branch cells the record had pruned. Such a class is live only when a
root or a live class reads it, as it was in the probe's walk
(`Builder::live_by_record`); a class the record names and does not mark
stays dead whatever reads it, so `tests/live.rs` still checks the record
against the walk. `Classes` is gone: `Compiled::live` is the record.
