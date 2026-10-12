# Plan 5: symbolic math in the cell architecture

This file records the decisions reached before implementation
(`docs/history/instructions5.md` is the request). Vocabulary is in `CONTEXT.md` (**Math
cell**, **Symbolic instruction**, **Expression arena**). The decision that
symbolic work runs inside a tick is ADR 0008, which revises ADR 0005. The
verdict goes in the "Plan 5" section of `results/NOTES.md`.

## The questions

1. What is the best-case performance for documents that rely heavily on
   symbolic manipulation?
2. What is the interface between the symbolic engine and the compute core,
   and what does its shape buy?
3. What memory layout suits expressions, and how does it relate to the cell
   layout?
4. Where can the amount of manipulation be bounded at build time?
5. How does symbolic work interleave with cell dependencies?

## Background found before planning

- **The current core already runs a Rust engine.** `math-expressions-rs`
  (`/home/charles/doenet/math-expressions/packages/math-expressions-rs`,
  about 42k lines, GPL-3.0 OR Apache-2.0) is the engine the current core
  calls, through wasm, behind the legacy JS API in `@doenet/math`. Its
  expressions are boxed trees (`enum Expr`) with a faithful layer and a
  canonical layer.
- **Most of the current core's per-change symbolic cost is in graphics
  props, not in `<math>`.** `<math>` defaults to no simplify and no expand.
  `Line.equation` simplifies several times and runs a sampling `equals` on
  every point move. `Point` runs `expand().simplify()` on its coords.
  Rectangle, Vector and Circle simplify on every change.
- **Other symbolic work and when it runs:**
  - `<function>` compiles `f()` once and samples it thousands of times.
  - Answer checking (a sampling `equals` by default, `equalsViaSyntax` under
    `symbolicEquality`) runs on submit.
  - Inverting through `<math>` matches a prebuilt linear template.

## Decisions

- **Symbolic instructions run inside a tick** (ADR 0008).
  - Simplify, expand, substitute, derivative, evaluate and equals are
    instructions in the same program and schedule as numeric operators.
  - They write new expressions into the arena.
  - Lowering (ADR 0005) is unchanged: an all-numeric `<math>` never becomes a
    math cell.
- **Gating.** A symbolic instruction is dirty-gated: it runs only when one of
  its inputs changed. Numeric instructions keep their current policy.
- **Leaf changes.** When a numeric leaf of a symbolic instruction changes, its
  value is substituted and the instruction reruns. For example,
  `<math simplify>$n x + 2x</math>` re-simplifies on every drag of `n`. This
  matches the current core's behavior and is the honest worst case. Keeping
  cell leaves symbolic is a candidate for the classification table, not
  something to build.
- **Two engines behind one arena interface.**
  - **A, our own.** A small engine in this repo with a flat, hash-consed
    arena that is shared by the whole document. Math cells hold handles. Equal
    expressions have equal handles, so an unchanged result stops downstream
    gating for free.
  - **R, the existing engine.** `math-expressions-rs` linked natively, with
    the arena holding its `Expr` trees. It is both the baseline engine and the
    behavior oracle.
  - **B, deferred.** An owned postfix buffer per math cell is built only if A
    shows allocation or reclamation costs that matter.
- **Operations in A:**
  - Parse text (no LaTeX), and print as text and LaTeX.
  - Substitute, and evaluate to a number.
  - Simplify: flatten, fold numbers, collect like terms, sort. No
    rational-function reduction.
  - Expand and derivative.
  - Equals, both by numeric sampling and structurally.
- **Reclamation.** The arena is not reclaimed within a session except at a
  rebuild. Its growth is measured. Mark and compact only if growth reaches
  megabytes per minute of interaction.
- **Renderer.** The tick report carries a side table of (cell, LaTeX) entries
  for each math cell whose handle changed. The renderer never reads the arena.
- **Curves.** The core samples.
  - A function curve owns a fixed set of sample cells: 200 x-values and 200
    y-values.
  - A gated `Sample` instruction fills them.
  - The x-range comes from the graph's bounds.
  - There is no adaptive sampling.
- **Answers.**
  - Submitting copies the live response into an essential *submitted
    response* math cell.
  - Credit is a derived numeric cell, `equals(submitted, correct)`, so the
    check runs only on submit.
  - Submit is an ordinary request.
- **Out of scope:**
  - Inverses through symbolic expressions. These are the leading follow-up,
    and Plan 3's deviation 7 still holds.
  - LaTeX parsing.
  - Build-time optimizations that make the code more complex, such as
    template expressions or compiling to numeric chains.

## Fixtures

Each family is generated and scales to N.

1. **Answer checking.** N `<answer>`s, each a mathInput response checked
   against a symbolic correct answer, with N up to 1,000. Typing into one
   costs a parse. Submitting costs one check.
2. **Function graphs.** N `<function>`s given as formulas with cell leaves,
   each with its `<derivative>`, both drawn as curves. Dragging a coefficient
   re-derives and resamples.
3. **Symbolic chains.** A mathInput feeds a chain and a fan-out of `<math>`s
   that substitute and simplify, with numeric cells interleaved:
   math → number → math.

## Correctness against the oracle (R)

- `equals` returns identical booleans in A and R on a fixed corpus.
- The outputs of `simplify`, `expand` and `derivative` must be equal under R's
  `equals`. Their printed forms are not compared.
- `evaluate` agrees to 1e-12.

## Measurements

- **Budget.** The bar from Plan 2 holds: fatal if a tick misses 50 ms at 10k
  components, or if a feature needs component-specific code in the core. The
  tick time of each fixture against N is measured natively and in wasm.
- **Per operation.** Parse, simplify, expand, derivative, equals and evaluate
  are timed in three ways on the same inputs:
  - A, natively;
  - R, natively;
  - R through `@doenet/math` in Node, which is the wasm boundary the current
    core pays.
- **Cutoff.** How many downstream reruns A's equal-handle cutoff saves
  against R.
- **Arena growth** over 10,000 keystrokes and 10,000 drags through fixture 3.
- **Current core, end to end.** All three fixtures at N = 10 and 100.

## Deliverables

- Engine A and the R adapter behind one interface, the fixtures, the
  benchmarks and the oracle tests.
- **A classification table (question 4).** Every symbolic-using prop of the
  current core is labelled one of:
  - build-time only;
  - tick-time but bounded, where the expression's shape is fixed and only its
    leaves vary;
  - unbounded, where the author or student supplies the expression.

  Each row notes the optimization that would apply. None are built.
- A verdict in `results/NOTES.md` that answers the five questions.
