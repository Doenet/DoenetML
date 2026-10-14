# One symbolic engine: math-expressions-rs

Status: implemented 2026-10-14 (`crates/cells-core/src/sym/`). Supersedes
the engine verdict of plan 5 that ADR 0008 relies on.

The core will hold one symbolic engine, the Rust port of math-expressions
(`math-expressions-rs`, Doenet's own library, pinned by git revision), and
call it directly. The `SymEngine` trait, the hash-consed arena (engine A),
and the core's own math-text parser go. The compiled curve tape stays, since
it compiles from the core's `Tree` and is independent of the engine.

We chose this because engine A's advantage was structural: equal expressions
got equal handles, so a tick could tell for free whether a symbolic
instruction's output changed. In practice DoenetML compares mathematically
by numeric sampling, not structurally, so that identity is not used for
anything the document can observe. Against that, one engine across all of
DoenetML gives one parser, one simplifier and one equality, which is what
parity with the current core needs. Plan 5 measured engine A as faster per
operation and an order of magnitude leaner in memory; that cost is accepted
and not re-measured now, because math-expressions-rs is itself expected to
change. The bench set keeps a symbolic family so growth stays visible.

## Considered options

- **Keep both engines behind the trait**, A by default. Rejected: the trait
  exists only to compare them, and a test oracle that needs a sibling
  checkout is a test nobody runs.
- **Keep the core's own parser** and convert its trees into the engine.
  Rejected: the parser is the piece most likely to diverge from DoenetML's
  handling of math text.

## Consequences

- `cells-sym` and `cells-sym-mer` are gone; `Tree`, the tape and the
  engine wrapper live in `cells-core/src/sym/`.
- The oracle test (A against R) disappears with A; the tests that ran the
  core with R became the ordinary symbolic tests. Switching them over
  found two wrapper bugs: a derivative was not usable as a template, and
  infinity evaluated to NaN.
- The cost, measured once at the switch (`scripts/perf-diff.sh`, the
  per-side minimum of 5 rounds, native release build):

  | fixture | load before | load after | tick before | tick after | heap before | heap after |
  |---|---|---|---|---|---|---|
  | symchain-1000 | 18 ms | 108 ms | 0.47 ms | 30 ms | 1.5 MB | 46 MB |
  | curves-100 | 3.2 ms | 11 ms | 0.38 ms | 2.2 ms | 0.8 MB | 6.2 MB |
  | chain-1000 | 5.2 ms | 4.6 ms | 16 µs | 16 µs | 0.28 MB | 0.28 MB |

  Documents without math cells are unchanged. The symchain tick is the
  consequence named above: with no structural identity, every recomputed
  expression gets a new handle, so a drag of `t` reruns all 1,000 links
  instead of stopping where the expression stops changing. A cheap change
  test (structural `equals_syntax` of the new result against the old, or a
  printed-form hash) would restore most of the cutoff and is the first
  thing to try if that cost matters; it is not done here.
- The wasm grows from 1.06 MB to 2.61 MB.
- The crate enables `serde_json/arbitrary_precision`, which cargo's feature
  unification spreads to the whole wasm binary.
- The build-time numeric parser in `build/compile/expr.rs` (the parse arena,
  ADR 0005) is still the core's own; it is the remaining parser to unify.
