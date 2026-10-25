# The tick's design decisions and what each one buys

The cells core's tick is fast: on the comparison run of 2026-10-19
(`packages/benchmark/results/runs/2026-10-19-claude-cloud-b686555cd/`) a
drag through a chain of 10,000 numbers takes 0.40 ms, where the JavaScript
core takes 8.5 s. That number is the product of many decisions made
together, and it does not say which of them earn it. This report lists the
decisions inside the tick that are most likely to, and for each one the
alternative it was chosen over, so that each can be measured on its own:
build the alternative for one decision, keep every other decision as it
is, and compare against the same base commit.

Scope: the work a tick does between receiving a request and returning its
`TickOutcome` (`Document::tick` in `document/request.rs`, and `tick/`):
inversion, the essential writes, recompute and change tracking. What
surrounds it (the rebuild, sticky snapping, the renderer boundary, the
build itself) is out of scope, except where a build-time decision fixes
the shape of the data the tick runs over.

Each decision gives:

- **Choice**: what the core does now, and where.
- **Alternative**: what to build in its place to measure it.
- **Depends on**: decisions that this one exists for, or only makes sense
  with. Measure an alternative against a base that keeps those.
- **Exercised by**: the benchmark shapes (`packages/benchmark/METHOD.md`)
  where its effect should show.
- **Result**: filled in when measured.

## The decisions

### 1. State lives in one store, apart from the graph

- **Choice.** Every value is in `Document::cells`. The instructions
  (`Program::instrs`), the producer of each cell (`Program::producer`) and
  the readers of each cell (`DirtyClosure::dependents`) are parallel
  arrays beside it. No component and no graph node owns a value.
- **Alternative.** Each value lives in the object that computes it: a
  `Node { value, op, dependents }` per cell, or state variables held per
  component, as in the JavaScript core.
- **Depends on.** Nothing; every other decision here depends on it.
- **Exercised by.** depth, breadth, inversion.
- **Result.** Not measured.

### 2. Operators are data, not code

- **Choice.** An operator is a value of a closed enum (`Op`,
  `program/scalar.rs`, `program/vector.rs`), and one evaluator
  (`Program::step`) interprets it. A component type only chooses and wires
  operators at build time; it runs no code during a tick. Each operator
  carries its inverse (`Op::invert`), so inversion is generic too.
- **Alternative.** Operators are code: each component type writes its
  state variables as functions, a forward rule and an inverse, which the
  tick calls through a trait object or closure. This is the JavaScript
  core's model.
- **Depends on.** 1.
- **Exercised by.** depth, breadth, inversion.
- **Result.** Not measured.

### 3. Operators are fine-grained primitives

- **Choice.** One small arithmetic instruction per derived cell (`Add`,
  `Scale`, `Clamp`, ...); a numeric `<math>` is lowered to a chain of them
  (ADR 0005).
- **Alternative.** One coarse operator per state variable or per
  component, computing several values in one call. It can be built as
  data ("fused" operators), so it is measurable apart from 2.
- **Depends on.** 2. Data operators push towards small primitives, but do
  not require them.
- **Exercised by.** depth, breadth; a fixture of lowered `<math>` chains.
- **Result.** Not measured.

### 4. Storage is contiguous

- **Choice.** One `Vec<f64>`, addressed by a `u32` cell index.
- **Alternative, keeping 5.** A separate heap allocation per value
  (`Vec<Box<f64>>`), so every read follows a pointer.
- **Depends on.** 1.
- **Exercised by.** depth, breadth at 10,000 and 100,000.
- **Result.** Not measured.

### 5. Every cell is the same size

- **Choice.** Every cell is one 8-byte slot. Large values (expressions,
  strings) live in stores outside the array (the session's math engine,
  the string table) and a cell holds a handle; a value of several parts
  is spread over several cells.
- **Alternative, keeping 4.** Values of varying size in one byte arena,
  with an `offsets[cell]` table; an expression or a string is stored
  inline.
- **Depends on.** 4.
- **Exercised by.** depth, breadth; symbolic, for the inline expressions.
- **Result.** Not measured.

### 6. Values are untagged `f64`

- **Choice.** Nothing stored with a value says what type it is. A boolean
  is 0.0 or 1.0, a missing value is NaN, and a cell's type is in a side
  table (`Program::value_types`) read when a request arrives, never during
  recompute.
- **Alternative.** A tagged enum, such as
  `Value { Number(f64), Bool(bool), Text(u32), Math(Handle), Missing }`,
  matched on every operand read. The enum also doubles a cell to 16 bytes,
  so measure two intermediate steps to tell the tag from the size:
  - 16-byte cells without a tag (an `f64` and padding);
  - 8-byte cells and a parallel array of tags, checked on every read.
- **Depends on.** 5.
- **Exercised by.** depth, breadth.
- **Result.** Not measured.

### 7. One cell per scalar

- **Choice.** A point is two cells, a circle three, a sampled curve 200.
  A change to a point's `x` reaches only the readers of `x`.
