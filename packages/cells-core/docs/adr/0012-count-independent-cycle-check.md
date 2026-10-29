# Cycles are rejected for every iteration count, not the count at load

Status: accepted 2026-10-16.

The cycle check runs on the template graph with every indexed reference
assumed to land on a real iteration, so a document that is acyclic at the
count the author tested but cyclic at a count a student can reach is
rejected at load. A count that reads a cell inside its own iterations is
rejected at load for the same reason, instead of failing after eight
rebuild passes. Today the only check is the topological sort of the stamped
graph (ADR 0004), and an indexed reference past the current count has no
edge at all because it resolves to the missing referent; the three documents
under Outcome load cleanly and then wedge on a student's second interaction.

We chose this because a rebuild happens inside a tick, where there is no
author to read the error (ADR 0004). A failed rebuild leaves the old
structure in place but the essential write has landed, so the input shows
the new count while the old iterations remain and every later structural
tick fails the same way. The author cannot be asked to test every count.
The template graph has one node per template slot rather than per
iteration, so the check costs a small fraction of one build pass and runs
once, since rebuilds change counts but never templates.

## The check

- It runs once per load, before the first build pass, on documents with
  a repeat; without one the structure never changes and the schedule's
  own check is complete. `LoadOptions::check_cycles` switches it off, for
  measuring. (Since 2026-10-18 the probe also runs for a document with a
  select, a document with neither runs the same loop check on its one
  build, so the compile finds every cycle and the schedule's check only
  guards against core bugs; `check_cycles` exists only with the crate's
  `testing` feature.)
- It is a *probe* expansion of the compiled templates (`build/probe.rs`):
  every repeat gets exactly one iteration, so each template slot exists
  once, and an index past that iteration lands in it instead of on the
  missing referent. The probe builder is discarded after the check.
- Every reference edge is labelled with how it moves through the
  iterations: one coordinate per level of nesting of its target, each
  either *kept* with a shift or *reset*. `$r[$i-2].x` written inside `r`
  keeps the position with a shift of minus two; a bare `$x` keeps it with
  no shift; `$r[2].x`, an index with another level's iteration index, a
  pick of a select, and a copy a collect gathers reset it. A reference from
  inside a repeat out to a document-level slot has no coordinate to keep.
  Edges that are not references (a section's credit reading an answer in an
  iteration, a gate) keep the position they share with their target and
  reset the rest.
- A `functionIterates` body carries both its first-iteration and its
  later-iteration sources in the probe, so the recurrence edge is seen.
- A strongly connected component of the probe graph is a cycle when, in
  every coordinate shared by all its nodes that no edge of it resets, a
  closed walk of zero total shift exists. In one coordinate that is exactly
  when the component has a loop of non-positive and a loop of non-negative
  total shift (two loops of opposite sign combine to zero), decided by
  Bellman-Ford with the shifts scaled; a component whose shifts are all
  zero is a cycle outright. A coordinate some edge resets is taken as free.
  Across several nested coordinates the test is made per coordinate, which
  can report a loop that no single count realizes, never miss one. A loop
  whose total is nonzero is a recurrence marching through the iterations
  and remains legal, so the lagged recurrence tests in `tests/repeat.rs`
  keep passing.
- A count whose inputs reach a slot inside a repeat's iterations is an
  edge between the two repeats, and a loop on that graph, a count reading
  its own iterations included, is a cycle, `Error::Cycle` naming a repeat
  on it; the probe's one iteration makes the read visible whatever the
  count at load. A repeat nested inside the one it reads adds no edge: an
  inner count may read its outer iteration.
- So the probe can see those reads: a collect's count (a polyline's
  `numVertices`) reads the counts of the repeats it gathers from, instead
  of being the constant the build makes it; and a select inside a repeat
  body expands every option, since each iteration draws its own, with one
  stand-in per interface name whose edges into the options reset the pick.
  A select outside any repeat probes its real pick.
