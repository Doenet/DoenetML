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
- **Result.** Measured as an evaluator over the core's own instructions
  (step 15): a node per cell, each its own allocation, scattered, with
  its value and its readers. The tick is 1.4 to 3.1 times the dirty
  closure's on every shape with work in it, most on fans and the page.
  See [Decision 1: a value per node](#decision-1-a-value-per-node)
  below.

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
- **Exercised by.** every shape.
- **Result.** In its cheap form, every scalar instruction made code at
  schedule time and called through a pointer, measured; the full form
  (state variable functions per component) not yet. Where the
  instructions' own cost shows (full recompute), the decision makes the
  tick 1.2 to 2.5 times faster than a function pointer per operator,
  and 1.5 to 5 times faster than a closure per instruction, most where
  instructions are independent of each other. Under the dirty closure,
  whose own bookkeeping dilutes it, up to 1.2 and 2.3 times. In its
  full form, as a lower bound (step 14): a state variable's function per
  value, with its dependencies looked up by key on every evaluation, is
  3.9 to 9.5 times the same evaluator running the same groups as data,
  and 2.1 to 12 times the core's dirty closure. See
  [Decision 2: operators as code](#decision-2-operators-as-code) and
  [Decision 2: state variable functions](#decision-2-state-variable-functions)
  below.

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
- **Result.** Measured as an evaluator over the core's own instructions
  (step 11): each value's lowered expression run as one unit, which is
  what a coarse operator per value would do. Against the same evaluator
  with every instruction a unit of its own, coarse operators are 2 to
  2.6 times *faster* on poly, the shape whose values are several
  instructions each, and the same elsewhere. Under a dirty closure,
  bookkeeping is paid per unit, so fewer, larger units cost less: the
  fine grain costs here rather than buys. See
  [Decision 3: coarse operators](#decision-3-coarse-operators) below.

### 4. Storage is contiguous

- **Choice.** One `Vec<f64>`, addressed by a `u32` cell index.
- **Alternative, keeping 5.** A separate heap allocation per value
  (`Vec<Box<f64>>`), so every read follows a pointer.
- **Depends on.** 1.
- **Exercised by.** every shape at 10,000 and 100,000.
- **Result.** It depends on where the allocations land. Allocated in
  cell order, the values lie nearly side by side and a pointer per read
  costs full recompute 1.04 to 1.8 times (one row 2.8) and the dirty
  closure up to 1.7. Allocated in a shuffled order, as objects made over
  a session would be, they cost full recompute 2.4 to 3 times at
  100,000 and the dirty closure up to 2.2: the largest cost of any
  storage alternative. See
  [Decision 4: an allocation per value](#decision-4-an-allocation-per-value)
  below.

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
- **Result.** Measured as an evaluator over the core's own instructions
  (step 13), on a new symbolic shape: each math cell's expression also
  kept as bytes of its own length, decoded before every symbolic
  instruction reads it and encoded after every write. It adds 1 to 8%
  to a symbolic tick, an upper bound, since the engine's work dwarfs
  it. See
  [Decision 5: values of varying size](#decision-5-values-of-varying-size)
  below.

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
- **Exercised by.** every shape.
- **Result.** The size alone measured: 16-byte cells without a tag make
  full recompute 5 to 36% slower (8 to 30% on most shapes), and the
  dirty closure, whose own cost dilutes it, at most 8%. The tag alone,
  checked on every read with the cells still 8 bytes, costs more: full
  recompute 12 to 50% slower (27 to 50% on all but depth at 10,000),
  and the dirty closure up to 34% on the fans. The tagged enum, both
  at once, costs about what the tag alone does (full recompute 1.13 to
  1.55 times), not the sum of the two. See
  [Decision 6: 16-byte cells](#decision-6-16-byte-cells),
  [Decision 6: a tag array](#decision-6-a-tag-array) and
  [Decision 6: a tagged enum](#decision-6-a-tagged-enum) below.

### 7. One cell per scalar

- **Choice.** A point is two cells, a circle three, a sampled curve 200.
  A change to a point's `x` reaches only the readers of `x`.
- **Alternative.** Compound values (a point as one value), with operators
  over vectors.
- **Depends on.** 5, and in practice 6: with tagged values of varying
  size, compound values are the natural choice.
- **Exercised by.** coords: a chain of points dragged in x alone, so
  the y chain does not change.
- **Result.** Measured as an evaluator over the core's own instructions
  (step 12): a point's two coordinates one value, recomputed together,
  their readers marked together. On coords, the shape that drags a
  point's x alone, it costs 5 to 7%, though it runs twice the
  instructions; elsewhere nothing. See
  [Decision 7: compound values](#decision-7-compound-values) below.

### 8. References alias a cell instead of copying it

- **Choice.** `$p.x`, and every prop of a copy that is not overridden,
  share the referent's cell (the union-find in `build/emit.rs`). A
  reference adds no instruction and no step to propagation.
- **Alternative.** An identity instruction per reference that copies the
  value forward.
- **Depends on.** 1.
- **Exercised by.** every shape, since each `$x` in a number's math is
  a reference; refs most: n references and copies of one point, each
  read by a number. And the program of every golden document.
- **Result.** Identity instructions double the instructions of every
  shape and of the golden documents (2.1 times over the set), and
  multiply `fixtures/sir.doenet`'s by 5.1 (2,829 to 14,538). The tick
  grows with them, at the same cost per instruction: under full
  recompute 1.9 to 2.9 times on the shapes and 4.5 to 6.3 on refs, and
  about the same under the dirty closure wherever its tick is more than
  a few µs. Aliasing also carries meaning outside
  the tick: three places used "the same cell" for "equal by
  construction", which the alternative had to replace. See
  [Decision 8: identity instructions](#decision-8-identity-instructions)
  below.

### 9. A fixed push schedule, computed eagerly

- **Choice.** A topological order fixed when the document is built
  (`Program::schedule`). A tick runs forward through it and never orders
  work at run time.
- **Alternatives.**
  - Readiness checking: the same work, but the order found at run time,
    an instruction running once its inputs' producers have. Two forms,
    one per evaluator of decision 10: every cell every tick, against full
    recompute; and invalidate what is downstream of a write, then bring
    it up to date, against the dirty closure.
  - Pull evaluation proper (lazy): a write invalidates what is
    downstream, and only what a renderer reads is brought up to date;
    the rest stays stale until something reads it.
- **Depends on.** 1, 2.
- **Exercised by.** every shape, with the share of the document a tick
  reads (a viewport over its first components) at 100%, 10% and 1%.
- **Result.** Finding the order at run time costs 2.6 to 5 times more
  than the fixed order against full recompute, and 1.8 to 2.6 times
  more against the dirty closure wherever more than one instruction is
  downstream; where early cutoff stops a change, 110
  to 870 times more, since invalidation visits everything downstream
  before any value is known. Lazy pull costs the same as readiness
  checking when the whole document is read, and wins in proportion to
  how little of the change is read: on a chain of 100,000 with 1% read,
  it is 47 times faster than the dirty closure. But that win is from
  computing less, not from laziness: the dirty closure pruned to the
  instructions some read cell needs, keeping the fixed schedule, is
  faster than lazy pull at every share read, by about 2 times on chains
  and up to 90 times where a fan of unread readers hangs off the drag.
  So the fixed push schedule is the faster choice whatever is shown,
  provided it skips what is not. See
  [Decision 9](#decision-9-pull-evaluation) below.

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
- **Result.** Against full recompute, it depends on how much of the
  program is downstream. Where all of it is,
  full recompute is 2.5 to 4 times faster than the dirty closure; where
  little of it is, the dirty closure wins by as much as the program is
  large. They break even with roughly 15 to 20% of the program
  downstream. On both benchmark shapes the decision makes the tick
  slower; on mixed, where a drag reaches 5% of a page, it makes it 3 to
  5 times faster. See [Decision 10](#decision-10-full-recompute) below.
  Against a priority queue, the bitset is 2.4 to 5.5 times faster where
  a change fans out (breadth, refs, mixed), and 4 to 10% slower on the
  chains (depth, coords), where the queue never holds more than one
  instruction. See [Decision 10: priority queue](#decision-10-priority-queue)
  below.

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
  the bench crate and runs beside the core's in the same process. The
  alternatives that change what a cell is (decisions 4 to 6) apply on
  top of `4-6-cells-type.patch`, which gives the cells a type of their
  own and changes nothing else; each is measured against it, committed
  locally as the base for `tick-diff.sh`.
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
tick by tick, each on its own copy of the document. The evaluators are
the core's two (`dirty`, `full`) by default; `CELLS_EVALUATORS` adds the
evaluators of `crates/cells-bench/src/pull.rs` (`ready_all`,
`ready_closure`, `lazy`), `pruned.rs` (`pruned`), `grouped.rs`
(`single`, `expression`, `compound`, `functions`), `nodes.rs` (`nodes`)
and `inline.rs` (`inline`). `CELLS_WANTED=100,10,1` sets the share of the
document a tick reads, as a viewport over the first components in
document order (`shapes::wanted`); only `lazy` computes less than all of
it, and values are compared on those cells.

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
| poly | a chain of n numbers, each `($c + 3) / 2 + $c / 2 - 1` of the one before: five instructions per value | 3 |
| symbolic | as the benchmark's: a chain of n simplified `<math>`s in x, evaluated at the end; not run by default, a tick at 1,000 takes 20 ms | 5 |

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
| 2 | 9 → readiness checking, and lazy pull | small, in the bench crate | done; see below |
| 2b | 9 → push over what is read: the dirty closure skipping instructions no read cell needs | small, in the bench crate | done; see below. It separates computing less from computing lazily |
| 3 | 11 → mark readers whether the value changed or not | one line in `tick/eval.rs` | done; see below. Version counters are a larger build, not planned yet |
| 4 | 10 → priority queue | small, in `tick/eval.rs` | done; see below |
| 5 | 2 → operators as code, the cheap form | small | done; see below. Measured in two forms, a closure per instruction and a function pointer per operator |
| 6 | 8 → identity instructions | medium, in `build/emit.rs` | done; see below |
| 7 | 6 → 16-byte cells, no tag | medium | done; see below. Built on the plumbing (`4-6-cells-type.patch`) the next steps reuse |
| 8 | 6 → 8-byte cells and a tag array | medium | done; see below |
| 9 | 6 → tagged enum | medium | done; see below |
| 10 | 4 → an allocation per value | medium | done; see below. Two forms: values allocated in cell order, and in a shuffled order |
| 11 | 3 → coarse operators | an evaluator, as you chose over a rewritten core | done; see below |
| 12 | 7 → compound values | an evaluator | done; see below |
| 13 | 5 → values of varying size | an evaluator, on a symbolic shape added for it | done; see below |
| 14 | 2 → operators as code, in full | an evaluator, a lower bound | done; see below |
| 15 | 1 → a value per node | an evaluator | done; see below |

Steps 7 to 10 all change what a cell is, so they are best built as a
series on one branch, a commit per alternative, each measured against the
base.

## Results

| # | Decision | Alternative | depth-10000 | breadth-10000 | depth-100000 | breadth-100000 | Other |
|---|---|---|---|---|---|---|---|
| 1 | one store, apart from the graph | a value per node (base: dirty closure) | 1.84 | 2.57 | 1.41 | 2.58 | mixed-100000: 3.11; poly-100000: 2.77 |
| 2 | operators are data | a closure per instruction (base: full recompute) | 1.54 | 4.87 | 1.69 | 4.32 | isolated-100000: 4.72; mixed-100000: 3.32 |
| 2 | operators are data | a closure per instruction (base: dirty closure) | 0.93 | 1.87 | 0.91 | 2.32 | mixed-100000: 1.77; refs-100000: 2.12 |
| 2 | operators are data | a function pointer per operator (base: full recompute) | 1.61 | 2.03 | 1.46 | 1.41 | isolated-100000: 1.43; mixed-100000: 1.22 |
| 2 | operators are data | a function pointer per operator (base: dirty closure) | 0.99 | 1.18 | 1.00 | 1.16 | mixed-100000: 0.85; refs-100000: 1.15 |
| 2 | operators are data | state variable functions, a lower bound (base: the same groups as data) | 6.76 | 7.83 | 7.32 | 6.64 | mixed-100000: 9.49; poly-100000: 4.12 |
| 2 | operators are data | state variable functions, a lower bound (base: dirty closure) | 8.32 | 10.9 | 6.73 | 8.79 | mixed-100000: 12.1; poly-100000: 2.66 |
| 3 | fine-grained primitives | coarse operators (base: a unit per instruction) | 1.00 | 1.00 | 1.00 | 0.99 | poly-10000: 0.39; poly-100000: 0.51 |
| 4 | contiguous | an allocation per value, in cell order (base: full recompute) | 1.18 | 1.61 | 1.15 | 1.53 | refs-10000: 2.84; mixed-100000: 1.64 |
| 4 | contiguous | an allocation per value, shuffled (base: full recompute) | 1.32 | 2.21 | 2.38 | 2.79 | coords-100000: 3.00; mixed-100000: 2.93 |
| 4 | contiguous | an allocation per value, shuffled (base: dirty closure) | 1.03 | 1.30 | 1.31 | 2.24 | refs-100000: 2.17; mixed-100000: 1.97 |
| 5 | uniform size | expressions stored inline, an upper bound (base: dirty closure) | — | — | — | — | symbolic-100: 1.06; symbolic-1000: 1.06 |
| 6 | untagged `f64` | 16 bytes, no tag (base: full recompute) | 1.05 | 1.24 | 1.13 | 1.08 | refs-10000: 1.36; mixed-10000: 1.30 |
| 6 | untagged `f64` | 16 bytes, no tag (base: dirty closure) | 1.01 | 1.04 | 1.03 | 1.07 | refs-100000: 1.08 |
| 6 | untagged `f64` | tag array (base: full recompute) | 1.12 | 1.50 | 1.32 | 1.32 | isolated-10000: 1.45; mixed-100000: 1.33 |
| 6 | untagged `f64` | tag array (base: dirty closure) | 0.99 | 1.22 | 1.02 | 1.32 | refs-100000: 1.34; mixed-100000: 1.11 |
| 6 | untagged `f64` | tagged enum (base: full recompute) | 1.25 | 1.54 | 1.23 | 1.28 | refs-10000: 1.55; mixed-100000: 1.23 |
| 6 | untagged `f64` | tagged enum (base: dirty closure) | 1.04 | 1.25 | 0.98 | 1.32 | refs-100000: 1.28; mixed-100000: 1.13 |
| 7 | one cell per scalar | compound values (base: a unit per instruction) | 1.00 | 0.99 | 1.00 | 0.99 | coords-10000: 1.07; coords-100000: 1.05 |
| 8 | aliases | identity instructions (base: dirty closure) | 2.17 | 2.68 | 1.95 | 2.44 | refs-100000: 4.78; mixed-100000: 2.13 |
| 8 | aliases | identity instructions (base: full recompute) | 2.30 | 2.89 | 1.93 | 2.09 | refs-100000: 4.52; mixed-100000: 2.07 |
| 9 | fixed push schedule | readiness checking, every cell (base: full recompute) | 2.64 | 2.75 | 2.74 | 3.00 | mixed-100000: 3.35 |
| 9 | fixed push schedule | readiness checking, invalidated (base: dirty closure) | 1.92 | 2.34 | 1.84 | 2.60 | mixed-100000: 2.13; cutoff-100000: 488 |
| 9 | fixed push schedule | lazy pull, 100% read (base: dirty closure) | 1.95 | 2.38 | 1.86 | 2.66 | mixed-100000: 2.09; cutoff-100000: 495 |
| 9 | fixed push schedule | lazy pull, 1% read (base: dirty closure) | 0.05 | 0.17 | 0.02 | 0.14 | mixed-100000: 0.58; cutoff-100000: 9.4 |
| 9 | fixed push schedule | lazy pull, 1% read (base: dirty closure pruned to what is read) | 1.80 | 7.69 | 1.95 | 10.4 | mixed-100000: 1.97; cutoff-100000: 70; refs-100000: 83 |
| 10 | downstream only | full recompute | 0.26 | 0.42 | 0.30 | 0.39 | mixed-100000: 5.2; isolated-100000: 247; chain10-100000: 1.7 |
| 10 | downstream only | priority queue | 0.91 | 3.49 | 0.90 | 4.83 | mixed-100000: 3.64; refs-100000: 4.72; coords-100000: 0.96 |
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
  thing from the other side: invalidating before evaluating cannot cut
  off before visiting, and is 110 to 870 times slower there. Either
  way the cost of losing cutoff is the size of what lies downstream of
  the point where the change stops.

### Decision 9: pull evaluation

Measured 2026-10-25 on `cells` at `f6677de` plus the harness, with
`tick_cost`, `CELLS_EVALUATORS=dirty,full,ready_all,ready_closure,lazy`
and `CELLS_WANTED=100,10,1`: the five evaluators interleaved, each on its
own copy of each document, seven processes, each evaluator's tick the
median of the processes' medians (as `tick-diff.sh`). Every evaluator
holds the same values, bit for bit, in the cells read, after each
shape's check drag and again after the timed ticks.

`testing/reference.rs` was meant to be the first alternative, but it
cannot be timed as it is: it allocates a scratch array of every cell for
every instruction it evaluates (quadratic in the document), keeps its
memo in a hash map, and recurses once per link, which overflows the
stack on a chain of 100,000. It would measure those, not pulling. So
`crates/cells-bench/src/pull.rs` has three evaluators built as such a
core would be on this data: the core's cells, instructions and
`Program::step`, and an explicit stack for demand.

Two are readiness checking. They compute what the core's evaluators do,
so they measure only finding the order at run time:

- **ready_all**: every tick, every derived cell is read, in cell order
  (the document's), and each instruction runs once its inputs' producers
  have. Its base is full recompute: neither is incremental.
- **ready_closure**: a write marks every instruction downstream of it
  stale, then each stale instruction is brought up to date by demand,
  running only if an input changed this tick, so early cutoff (decision
  11) is kept. Its base is the dirty closure: both do work in proportion
  to what is downstream.

The third is pull evaluation proper:

- **lazy**: a write marks every instruction downstream of it stale, and
  a stale instruction stays stale until a read needs it. The cells a
  renderer reads are observed: invalidation that reaches one queues it,
  and the tick reads the queued ones, bringing up to date what they
  need, as a reactive UI library's effects do. A version counter per
  cell and per instruction decides whether a stale instruction must
  run: only if an input changed since it last ran, which keeps early
  cutoff across ticks. What no read needs stays stale, and invalidation
  stops at what is already stale, so content out of view costs nothing
  tick after tick.

What a tick reads is a viewport: every prop of the first 100%, 10% or 1%
of the components in document order. The dragged point is at the top of
every shape, so the viewport holds the start of its change; in mixed, the
dragged graph is the first 5% of the page, so a 10% viewport holds all of
it. The core's evaluators and readiness checking compute everything
whatever is read; their columns differ between the three shares only by
noise, and the table gives them once, at 100%.

| shape | n | dirty | full | ready_all | ready_closure | lazy, 100% | lazy, 10% | lazy, 1% |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| depth | 10,000 | 126 | 37.0 | 97.2 | 241 | 245 | 26.1 | 5.7 |
| depth | 100,000 | 1,382 | 386 | 1,058 | 2,545 | 2,570 | 264 | 29.6 |
| breadth | 10,000 | 69.3 | 31.9 | 87.9 | 162 | 165 | 25.2 | 11.4 |
| breadth | 100,000 | 682 | 327 | 983 | 1,774 | 1,813 | 254 | 101 |
| mixed | 10,000 | 4.9 | 15.9 | 79.1 | 10.6 | 9.8 | 9.9 | 2.9 |
| mixed | 100,000 | 47.6 | 270 | 906 | 101 | 99.6 | 96.7 | 27.9 |
| isolated | 10,000 | 0.5 | 15.6 | 79.0 | 0.4 | 0.3 | 0.3 | 0.3 |
| isolated | 100,000 | 2.2 | 279 | 894 | 3.0 | 1.8 | 1.6 | 2.0 |
| cutoff | 10,000 | 1.7 | 25.7 | 85.2 | 192 | 190 | 18.7 | 2.9 |
| cutoff | 100,000 | 4.6 | 280 | 924 | 2,248 | 2,281 | 213 | 24.2 |
| refs | 10,000 | 70.1 | 32.6 | 89.3 | 163 | 165 | 8.9 | 8.9 |
| refs | 100,000 | 680 | 339 | 987 | 1,765 | 1,799 | 81.3 | 81.5 |
| coords | 10,000 | 129 | 57.5 | 189 | 234 | 244 | 25.2 | 4.8 |
| coords | 100,000 | 1,432 | 740 | 2,141 | 2,554 | 2,609 | 260 | 33.9 |

Times in µs. The ratios, each evaluator over its base:

| shape | n | ready_all / full | ready_closure / dirty | lazy / dirty, 100% | 10% | 1% |
|---|---:|---:|---:|---:|---:|---:|
| depth | 10,000 | 2.63 | 1.92 | 1.95 | 0.21 | 0.05 |
| depth | 100,000 | 2.74 | 1.84 | 1.86 | 0.19 | 0.02 |
| breadth | 10,000 | 2.75 | 2.34 | 2.38 | 0.37 | 0.17 |
| breadth | 100,000 | 3.00 | 2.60 | 2.66 | 0.35 | 0.14 |
| mixed | 10,000 | 4.98 | 2.17 | 1.99 | 2.07 | 0.61 |
| mixed | 100,000 | 3.35 | 2.13 | 2.09 | 2.05 | 0.58 |
| isolated | 10,000 | 5.08 | 0.77 | 0.67 | 0.74 | 0.80 |
| isolated | 100,000 | 3.20 | 1.40 | 0.82 | 0.84 | 0.95 |
| cutoff | 10,000 | 3.32 | 112 | 111 | 23.8 | 4.4 |
| cutoff | 100,000 | 3.30 | 488 | 495 | 77.6 | 9.4 |
| refs | 10,000 | 2.74 | 2.33 | 2.35 | 0.13 | 0.13 |
| refs | 100,000 | 2.91 | 2.60 | 2.65 | 0.11 | 0.11 |
| coords | 10,000 | 3.29 | 1.81 | 1.89 | 0.20 | 0.04 |
| coords | 100,000 | 2.89 | 1.78 | 1.82 | 0.19 | 0.03 |

Each process's own lazy over dirty stayed within about 10% of the value
shown, except where the dirty closure's tick is a few µs: isolated (0.3
to 1.2), cutoff at 100% (98 to 164 at 10,000, 440 to 575 at 100,000) and
at 10% (21 to 29, 66 to 86).

What it shows:

- Finding the order at run time costs about 7 to 9 ns per instruction
  (ready_all at 10,000 instructions: 79 to 97 µs), against 2 to 4 ns for
  running a fixed order. Readiness checking looks at each input's
  producer before running an instruction and keeps a stack; the fixed
  schedule only runs the next instruction.
- Invalidating, then evaluating, pays twice: once to mark what is
  downstream stale, once to bring it up to date. It does the same amount
  of work as the dirty closure, so its ratio to it (about 2) is the cost
  of the extra pass and of demand. Lazy pull with everything read is the
  same thing, and costs the same.
- Where early cutoff stops a change, the fixed schedule computes in
  order, so the dirty closure learns that `round` did not change before
  it marks anything after it, and stops there. Invalidation has to mark
  the whole chain stale before any value is known; evaluation then skips
  running each instruction, but must still visit it. So decision 9 is
  what lets early cutoff (decision 11) save visits, and not only runs.
- Lazy pull computes only the read part of the change, and leaves the
  rest stale, so its tick shrinks with the viewport, about in proportion
  to the share of the change in view: on the chains (depth, coords) a
  10% viewport costs a fifth of the dirty closure and 1% a twentieth to
  a fiftieth. It breaks even with the dirty closure at about half of the
  change in view. Where the viewport holds all of the change (mixed at
  10%) or none of it beyond one cell (isolated), it gains nothing.
- So which is faster depends on what a renderer shows. A drag whose
  effects are all on screen favors the fixed push schedule by about two
  times; a drag whose effects are mostly off screen or hidden favors
  the lazy core, by as much as what is not shown is large.
- Whether that win is laziness or only computing less is the next
  section's question: a push core can also skip what no read needs.
- Not measured: scrolling. The lazy core pays for what it skipped when
  stale content comes into view, and this harness never moves the
  viewport. Nor reads in another order than the document's.

#### Push over what is read

Measured 2026-10-25, the same way, with
`CELLS_EVALUATORS=dirty,lazy,pruned`. `pruned`
(`crates/cells-bench/src/pruned.rs`) is the core's `DirtyClosure`, copied
since its fields are private, with one change: its table of each cell's
readers lists only the instructions some read cell depends on, worked out
once when it is made, as a push core would when the viewport changes.
Its tick loop is the core's line for line, so pruning costs nothing per
tick, and with everything read it is the core's dirty closure: at 100%
it took 0.98 to 1.01 of the dirty closure's time on every shape (1.14
and 1.61 on cutoff, ticks of 0.3 and 2 to 4 µs), so the copy is
faithful. An instruction no read cell needs never runs and goes stale,
as in lazy; values are compared on the read cells.

| shape | n | read | dirty (µs) | lazy (µs) | pruned (µs) | pruned / dirty | lazy / pruned |
|---|---:|---:|---:|---:|---:|---:|---:|
| depth | 10,000 | 10% | 108 | 20.5 | 11.2 | 0.10 | 1.82 |
| depth | 10,000 | 1% | 108 | 2.6 | 1.5 | 0.01 | 1.80 |
| depth | 100,000 | 10% | 1,340 | 237 | 119 | 0.09 | 1.99 |
| depth | 100,000 | 1% | 1,352 | 27.9 | 14.3 | 0.01 | 1.95 |
| breadth | 10,000 | 10% | 56.2 | 20.4 | 6.2 | 0.11 | 3.30 |
| breadth | 10,000 | 1% | 55.8 | 8.1 | 1.0 | 0.02 | 7.69 |
| breadth | 100,000 | 10% | 691 | 239 | 66.4 | 0.10 | 3.60 |
| breadth | 100,000 | 1% | 706 | 93.4 | 9.0 | 0.01 | 10.4 |
| mixed | 100,000 | 10% | 41.4 | 85.7 | 41.7 | 1.01 | 2.06 |
| mixed | 100,000 | 1% | 41.0 | 21.8 | 11.0 | 0.27 | 1.97 |
| isolated | 100,000 | 1% | 0.2 | 0.2 | 0.2 | 1.02 | 1.05 |
| cutoff | 100,000 | 10% | 0.3 | 169 | 0.4 | 1.07 | 469 |
| cutoff | 100,000 | 1% | 0.2 | 17.3 | 0.2 | 1.02 | 70 |
| refs | 10,000 | 10% | 56.0 | 6.4 | 0.2 | 0.00 | 29.7 |
| refs | 100,000 | 10% | 694 | 75.6 | 0.8 | 0.00 | 89.2 |
| refs | 100,000 | 1% | 686 | 74.7 | 0.9 | 0.00 | 83.5 |
| coords | 100,000 | 10% | 1,357 | 251 | 132 | 0.10 | 1.91 |
| coords | 100,000 | 1% | 1,363 | 32.6 | 17.0 | 0.01 | 1.91 |

At 100% read, lazy over pruned is lazy over the dirty closure above
(1.8 to 2.5 times, 450 to 590 on cutoff). Each process's own lazy over
pruned stayed within about 10% of the value shown, except on cutoff and
refs, where pruned's tick is under 1 µs (cutoff at 1% and 100,000: 26 to
75; refs at 100,000: 70 to 120).

What it shows:

- Pruned push is faster than lazy pull at every share read, on every
  shape with work to skip. Lazy's win over the dirty closure was from
  computing less, which the fixed schedule keeps when it skips what no
  read needs; laziness itself costs about 2 times.
- On the chains (depth, coords) and the page (mixed), lazy over pruned
  stays about 2 at every share: the cost of invalidating before
  evaluating, as with everything read.
- On fans (breadth, refs) the gap grows as less is read, to 10 and 90
  times: lazy's invalidation still walks every reader of the dragged
  point each tick, read or not, to find it already stale, while pruned's
  table no longer lists the unread ones. A lazy core that unsubscribes
  what nothing observes, as MobX suspends an unobserved computed, would
  drop that walk and come to about 2 times again, which is pruning by
  another name.
- On cutoff, pruning keeps early cutoff at the round, and lazy cannot.
- So decision 9 holds: with the same work skipped, the fixed push
  schedule is about 2 times faster than pull, and far more where a
  change stops early. What a viewport saves belongs to computing less,
  which either can do.
- Not measured: changing what is read. Pruned remakes its table, a
  pass over the program, when the viewport moves, and must then compute
  what came into view, which went stale while out of it; lazy computes
  that on the read. Scrolling is where they would differ next.

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

### Decision 10: priority queue

Measured 2026-10-25 with `scripts/tick-diff.sh` against `90cfe62`, the
alternative being `docs/tick-alternatives/10-priority-queue.patch`: the
dirty closure keeps the instructions waiting to run in a min-heap of
schedule positions (`BinaryHeap<Reverse<u32>>`) with a flag per
instruction for whether it is queued, both kept across ticks, instead
of the bitset scanned forward a word at a time. The readers table and
early cutoff are unchanged. Full recompute is untouched, so its column
is a control.

| shape | n | dirty, base → queue (µs) | queue / base | full, base → queue (µs) | queue / base |
|---|---:|---|---:|---|---:|
| depth | 10,000 | 109 → 99.5 | 0.91 | 27.8 → 27.8 | 1.00 |
| depth | 100,000 | 1,343 → 1,210 | 0.90 | 361 → 354 | 0.98 |
| breadth | 10,000 | 56.3 → 196 | 3.49 | 19.3 → 17.0 | 0.88 |
| breadth | 100,000 | 678 → 3,276 | 4.83 | 333 → 326 | 0.98 |
| isolated | 10,000 | 0.2 → 0.2 | 0.98 | 14.0 → 14.0 | 1.00 |
| isolated | 100,000 | 1.9 → 1.8 | 0.98 | 260 → 250 | 0.96 |
| mixed | 10,000 | 4.4 → 10.5 | 2.37 | 14.8 → 14.7 | 1.00 |
| mixed | 100,000 | 50.9 → 186 | 3.64 | 260 → 271 | 1.04 |
| cutoff | 10,000 | 0.2 → 0.2 | 0.97 | 14.0 → 14.0 | 1.00 |
| cutoff | 100,000 | 1.9 → 2.0 | 1.08 | 243 → 260 | 1.07 |
| refs | 10,000 | 44.3 → 241 | 5.45 | 15.2 → 21.4 | 1.41 |
| refs | 100,000 | 690 → 3,256 | 4.72 | 312 → 337 | 1.08 |
| coords | 10,000 | 119 → 107 | 0.90 | 49.5 → 49.8 | 1.01 |
| coords | 100,000 | 1,354 → 1,297 | 0.96 | 637 → 648 | 1.02 |

The control moved by more than the noise floor on refs at 10,000 (1.41):
the base's process landed in that row's fast mode (15.2 µs, against the
19.3 µs it usually takes), which also flatters the base's dirty closure
there (44.3 against its usual 56 µs), so the 5.45 on that row is high,
and about 4.3 at its usual times. With the patch, `cargo test
--workspace` passes, the golden diff is identical (12 documents and
their programs), and every shape's fingerprint matches the base's.

What it shows:

- Where a change fans out, the frontier is wide: breadth queues all n
  readers of the dragged point at once, and a heap pays O(log n) for
  each push and pop: about 33 ns per instruction on breadth at 100,000,
  against about 7 for the bitset, which pays a bit set and a scan
  whatever the width. So the bitset
  is 2.4 to 5.5 times faster on breadth, refs and mixed, the shapes most
  like a page.
- On a chain the frontier is one instruction: each step queues the next.
  The heap then holds one entry, and its push and pop are a few
  instructions, while the bitset still sets a bit, scans for it and
  keeps the bounds of what is marked. The queue is 4 to 10% faster
  there.
- So the bitset is the right choice for the closure, by a wide margin
  where it matters. A hybrid that walks a chain directly (as the
  inversion's `walk` does) could take the 10% on chains; that would be a
  change to the core, not part of this plan.
- Decision 10 found the dirty closure costing about 10 ns per
  instruction on a chain, against 3 for full recompute. Swapping its
  bitset for a queue saves only 10% of that, so most of the gap is in
  what both keep: the readers lookup, the change test and the list of
  changed cells. Not profiled.

### Decision 2: operators as code

Measured 2026-10-25 with `scripts/tick-diff.sh` against `bbc4c88`, in
the cheap form of the plan's step 5: no component is rewritten; when the
program is scheduled, every scalar instruction is also made code, kept
in `Program::code` beside the instructions, and `Program::step` calls
that code instead of matching on the operator. Vector and symbolic
instructions keep their path. The code is generated from each operator's
entry in `scalar_ops!`, the same formula the match runs, so it is code
specialized to its operator, not a wrapper around the match. Two forms:

- **A closure per instruction**
  (`docs/tick-alternatives/2-operators-as-closures.patch`): an
  `Rc<dyn Fn(&[f64]) -> f64>` that captures its input cells and
  parameters, as a state variable's function closes over what it reads.
  Each is a heap allocation of its own.
- **A function pointer per operator**
  (`docs/tick-alternatives/2-operators-as-fn-pointers.patch`): an
  `fn(&Op, &[f64]) -> f64` per kind of operator, which reads its inputs
  from the instruction, in one contiguous array. The call through a
  pointer, without the allocations.

Both find an instruction's code by its position in the program, a
subtraction, a division and a comparison per step that the match does
not pay. With each, `cargo test --workspace` passes, the golden diff is
identical (12 documents and their programs), and every shape's
fingerprint matches the base's.

| shape | n | full: closures / base | full: pointers / base | dirty: closures / base | dirty: pointers / base |
|---|---:|---:|---:|---:|---:|
| depth | 10,000 | 1.54 | 1.61 | 0.93 | 0.99 |
| depth | 100,000 | 1.69 | 1.46 | 0.91 | 1.00 |
| breadth | 10,000 | 4.87 | 2.03 | 1.87 | 1.18 |
| breadth | 100,000 | 4.32 | 1.41 | 2.32 | 1.16 |
| isolated | 10,000 | 4.27 | 2.18 | 1.98 | 1.14 |
| isolated | 100,000 | 4.72 | 1.43 | 1.35 | 0.92 |
| mixed | 10,000 | 2.40 | 2.52 | 1.10 | 1.06 |
| mixed | 100,000 | 3.32 | 1.22 | 1.77 | 0.85 |
| cutoff | 10,000 | 1.97 | 1.72 | 1.10 | 0.90 |
| cutoff | 100,000 | 2.02 | 1.49 | 1.53 | 1.16 |
| refs | 10,000 | 5.12 | 2.12 | 2.08 | 1.19 |
| refs | 100,000 | 3.35 | 1.34 | 2.12 | 1.15 |
| coords | 10,000 | 2.08 | 1.78 | 1.09 | 0.99 |
| coords | 100,000 | 1.78 | 1.53 | 1.06 | 0.97 |

Times, base → closures → pointers, in µs:

| shape | n | full | dirty |
|---|---:|---|---|
| depth | 100,000 | 356 → 603 → 545 | 1,344 → 1,221 → 1,359 |
| breadth | 100,000 | 356 → 1,536 → 480 | 696 → 1,618 → 797 |
| isolated | 100,000 | 257 → 1,214 → 371 | 1.9 → 2.6 → 1.9 |
| mixed | 100,000 | 263 → 874 → 326 | 51.1 → 90.5 → 43.8 |
| refs | 100,000 | 261 → 875 → 470 | 551 → 1,171 → 796 |

The two forms were measured in separate runs, each against its own run
of the base, so the base's times differ between them by the noise
floor; each ratio is against its own run's base.

What it shows:

- Operators as data are faster on every shape where the instructions'
  own cost shows: full recompute runs 1.2 to 2.5 times slower with a
  function pointer per operator, and 1.5 to 5 times with a closure per
  instruction.
- On the fans (breadth, refs, isolated), the closures cost far more
  than the pointers: at 100,000, the pointers add 0.1 to 0.2 ms to full
  recompute and the closures 0.6 to 1.2 ms. That difference is the
  allocation per instruction: the tick reads each closure's captures
  from its own place on the heap, where the match, and the pointers,
  read the instruction from one contiguous array. On the chains the two
  forms cost about the same.
- The cost is largest where the instructions are independent of each
  other (breadth, refs, isolated): with data, the processor overlaps
  many instructions at once; through a call it cannot see into, much
  less so. On a chain (depth, coords) each instruction waits on the one
  before anyway, and the call adds less (1.5 to 2.1 times).
- Under the dirty closure, whose own cost per instruction is several
  times an instruction's (decision 10), the pointers cost at most 19%
  and the closures up to 2.3 times, again on the fans. On depth the
  closures came out 7 to 9% faster than the base under the dirty
  closure, beyond the noise floor; not explained.
- This is the cheap form: dispatch alone. The JavaScript core's model
  adds what the full form (Plan, step 14) would measure: a function per
  state variable rather than per primitive, its dependencies looked up
  rather than bound, and values held in its objects.

### Decision 8: identity instructions

Measured 2026-10-25 with `scripts/tick-diff.sh` against `1064555`, the
alternative being `docs/tick-alternatives/8-identity-instructions.patch`.
At the start of emit, in a real build, every alias slot becomes an
instruction of a new scalar operator, `Id(a)`, whose inverse writes the
requested value to `a`; the union-find then has nothing to merge, and
every slot has a cell of its own. (The cycle check's probe keeps
aliases: a recurrence it folds onto itself is a loop of aliases, which
it turns into a constant.) An identity's cell takes its referent's
value type, as the shared cell did, and the tape compiler follows
identities as it followed aliases.

Three places outside the tick took "the same cell" to mean "equal by
construction", and the alternative has to say that another way: each
now follows a cell back through identities to its source
(`Document::source_cell`, new in the patch).

- `Document::answer_responses` and `answer_inputs`, which find which
  input an answer reads by its cell. Without the change, an input was
  listed twice, or not at all.
- `Document::interactive_cells` and `is_interactive`: a copy of an
  input is interactive, as their one shared cell was.
- The sticky tables. A member's points are deduplicated by source; a
  request on a member's own copy of a point names that point, and takes
  its snapped value; and a group that copies an earlier one, left out
  as before, adds its members' cells to the earlier group's index.
  Without these, a shape stuck to its own vertices, and a drag of a
  copied group was not snapped.

With the patch, the golden diff is identical in every value (12
documents; their programs differ, as they should), every shape's
fingerprint matches the base's, and every value check of the component
specs passes. 29 tests fail, every one on structure, not on a value:
the number of cells or instructions a document builds (`build.rs`,
`math.rs`, `repeat.rs`), two props sharing one cell (`boolean.rs`,
`build.rs`, `slider.rs`, `symbolic.rs`, `text_input.rs`), the operators
a math lowers to (`math.rs`), the number of cells a tick reports
changed, which now counts each identity (`requests.rs`), and the
specs' cost snapshots (circle, line, polygon, segment, slider). They
check decision 8 itself.

What it does to programs (`crates/cells-bench/examples/program_size.rs`,
run on each side):

| document | cells, base → identities | instructions, base → identities | instructions × |
|---|---|---|---:|
| choices | 82 → 105 | 38 → 61 | 1.61 |
| circles | 113 → 165 | 58 → 110 | 1.90 |
| fixed | 50 → 66 | 23 → 39 | 1.70 |
| lines | 50 → 65 | 26 → 41 | 1.58 |
| ops | 29 → 51 | 17 → 39 | 2.29 |
| polygons | 52 → 104 | 5 → 57 | 11.4 |
| repeats | 91 → 151 | 40 → 100 | 2.50 |
| scoring | 109 → 120 | 28 → 39 | 1.39 |
| slider | 42 → 46 | 26 → 30 | 1.15 |
| sticky | 45 → 85 | 1 → 41 | 41.0 |
| symbolic | 421 → 432 | 13 → 24 | 1.85 |
| `fixtures/sir.doenet` | 5,488 → 17,197 | 2,829 → 14,538 | 5.14 |

And to ticks:

| shape | n | instructions | dirty, base → identities (µs) | identities / base | full, base → identities (µs) | identities / base |
|---|---:|---|---|---:|---|---:|
| depth | 10,000 | 10,000 → 20,000 | 108 → 234 | 2.17 | 27.1 → 62.4 | 2.30 |
| depth | 100,000 | 100,000 → 200,000 | 1,370 → 2,673 | 1.95 | 372 → 718 | 1.93 |
| breadth | 10,000 | 10,000 → 20,000 | 56.2 → 150 | 2.68 | 19.3 → 55.6 | 2.89 |
| breadth | 100,000 | 100,000 → 200,000 | 690 → 1,688 | 2.44 | 330 → 688 | 2.09 |
| isolated | 10,000 | 10,001 → 20,002 | 0.2 → 0.3 | 1.18 | 14.0 → 27.9 | 1.99 |
| isolated | 100,000 | 100,001 → 200,002 | 2.0 → 3.4 | 1.67 | 276 → 568 | 2.06 |
| mixed | 10,000 | 10,000 → 20,000 | 4.4 → 9.2 | 2.09 | 14.7 → 29.1 | 1.97 |
| mixed | 100,000 | 100,000 → 200,000 | 52.5 → 112 | 2.13 | 273 → 565 | 2.07 |
| cutoff | 10,000 | 10,002 → 20,003 | 0.2 → 0.2 | 1.07 | 14.0 → 27.8 | 1.99 |
| cutoff | 100,000 | 100,002 → 200,003 | 2.1 → 3.6 | 1.67 | 260 → 547 | 2.10 |
| refs | 10,000 | 10,000 → 40,000 | 57.2 → 302 | 5.28 | 20.5 → 130 | 6.32 |
| refs | 100,000 | 100,000 → 400,000 | 690 → 3,297 | 4.78 | 331 → 1,496 | 4.52 |
| coords | 10,000 | 20,000 → 40,000 | 119 → 256 | 2.16 | 50.3 → 116 | 2.30 |
| coords | 100,000 | 200,000 → 400,000 | 1,385 → 2,713 | 1.96 | 640 → 1,328 | 2.08 |

What it shows:

- References are most of what a document says: every `$x` in a math,
  every attribute given by reference, every prop of a copy. Without
  aliasing, each is an instruction, and the program grows by that many:
  twice over on the shapes and the golden set, five times on `sir`,
  whose geometry is mostly copies and references.
- The tick grows with the program, at about the same cost per
  instruction: the identities are as cheap as any operator, so the
  ratio of times follows the ratio of instructions (2 on the shapes,
  where it is 1.9 to 2.9; 4 on refs, where it is 4.5 to 6.3). Under the dirty closure the
  identities also cost their bookkeeping, a step more on every path.
- So aliasing pays in proportion to how much a document refers: on
  `sir` a tick with identity instructions would do about five times the
  work. Its other cost is the one the patch had to pay for: the core's
  answers, interactive cells and sticky groups read meaning off shared
  cells, and a core without aliasing must track where each copy comes
  from instead.
- Not measured: the tick on `sir` and the golden documents themselves,
  which `tick_cost` does not load; their programs are what is measured.

### Decision 6: 16-byte cells

Measured 2026-10-25 in two steps, each with `scripts/tick-diff.sh`.

First the plumbing, `docs/tick-alternatives/4-6-cells-type.patch`,
against `8380ecf`. The cells get a type of their own, `Cells`
(`src/cells.rs`, new): a vector of slots, indexed by cell, which reads
and writes an `f64` whatever a slot is, so `cells[c]` keeps its meaning
everywhere. Every function that took the cells as `&[f64]` or
`&mut [f64]` takes `&Cells` or `&mut Cells` (the operators, the
evaluators, inversion, the symbolic engine's instantiation, the bench
crate's evaluators), and the few range reads and writes become
`Cells::values` and `Cells::write`. The slot is still an `f64`, so this
should change nothing: it is the control. It did not, beyond the noise
floor: every row within 4% of the base, except two dirty closure ticks
of about 2 µs (1.17). `cargo test --workspace` passes and the golden
diff is identical.

Then the alternative, `docs/tick-alternatives/5-16-byte-cells.patch`,
on top of the plumbing and against it (committed locally as the base,
not pushed): a slot becomes `#[repr(C)] struct Padded { v: f64, _pad:
f64 }`, 16 bytes, with no tag. Reads and writes touch only `v`; the
padding is never read. The cell array doubles: 0.8 MB to 1.6 MB at
100,000 cells. `cargo test --workspace` passes, the golden diff is
identical, and every shape's fingerprint matches.

| shape | n | dirty, 8 → 16 bytes (µs) | 16 / 8 | full, 8 → 16 bytes (µs) | 16 / 8 |
|---|---:|---|---:|---|---:|
| depth | 10,000 | 108 → 109 | 1.01 | 28.4 → 30.0 | 1.05 |
| depth | 100,000 | 1,333 → 1,368 | 1.03 | 369 → 417 | 1.13 |
| breadth | 10,000 | 56.9 → 59.3 | 1.04 | 20.1 → 24.9 | 1.24 |
| breadth | 100,000 | 692 → 741 | 1.07 | 344 → 373 | 1.08 |
| isolated | 10,000 | 0.2 → 0.2 | 0.98 | 14.0 → 18.8 | 1.34 |
| isolated | 100,000 | 2.0 → 1.9 | 0.96 | 263 → 290 | 1.10 |
| mixed | 10,000 | 4.5 → 4.5 | 1.01 | 14.8 → 19.2 | 1.30 |
| mixed | 100,000 | 51.2 → 51.3 | 1.00 | 268 → 288 | 1.08 |
| cutoff | 10,000 | 0.2 → 0.2 | 1.00 | 14.0 → 18.3 | 1.31 |
| cutoff | 100,000 | 2.1 → 2.0 | 0.97 | 260 → 287 | 1.11 |
| refs | 10,000 | 55.9 → 60.6 | 1.08 | 19.3 → 26.3 | 1.36 |
| refs | 100,000 | 692 → 744 | 1.08 | 328 → 389 | 1.19 |
| coords | 10,000 | 120 → 124 | 1.04 | 50.1 → 60.8 | 1.21 |
| coords | 100,000 | 1,349 → 1,376 | 1.02 | 640 → 720 | 1.13 |

What it shows:

- Doubling a cell, with nothing else changed, costs full recompute 5 to
  36%. What a tick reads and writes is spread over twice the memory, so
  fewer values share a cache line; that is the likely cause, not
  profiled.
- The cost is largest at 10,000 (21 to 36% on all but depth), where the
  cells go from 80 KB to 160 KB, and smaller at 100,000 (8 to 19%). On
  depth, where each instruction waits on the one before, it costs least
  (5 and 13%).
- Under the dirty closure, which reaches cells through its readers
  table and spends most of its time on its own bookkeeping (decision
  10), the size costs at most 8%.
- So a tagged 16-byte enum would pay this much for its size alone.
  What the tag adds, a check on every read, is the next step.

### Decision 6: a tag array

Measured 2026-10-25 with `scripts/tick-diff.sh`, the alternative being
`docs/tick-alternatives/6-tag-array.patch` on top of the plumbing
(`4-6-cells-type.patch`) and measured against it, committed locally as
the base, as for 16-byte cells. The cells stay 8-byte `f64`s; beside them
`Cells` keeps a byte per cell, its tag, set from `Program::value_types`
(number, text or math) when the document is made. Every read checks the
tag: a tag past the last value type would read as NaN. None ever is,
but the compiler cannot know it, so each read loads the tag, compares
it and branches. Writes leave the tag alone, since a cell's type is
fixed per build. `cargo test --workspace` passes, the golden diff is
identical, and every shape's fingerprint matches.

| shape | n | dirty, untagged → tag array (µs) | tagged / untagged | full, untagged → tag array (µs) | tagged / untagged |
|---|---:|---|---:|---|---:|
| depth | 10,000 | 106 → 104 | 0.99 | 27.5 → 30.9 | 1.12 |
| depth | 100,000 | 1,307 → 1,331 | 1.02 | 363 → 480 | 1.32 |
| breadth | 10,000 | 56.3 → 68.7 | 1.22 | 19.3 → 28.9 | 1.50 |
| breadth | 100,000 | 670 → 886 | 1.32 | 349 → 462 | 1.32 |
| isolated | 10,000 | 0.2 → 0.2 | 1.01 | 14.0 → 20.4 | 1.45 |
| isolated | 100,000 | 1.9 → 2.3 | 1.23 | 253 → 346 | 1.37 |
| mixed | 10,000 | 4.5 → 4.7 | 1.04 | 14.8 → 21.1 | 1.43 |
| mixed | 100,000 | 50.2 → 55.5 | 1.11 | 259 → 345 | 1.33 |
| cutoff | 10,000 | 0.2 → 0.2 | 1.04 | 14.0 → 20.4 | 1.46 |
| cutoff | 100,000 | 2.1 → 2.3 | 1.10 | 257 → 343 | 1.33 |
| refs | 10,000 | 56.2 → 68.6 | 1.22 | 19.4 → 27.8 | 1.43 |
| refs | 100,000 | 683 → 917 | 1.34 | 354 → 451 | 1.27 |
| coords | 10,000 | 115 → 118 | 1.03 | 48.6 → 63.6 | 1.31 |
| coords | 100,000 | 1,355 → 1,340 | 0.99 | 648 → 867 | 1.34 |

What it shows:

- A check on every read costs full recompute 31 to 50% on every shape
  but depth at 10,000, 27 to 37% at 100,000, and 12 and 32% on depth:
  more than doubling the cell (5 to 36%). Each operand read becomes a second load, from a
  second array, a compare and a branch, and the step's change test
  reads the old value through the same check.
- Unlike the size, the tag's cost hardly shrinks at 100,000: it is
  work per read more than memory (the tags add a byte per cell).
- Under the dirty closure it shows on the fans (breadth and refs, 22 to
  34%), where every reader of the dragged cell is checked as it runs,
  and hardly on the chains (depth and coords, within 3%), where each
  step waits on the one before; likely the check hides in that wait,
  not profiled.
- So untagged values (decision 6) save more for the tag than for the
  size: on full recompute 1.12 to 1.50 times against 1.05 to 1.36. A
  tagged enum pays both, which is the next step.

### Decision 6: a tagged enum

Measured 2026-10-25 with `scripts/tick-diff.sh`, the alternative being
`docs/tick-alternatives/6-tagged-enum.patch` on top of the plumbing and
against it, as for the steps before. A slot becomes
`enum Value { Number(f64), Text(f64), Math(f64), Missing }`, 16 bytes:
a discriminant and the value. Each cell's variant is set from
`Program::value_types` when the document is made. Every read matches
on the variant; a missing value stays a NaN `Number`, as in the core,
so values match bit for bit, and `Missing` is never made, but the match
has to allow for it. `cargo test --workspace` passes, the golden diff
is identical, and every shape's fingerprint matches.

| shape | n | dirty, untagged → enum (µs) | enum / untagged | full, untagged → enum (µs) | enum / untagged |
|---|---:|---|---:|---|---:|
| depth | 10,000 | 106 → 110 | 1.04 | 27.7 → 34.7 | 1.25 |
| depth | 100,000 | 1,347 → 1,356 | 1.01 | 375 → 459 | 1.22 |
| breadth | 10,000 | 56.7 → 70.6 | 1.25 | 19.9 → 30.7 | 1.54 |
| breadth | 100,000 | 689 → 906 | 1.32 | 331 → 424 | 1.28 |
| isolated | 10,000 | 0.2 → 0.2 | 1.06 | 14.0 → 21.4 | 1.53 |
| isolated | 100,000 | 2.1 → 2.0 | 0.93 | 271 → 313 | 1.15 |
| mixed | 10,000 | 4.5 → 4.8 | 1.09 | 14.8 → 22.3 | 1.51 |
| mixed | 100,000 | 50.3 → 56.8 | 1.13 | 262 → 323 | 1.23 |
| cutoff | 10,000 | 0.2 → 0.2 | 1.06 | 14.0 → 21.3 | 1.52 |
| cutoff | 100,000 | 2.1 → 2.3 | 1.08 | 268 → 304 | 1.14 |
| refs | 10,000 | 56.5 → 71.4 | 1.26 | 19.8 → 30.6 | 1.55 |
| refs | 100,000 | 679 → 868 | 1.28 | 348 → 402 | 1.16 |
| coords | 10,000 | 115 → 123 | 1.07 | 50.4 → 66.6 | 1.32 |
| coords | 100,000 | 1,361 → 1,387 | 1.02 | 657 → 744 | 1.13 |

The first run gave coords at 100,000 as 0.80 and 0.92, faster than the
base; a second run of that row, shown, gave 1.02 and 1.13, with depth
at 100,000 again within 1% of its first run, so the first was noise.

The three alternatives to decision 6 side by side, full recompute, each
over the untagged 8-byte cells:

| shape | n | 16 bytes, no tag | tag array | tagged enum |
|---|---:|---:|---:|---:|
| depth | 10,000 | 1.05 | 1.12 | 1.25 |
| depth | 100,000 | 1.13 | 1.32 | 1.22 |
| breadth | 10,000 | 1.24 | 1.50 | 1.54 |
| breadth | 100,000 | 1.08 | 1.32 | 1.28 |
| mixed | 10,000 | 1.30 | 1.43 | 1.51 |
| mixed | 100,000 | 1.08 | 1.33 | 1.23 |
| refs | 10,000 | 1.36 | 1.43 | 1.55 |
| refs | 100,000 | 1.19 | 1.27 | 1.16 |
| coords | 10,000 | 1.21 | 1.31 | 1.32 |
| coords | 100,000 | 1.13 | 1.34 | 1.13 |

What it shows:

- The enum costs about what the tag alone does, not size and tag added
  together: at 10,000 a little more than the tag array (1.25 to 1.55),
  at 100,000 a little less (1.13 to 1.28). The enum's tag sits beside
  its value, in the same cache line, where the tag array's is a second
  load from a second array; that is the likely reason, not profiled.
- So what decision 6 buys over a tagged enum is mostly the check on
  every read: 13 to 55% of full recompute, and under the dirty closure
  up to 32% on the fans.

### Decision 4: an allocation per value

Measured 2026-10-25 with `scripts/tick-diff.sh`, the alternative being
`docs/tick-alternatives/4-allocation-per-value.patch` on top of the
plumbing and against it. A slot becomes a `Box<f64>`: every value is an
allocation of its own, and the cells are a vector of pointers to them,
so every read and write follows a pointer. Where the allocations land
decides most of the cost, so two forms, switched by a constant
(`SHUFFLE`) in the patch:

- **In cell order**: the values are allocated one after another, as a
  core that builds them in one pass would, and the allocator lays them
  nearly side by side.
- **Shuffled** (the patch as saved): the values are allocated in a
  fixed shuffled order, so neighbouring cells sit far apart on the
  heap, as objects made over a session among everything else would.

A clone of the cells (each evaluator's copy of the document, a
lookahead's scratch) allocates in the same order. With the shuffled
form, `cargo test --workspace` passes and the golden diff is identical;
in cell order the core's tests pass; every shape's fingerprint matches
in both forms.

| shape | n | full: in order / contiguous | full: shuffled / contiguous | dirty: in order / contiguous | dirty: shuffled / contiguous |
|---|---:|---:|---:|---:|---:|
| depth | 10,000 | 1.18 | 1.32 | 1.03 | 1.03 |
| depth | 100,000 | 1.15 | 2.38 | 1.00 | 1.31 |
| breadth | 10,000 | 1.61 | 2.21 | 1.14 | 1.30 |
| breadth | 100,000 | 1.53 | 2.79 | 1.15 | 2.24 |
| isolated | 10,000 | 1.05 | 1.08 | 1.04 | 1.07 |
| isolated | 100,000 | 1.69 | 2.92 | 1.67 | 1.93 |
| mixed | 10,000 | 1.06 | 1.11 | 1.04 | 1.02 |
| mixed | 100,000 | 1.64 | 2.93 | 1.08 | 1.97 |
| cutoff | 10,000 | 1.04 | 1.12 | 1.03 | 1.04 |
| cutoff | 100,000 | 1.35 | 2.78 | 1.31 | 1.77 |
| refs | 10,000 | 2.84 | 2.48 | 1.42 | 1.40 |
| refs | 100,000 | 1.83 | 2.70 | 1.34 | 2.17 |
| coords | 10,000 | 1.38 | 2.51 | 1.08 | 1.46 |
| coords | 100,000 | 1.20 | 3.00 | 1.00 | 1.58 |

Times at 100,000, contiguous → in order and contiguous → shuffled, in
µs (each form against its own run of the base):

| shape | full, in order | full, shuffled | dirty, in order | dirty, shuffled |
|---|---|---|---|---|
| depth | 375 → 431 | 360 → 855 | 1,337 → 1,342 | 1,307 → 1,709 |
| breadth | 329 → 503 | 334 → 931 | 683 → 789 | 690 → 1,545 |
| mixed | 263 → 431 | 260 → 764 | 49.9 → 53.8 | 49.5 → 97.4 |
| refs | 332 → 607 | 343 → 927 | 684 → 919 | 690 → 1,499 |
| coords | 662 → 794 | 641 → 1,925 | 1,353 → 1,357 | 1,317 → 2,082 |

What it shows:

- A pointer per value costs full recompute 1.04 to 1.8 times when the
  values lie in order (refs at 10,000, 2.84, is a row the noise floor
  marks as unsteady), and 2.4 to 3 times at 100,000 when they are
  scattered: the largest cost of any change to storage measured here.
  Scattered, each read is likely a cache miss of its own, where
  contiguous cells share lines; not profiled.
- At 10,000 the shuffle adds little on half the shapes (isolated,
  mixed, cutoff: within 12%), and up to 2.5 times on the others; at
  100,000 it is most of the cost everywhere.
- The dirty closure, which pays its own bookkeeping per instruction,
  shows it less in order (up to 1.7) but up to 2.2 times shuffled, on
  the fans and the page.
- So decision 4 buys up to 3 times over values allocated one by one;
  how much in the alternative core depends on how scattered its values
  would be, which this measurement bounds but cannot settle.

### Steps 11 to 15: evaluators over the core's own instructions

The last five alternatives would each rewrite much of the core: its
lowering, its components, the layout of its values or its whole model of
evaluation. They are built instead, as chosen, as evaluators in the
bench crate that run the core's own instructions with `Program::step` on
the core's cells and change only what the decision is about, as the pull
evaluators did for decision 9. Each measures the decision's mechanism,
not a core built around the alternative. Measured 2026-10-26 with
`tick_cost`, every evaluator on its own copy of each document,
interleaved, seven processes, each evaluator's tick the median of the
processes' medians; every evaluator holds the dirty closure's values,
bit for bit, in every cell, on every shape. Two shapes were added for
them: poly (decision 3) and symbolic (decision 5); see
[The harness](#the-harness).

Times here are a little higher than in earlier sections at 100,000:
with up to eight copies of a document in memory, each evaluator's copy
sits in a busier cache. Each ratio is between evaluators of the same
processes.

### Decision 3: coarse operators

`crates/cells-bench/src/grouped.rs`: a dirty closure over groups of
instructions. A group runs as a unit: when anything it reads changes,
all its instructions run, in schedule order, and only then are the
readers of its changed outputs marked. Groups run in the order of their
last instruction, through a bitset over that order, as the core's dirty
closure runs instructions. Grouped as a coarse operator per value would
be (`expression`), an instruction joins its reader's group when its one
output is read by that one instruction and by no component: the
intermediates of a lowered math, so each value's expression is a unit.

This evaluator is not the core's dirty closure: with every instruction
a unit of its own (`single`, the control) it is 1.15 to 1.45 times the
core's on every shape with work in it. So coarse operators are measured
against `single`, the same evaluator with the same bookkeeping per unit.

| shape | n | dirty (µs) | full (µs) | single (µs) | expression (µs) | compound (µs) |
|---|---:|---:|---:|---:|---:|---:|
| depth | 10,000 | 120 | 33.4 | 152 | 153 | 153 |
| depth | 100,000 | 1,341 | 386 | 1,662 | 1,661 | 1,666 |
| breadth | 10,000 | 64.2 | 29.9 | 90.7 | 89.7 | 89.7 |
| breadth | 100,000 | 687 | 348 | 970 | 965 | 957 |
| mixed | 10,000 | 4.4 | 14.7 | 6.1 | 6.2 | 6.1 |
| mixed | 100,000 | 48.2 | 274 | 67.2 | 62.2 | 62.0 |
| refs | 10,000 | 64.3 | 30.6 | 91.4 | 89.7 | 89.2 |
| refs | 100,000 | 552 | 281 | 783 | 775 | 760 |
| coords | 10,000 | 106 | 48.5 | 143 | 145 | 147 |
| coords | 100,000 | 1,344 | 648 | 1,855 | 1,819 | 1,955 |
| poly | 10,000 | 618 | 164 | 822 | 319 | 815 |
| poly | 100,000 | 7,740 | 3,371 | 9,727 | 4,922 | 9,807 |

(isolated and cutoff, whose ticks are 0.2 to 2.5 µs, are left out: their
ratios ranged from 0.3 to 1.1 between processes.)

Expression over single, the median of the processes' own ratios: 0.39
on poly at 10,000 and 0.51 at 100,000 (0.38 to 0.51 across processes);
0.92 on mixed at 100,000; within 2% on every other shape.

What it shows:

- On poly, where a value is five instructions, running each value as
  one unit makes the tick 2 to 2.6 times faster than running each
  instruction as one: the closure's bookkeeping, which decision 10 found
  costs several times an instruction, is paid once per value instead of
  five times. Against the core's own dirty closure, which is faster than
  this evaluator, the coarse units are still 1.6 to 1.9 times faster on
  poly.
- On every other shape a value is one instruction, so the groups are
  the same and so is the time.
- So under a dirty closure, decision 3's fine grain costs rather than
  buys, wherever a value lowers to several instructions. What it does
  buy is not measured here: inverting through primitives with inverses
  of their own, and early cutoff inside an expression, which a unit
  gives up. Under full recompute, which runs every instruction whatever
  the units, the grouping changes nothing; a coarse operator that also
  fused its arithmetic into one call would save dispatch there, which
  this evaluator does not model.

### Decision 7: compound values

The same evaluator (`compound`), grouped so that a point's coordinates
are one value: the instructions writing a point's `x` and `y` are one
unit, and when either changes, the readers of both are marked, as
readers of the point would be. Every other instruction is a unit of its
own, as in `single`. A first version marked through a different loop
from `single` and came out 15 to 25% faster even where the units were
the same; with one loop for both, `compound` is within 3% of `single`
wherever the units are the same (depth, breadth, refs, poly), as it
should be.

Compound over single (table above): 1.07 on coords at 10,000 (0.99 to
1.10 across processes) and 1.05 at 100,000 (1.03 to 1.07); 1.00 on the
shapes with no derived point.

What it shows:

- On coords, a drag of x makes each point's unit run both coordinates,
  twice the instructions, and still costs only 5 to 7%: the bookkeeping
  is per unit, and the units are as many as before.
- So one cell per scalar buys little in a dirty closure, even where a
  coordinate changes alone: decision 7's value is elsewhere, in operators
  and inverses that need no vector forms, not in the tick's time.

### Decision 2: state variable functions

The same evaluator (`functions`), with the units of `expression`, each
run as a state variable's function is in the JavaScript core: before
each evaluation its dependencies are looked up by key, from a hash map
of keys to cells (std's, SipHash), into a fresh hash map of values; a
boxed function reads each dependency by key and returns its outputs in
a fresh vector; then they are compared with the old values and written.
The arithmetic is still the core's instructions, run inside the
function, so this is a lower bound on such a core's cost: it leaves out
interpreting the formulas, dependencies found by walking names at run
time, and values held in objects.

| shape | n | dirty (µs) | expression (µs) | functions (µs) | functions / expression | functions / dirty |
|---|---:|---:|---:|---:|---:|---:|
| depth | 10,000 | 125 | 159 | 1,060 | 6.76 | 8.32 |
| depth | 100,000 | 2,123 | 2,018 | 14,333 | 7.32 | 6.73 |
| breadth | 10,000 | 64.8 | 90.1 | 706 | 7.83 | 10.9 |
| breadth | 100,000 | 806 | 1,049 | 7,097 | 6.64 | 8.79 |
| mixed | 10,000 | 4.5 | 6.1 | 35.6 | 5.83 | 7.87 |
| mixed | 100,000 | 47.1 | 61.6 | 584 | 9.49 | 12.1 |
| refs | 10,000 | 64.9 | 89.1 | 710 | 7.94 | 10.9 |
| refs | 100,000 | 799 | 1,047 | 6,983 | 6.70 | 8.75 |
| coords | 10,000 | 128 | 182 | 1,304 | 7.44 | 10.2 |
| coords | 100,000 | 2,139 | 2,547 | 17,999 | 6.98 | 8.40 |
| poly | 10,000 | 611 | 333 | 1,301 | 3.87 | 2.13 |
| poly | 100,000 | 7,657 | 4,996 | 20,497 | 4.12 | 2.66 |

(Ratios are the median of the processes' own. Functions over expression
stayed within about 10% of it; functions over dirty varied more, depth
at 100,000 from 6.4 to 8.7. isolated and cutoff, ticks of a µs, came to
1.2 to 1.6.)

What it shows:

- A function per value, with its dependencies looked up and gathered on
  every run, costs 3.9 to 9.5 times the same units run as data: two hash
  maps and a vector per evaluation, and a lookup per dependency, against
  a few instructions.
- With step 5's dispatch alone (1.2 to 5 times on full recompute), this
  puts the operators-as-code model at about an order of magnitude over
  the core's, before anything this lower bound leaves out. On poly,
  where a function does five instructions' work, the overhead is shared
  out and the ratio is lower.

### Decision 1: a value per node

`crates/cells-bench/src/nodes.rs` (`nodes`): a node per cell, each its
own heap allocation, made in a fixed shuffled order as in decision 4's
shuffled form, holding its value, the position of the instruction that
computes it, and its readers, a vector of its own. A tick reads every
input from its node and marks readers from the node's own list. It keeps
the core's order: instructions run by schedule position through the
core's bitset, so what differs is where values and edges live. The
operators read cells by index, so the document's cells stay as a mirror,
filled from the nodes just before each instruction runs: a write per
input the core does not pay.

| shape | n | dirty (µs) | nodes (µs) | nodes / dirty |
|---|---:|---:|---:|---:|
| depth | 10,000 | 125 | 233 | 1.84 |
| depth | 100,000 | 2,123 | 2,963 | 1.41 |
| breadth | 10,000 | 64.8 | 167 | 2.57 |
| breadth | 100,000 | 806 | 2,045 | 2.58 |
| mixed | 10,000 | 4.5 | 6.5 | 1.47 |
| mixed | 100,000 | 47.1 | 145 | 3.11 |
| refs | 10,000 | 64.9 | 168 | 2.56 |
| refs | 100,000 | 799 | 1,965 | 2.45 |
| coords | 10,000 | 128 | 369 | 2.94 |
| coords | 100,000 | 2,139 | 4,915 | 2.28 |
| poly | 10,000 | 611 | 1,467 | 2.40 |
| poly | 100,000 | 7,657 | 21,647 | 2.77 |

(Ratios are the median of the processes' own; each stayed within about
15% of it. isolated and cutoff came to 1.1 to 1.25.)

What it shows:

- Values and edges in scattered nodes cost the dirty closure 1.4 to 3.1
  times on every shape with work in it, about what decision 4's
  scattered allocation cost (up to 2.2 under the dirty closure), plus
  the readers lists, each its own allocation. Most on fans and the page,
  where each step's reads land on many nodes.
- This keeps the core's fixed order and its bitset; a core built around
  nodes usually also finds its order by walking them, which decision 9
  measured at about 2 times on its own.

### Decision 5: values of varying size

`crates/cells-bench/src/inline.rs` (`inline`): the core's dirty closure,
copied, that also keeps each math cell's expression as bytes of its own
length, as a cell holding its expression inline would: a symbolic
instruction decodes its math inputs from their bytes before it runs, and
every math output it changes is exported from the engine and encoded
back. The engine still does the symbolic work through handles, so this
measures what storing expressions inline would add, at most. Measured on
the symbolic shape, 21 timed ticks per evaluator:

| n | dirty (µs) | inline (µs) | inline / dirty, per process |
|---:|---:|---:|---|
| 100 | 1,881 | 1,966 | 1.01 to 1.08 |
| 1,000 | 18,970 | 19,974 | 1.04 to 1.08 |

What it shows:

- Encoding and decoding expressions adds 1 to 8% to a symbolic tick: the
  engine's simplification costs far more than moving an expression's
  bytes. So decision 5, a handle in an 8-byte cell rather than the
  expression, is not what keeps symbolic ticks fast; their time is the
  engine's (ADR 0011).
- `inline` also costs 1.3 times the dirty closure on breadth and refs,
  which have no math cells, and 1.0 to 1.1 on the other numeric shapes;
  not explained, and a reason to read the symbolic ratio as an upper
  bound.

