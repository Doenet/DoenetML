# Compute only what leaves the core: outputs, decided once per load

Status: draft 2026-10-28.

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
- every sticky group member's cells, which snapping reads. They are
  rendered today; naming them keeps snapping right if one is not.

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

- `renders: always` (the default), `never` (an `<award>`, a `<when>`, a
  `<response>`, a `<choice>`, which its `<choiceInput>` draws, a
  `<selectFromSequence>`, an `<updateValue>`, a `<functionIterates>`), or
  `in_graph` (a line, a segment, a circle, a polygon, a polyline);
- a type whose children are not rendered: `<setup>`. A component is
  rendered when it renders and every component above it renders its
  children.

A dynamic `hide`, or a case that is not active, does not make a component
unrendered: either can change on any tick. Content under a literal
`hide` could be cut, as a later refinement.

The marks are the contract with the renderer, as `interactive` is. The
viewer's test fails when a renderer reads, through `comps.cell` or
`useCell`, a cell the core does not report as an output, as it fails today
on a request to a cell that is not interactive. A renderer added for a
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
exposed by `cells-wasm`, turns the record off: every slot live, as before
this ADR. The viewer loads with it on; the harness and the golden diff with
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
  function's samples most of the derived cells; on `sir.doenet` no instruction goes, but about
  seven in ten fixed cells do.
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
   under.
3. **Prune** (step 5). Emit skips dead slots; the dead cell;
   `LoadOptions::prune`; `Document::is_live`. In `tests/every_count.rs`,
   for every golden document and fixture at counts 0 to 4 and four seeds:
   each build's own walk finds nothing live the record leaves out, and
   after load and after the golden script every live cell holds the same
   value with pruning on and off. Spec cost snapshots move and are
   rewritten with `SPEC_UPDATE=1`, reviewed against the census.
4. **Measured** against the commit before phase 3: `golden-diff.sh` with
   pruning off identical; load, tick, rebuild and memory with
   `perf-diff.sh` and `cells-bench`; the parity dashboard, unchanged with
   the harness loading unpruned.
5. **Docs.** `CONTEXT.md`: *output*, *root*, *live*, *dead cell*, and
   *fixed cell*'s and *derived cell*'s note that a dead one has no cell.
   `ARCHITECTURE.md`: emit, "A document loads", and "Add a component type"
   (mark what the renderer reads). This ADR's status.

Open while drafting:

- Whether `renders` and the setup rule cover every type, checked by
  phase 1's test over the viewer's renderers.
- Whether a fixed `hide` (a literal, ADR 0018) should make its content
  unrendered, and so dead unless something live reads it.