- **Alternative.** Compound values (a point as one value), with operators
  over vectors.
- **Depends on.** 5, and in practice 6: with tagged values of varying
  size, compound values are the natural choice.
- **Exercised by.** a fixture of points and shapes; a drag of one
  coordinate.
- **Result.** Not measured.

### 8. References alias a cell instead of copying it

- **Choice.** `$p.x`, and every prop of a copy that is not overridden,
  share the referent's cell (the union-find in `build/emit.rs`). A
  reference adds no instruction and no step to propagation.
- **Alternative.** An identity instruction per reference that copies the
  value forward.
- **Depends on.** 1.
- **Exercised by.** a fixture with many references and copies; no shape
  has one today.
- **Result.** Not measured.

### 9. A fixed push schedule, computed eagerly

- **Choice.** A topological order fixed when the document is built
  (`Program::schedule`). A tick runs forward through it and never orders
  work at run time.
- **Alternative.** Pull-based, lazy evaluation that recomputes a value
  when it is read, with a memo per value. `testing/reference.rs` is a
  naive version of it.
- **Depends on.** 1, 2.
- **Exercised by.** depth, breadth.
- **Result.** Not measured.

### 10. Recompute only what is downstream, tracked by schedule position

- **Choice.** `DirtyClosure` (`tick/eval.rs`): the instructions to run are
  a bitset over schedule positions, scanned forward a word at a time,
  with each cell's readers in a precomputed table in compressed-sparse-row
  form.
- **Alternatives.**
  - Recompute everything: `FullRecompute`, selected by
    `set_evaluator("full")` with no code change.
  - The same closure, tracked by a priority queue or a dirty flag per
    instruction.
- **Depends on.** 9: the bitset works because every reader comes later in
  the schedule than what it reads.
- **Exercised by.** breadth, depth.
- **Result.** Not measured.

### 11. Changes are detected by comparing values, with early cutoff

- **Choice.** An instruction's readers are marked only when its output
  actually changed (`differs` in `program/mod.rs`; NaN to NaN counts as
  unchanged). Comparing two untagged 8-byte values is one instruction.
- **Alternative.** A version counter per cell, or marking the readers of
  every instruction that ran, changed or not.
- **Depends on.** 6, 10.
- **Exercised by.** a fixture where a change stops partway, such as a
  `Round` or `Clamp` early in a chain; no shape has one today.
- **Result.** Not measured.

## How the decisions depend on each other

```
1 one store, apart from the graph
├── 2 operators are data
│   └── 3 fine-grained primitives
├── 4 contiguous
│   └── 5 uniform size
│       ├── 6 untagged f64
│       └── 7 one cell per scalar   (in practice also 6)
├── 8 aliases
└── 9 fixed push schedule           (also 2)
    └── 10 downstream only
        └── 11 value comparison and cutoff   (also 6)
```

Two things follow for the measurements:

- Some alternatives are easy to build bundled with another: 2 with 3, and
  4, 5 and 6 at once (which is what a tagged enum does). Build each so it
  changes one decision.
- Some alternatives shrink what another decision buys. With 1's
  alternative, 4 mostly no longer applies; with 10's alternative (full
  recompute), 11 matters much less. Measure those pairs together as well
  as alone.

## Method

- One base commit for every measurement; each alternative on a branch of
  its own from it.
- Native release builds, timing ticks directly, rather than the Node
  driver alone: the driver's adapter floor (23 µs on the cells core) is
  most of a tick at 1,000 elements, so smaller effects would not show.
  The Node driver (`packages/benchmark/scripts/perf-diff.sh`) at 10,000
  and 100,000 is the cross-check.
- Every alternative must give the same values as the base: the golden diff
  (`scripts/golden-diff.sh`) and `cargo test` stay green.
- Missing fixtures to add first: many references and copies (8), points
  and shapes dragged one coordinate at a time (7), and a chain cut off
  partway (11).

## Results

| # | Decision | Alternative | depth-10000 | breadth-10000 | depth-100000 | breadth-100000 | Other |
|---|---|---|---|---|---|---|---|
| 1 | one store, apart from the graph | value per node | | | | | |
| 2 | operators are data | operators are code | | | | | |
| 3 | fine-grained primitives | coarse operators | | | | | |
| 4 | contiguous | allocation per value | | | | | |
| 5 | uniform size | varying size | | | | | |
| 6 | untagged `f64` | 16 bytes, no tag | | | | | |
| 6 | untagged `f64` | tag array | | | | | |
| 6 | untagged `f64` | tagged enum | | | | | |
| 7 | one cell per scalar | compound values | | | | | |
| 8 | aliases | identity instructions | | | | | |
| 9 | fixed push schedule | pull, lazy | | | | | |
| 10 | downstream only | full recompute | | | | | |
| 10 | downstream only | priority queue | | | | | |
| 11 | value comparison, cutoff | version counters | | | | | |

Each cell is the alternative's tick over the base's (above 1 means the
decision makes the tick faster by that factor), the per-side median of
interleaved runs.
