# math-expressions-rs is the symbolic engine

Revises Plan 5's verdict, which kept engine A. The core's symbolic engine is
engine R: math-expressions-rs, the engine the current DoenetML core already
calls through wasm, behind the same `SymEngine` trait
(`crates/cells-sym-mer`). It is the default in `LoadOptions` and in the wasm
binding. Engine A stays in `crates/cells-sym` for comparison and can still be
chosen per document. The decision was made when the prototype moved into the
DoenetML monorepo as `@doenet/doenetml-worker-cells`, the start of replacing
both current cores with it: one symbolic engine across DoenetML is worth
more than A's measured speed and memory advantages.

## Considered options

- **Keep A.** Rejected: it would be a second computer algebra system to grow
  to the coverage math-expressions already has, and the behavior DoenetML
  authors rely on is math-expressions' behavior.
- **Remove A.** Deferred. It costs nothing at run time while unused, and it
  is the comparison for any later measurement of R.

## Consequences

- R does not deduplicate. Every recomputed expression gets a new handle, so a
  symbolic instruction whose result did not change still reruns everything
  downstream of it, and the math cell is reported as changed in the tick.
  The equal-handle cutoff of ADR 0008 is A's only
  (`tests/symbolic.rs` pins that test to A; `cells-sym-mer/tests/core_r.rs`
  checks R's behavior).
- Tests that compare written handles compare expressions instead
  (`tests/invert_walk.rs`).
- On the golden documents (`scripts/golden-diff.sh` from A to R) every
  sampled and numeric value is unchanged but one `evaluate`, which differs in
  the last bit. Text differs where an expression is instantiated without
  `simplify`: R shows `1 x + 1` where A's arena folded it to `x + 1`, as the
  current DoenetML core does without `simplify`.
- Math written in the document is still parsed at build time by the
  prototype's own parser (`cells_sym::parse`) into builder trees; only a
  `mathInput`'s text goes through math-expressions' parser.
- Compiled curve tapes (`cells_sym::tape`) are unchanged: they compile a
  builder tree, which R exports as A did.
- The wasm binary grows from 1.13 MB to 2.97 MB (337 KB to 821 KB gzipped),
  and serde_json's `arbitrary_precision`, which math-expressions enables, now
  applies to every binary that links the core.