- The prefill rule (a seed must name a value that is not computed), which
  the build applies at emit, is applied in the probe from the resolved
  sources, so a referent past the count at load is checked as the
  iteration it would name.
- Caps are ignored: a loop is reported at any count that would close it.

## Considered options

- Keep the stamped-graph check and report a failed rebuild as a tick error.
  This is what exists. Rejected: the student, not the author, sees the
  error, and the document is left with an input value its structure does
  not match.
- Check the stamped graph at every count up to the cap at load. Rejected:
  a cap of ten thousand means ten thousand builds, and a document with two
  repeats needs their product.
- Roll back the essential write when a rebuild fails, so the document stays
  consistent. Not enough on its own: the student still cannot reach the
  count, with no explanation. Worth doing as well; it is the subject of a
  separate change.
- Let a missing referent break a loop, as it does now, but warn when an
  index could ever be in range. Rejected: a warning at load is read by the
  same author who did not test that count.

## Consequences

- A document that is acyclic only because an index is always out of range
  is rejected. No fixture or golden document relies on this.
- The lagged recurrence `x[i] = f(x[i-1])` stays legal; the two-sided
  neighbor form `x[i] = x[i-1] + x[i+1]` becomes a load error at any count,
  where today it loads at count one.
- Reactive choices are unaffected: every branch is built and a flip is an
  ordinary tick (ADR 0009). A load-time choice outside a repeat fixes the
  graph per seed, so a cycle inside one option is caught at load for the
  students who draw it, and the rest are not told; inside a repeat every
  option is checked, since a later iteration may draw it. (Since ADR 0014's
  amendment every option of every select is checked at load.)
- Dynamic indices (`$r[$k]`) remain rejected at compile time. Admitting
  them would make every loop through such an edge a cycle, since its
  offset is unknown; that is a decision for when they are wanted.
- `CONTEXT.md`: a cycle is rejected at load time for every iteration
  count, never only the count at load.

## Outcome

Probed against the core on 2026-10-16, before the change. Each loads and
then fails on the first structural tick:

```xml
<numberInput name="n" value="1"/>
<repeatForSequence name="r" length="$n"><number name="x">$y</number></repeatForSequence>
<number name="y">$r[2].x</number>
```

Setting `n` to 2: `dependency cycle involving component 'y.value'`, the
input holds 2, one iteration remains, and every later tick on `n` fails.

```xml
<repeatForSequence name="r" length="$n" indexName="i">
  <number name="x">$r[$i-1].x + $r[$i+1].x</number>
</repeatForSequence>
```

Setting `n` to 2: the same cycle error.

```xml
<graph><repeatForSequence name="r" length="$k"><point name="p">(0,0)</point></repeatForSequence></graph>
<boolean name="b">$r[2].p.x > 0</boolean><number name="k">2 - $b</number>
```

Dragging point 2 to x = 1: `document structure did not settle after 8
rebuilds`. The count reads its own iteration 2, which exists only while
the count is 2.

### Implementation and cost, 2026-10-16

Built as described under The check, behind `LoadOptions::check_cycles`
(default on). The three documents above are now rejected at load with
`Error::Cycle` (`tests/cycles.rs`); the suite and the golden diff against
c28b7c5 are clean. Measured with
`cargo run --release -p cells-bench --example cycle_check_cost` (medians
of seven interleaved loads per side, native, from the binary fixtures; the
whole table was in `packages/benchmark/results/NOTES.md`, which is in git
history up to 04c8a7b):

