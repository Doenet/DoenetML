# Why the tick is fast

The cells core answers a drag in a document of 10,000 numbers in 0.40 ms,
where the JavaScript core takes 8.5 s (the benchmark comparison of
2026-10-19, `packages/benchmark/results/runs/2026-10-19-claude-cloud-b686555cd/`).
That speed comes from many design decisions made together. This report
takes the eleven decisions inside the tick most likely to matter, builds
the alternative to each one, swaps it in with everything else unchanged,
and measures the difference. It says which decisions earn the speed,
which barely matter, and where the design costs time.

**The tick in one paragraph.** All of a document's state is one flat
array of `f64` *cells*. A cell is *essential* (state a student can set,
such as a point's position), *fixed* (a constant) or *derived* (computed
from other cells). Each derived cell is computed by one *instruction*: a
small operator such as `Add` or `Scale`, bound to the cells it reads.
When the document is built, the instructions are sorted once into a
*schedule* in which every instruction comes after the ones it reads. A
*tick* is the core's answer to one request, such as "move this point
here": it works out which essential cells to write, writes them, and
recomputes what depends on them. By default it recomputes only the
instructions downstream of the change (the *dirty closure*); it can also
recompute everything (*full recompute*). It skips the readers of any
value that did not actually change (*early cutoff*).

## What makes the tick fast

