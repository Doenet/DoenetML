# What a load costs

The compile does more each time an ADR moves a question from the build or
the tick to the source (ADRs 0026 to 0036): constants folded and pooled,
equal computations shared, types and ports settled once. Each makes a
tick or a rebuild cheaper and is paid for at every load. This page keeps
the load's side of that trade: how to measure it, what it has cost so
far, and where its time goes.

## Measuring

- `crates/cells-bench/examples/load_cost.rs` loads each `tick_cost` shape
  (`src/shapes.rs`) and prints the median of `REPS` loads (default 7) as
  JSON lines. `CELLS_SHAPES` and `CELLS_SIZES` choose what runs; `sir`
  (`fixtures/sir.doenet`, path in `SIR`) needs `@doenet/parser` built.
- `scripts/load-diff.sh [base] [shapes] [sizes]` builds `load_cost` at a
  base commit and in the working tree, runs them alternately seven times,
  and prints the working tree's load over the base's, as
  `scripts/tick-diff.sh` does for a tick. A base older than `load_cost`
  gets the working tree's copy.
- `LoadTimings::spans` (`document/load.rs`) splits one load into the
  compile's stages, the abstract build and each build's expand, resolve,
  define, emit and schedule.

An ADR that changes the compile or the build records `load-diff.sh`
beside `tick-diff.sh`. A load of one shape at 10,000 elements varies by
about 5% between runs; a ratio inside that is no change.

## History

Native release builds on a shared four-core cloud container, 2026-11-05:
for each commit the better of two runs, each the median of nine loads,
in ms.

| shape, 10,000 | cda77a8 (before ADR 0026's constants) | 6fdaac1 (ADR 0027) | d9d98d8 (ADR 0028's pool) | 247b254 (ADR 0033) | 90654e1 | 90654e1 ÷ cda77a8 |
|---|---:|---:|---:|---:|---:|---:|
| depth | 33.5 | 32.6 | 32.6 | 38.3 | 42.6 | 1.27 |
| mixed | 32.2 | 30.4 | 34.2 | 40.4 | 39.7 | 1.23 |
| cutoff | 30.2 | 29.8 | 32.4 | 35.7 | 40.5 | 1.34 |
| poly | 69.7 | 72.1 | 70.6 | 115.7 | 103.3 | 1.48 |
| coords | 61.5 | 66.7 | 69.7 | 92.6 | 107.2 | 1.74 |
| refs | 61.1 | 62.0 | 76.3 | 85.2 | 102.2 | 1.67 |
| breadth | 36.0 | 37.5 | 85.1 | 90.7 | 91.5 | 2.54 |
| isolated | 34.7 | 34.7 | 85.8 | 91.3 | 94.1 | 2.71 |

At 1,000 elements the ratios are 1.2 to 1.5. Over these six days a load
became about 1.2 to 1.7 times slower, most of it from ADRs 0032 to 0034.
The jump of breadth and isolated at d9d98d8 was a bug, not a cost of the
design: emit asked of every constant slot whether it was an operator's
constant by scanning all of them (`self.consts.values().any(..)`), so a
document with many distinct literals paid slots times constants. Marking
them once fixed it; `load-diff.sh` against 79761c6:

| shape, 10,000 | before (ms) | after (ms) | after / before |
|---|---:|---:|---:|
| breadth | 93.5 | 47.2 | 0.51 |
| isolated | 96.6 | 46.7 | 0.48 |
| refs | 102.0 | 91.1 | 0.89 |
| depth, mixed, cutoff, coords, poly | | | 0.96 to 1.06 |

ADR 0032's step 8, part 3, moved the cycle check onto the compile's
template graph, which every compile now stamps beside the abstract build
until part 6 removes the abstract build's expand and resolve.
`load-diff.sh` against 103d566:

| shape, 10,000 | before (ms) | after (ms) | after / before |
|---|---:|---:|---:|
| refs | 121.5 | 143.3 | 1.18 |
| coords | 126.2 | 141.3 | 1.12 |
| isolated | 55.9 | 60.1 | 1.08 |
| depth, breadth, mixed, cutoff, poly | | | 1.02 to 1.06 |

By `LoadTimings::spans`, the stamping is 2.0 ms of depth's load, 7.2 ms
of refs', 4.7 of poly's and 4.8 of coords', and the checks over it 0.6
to 2.8 ms. A second run of refs and coords alone gave 1.00 and 1.10: the
rest of refs' first difference was a run's variance.

Part 4's first piece gave the template graph each node's definition, so
it lowers the math a second time beside the abstract build: the stamping
became 3.4 ms of depth's load at 10,000, 11 ms of refs' and coords', and
15 ms of poly's. `load-diff.sh` against 5323bf3 puts poly at 1.08 to
1.14 and coords at 1.00 to 1.13, the rest within 1.05. One trap on the
way: keyed by the word hasher, the constants (a whole number's bits end
in zeros, which it keeps) fell into one bucket, and breadth and isolated,
10,000 distinct literals each, loaded 30% slower until they were keyed by
the standard one.

## Where a load's time goes

`LoadTimings::spans` at 90654e1, the median of nine loads, in ms:

| shape, 10,000 | load | plan | abstract build | build's emit | rest |
|---|---:|---:|---:|---:|---:|
| depth | 38 | 25 | 6 | 1.4 | 6 |
| refs | 81 | 46 | 11 | 15 | 9 |
| poly | 87 | 47 | 18 | 4 | 18 |

- The compile's plan is about two thirds of a load, spread over its
  stages (outline, parse records, plan all, seal, share, finish: 3 to
  8 ms each at 10,000 depth). No one stage dominates.
- The first compute is under 0.3 ms: folding and the pool moved it into
  the compile.
- A document with no repeat or select pays an abstract build it does not
  need (ADR 0036, section 4), 5 to 32% of its load.
- `Compiled` depends on the source alone (ADR 0015), so a host could
  compile once per document, when it is published, and give every
  student only the build and emit. That is the way out of the trade if
  loads come to matter; nothing does it yet.

In absolute terms a load of 10,000 elements is 40 to 100 ms natively,
against 680 to 880 ms to start the JavaScript core's worker (ADR 0020).