| fixture | load, check off (ms) | load, check on (ms) | check (ms) | check / load off | build, check off (ms) |
|---|---:|---:|---:|---:|---:|
| chain-1000 | 6.03 | 5.74 | 0.00 | 0.0% | 5.78 |
| chain-100000 | 807.65 | 867.24 | 0.00 | 0.0% | 786.08 |
| points-100 | 0.33 | 0.34 | 0.00 | 0.0% | 0.26 |
| recur-100 | 0.54 | 0.61 | 0.05 | 8.9% | 0.44 |
| recur-1000 | 3.46 | 3.46 | 0.05 | 1.5% | 3.29 |
| repeat-100 | 0.45 | 0.50 | 0.04 | 9.0% | 0.35 |
| repeat-1000 | 2.85 | 2.81 | 0.04 | 1.6% | 2.52 |
| repeat-10000 | 29.03 | 28.93 | 0.05 | 0.2% | 26.95 |
| sir | 3.56 | 3.71 | 0.12 | 3.4% | 3.25 |

The check runs only on documents with a repeat (the `0.00` rows), on the
first build pass, where the repeats have no iterations yet and the probe is
the only expansion of their templates. Its cost is independent of the
iteration count: 0.04 to 0.05 ms for the repeat fixtures at 100, 1,000 and
10,000 iterations, 0.12 ms for the SIR simulation (its probe parses the
document's math once more). What it scales with is the size of the
document outside the repeats, since the probe expands the whole document at
one iteration per repeat: a document of 10,000 free points with one repeat
would pay about the cost of one build pass of those points (points-10000
builds in about 30 ms). The per-phase profile (`CELLS_BUILD_PROFILE=1`) on
the first pass shows the check at 70 to 80 µs for repeat-10000 and
recur-1000 and 245 µs for SIR, against 50 ms, 5 ms and 4 ms for the pass
that builds the settled document. Run-to-run noise on this laptop is larger
than the check on every fixture (the on and off columns cross).

Recommendation: keep it always on. The cost is negligible against the
load it protects, and switching it off only to save a tenth of a
millisecond would reintroduce a failure the student sees.

### Closing the survey's holes, 2026-10-16

`docs/rebuild-cycles-survey.md` found four constructs the probe did not
model (a select inside a repeat, counts coupled through each other's
iterations, a collect's count, the prefill rule); the rules above under
The check now cover them, with the SCC test untouched, and the survey's
tests in `tests/rebuild_cycles.rs` pass. The clamp of a collect index now
applies only to a collect that gathers from a repeat. The cost did not
move: 0.04 to 0.06 ms on the repeat and recur fixtures and 0.13 ms on SIR,
against 0.04 to 0.05 and 0.12 before, within this laptop's noise.

### One structure view, 2026-10-16

The probe was a builder flag that `build/expand/` tested in 36 places.
The build now learns structure only through the structure view
(`View`, `build/view.rs`): how many iterations a repeat is stamped with,
which iteration, item or pick an index names, a collect's count, which
options a select builds, and which plans a first-iteration prop gets. The
real build reads the carryover through `Stamped`; the probe is the other
implementation (`build/cycles.rs`), so the rules under The check are its
answers, not branches in expand. Edges are still labelled in one place in
the resolver, every slot records its scope when it is made, and the SCC
test is unchanged. The probe now runs emit too, with its output
discarded, so the prefill rule is checked by `seed_cells` itself rather
than by a copy in the probe; a loop of aliases in the probe, a recurrence
folded onto its one iteration, is left to the SCC test rather than
reported by emit. `cycles.rs` went from 604 to 492 lines. The golden diff
against 6e66632 is identical.

`tests/every_count.rs` checks the promise independently of the probe:
every golden document, `sir` and every generated fixture, plus the
documents of this ADR and the survey, is loaded at four seeds (one when it
has no load-time choice), and each repeat is stamped at 0 to 4 iterations,
alone and all together, then let settle; no build may fail with
`Error::Cycle` and the counts must settle, and the same counts requested
through the count cells must not fail a rebuild with a cycle or an
unsettled structure. Since 2026-10-18 it also checks each of those builds
against the probe's graph (`build/coverage.rs`): every dependency the build
has, between element slots and through any intermediate slots, must be one
the probe has, with a label its iterations satisfy; a probe that leaves out
a select's other options, or flips a shift's sign, fails it at once. It passes, and it fails when the probe is made to
answer like a stamped build in any one of the options, index or collect
count operations, or when expand reads the carryover's counts directly.

The cost, measured on a different machine from the table above, with the
same example for both commits (medians of eleven rounds; noise at this
size is about 0.01 ms):

| fixture | check at 6e66632 (ms) | check now (ms) |
|---|---:|---:|
| recur-100 | 0.03 | 0.03 |
| recur-1000 | 0.04 | 0.04 |
| repeat-100 | 0.02 to 0.03 | 0.03 |
| repeat-1000 | 0.03 | 0.04 |
| repeat-10000 | 0.04 to 0.05 | 0.06 |
| sir | 0.09 | 0.11 |

About 0.01 ms more, which is the emit pass the probe now runs. The real
build's time ("build, check off") did not move beyond run-to-run noise on
any fixture, from 0.2 ms to the 590 ms of chain-100000.

### Every document is probed, 2026-10-29

The probe now runs for every document (ADR 0015's amendment of the same
date): the first build of a document without repeats or selects no
longer doubles as its check, so a load is one sequence of steps, and the
probe's records of what every build reads are made for every document.
What it costs is one more expand and emit at load for such a document,
about the size of its one build, and for a document with symbolic math
the engine work emit does; the probe compiles no curve tape and takes no
derivative, since its instructions never run. Measured with
`cycle_check_cost` (medians of 7 loads, release, this laptop; "before" is
177f1a1, the last commit of the two-path load):

| fixture | load before (ms) | load now (ms) | probe (ms) | probe / load | now / before |
|---|---:|---:|---:|---:|---:|
| adventure-3 | 33.07 | 52.19 | 13.06 | 25% | 1.58 |
| chain-1000 | 2.38 | 3.05 | 0.60 | 20% | 1.28 |
| chain-100000 | 438.41 | 566.73 | 97.99 | 17% | 1.29 |
| curves-100 | 1.70 | 3.21 | 1.27 | 40% | 1.89 |
| fanout-10000 | 61.20 | 69.90 | 11.31 | 16% | 1.14 |
| points-100 | 0.16 | 0.23 | 0.05 | 22% | 1.44 |
| points-1000 | 1.40 | 1.81 | 0.32 | 18% | 1.29 |
| points-10000 | 17.91 | 19.85 | 3.46 | 17% | 1.11 |
| recur-1000 | 2.53 | 3.02 | 0.05 | 2% | 1.19 |
| repeat-1000 | 2.18 | 2.37 | 0.05 | 2% | 1.09 |
| repeat-10000 | 25.78 | 28.02 | 0.06 | 0% | 1.09 |
| select-1000 | 30.68 | 29.66 | 12.98 | 44% | 0.97 |
| selectflat-1000 | 5.08 | 8.77 | 3.00 | 34% | 1.73 |
| sir | 2.68 | 4.08 | 0.13 | 3% | 1.52 |
| sliderstack-1000 | 3.56 | 6.05 | 1.92 | 32% | 1.70 |
| sticky-1000 | 6.02 | 9.86 | 1.63 | 17% | 1.64 |
| symchain-1000 | 45.78 | 57.81 | 10.66 | 18% | 1.26 |
| wording-1000 | 26.43 | 41.53 | 13.34 | 32% | 1.57 |

Over the 41 fixtures without a repeat or a select, a load now takes 1.0
to 2.2 times what it took, the median 1.5, with the probe 16% to 41% of
it. The fixtures the probe already ran for (repeat, recur, select, sir's
probe column) moved within this laptop's run-to-run noise, about 10%,
which the whole table carries. `LoadTimings::cycle_check` is the probe's
time, which `check off` (`LoadOptions::check_cycles`) no longer removes:
it only skips the probe's loop checks.