Each row is one decision, the alternative it was measured against, and
how many times slower the tick gets with the alternative. "Full" and
"dirty" are the two ways of recomputing; the numbers come from synthetic
documents of 10,000 and 100,000 elements, described in
[How it was measured](#how-it-was-measured).

| Rank | Decision | Alternative | Slowdown with the alternative |
|---|---|---|---|
| 1 | [The order of work is fixed when the document is built](#9-a-fixed-schedule) (#9) | finding the order at run time, as pull-based cores do | 2.6–5×; 110–870× where a change stops early |
| 2 | [References share their referent's cell](#8-references-share-a-cell) (#8) | each reference an instruction that copies its value | about 2× on the shapes, whose instructions double, as the golden documents' do; `sir.doenet` would run 5× as many instructions |
| 3 | [Operators are data the core interprets](#2-operators-are-data) (#2) | operators as code called through a pointer, as in the JavaScript core | 1.2–5× for the call alone; 2–12× with run-time dependency lookup |
| 4 | [Values sit side by side in one array, apart from the graph](#4-and-1-one-contiguous-array-apart-from-the-graph) (#4, #1) | a heap allocation per value; a heap node per value | up to 3× (scattered allocations); 1.4–3.1× (nodes) |
| 5 | [Early cutoff](#11-early-cutoff) (#11) | marking every reader, changed or not | 420–650× where a change stops partway; up to 10% *faster* where nothing stops |

These five compound. A tick walks a precomputed order (#9) through a
program with no copying instructions (#8), interpreting compact
operators (#2) over one contiguous array (#4, #1), and stops where values
stop changing (#11). Take away any one and the tick is several times
slower; the JavaScript core gives up most of them at once.

Decisions that matter by tens of percent:

| Decision | Alternative | Slowdown with the alternative |
|---|---|---|
| [Values carry no type tag](#6-values-carry-no-type-tag) (#6) | a tag checked on every read, or a tagged enum | 1.1–1.55× (full recompute) |
| [Every cell is 8 bytes; expressions are held by handle](#5-every-cell-is-8-bytes) (#5) | 16-byte cells; expressions stored inline | 1.05–1.36× (full); at most 1.08× on symbolic ticks |
| [One cell per scalar](#7-one-cell-per-scalar) (#7) | a point as one value | at most 1.07× |

## Where the design costs time

Three results cut against the current design.

- **The dirty closure loses when most of the document changes.**
  Recomputing only what is downstream of a change (#10) costs about 10 ns
  per instruction, against 2–3 ns for recomputing everything in a tight
  loop. It pays off only when less than about 15–20% of the program is
  downstream of the change. On the benchmark's own shapes, depth and
  breadth, the whole program is downstream of every drag, so the tick
  there is 2.5–4 times slower than full recompute would be. On a page
  where a drag reaches 5% of the document, it is 3–5 times faster.
  See [#10](#10-recompute-only-what-is-downstream).
- **Fine-grained operators cost time under the dirty closure.** Because
  the dirty closure pays its bookkeeping per instruction, running a
  value's whole expression as one unit is 2–2.6 times faster than running
  its instructions one by one, wherever a value lowers to several
  instructions. See [#3](#3-fine-grained-operators).
- **The dirty closure needs early cutoff.** Without early cutoff, the
  dirty closure is slower than full recompute on the document where a
  change stops partway. The two decisions only pay together. See
  [#11](#11-early-cutoff).

Ideas these suggest, none built: fall back to full recompute when a
change reaches most of the program; fuse each value's expression into
one unit; walk a chain directly rather than through the bitset (see
[#10](#10-recompute-only-what-is-downstream)).

## What was not measured

- **wasm and the browser.** All timings are native x86-64 builds, timed
  directly. The browser runs wasm, where the costs per instruction may
  differ, and the benchmark's Node driver adds a fixed 23 µs per tick
  that would hide the smaller effects.
- **Real documents' ticks.** The ticks are timed on synthetic shapes.
  The golden documents and `fixtures/sir.doenet` are measured only by
  the size of their programs (#8).
- **Whole cores built around an alternative.** The five largest
  alternatives (#1, #2 in full, #3, #5, #7) were measured as evaluators
  that change one mechanism on the core's own instructions, not as
  rewritten cores. They measure the mechanism; the cost of a real core
  built that way could be higher.
- **Scrolling.** Lazy and pruned evaluation (#9) were measured with a
  fixed viewport. What they pay when it moves is not measured.
- **Version counters** as an alternative to early cutoff's value
  comparison (#11).

## How the tick works

This section expands the paragraph at the top, with the vocabulary the
rest of the report uses. `ARCHITECTURE.md` and `CONTEXT.md` describe the
core in full; paths here are relative to `crates/cells-core/src/`.

- **Cells.** `Document::cells` is a `Vec<f64>`. Cells are numbered
  essential first, then fixed, then derived, so whether a cell is
  essential is one comparison. A cell holding text or a math expression
  holds an id or a handle into a store outside the array; its type is in
  a side table (`Document::value_types`).
- **Components are only names.** A component's props name cells; a
  component is not a node in the graph and owns no value.
- **Instructions.** `Program::instrs` is the list of instructions, each
  an operator (`Op`, `program/scalar.rs` and `program/vector.rs`) bound
  to its input cells and the cell it writes. A `<math>` of numbers is
  lowered to a chain of small operators when the document is built.
- **References.** `$p.x`, and every prop of a copy that is not
  overridden, share their referent's cell (*aliasing*). A reference is
  not an instruction.
- **The schedule.** `Program::schedule` sorts the instructions once, when
  the document is built, so that every instruction comes after those it
  reads.
- **A tick.** `Document::request` (`document/request.rs`) takes a
  request such as "set this cell to this value". Inversion
  (`tick/invert.rs`) walks back through the operators' inverses to the
  essential cells beneath, which are written. Then an evaluator
  (`tick/eval.rs`) recomputes:
  - **The dirty closure** (`DirtyClosure`, the default) marks the readers
    of each changed cell in a bitset over schedule positions and scans it
    forward, running each marked instruction, so it runs only what is
    downstream of the change.
  - **Full recompute** (`FullRecompute`) runs every instruction in
    schedule order.
  - **Early cutoff:** an instruction whose output did not change marks
    no readers, so a change that stops partway stops the closure there.

## How it was measured

**One decision at a time.** For each decision the alternative was built
and swapped in, with every other decision kept, and timed against the
core on the same machine. An alternative that changes the core is kept
out of it, as a patch in `docs/tick-alternatives/`. An alternative that
only adds a way of evaluating lives in the bench crate as an extra
evaluator, timed beside the core's in the same process. Every
alternative had to leave every value the same as the core, bit for bit:
the harness compares them, and for patches `cargo test --workspace` and
the golden diff (`scripts/golden-diff.sh`) must also pass.

**Where the alternatives are.** The patches and extra evaluators are not
kept in the repository: they were written for this report and would
fall out of date as the core changes. They are at the tag
`cells-tick-alternatives` in `cqnykamp/DoenetML` (commit `8daf609`),
together with the core they were measured against; every path to one in
this report is a path at that tag. To get it:

    git fetch https://github.com/cqnykamp/DoenetML tag cells-tick-alternatives

The shapes and the harness that times them are kept (see
[Tools](#tools)).

**Both evaluators.** Each alternative was timed under full recompute and
the dirty closure. The dirty closure's own bookkeeping costs several
times an instruction (#10), which hides differences per instruction,
such as a type tag, under the default; full recompute shows them.

**Shapes.** `crates/cells-bench/src/shapes.rs` builds synthetic
documents in Rust, so neither node nor the parser is needed. Each is
driven by dragging one point's x between 2 and 3; n is its number of
elements, measured at 10,000 and 100,000.

| Shape | What it is | What the drag reaches | Used for |
|---|---|---|---|
| depth | a chain of n numbers from the point | all of it | the benchmark's shape |
| breadth | n numbers, each reading the point | all of it | the benchmark's shape |
| mixed | 20 graphs, each a point read by a chain and a fan of n/40 numbers | 5%: one graph | a page, closest to real use |
| isolated | one number reads the point; n others read another point | one instruction | #10 |
| chainK | a chain of K% of n numbers; the rest read another point | K% | #10 |
| cutoff | `round($p.x / 10)`, then a chain of n numbers | one instruction, then the change stops | #11 |
| refs | n/2 references to `$p.x` and n/2 copies of `p`, each read by a number | all of it | #8 |
| coords | a chain of n points, each at (x+1, y+1) of the one before | the x chain only | #7 |
| poly | a chain of n numbers, each `($c + 3) / 2 + $c / 2 - 1` of the one before: five instructions per value | all of it | #3 |
| symbolic | as the benchmark's: n simplified `<math>`s in x, evaluated at the end | all of it | #5 |

<a id="tools"></a>**Tools.** In `crates/cells-bench/`:

- `examples/tick_cost.rs` times every shape under a list of evaluators
  (`CELLS_EVALUATORS`), interleaved tick by tick, each on its own copy of
  the document: 3 warm-up ticks and 41 timed, the median reported. It
  checks each shape's values and that every evaluator agrees. As kept, it
  knows the core's two evaluators; at the tag above it also knows the
  alternatives', and `CELLS_WANTED` sets the share of the document a tick
  reads, for #9.
- `scripts/tick-diff.sh [base] [shapes] [sizes]` (in this package)
  builds `tick_cost` at a base commit and in the working tree, runs them
  alternately seven times, and prints the working tree's tick over the
  base's, with whether their values agree.
- `examples/program_size.rs` prints each golden document's cells and
  instructions.

**Noise.** On the shared 4-core machine used (Intel Xeon @ 2.10 GHz,
Linux), a whole process now and then runs fast or slow, so each tick
reported is the median of seven processes' medians. Comparing the core
with itself, most rows agree within 5%. Two rows (breadth at 100,000 and
isolated at 10,000) settle per process at one of two speeds about 20%
apart, and ticks of a few µs (isolated, cutoff) vary by more; read small
differences there as noise.

**Reading the tables.** "Slowdown" and "alternative / core" are the
alternative's tick divided by the core's: above 1, the core's decision
makes the tick faster by that factor; below 1, the alternative is faster.

**Running the tests.** `cargo test` and the golden diff need the parser:
`npm ci --ignore-scripts` at the repository root, then
`npm run build -w packages/parser`.

## The decisions in detail

In order of how much they buy. Each opens with a paragraph on the idea,
the alternative and the result, then says in detail what the core does,
what was measured against it, and what the numbers show.

### 9. A fixed schedule

The core decides the order in which instructions run once, when the
document is built, so a tick only walks a precomputed list. The
alternative is to find the order while the tick runs, as pull-based
reactive systems do: to compute a value, first make sure its inputs are
up to date. Doing the same work, the fixed order is 2 to 5 times faster,
and over a hundred times faster where a change stops early, because it
learns that a value did not change before it touches anything after it.
Pulling lazily can skip what is not on screen, but the fixed schedule,
cut down to what is shown, skips the same work and stays faster.

**The core.** The order of work is fixed when the document is built
(`Program::schedule`). A tick runs forward through it and never works
out an order at run time.

**The alternatives.** Cores that pull values find the order at run
time: to compute a cell, first compute its inputs. Three evaluators in
`crates/cells-bench/src/pull.rs` do that on the core's own cells and
instructions, so only how the next instruction is found differs:

- **ready_all**: every tick, read every derived cell in document order,
  computing what each needs first. It does the same work as full
  recompute.
- **ready_closure**: mark everything downstream of a write stale, then
  bring each stale instruction up to date by demand, running it only if
  an input changed (early cutoff kept). It does the same work as the
  dirty closure.
- **lazy**: pull evaluation proper. A write marks what is downstream
  stale, and stale stays stale until something reads it. The cells a
  renderer shows are watched, as a reactive UI library's effects are,
  and only those reached by a change are brought up to date. Version
  counters skip a stale instruction whose inputs have not changed since
  it last ran.

Lazy computes less when less is shown, so a fourth evaluator separates
showing less from laziness:

- **pruned** (`crates/cells-bench/src/pruned.rs`): the core's dirty
  closure, with its table of readers cut, when the viewport is set, to
  the instructions some shown cell depends on. Its tick loop is the
  core's line for line; with everything shown it took 0.98–1.01 of the
  dirty closure's time.

What a tick shows is a viewport: every prop of the first 100%, 10% or 1%
of the document's components. The dragged point is at the top of every
shape.

**Results.** Times in µs at 100,000, everything shown unless stated:

| Shape | dirty | full | ready_all | ready_closure | lazy 100% | lazy 1% | pruned 1% |
|---|---:|---:|---:|---:|---:|---:|---:|
| depth | 1,382 | 386 | 1,058 | 2,545 | 2,570 | 29.6 | 14.3 |
| breadth | 682 | 327 | 983 | 1,774 | 1,813 | 101 | 9.0 |
| mixed | 47.6 | 270 | 906 | 101 | 99.6 | 27.9 | 11.0 |
| cutoff | 4.6 | 280 | 924 | 2,248 | 2,281 | 24.2 | 0.2 |
| refs | 680 | 339 | 987 | 1,765 | 1,799 | 81.5 | 0.9 |
| coords | 1,432 | 740 | 2,141 | 2,554 | 2,609 | 33.9 | 17.0 |

(The pruned column comes from a separate run of the same harness, so
compare it with lazy at 1% through the ratios below.)

| Shape (100,000) | ready_all / full | ready_closure / dirty | lazy / dirty, 100% shown | 10% | 1% | lazy / pruned, 1% |
|---|---:|---:|---:|---:|---:|---:|
| depth | 2.74 | 1.84 | 1.86 | 0.19 | 0.02 | 1.95 |
| breadth | 3.00 | 2.60 | 2.66 | 0.35 | 0.14 | 10.4 |
| mixed | 3.35 | 2.13 | 2.09 | 2.05 | 0.58 | 1.97 |
| cutoff | 3.30 | 488 | 495 | 77.6 | 9.4 | 70 |
| refs | 2.91 | 2.60 | 2.65 | 0.11 | 0.11 | 83.5 |
| coords | 2.89 | 1.78 | 1.82 | 0.19 | 0.03 | 1.91 |

At 10,000: ready_all / full 2.63–5.08, ready_closure / dirty 1.81–2.34
(112 on cutoff). The full tables are in
[Appendix: all results](#appendix-all-results).

**What it shows.**

- Finding the order at run time costs about 7–9 ns per instruction,
  against 2–4 ns for running a fixed order: readiness checking looks at
  each input's producer before running an instruction, and keeps a
  stack.
- Invalidating, then evaluating, pays twice: once to mark what is
  downstream stale, once to bring it up to date. That makes it about
  twice the dirty closure, which does the same work in one pass.
- Where a change stops early (cutoff), the fixed schedule wins by
  110–870 times. It computes in order, so it learns that `round` did not
  change before marking anything after it. Invalidation must mark the
  whole chain stale before any value is known, and then visit every
  stale instruction, even though none needs to run.
- Lazy pull wins by as much as what is not shown, 47 times on depth with
  1% shown. But pruned push wins more: about 2 times faster than lazy on
  chains and the page, and up to 10 and 90 times on the fans (breadth,
  refs), where lazy's
  invalidation still walks every unread reader each tick. A lazy core
  that unsubscribes what nothing watches (as MobX suspends an unobserved
  computed value) would close that gap to about 2 times, which is
  pruning by another name.
- So with the same work skipped, the fixed push schedule is about twice
  as fast as pulling, and far faster where a change stops early. What a
  viewport saves comes from computing less, which either design can do.

Not measured: changing what is shown. Pruned must rebuild its table and
compute what came into view; lazy computes it when read.

`testing/reference.rs`, the core's test oracle, was not used as the
alternative: it allocates a full scratch array per instruction and
recurses once per link, so it measures those, not pulling.

### 8. References share a cell

When one value refers to another, such as `$p.x` or a prop of a copy,
the core gives both the same cell instead of copying one into the
other, so a reference costs a tick nothing. The alternative makes every
reference an instruction that copies its source's value. References are
most of what a document says, so that doubles the instructions on the
synthetic shapes, and the tick's time with them, and gives a real
document of geometry five times as many instructions.

**The core.** `$p.x`, and every prop of a copy that is not overridden,
share the referent's cell, merged by a union-find in `build/emit.rs`. A
reference adds no instruction and no step to a tick.

**The alternative** (`docs/tick-alternatives/8-identity-instructions.patch`).
Every alias becomes an instruction of a new operator, `Id(a)`, that
copies its referent's value; its inverse writes straight through. Every
reference gets its own cell.

Three places outside the tick took "the same cell" to mean "equal by
construction", and had to learn to follow a copy back to its source
(`Document::source_cell`, added by the patch): which input an answer
reads (`answer_inputs` listed inputs twice), which cells are interactive
(a copy of an input was not), and sticky groups (a shape stuck to its
own vertices, and a copied group did not snap). With those fixed, every
value matches. 29 tests fail, all checking structure that this decision
creates: cell and instruction counts, two props sharing a cell, and the
specs' cost snapshots.

**Results.** Instructions, with aliasing → with identity instructions
(`examples/program_size.rs`):

| Document | Instructions | × |
|---|---|---:|
| the 11 golden documents | 275 → 581 | 2.1 |
| `fixtures/sir.doenet` | 2,829 → 14,538 | 5.1 |
| polygons (golden) | 5 → 57 | 11.4 |
| sticky (golden) | 1 → 41 | 41 |

Ticks, identity instructions / aliasing:

| Shape | n | Instructions | full | dirty |
|---|---:|---|---:|---:|
| depth | 100,000 | 100,000 → 200,000 | 1.93 | 1.95 |
| breadth | 100,000 | 100,000 → 200,000 | 2.09 | 2.44 |
| mixed | 100,000 | 100,000 → 200,000 | 2.07 | 2.13 |
| coords | 100,000 | 200,000 → 400,000 | 2.08 | 1.96 |
| refs | 10,000 | 10,000 → 40,000 | 6.32 | 5.28 |
| refs | 100,000 | 100,000 → 400,000 | 4.52 | 4.78 |

**What it shows.** References are most of what a document says: every
`$x` in a math, every attribute given by reference, every prop of a
copy. Without aliasing each is an instruction, and a tick does that much
more work at the same cost per instruction: twice on the shapes, where
each number's `$x` is a reference, and five times as many instructions
on `sir.doenet`, whose geometry is mostly copies. Aliasing also carries
meaning the core relies on elsewhere, as the three fixes show.

### 2. Operators are data

Each operator in the core is a small piece of data, and one loop
interprets them all; no component code runs during a tick. The
alternative makes operators code: a function called through a pointer, a
closure per instruction, or, as in the JavaScript core, a function per
state variable that looks up its inputs by name. Calling code costs 1.2
to 5 times as much as interpreting data, mostly because the processor
can overlap independent steps written as data but cannot see through a
call. The JavaScript core's model costs 2 to 12 times, even simplified.

**The core.** An operator is a value of a closed enum (`Op`), and one
function, `Program::step`, interprets it with a `match`. Components only
choose and wire operators when the document is built; no component code
runs in a tick. Each operator carries its inverse, so inversion is
generic too.

**The alternatives.** Operators as code, as in the JavaScript core,
where each component writes its state variables as functions. Measured
three ways, from the dispatch alone to a lower bound on the full model:

- **A function pointer per operator kind**
  (`docs/tick-alternatives/2-operators-as-fn-pointers.patch`): the call
  through a pointer, alone.
- **A closure per instruction**
  (`docs/tick-alternatives/2-operators-as-closures.patch`): an
  `Rc<dyn Fn>` capturing its input cells, so each is also a heap
  allocation of its own.
- **State-variable functions** (`functions` in
  `crates/cells-bench/src/grouped.rs`): one boxed function per value.
  Before each run, the function's dependencies are looked up by key in a
  hash map and gathered into a fresh map of values; it reads them by key
  and returns its outputs in a fresh vector, which are then compared and
  written. The arithmetic is still the core's instructions, so this is a
  lower bound: it leaves out interpreting formulas and finding
  dependencies by name.

The first two are generated from each operator's own formula, so they
are code specialized to the operator, not a wrapper around the `match`.

**Results.** Alternative / core:

| Shape | n | pointer, full | closure, full | pointer, dirty | closure, dirty | functions, dirty |
|---|---:|---:|---:|---:|---:|---:|
| depth | 10,000 | 1.61 | 1.54 | 0.99 | 0.93 | 8.32 |
| depth | 100,000 | 1.46 | 1.69 | 1.00 | 0.91 | 6.73 |
| breadth | 10,000 | 2.03 | 4.87 | 1.18 | 1.87 | 10.9 |
| breadth | 100,000 | 1.41 | 4.32 | 1.16 | 2.32 | 8.79 |
| mixed | 100,000 | 1.22 | 3.32 | 0.85 | 1.77 | 12.1 |
| refs | 10,000 | 2.12 | 5.12 | 1.19 | 2.08 | 10.9 |
| coords | 100,000 | 1.53 | 1.78 | 0.97 | 1.06 | 8.40 |
| poly | 100,000 | — | — | — | — | 2.66 |

Against the same units run as data, the functions cost 3.9–9.5 times.

**What it shows.**

- Under full recompute, where the instructions' own cost shows, calling
  through a pointer costs 1.2–2.5 times, and a closure per instruction
  1.5–5 times. The cost is largest where instructions are independent
  (breadth, refs): with data, the processor overlaps many of them at
  once, but it cannot see through a call. On a chain each instruction
  waits on the one before anyway, and the call adds less.
- The closures' extra cost over pointers on fans is the allocation per
  instruction: each closure's captures sit in their own place on the
  heap.
- Under the dirty closure, whose bookkeeping dilutes the cost, pointers
  cost at most 19% and closures up to 2.3 times. On depth the closures
  came out 7–9% faster; not explained.
- The state-variable model costs 2–12 times the core's dirty closure even
  as a lower bound: two hash maps and a vector per evaluation, and a
  lookup per dependency, against a few arithmetic instructions.

### 4 and 1. One contiguous array, apart from the graph

The core keeps every value in one array, side by side in memory, and
keeps the graph of which instruction reads which cell in separate arrays
beside it. The alternatives give each value its own heap allocation, or
put each value in a graph node together with its links. Either way,
every read follows a pointer to wherever the value happens to live. When
the values are scattered in memory, as objects created over a session
would be, that costs 2.4 to 3 times on large documents; nodes cost 1.4
to 3.1 times.

Two related decisions, both about where values live.

**The core.** All values are in one `Vec<f64>`, indexed by cell (#4).
The graph (instructions, each cell's producer and readers) lives in
separate arrays beside it, and no node owns a value (#1).

**The alternatives.**

- **A heap allocation per value** (#4,
  `docs/tick-alternatives/4-allocation-per-value.patch`): the cells
  become a vector of `Box<f64>`, so every read follows a pointer. Where
  the allocations land decides most of the cost, so two forms: values
  allocated in cell order, which the allocator lays nearly side by side,
  and values allocated in a shuffled order, scattered as objects made
  over a session would be (the patch as saved; set `SHUFFLE` to switch).
- **A value per node** (#1, `crates/cells-bench/src/nodes.rs`): a heap
  node per cell, scattered the same way, holding its value, its
  instruction and its own list of readers. A tick reads every input from
  its node and marks readers from the node's list. It keeps the core's
  fixed order, so what differs is where values and edges live. (The
  operators read cells by index, so the evaluator copies each input from
  its node into the array just before use: one extra write per input.)

**Results.** Alternative / core:

| Shape | n | in order, full | scattered, full | scattered, dirty | nodes, dirty |
|---|---:|---:|---:|---:|---:|
| depth | 10,000 | 1.18 | 1.32 | 1.03 | 1.84 |
| depth | 100,000 | 1.15 | 2.38 | 1.31 | 1.41 |
| breadth | 10,000 | 1.61 | 2.21 | 1.30 | 2.57 |
| breadth | 100,000 | 1.53 | 2.79 | 2.24 | 2.58 |
| mixed | 100,000 | 1.64 | 2.93 | 1.97 | 3.11 |
| refs | 100,000 | 1.83 | 2.70 | 2.17 | 2.45 |
| coords | 100,000 | 1.20 | 3.00 | 1.58 | 2.28 |
| poly | 100,000 | — | — | — | 2.77 |

**What it shows.** A pointer per value costs 1.04–1.8 times when the
values happen to lie in order, and 2.4–3 times at 100,000 when they are
scattered, the largest cost of any storage alternative: each scattered
read is likely a cache miss of its own, where contiguous cells share
cache lines (not profiled). Values and edges in nodes cost 1.4–3.1 times
under the dirty closure, most on fans and the page. A core built around
nodes usually also finds its order by walking them, which #9 measured at
about twice more.

### 11. Early cutoff

When an instruction recomputes and gets the same value as before, the
core does not recompute the instructions that read it. The alternative
recomputes everything downstream of a change, whether or not values
along the way changed. Where a change stops partway, as when a value is
rounded, early cutoff makes the tick hundreds of times faster, and it is
what lets the dirty closure (#10) beat full recompute there. Where every
value changes it saves nothing, and its checks cost up to 10%.

**The core.** An instruction's readers are marked only when its output
actually changed (`differs` in `program/mod.rs`; NaN to NaN counts as
unchanged).

**The alternative** (`docs/tick-alternatives/11-no-cutoff.patch`): the
dirty closure marks the readers of every instruction it runs, changed or
not.

**Results.** Alternative / core, dirty closure (full recompute marks no
readers, so it is unaffected and served as a control):

| Shape | n | Core (µs) | No cutoff (µs) | No cutoff / core |
|---|---:|---:|---:|---:|
| cutoff | 10,000 | 0.2 | 94 | 423 |
| cutoff | 100,000 | 1.9 | 1,216 | 645 |
| depth | 10,000 | 108 | 97 | 0.90 |
| coords | 100,000 | 1,403 | 1,285 | 0.92 |
| breadth, refs, mixed, isolated | both | | | 0.97–1.05 |

**What it shows.** On cutoff, early cutoff is the whole tick: with it,
the dirty closure runs one instruction, the `round`; without it, all
100,000, and it becomes 4.6 times slower than full recompute. So the
dirty closure (#10) pays off on such a document only because of early
cutoff. Where every value changes there is nothing to cut off, and
cutoff's bookkeeping costs 5–10% on chains. The value comparison itself
stays in both versions, since a tick reports which cells changed;
version counters, which would replace it, were not measured.

### 10. Recompute only what is downstream

After a change, the core recomputes only the instructions downstream of
it, tracking which ones in a bitset. The alternative is to recompute
every instruction. The tracking makes each instruction several
times as expensive, so it pays only when less than about 15–20% of the
program is downstream of the change. On the benchmark's shapes, where
everything is downstream, it is 2.5 to 4 times slower than recomputing
everything; on a page where a drag reaches 5% of the document, it is 3
to 5 times faster. Tracking with a priority queue instead of a bitset is
several times slower where a change fans out.

**The core.** The dirty closure (`DirtyClosure`, `tick/eval.rs`): the
instructions to run are a bitset over schedule positions, scanned
forward a word at a time, with each cell's readers in a precomputed
table.

**The alternatives.**

- **Full recompute** (`FullRecompute`, already in the core, selected
  with `set_evaluator("full")`): run every instruction.
- **A priority queue** (`docs/tick-alternatives/10-priority-queue.patch`):
  the same closure, with the instructions waiting to run in a min-heap
  of schedule positions instead of a bitset.

**Results.** Full recompute / dirty closure, by how much of the program
is downstream of the drag:

| Downstream | Shape | n = 10,000 | n = 100,000 |
|---|---|---:|---:|
| all of it | depth | 0.26 | 0.30 |
| all of it | breadth | 0.42 | 0.39 |
| 50% | chain50 | 0.46 | 0.45 |
| 25% | chain25 | 0.70 | 0.84 |
| 10% | chain10 | 2.0 | 1.7 |
| 5% | mixed | 3.3 | 5.2 |
| 1% | chain1 | 10.4 | 14.2 |
| one instruction | isolated | 66 | 247 |

Priority queue / bitset:

| Shape | n = 10,000 | n = 100,000 |
|---|---:|---:|
| breadth | 3.49 | 4.83 |
| refs | 5.45 | 4.72 |
| mixed | 2.37 | 3.64 |
| depth | 0.91 | 0.90 |
| coords | 0.90 | 0.96 |

**What it shows.**

- The dirty closure costs about 10 ns per instruction on a chain and
  6 ns on a fan, against 2–3.5 ns for full recompute: full recompute is
  a tight loop over the schedule, while the closure also looks up each
  changed cell's readers and sets and scans their bits. So the closure
  pays for itself only when less than about 15–20% of the program is
  downstream of a change, and below that it wins by as much as the
  program is large.
- Neither benchmark shape (depth, breadth) measures what the closure is
  for: both put the whole program downstream of the drag, so those ticks
  are about 3 times slower than full recompute would be. On mixed, where
  a drag reaches 5% of a page, the closure is 3–5 times faster.
- The bitset beats a priority queue by 2.4–5.5 times where a change fans
  out: a heap pays O(log n) per push and pop, about 33 ns per instruction
  on breadth, against about 7 for the bitset. On a chain the heap holds
  one entry and is 4–10% faster; a closure that walked chains directly
  could take that back.
- The queue saves only 10% of the closure's cost on chains, so most of
  the gap to full recompute is in what both keep: the readers lookup,
  the change test and the list of changed cells (not profiled).

### 6. Values carry no type tag

The core stores every value as a bare 64-bit float, with nothing beside
it saying what kind of value it is; types live in a separate table,
consulted when a request arrives and never while recomputing. The
alternative stores a type tag with each value and checks it on every
read, as a tagged enum would. The check costs 10 to 55% when every
instruction runs; under the default dirty closure, whose bookkeeping
dominates, it costs up to a third on fans and little on chains.

**The core.** Nothing stored with a value says what type it is. A
boolean is 0.0 or 1.0, a missing value is NaN, and a cell's type is in a
side table read when a request arrives, never during recompute.

**The alternatives.** A tagged enum, such as `Number | Text | Math |
Missing`, is both a tag and a bigger cell (16 bytes), so three
alternatives separate the two, each built on a patch that gives the
cells a type of their own (`docs/tick-alternatives/4-6-cells-type.patch`,
which on its own changes no time beyond noise):

- **16-byte cells with no tag** (`5-16-byte-cells.patch`): size alone.
- **A tag array** (`6-tag-array.patch`): 8-byte cells plus a byte per
  cell, checked on every read.
- **A tagged enum** (`6-tagged-enum.patch`): both, matched on every read.

**Results.** Alternative / core, full recompute:

| Shape | n | 16 bytes, no tag | tag array | tagged enum |
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

Under the dirty closure: 16 bytes at most 1.08; tag array and enum up to
1.34 on fans, within 7% on chains.

**What it shows.** The check on every read costs more than the size: a
tag adds a load, a compare and a branch to every operand read, and that
cost hardly shrinks at 100,000, where the size's does. The enum costs
about what the tag alone does, not the two added together, probably
because its tag sits next to its value in the same cache line (not
profiled). So untagged values save 12–55% of full recompute, mostly by
skipping the check.

### 5. Every cell is 8 bytes

Every cell is the same 8 bytes. Values that do not fit, such as math
expressions and strings, are stored elsewhere and the cell holds a
handle to them. The alternatives are bigger cells, of 16 bytes, and
expressions stored in their cells at their own length. Bigger cells cost
5 to 36% when every instruction runs; storing expressions inline costs
at most 8% on symbolic documents, whose time is the symbolic engine's
work.

**The core.** Every cell is one 8-byte slot. Large values (expressions,
strings) live in stores outside the array, and a cell holds a handle; a
value of several parts takes several cells.

**The alternatives.** 16-byte cells measure size alone (see #6: 1.05–1.36
times under full recompute). For values of varying size,
`crates/cells-bench/src/inline.rs` (`inline`) keeps each math cell's
expression also as bytes of its own length, as a cell holding its
expression inline would: decoded before every symbolic instruction reads
it, encoded after every write. The engine still does the work through
handles, so this measures what inline storage would add.

**Results.** On the symbolic shape, inline / core: 1.01–1.08 at n = 100
(1,881 → 1,966 µs) and 1.04–1.08 at n = 1,000 (18,970 → 19,974 µs).

**What it shows.** Moving an expression's bytes costs far less than the
symbolic engine's work, so holding expressions by handle is not what
keeps symbolic ticks fast; their time is the engine's (ADR 0011). Read
the 8% as an upper bound: the same evaluator also cost 1.3 times on
breadth and refs, which have no math cells, unexplained.

### 7. One cell per scalar

A point's x and y are two cells, so a change to x reaches only what
reads x. The alternative makes a point one value, so a change to either
coordinate recomputes both and reaches the readers of both. That costs
at most 7%: this decision is about simpler operators, not speed.

**The core.** A point is two cells; a change to its x reaches only the
readers of x.

**The alternative** (`compound` in `crates/cells-bench/src/grouped.rs`):
a point's coordinates are one value. The instructions writing a point's x
and y run together, and when either changes, the readers of both are
marked.

**Results.** On coords, the shape that drags a point's x alone,
compound / one cell per scalar is 1.07 at 10,000 and 1.05 at 100,000;
1.00 on shapes with no computed point.

**What it shows.** Running both coordinates costs twice the instructions
but only 5–7% of the tick, because under the dirty closure the
bookkeeping per unit dominates. One cell per scalar buys little time;
its value is in operators and inverses that need no vector forms.

These numbers come from the group evaluator described under #3; they are
measured against the same evaluator with every instruction its own unit.

### 3. Fine-grained operators

Each derived cell is computed by one small operator, so a math
expression becomes a chain of several instructions. The alternative runs
each value's whole expression as one unit. The dirty closure pays its
bookkeeping per instruction, so coarse units are 2 to 2.6 times faster
wherever a value lowers to several instructions, and no different
elsewhere. This is one place the design costs time.

**The core.** One small instruction per derived cell (`Add`, `Scale`,
`Clamp`, ...); a numeric `<math>` lowers to a chain of them (ADR 0005).

**The alternative** (`expression` in `crates/cells-bench/src/grouped.rs`):
coarse operators, one per value. The group evaluator runs units of
instructions: when anything a unit reads changes, all its instructions
run, and only then are the readers of its changed outputs marked. Here
each value's lowered expression is one unit.

The group evaluator is not the core's dirty closure: with every
instruction its own unit (`single`, the control) it is 1.15–1.45 times
slower than the core's. So coarse units are measured against `single`.

**Results.** Times in µs:

| Shape | n | core's dirty | single | expression (coarse) | coarse / single |
|---|---:|---:|---:|---:|---:|
| poly | 10,000 | 618 | 822 | 319 | 0.39 |
| poly | 100,000 | 7,740 | 9,727 | 4,922 | 0.51 |
| depth | 100,000 | 1,341 | 1,662 | 1,661 | 1.00 |
| breadth | 100,000 | 687 | 970 | 965 | 0.99 |
| mixed | 100,000 | 48.2 | 67.2 | 62.2 | 0.92 |

**What it shows.** On poly, where a value is five instructions, running
each value as one unit is 2–2.6 times faster, and still 1.6–1.9 times
faster than the core's own dirty closure: the closure's bookkeeping is
paid once per value instead of five times. Elsewhere a value is one
instruction and nothing changes. So under the dirty closure the fine
grain costs time wherever a value lowers to several instructions. What it
buys was not measured: inverses for each primitive, and early cutoff
inside an expression, which a unit gives up.

## Appendix: how the decisions depend on each other

```
1 one store, apart from the graph
├── 2 operators are data
│   └── 3 fine-grained operators
├── 4 contiguous
│   └── 5 uniform 8-byte cells
│       ├── 6 untagged f64
│       └── 7 one cell per scalar   (in practice also 6)
├── 8 references share a cell
└── 9 fixed schedule               (also 2)
    └── 10 downstream only
        └── 11 early cutoff        (also 6)
```

Each alternative changed one decision and kept the rest. Some pairs
interact: with full recompute instead of the dirty closure (#10), early
cutoff (#11) matters much less; with nodes instead of one store (#1),
contiguity (#4) no longer applies.

## Appendix: all results

Every alternative's tick over the core's, at the four sizes most rows
share, with notable other rows. Above 1, the core's decision makes the
tick faster. Medians of seven processes (three for full recompute's
first measurement).

| # | Decision | Alternative (and what it is measured against) | depth 10k | breadth 10k | depth 100k | breadth 100k | Other |
|---|---|---|---|---|---|---|---|
| 1 | one store, apart from the graph | a value per node (dirty closure) | 1.84 | 2.57 | 1.41 | 2.58 | mixed-100k: 3.11; poly-100k: 2.77 |
| 2 | operators are data | a closure per instruction (full) | 1.54 | 4.87 | 1.69 | 4.32 | isolated-100k: 4.72; mixed-100k: 3.32 |
| 2 | operators are data | a closure per instruction (dirty) | 0.93 | 1.87 | 0.91 | 2.32 | mixed-100k: 1.77; refs-100k: 2.12 |
| 2 | operators are data | a function pointer per operator (full) | 1.61 | 2.03 | 1.46 | 1.41 | isolated-100k: 1.43; mixed-100k: 1.22 |
| 2 | operators are data | a function pointer per operator (dirty) | 0.99 | 1.18 | 1.00 | 1.16 | mixed-100k: 0.85; refs-100k: 1.15 |
| 2 | operators are data | state-variable functions, lower bound (the same units as data) | 6.76 | 7.83 | 7.32 | 6.64 | mixed-100k: 9.49; poly-100k: 4.12 |
| 2 | operators are data | state-variable functions, lower bound (dirty) | 8.32 | 10.9 | 6.73 | 8.79 | mixed-100k: 12.1; poly-100k: 2.66 |
| 3 | fine-grained operators | coarse units (a unit per instruction) | 1.00 | 1.00 | 1.00 | 0.99 | poly-10k: 0.39; poly-100k: 0.51 |
| 4 | contiguous | an allocation per value, in order (full) | 1.18 | 1.61 | 1.15 | 1.53 | refs-10k: 2.84; mixed-100k: 1.64 |
| 4 | contiguous | an allocation per value, scattered (full) | 1.32 | 2.21 | 2.38 | 2.79 | coords-100k: 3.00; mixed-100k: 2.93 |
| 4 | contiguous | an allocation per value, scattered (dirty) | 1.03 | 1.30 | 1.31 | 2.24 | refs-100k: 2.17; mixed-100k: 1.97 |
| 5 | 8-byte cells, expressions by handle | expressions stored inline, upper bound (dirty) | — | — | — | — | symbolic-100: 1.06; symbolic-1000: 1.06 |
| 6 | untagged `f64` | 16 bytes, no tag (full) | 1.05 | 1.24 | 1.13 | 1.08 | refs-10k: 1.36; mixed-10k: 1.30 |
| 6 | untagged `f64` | 16 bytes, no tag (dirty) | 1.01 | 1.04 | 1.03 | 1.07 | refs-100k: 1.08 |
| 6 | untagged `f64` | tag array (full) | 1.12 | 1.50 | 1.32 | 1.32 | isolated-10k: 1.45; mixed-100k: 1.33 |
| 6 | untagged `f64` | tag array (dirty) | 0.99 | 1.22 | 1.02 | 1.32 | refs-100k: 1.34; mixed-100k: 1.11 |
| 6 | untagged `f64` | tagged enum (full) | 1.25 | 1.54 | 1.23 | 1.28 | refs-10k: 1.55; mixed-100k: 1.23 |
| 6 | untagged `f64` | tagged enum (dirty) | 1.04 | 1.25 | 0.98 | 1.32 | refs-100k: 1.28; mixed-100k: 1.13 |
| 7 | one cell per scalar | compound values (a unit per instruction) | 1.00 | 0.99 | 1.00 | 0.99 | coords-10k: 1.07; coords-100k: 1.05 |
| 8 | references share a cell | identity instructions (dirty) | 2.17 | 2.68 | 1.95 | 2.44 | refs-100k: 4.78; mixed-100k: 2.13 |
| 8 | references share a cell | identity instructions (full) | 2.30 | 2.89 | 1.93 | 2.09 | refs-100k: 4.52; mixed-100k: 2.07 |
| 9 | fixed schedule | readiness checking, every cell (full) | 2.64 | 2.75 | 2.74 | 3.00 | mixed-100k: 3.35 |
| 9 | fixed schedule | readiness checking, invalidated (dirty) | 1.92 | 2.34 | 1.84 | 2.60 | mixed-100k: 2.13; cutoff-100k: 488 |
| 9 | fixed schedule | lazy pull, all shown (dirty) | 1.95 | 2.38 | 1.86 | 2.66 | mixed-100k: 2.09; cutoff-100k: 495 |
| 9 | fixed schedule | lazy pull, 1% shown (dirty) | 0.05 | 0.17 | 0.02 | 0.14 | mixed-100k: 0.58; cutoff-100k: 9.4 |
| 9 | fixed schedule | lazy pull, 1% shown (dirty closure pruned to what is shown) | 1.80 | 7.69 | 1.95 | 10.4 | mixed-100k: 1.97; cutoff-100k: 70; refs-100k: 83 |
| 10 | downstream only | full recompute | 0.26 | 0.42 | 0.30 | 0.39 | mixed-100k: 5.2; isolated-100k: 247; chain10-100k: 1.7 |
| 10 | bitset | priority queue | 0.91 | 3.49 | 0.90 | 4.83 | mixed-100k: 3.64; refs-100k: 4.72; coords-100k: 0.96 |
| 11 | early cutoff | marking every reader (dirty) | 0.90 | 1.02 | 0.95 | 1.05 | cutoff-100k: 645; coords-100k: 0.92 |

### Every shape, the core's two evaluators

The core's own ticks, in µs, from the run that measured the noise floor:

| Shape | n | dirty closure | full recompute |
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

## Appendix: notes on particular measurements

- **#8's 29 failing tests** are structural: cell or instruction counts
  (`build.rs`, `math.rs`, `repeat.rs`), two props sharing one cell
  (`boolean.rs`, `build.rs`, `slider.rs`, `symbolic.rs`,
  `text_input.rs`), the operators a math lowers to (`math.rs`), the
  number of cells a tick reports changed (`requests.rs`), and the specs'
  cost snapshots (circle, line, polygon, segment, slider). The golden
  diff matches in every value.
- **#10's priority queue** on refs at 10,000 (5.45) is flattered: the
  core's run landed in that row's fast mode; at its usual time the ratio
  is about 4.3.
- **#6's tagged enum** first gave coords at 100,000 as 0.80 and 0.92; a
  rerun gave 1.02 and 1.13, shown, so the first was noise.
- **#3 and #7's group evaluator**: a first version marked readers through
  a different loop in `compound` mode and came out 15–25% faster than
  `single` even with identical units; with one loop for both, the two
  agree within 3% where the units are the same. The numbers shown are
  from the fixed version.
- **The evaluators of #1, #2 (functions), #3, #5 and #7** ran with up to
  eight copies of each document in memory, so their absolute times at
  100,000 are somewhat higher than elsewhere in this report; each ratio
  compares evaluators of the same processes.
- **#4's in-order form** on refs at 10,000 (2.84) is a row the noise
  floor marks as unsteady.

## Appendix: files

Kept in the repository:

| File | What it is |
|---|---|
| `crates/cells-bench/src/shapes.rs` | the synthetic documents |
| `crates/cells-bench/examples/tick_cost.rs` | times shapes under the core's evaluators |
| `crates/cells-bench/examples/program_size.rs` | golden documents' program sizes (#8) |
| `scripts/tick-diff.sh` | a base commit against the working tree |

Everything, at the tag `cells-tick-alternatives`:

| File | What it is |
|---|---|
| `crates/cells-bench/src/shapes.rs` | the synthetic documents |
| `crates/cells-bench/examples/tick_cost.rs` | times shapes under evaluators |
| `crates/cells-bench/examples/program_size.rs` | golden documents' program sizes (#8) |
| `scripts/tick-diff.sh` | a base commit against the working tree |
| `crates/cells-bench/src/pull.rs` | `ready_all`, `ready_closure`, `lazy` (#9) |
| `crates/cells-bench/src/pruned.rs` | `pruned` (#9) |
| `crates/cells-bench/src/grouped.rs` | `single`, `expression` (#3), `compound` (#7), `functions` (#2) |
| `crates/cells-bench/src/nodes.rs` | `nodes` (#1) |
| `crates/cells-bench/src/inline.rs` | `inline` (#5) |
| `docs/tick-alternatives/2-operators-as-fn-pointers.patch`, `2-operators-as-closures.patch` | #2 |
| `docs/tick-alternatives/4-6-cells-type.patch` | a type for the cells; the base for the four below |
| `docs/tick-alternatives/4-allocation-per-value.patch` | #4 |
| `docs/tick-alternatives/5-16-byte-cells.patch`, `6-tag-array.patch`, `6-tagged-enum.patch` | #6 (and #5's size) |
| `docs/tick-alternatives/8-identity-instructions.patch` | #8 |
| `docs/tick-alternatives/10-priority-queue.patch` | #10 |
| `docs/tick-alternatives/11-no-cutoff.patch` | #11 |

To measure a patch, at that tag: `git apply` it (the cell-type
patches on top of `4-6-cells-type.patch`), commit it locally, and run
`scripts/tick-diff.sh` with the commit before it as the base. To measure
an evaluator, at that tag: `CELLS_EVALUATORS=dirty,full,<name> cargo
run --release -p cells-bench --example tick_cost` (the example as kept
names the core's two `dirty-closure` and `full`, as `set_evaluator`
does). To measure a change
to the core now, make it in the working tree and run
`scripts/tick-diff.sh`.
