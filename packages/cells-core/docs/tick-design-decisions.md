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
- **Exercised by**: the shapes (see [Method](#method)) where its effect
  should show.
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
- **Exercised by.** depth, breadth, mixed.
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
- **Exercised by.** depth, breadth, mixed.
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
- **Exercised by.** depth, breadth, mixed: each number is a lowered
  `$x + k`.
- **Result.** Not measured.

### 4. Storage is contiguous

- **Choice.** One `Vec<f64>`, addressed by a `u32` cell index.
- **Alternative, keeping 5.** A separate heap allocation per value
  (`Vec<Box<f64>>`), so every read follows a pointer.
- **Depends on.** 1.
- **Exercised by.** depth, breadth, mixed at 10,000 and 100,000.
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
- **Exercised by.** depth, breadth, mixed; a symbolic shape, for the
  inline expressions, is still to add.
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
- **Exercised by.** depth, breadth, mixed.
- **Result.** Not measured.

### 7. One cell per scalar

- **Choice.** A point is two cells, a circle three, a sampled curve 200.
  A change to a point's `x` reaches only the readers of `x`.
- **Alternative.** Compound values (a point as one value), with operators
  over vectors.
- **Depends on.** 5, and in practice 6: with tagged values of varying
  size, compound values are the natural choice.
- **Exercised by.** coords: a chain of points dragged in x alone, so
  the y chain does not change.
- **Result.** Not measured.

### 8. References alias a cell instead of copying it

- **Choice.** `$p.x`, and every prop of a copy that is not overridden,
  share the referent's cell (the union-find in `build/emit.rs`). A
  reference adds no instruction and no step to propagation.
- **Alternative.** An identity instruction per reference that copies the
  value forward.
- **Depends on.** 1.
- **Exercised by.** refs: n references and copies of one point, each
  read by a number. Today it has as many instructions as readers.
- **Result.** Not measured.

### 9. A fixed push schedule, computed eagerly

- **Choice.** A topological order fixed when the document is built
  (`Program::schedule`). A tick runs forward through it and never orders
  work at run time.
- **Alternative.** Pull-based evaluation, which finds the order of work
  at run time: to give a cell its value, first give its inputs theirs.
  Two forms, one per evaluator of decision 10: every cell pulled every
  tick, against full recompute; and lazy with push invalidation (a write
  marks everything downstream stale, then the stale cells are pulled),
  against the dirty closure.
- **Depends on.** 1, 2.
- **Exercised by.** every shape.
- **Result.** The fixed schedule makes the tick 2.8 to 5 times faster
  than pulling every cell, and 1.8 to 2.8 times faster than invalidating
  and pulling, with all else equal. Where early cutoff stops a change
  (cutoff), it is 380 to 640 times faster than invalidating and pulling,
  since invalidation must visit everything downstream before any value
  is known. See [Decision 9](#decision-9-pull-evaluation) below.

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
- **Exercised by.** breadth and depth, where every instruction is
  downstream of the drag, and mixed, isolated and chainK, where only part
  of it is.
- **Result.** Full recompute measured; the priority queue not yet. It
  depends on how much of the program is downstream. Where all of it is,
  full recompute is 2.5 to 4 times faster than the dirty closure; where
  little of it is, the dirty closure wins by as much as the program is
  large. They break even with roughly 15 to 20% of the program
  downstream. On both benchmark shapes the decision makes the tick
  slower; on mixed, where a drag reaches 5% of a page, it makes it 3 to
  5 times faster. See [Decision 10](#decision-10-full-recompute) below.

### 11. Changes are detected by comparing values, with early cutoff

- **Choice.** An instruction's readers are marked only when its output
  actually changed (`differs` in `program/mod.rs`; NaN to NaN counts as
  unchanged). Comparing two untagged 8-byte values is one instruction.
- **Alternative.** A version counter per cell, or marking the readers of
  every instruction that ran, changed or not.
- **Depends on.** 6, 10.
- **Exercised by.** cutoff: `round($p.x / 10)` feeds a chain of n
  numbers, and the timed drags both round to 0, so the change stops at
  the round.
- **Result.** Marking every reader measured; version counters not yet.
  Where a change stops partway (cutoff), the decision makes the tick 420
  to 650 times faster: without it the dirty closure runs the whole chain
  after the round, and becomes slower than full recompute. Where every
  value changes, it costs up to 10% (depth and coords, the chains): the
  check whether an output changed, and the list of what did, are work
  that marking every reader skips. See
  [Decision 11](#decision-11-no-early-cutoff) below.

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

- One base commit for every measurement. An alternative that changes the
  core is kept out of it, as a patch in `docs/tick-alternatives/`
  (`git apply` it on the base, then `scripts/tick-diff.sh` compares it
  with the base). An alternative that only adds an evaluator lives in
  the bench crate and runs beside the core's in the same process.
- Native release builds, timing ticks directly: the Node driver's adapter
  floor (23 µs on the cells core) is most of a tick at 1,000 elements, so
  smaller effects would not show through it. The Node driver
  (`packages/benchmark/scripts/perf-diff.sh`) at 10,000 and 100,000 is a
  cross-check, and the only measurement in wasm.
- Every alternative is measured under both evaluators. Decision 10 showed
  that the dirty closure costs several times what the instructions it
  runs do, which hides a difference per instruction (a tag, a dispatch)
  under the default evaluator; full recompute shows it.
- Every alternative must give the same values as the base: the golden diff
  (`scripts/golden-diff.sh`) and `cargo test --workspace` stay green, and
  the harness compares a fingerprint of every prop's value. Both need the
  parser: `npm ci --ignore-scripts` at the repository root, then
  `npm run build -w packages/parser`.

### The harness

`crates/cells-bench/examples/tick_cost.rs` times ticks on the shapes of
`crates/cells-bench/src/shapes.rs`, which are built in Rust
(`testing::dast`), so neither the parser nor node is needed. For each
shape and size it loads the document, drags to a check value and asserts
the values the shape names, asserts that every evaluator leaves the same
cells, then alternates the dragged coordinate between 2 and 3 for 3
warm-up and 41 timed ticks per evaluator, the evaluators interleaved
tick by tick on the same document. The evaluators are the core's two
(`dirty`, `full`) by default; `CELLS_EVALUATORS` adds the pull
evaluators of `crates/cells-bench/src/pull.rs` (`pull`,
`pull_invalidated`).

| shape | what the drag reaches | serves |
|---|---|---|
| depth | a chain of n numbers: all of the program | the benchmark's own shape |
| breadth | n numbers each reading the point: all of it | the benchmark's own shape |
| mixed | 20 graphs, each with a point read by a chain and a fan of n / 40 numbers; one point dragged: 5% | a page, closer to real use |
| isolated | one number; n others read another point | 10 |
| chainK | a chain of K% of the n numbers; the rest read another point | 10 |
| cutoff | `round($p.x / 10)`, then a chain of n numbers, which the timed drags leave unchanged | 11 |
| refs | n / 2 references to `$p.x` and n / 2 copies of `p`, each read by a number | 8 |
| coords | a chain of n points, each at (x + 1, y + 1) of the one before, dragged in x | 7 |

`scripts/tick-diff.sh [base] [shapes] [sizes]` builds the harness at a
base commit and in the working tree, runs the two alternately seven
times, and prints the working tree over the base for each shape under
each evaluator, with whether the two hold the same values. Each side's
tick is the median of the seven runs' medians: on the shared 4-core
machine these were measured on, a whole process now and then runs fast or
slow, and the median of runs rejects it, where the minimum would pick a
lucky one.

The noise floor, from comparing the base with itself: most rows agree
within 5%. Two (breadth at 100,000 and isolated at 10,000) settle per
process at one of two speeds about 20% apart, so a difference smaller
than that on those rows is noise. These are the base's times, under each
evaluator (from that run):

| shape | n | dirty closure (µs) | full recompute (µs) |
|---|---:|---:|---:|
| depth | 10,000 | 110 | 27.5 |
| depth | 100,000 | 1,364 | 359 |
| breadth | 10,000 | 56.1 | 19.2 |
| breadth | 100,000 | 685 | 302 |
| mixed | 10,000 | 4.5 | 14.8 |
| mixed | 100,000 | 50.5 | 262 |
| isolated | 10,000 | 0.2 | 14.0 |
| isolated | 100,000 | 1.7 | 259 |
| cutoff | 10,000 | 0.2 | 14.0 |
| cutoff | 100,000 | 1.9 | 259 |
| refs | 10,000 | 56.2 | 19.4 |
| refs | 100,000 | 693 | 336 |
| coords | 10,000 | 119 | 37.9 |
| coords | 100,000 | 1,388 | 642 |

## Plan

The alternatives in the order to build them. Two rules set it: what
already exists or is small comes first, and the leaves of the dependency
tree come before the roots, since a root's alternative (1, 2, 4) makes
the decisions below it moot, while a leaf's result stays valid whatever
is measured later.

| step | decision → alternative | to build | why here |
|---|---|---|---|
| 0 | the shapes and the harness | done | mixed, cutoff, refs and coords, `tick_cost`, `tick-diff.sh` |
| 1 | 10 → full recompute | exists | done; see below |
| 2 | 9 → pull | small, in the bench crate | done; see below |
| 3 | 11 → mark readers whether the value changed or not | one line in `tick/eval.rs` | done; see below. Version counters are a larger build, not planned yet |
| 4 | 10 → priority queue | small, in `tick/eval.rs` | finishes 10 |
| 5 | 2 → operators as code, the cheap form | small | a boxed closure per instruction, made when the program is scheduled: the dispatch alone, with no component rewritten |
| 6 | 8 → identity instructions | medium, in `build/emit.rs` | the tick is unchanged; on refs |
| 7 | 6 → 16-byte cells, no tag | medium | the first change to what a cell is: size alone |
| 8 | 6 → 8-byte cells and a tag array | medium | the tag alone, on step 7's plumbing |
| 9 | 6 → tagged enum | medium to large | both; 7 and 8 should account for it |
| 10 | 4 → an allocation per value | medium | the same plumbing as 7 to 9 |
| 11 | 3 → coarse operators | large | new operators and lowering |
| 12 | 7 → compound values | large | vector operators, components rewired; on coords |
| 13 | 5 → values of varying size | large | the most invasive change to storage; means most after 6 and 7 |
| 14 | 2 → operators as code, in full | very large | state variable functions per component, as the JavaScript core; step 5 may answer most of it |
| 15 | 1 → a value per node | very large | the root, which makes 4 to 6 moot: last |

Steps 7 to 10 all change what a cell is, so they are best built as a
series on one branch, a commit per alternative, each measured against the
base.

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
| 9 | fixed push schedule | pull every cell (base: full recompute) | 2.78 | 3.63 | 2.92 | 3.02 | mixed-100000: 3.34 |
| 9 | fixed push schedule | invalidate, then pull (base: dirty closure) | 1.81 | 2.35 | 1.97 | 2.40 | mixed-100000: 2.46; cutoff-100000: 637 |
| 10 | downstream only | full recompute | 0.26 | 0.42 | 0.30 | 0.39 | mixed-100000: 5.2; isolated-100000: 247; chain10-100000: 1.7 |
| 10 | downstream only | priority queue | | | | | |
| 11 | value comparison, cutoff | mark every reader (base: dirty closure) | 0.90 | 1.02 | 0.95 | 1.05 | cutoff-100000: 645; coords-100000: 0.92 |
| 11 | value comparison, cutoff | version counters | | | | | |

Each cell is the alternative's tick over the base's (above 1 means the
decision makes the tick faster by that factor, below 1 that it makes it
slower), the per-side median of interleaved runs; where a shape was run
more than once, the median of the runs.

### Decision 11: no early cutoff

Measured 2026-10-25 with `scripts/tick-diff.sh` against `b789021`, the
alternative being `docs/tick-alternatives/11-no-cutoff.patch`: in
`DirtyClosure::recompute`, mark the readers of every output of every
instruction run, rather than of the outputs whose value changed. Full
recompute does not mark readers, so its column is a control: it should
not move, and moved by at most 8%, about the noise floor.

| shape | n | dirty, base → no cutoff (µs) | no cutoff / base | full, base → no cutoff (µs) | no cutoff / base |
|---|---:|---|---:|---|---:|
| depth | 10,000 | 108 → 97.0 | 0.90 | 27.0 → 27.3 | 1.01 |
| depth | 100,000 | 1,370 → 1,295 | 0.95 | 358 → 376 | 1.05 |
| breadth | 10,000 | 56.0 → 57.0 | 1.02 | 19.2 → 19.2 | 1.00 |
| breadth | 100,000 | 668 → 704 | 1.05 | 314 → 324 | 1.03 |
| isolated | 10,000 | 0.2 → 0.2 | 1.02 | 14.0 → 14.0 | 1.00 |
| isolated | 100,000 | 1.9 → 2.0 | 1.02 | 266 → 260 | 0.98 |
| mixed | 10,000 | 4.4 → 4.3 | 0.97 | 14.7 → 14.7 | 1.00 |
| mixed | 100,000 | 50.3 → 49.6 | 0.99 | 256 → 262 | 1.02 |
| cutoff | 10,000 | 0.2 → 94.2 | 423 | 14.0 → 14.1 | 1.01 |
| cutoff | 100,000 | 1.9 → 1,216 | 645 | 256 → 265 | 1.04 |
| refs | 10,000 | 56.2 → 57.1 | 1.02 | 19.4 → 19.5 | 1.01 |
| refs | 100,000 | 695 → 716 | 1.03 | 322 → 339 | 1.05 |
| coords | 10,000 | 111 → 102 | 0.92 | 35.2 → 38.0 | 1.08 |
| coords | 100,000 | 1,403 → 1,285 | 0.92 | 647 → 649 | 1.00 |

With the patch, `cargo test --workspace` passes, the golden diff is
identical (12 documents, and their programs), and every shape's
fingerprint matches the base's.

What it shows:

- On cutoff, early cutoff is the whole tick: with it, the dirty closure
  runs one instruction, the round; without it, all 100,000, and at
  1.2 ms it is 4.6 times slower than full recompute (265 µs), which runs
  them in a tight loop. Decision 10 pays off on that document only
  because of decision 11.
- Where every value changes, there is nothing to cut off, and the
  decision costs about 5 to 10% on the chains (depth, coords). The
  patch marks from the instruction's outputs directly, instead of from
  the part of the changed list the step just appended; not profiled
  further.
  Breadth, refs and mixed, whose changed cells mostly have no readers,
  are within noise.
- The step still compares each new value with the old, since the tick
  reports which cells changed (`TickOutcome::changed`), so the patch
  takes away the use of the comparison, not its cost. What the
  comparison itself costs belongs to the version counter alternative.
- With decision 9 (Decision 9 below), the cutoff rows show the same
  thing from the other side: lazy evaluation with invalidation cannot
  cut off before visiting, and is 380 to 640 times slower there. Either
  way the cost of losing cutoff is the size of what lies downstream of
  the point where the change stops.

### Decision 9: pull evaluation

Measured 2026-10-25 on `cells` at `f6677de` plus the harness, with
`tick_cost` and `CELLS_EVALUATORS=dirty,full,pull,pull_invalidated`: the
four evaluators interleaved on each document, seven processes, each
evaluator's tick the median of the processes' medians (as
`tick-diff.sh`). Every evaluator leaves the same cells, bit for bit,
after each shape's check drag.

`testing/reference.rs` was meant to be this alternative, but it cannot be
timed as it is: it allocates a scratch array of every cell for every
instruction it evaluates (quadratic in the document), keeps its memo in a
hash map, and recurses once per link, which overflows the stack on a
chain of 100,000. It would measure those, not pulling. So
`crates/cells-bench/src/pull.rs` has two pull evaluators built as a pull
core would be on this data: the core's cells, instructions and
`Program::step`, an explicit stack for demand, and state in arrays stamped
with the tick's epoch, so nothing is cleared between ticks. What differs
from the core's evaluators is only how the next instruction is found.

- **pull**: every tick, every derived cell is read, in cell order (the
  document's), and each instruction runs once its inputs' producers have.
  Its base is full recompute: neither is incremental.
- **pull_invalidated**: a write marks every instruction downstream of it
  stale (push), then each stale instruction is brought up to date by
  demand (pull), running only if an input changed this tick, so early
  cutoff (decision 11) is kept. Its base is the dirty closure: both do
  work proportional to what is downstream.

| shape | n | dirty (µs) | full (µs) | pull (µs) | pull_invalidated (µs) | pull / full | pull_invalidated / dirty |
|---|---:|---:|---:|---:|---:|---:|---:|
| depth | 10,000 | 121 | 31.4 | 87.1 | 219 | 2.78 | 1.81 |
| depth | 100,000 | 1,386 | 349 | 1,019 | 2,734 | 2.92 | 1.97 |
| breadth | 10,000 | 63.8 | 22.5 | 81.8 | 150 | 3.63 | 2.35 |
| breadth | 100,000 | 727 | 336 | 1,016 | 1,746 | 3.02 | 2.40 |
| mixed | 10,000 | 4.7 | 14.9 | 77.4 | 10.7 | 5.18 | 2.29 |
| mixed | 100,000 | 43.0 | 273 | 911 | 106 | 3.34 | 2.46 |
| isolated | 10,000 | 0.3 | 16.0 | 74.7 | 0.3 | 4.66 | 1.16 |
| isolated | 100,000 | 1.0 | 272 | 878 | 2.8 | 3.23 | 2.75 |
| cutoff | 10,000 | 0.4 | 14.2 | 71.7 | 170 | 5.04 | 382 |
| cutoff | 100,000 | 3.9 | 275 | 921 | 2,453 | 3.34 | 637 |
| refs | 10,000 | 63.2 | 22.6 | 81.8 | 150 | 3.62 | 2.38 |
| refs | 100,000 | 700 | 322 | 969 | 1,728 | 3.01 | 2.47 |
| coords | 10,000 | 127 | 40.6 | 172 | 243 | 4.22 | 1.91 |
| coords | 100,000 | 1,362 | 628 | 1,974 | 2,653 | 3.14 | 1.95 |

The ratios held across the seven processes: each process's own ratio
stayed within about 10% of the value shown, except on three rows where
the dirty closure's tick is a few µs: mixed at 10,000 (pull over full
4.5 to 5.3, pull_invalidated over dirty 1.8 to 2.4), isolated at 100,000
(pull_invalidated over dirty 2.4 to 4.0) and cutoff (370 to 750).

What it shows:

- Finding the order at run time costs about 7 to 9 ns per instruction
  (pull at 10,000 instructions: 72 to 87 µs), against 2 to 3 ns for
  running a fixed order. Pull looks at each input's producer before
  running an instruction, and keeps a stack; the fixed schedule only
  runs the next instruction.
- Lazy evaluation with invalidation pays twice: once to mark what is
  downstream stale, once to pull it. It does the same amount of work as
  the dirty closure, so its ratio to it (about 2) is the cost of the
  extra pass and of demand.
- The cutoff rows are the largest difference in this report so far.
  The fixed schedule computes in order, so the dirty closure learns that
  `round` did not change before it marks anything after it, and stops
  there. Invalidation has to mark the whole chain stale before any value
  is known; the pull then skips running each instruction, but must still
  visit it. So decision 9 is what lets early cutoff (decision 11) save
  visits, and not only runs.
- Not measured: what laziness is for. A lazy core computes only what is
  read, and every shape shows every value, so here pulling never skips
  anything. A shape with content that is hidden or off screen would
  measure that. Nor the order of reads: pull reads cells in document
  order, where most inputs are already up to date; reading in reverse
  would make each demand walk the chain.

### Decision 10: full recompute

Measured 2026-10-25 on `cells` at `f6677de` (the core's code is unchanged since) with
`crates/cells-bench/examples/evaluator_cost.rs` (since renamed
`tick_cost.rs`; see [The harness](#the-harness)): a native release build
(x86-64, Intel Xeon @ 2.10 GHz, 4 cores, Linux), not wasm. One document
per row; the two evaluators alternate tick by tick on it, each tick
dragging `p` between x = 2 and x = 3, 3 warm-up ticks and 41 timed ticks
per evaluator. The time is the whole tick (`Document::request_with`), but
the request lands on an essential cell, so inversion is negligible and
the tick is the recompute. Before timing, the two evaluators' cells are
checked equal bit for bit after the same drag.

The benchmark shapes, three runs each (median of the per-run medians):

| shape | n | dirty closure (µs) | full recompute (µs) | full / dirty |
|---|---:|---:|---:|---:|
| depth | 1,000 | 11.4 | 3.2 | 0.28 |
| depth | 10,000 | 111 | 28.3 | 0.26 |
| depth | 100,000 | 1,153 | 358 | 0.30 |
| breadth | 1,000 | 6.3 | 3.0 | 0.49 |
| breadth | 10,000 | 57.5 | 25.5 | 0.42 |
| breadth | 100,000 | 698 | 265 | 0.39 |
| isolated | 1,000 | 0.2 | 1.8 | 8.3 |
| isolated | 10,000 | 0.2 | 16.4 | 66 |
| isolated | 100,000 | 0.7 | 178 | 247 |

`isolated` is one number downstream of the dragged point and n numbers
fed by another point. To find where the two break even, `chainK` puts a
chain of K% of the n numbers downstream of the drag and the rest on the
other point (two runs each; they agreed within about 15%, and the first
is shown):

| downstream | n | dirty closure (µs) | full recompute (µs) | full / dirty |
|---|---:|---:|---:|---:|
| 1% | 10,000 | 1.6 | 16.7 | 10.4 |
| 1% | 100,000 | 12.4 | 176 | 14.2 |
| 5% | 10,000 | 5.6 | 17.3 | 3.1 |
| 5% | 100,000 | 54.2 | 178 | 3.3 |
| 10% | 10,000 | 10.6 | 21.6 | 2.0 |
| 10% | 100,000 | 106 | 175 | 1.7 |
| 25% | 10,000 | 25.8 | 18.1 | 0.70 |
| 25% | 100,000 | 261 | 220 | 0.84 |
| 50% | 10,000 | 51.4 | 23.7 | 0.46 |
| 50% | 100,000 | 592 | 265 | 0.45 |

What it shows:

- Per instruction run, the dirty closure costs about 10 ns on a chain
  and about 6 ns on a fan, against about 2 to 3.5 ns for full recompute
  (2 ns where nothing changes, 3 to 3.5 ns where everything does). Full
  recompute runs every instruction, but each is a step of a tight loop
  over the schedule. The closure also looks up each changed cell's
  readers and sets and scans their bits; on a chain, probably worse
  because it learns the next instruction only after the previous one
  ran. Not profiled.
- So the closure pays for itself only when less than about a fifth of
  the program is downstream of the request. Below that its advantage
  grows with the program's size, without bound: 247 times at 100,000
  with one instruction downstream.
- Neither benchmark shape measures what the decision is for. Both put
  the whole program downstream of the drag, so the comparison's depth
  and breadth ticks are about three times slower than full recompute
  would make them. A real document, where a drag reaches a small part
  of it, is where the decision pays; the shapes say nothing about how
  much.
- The mixed shape, added after this measurement, is one such document:
  20 graphs, one of them dragged, so the drag reaches 5% of the program.
  There the closure is 3.3 times faster than full recompute at 10,000
  and 5.2 times at 100,000 (the base's times under
  [The harness](#the-harness)).
- Not measured here: wasm, where the per-instruction costs may differ,
  and the tick in the Node driver, whose floor would hide the small
  rows.
