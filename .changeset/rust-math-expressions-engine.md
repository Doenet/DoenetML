---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Replace the JavaScript `math-expressions` library with the Rust core compiled to WASM.

Everything DoenetML does with mathematics — parsing what a student types, deciding whether an
answer is equivalent to the expected one, simplifying, differentiating, rendering a `<math>` — now
runs through the Rust engine reached by its `math-expressions-js-compat` drop-in, rather than
through the legacy JavaScript library. The API is unchanged, so authored documents need no edits,
but the engine is a different implementation and some results differ:

- **Text rendering of containers is no longer padded.** A point that read `( 0, 0 )` now reads
  `(0, 0)`; the same for intervals, vectors and matrices. LaTeX is unchanged except that a
  compound `\frac` operand no longer carries interior spaces (`\frac{\partial f}{\partial x}`
  rather than `\frac{ \partial f }{ \partial x }`), which renders identically.
- **Simplification is stronger.** Identities the old engine could not reach, such as
  `exp(ln x) → x`, `cos(pi/3) → 1/2` and `log_2(2^3) → 3`, now fold. Because equality testing
  evaluates exact constants, expressions the old engine called different can now compare equal,
  which can change whether a student's answer is marked correct.
- **Inverse trigonometric notation parses correctly.** `sin^(-1)(1)` is read as the inverse
  function; the old engine read it as `(1/sin)(1)`.
- **A value that is not a number now reads as `NaN` rather than as zero.** The engine reports "I
  cannot evaluate this" separately from "this evaluates to NaN", and the first of those coerces to
  `0` in JavaScript. Where a numeric state variable used to take it — `<numberList>` over a
  symbolic child, `<clampNumber>` of a free variable, a `<curve>` whose `parMin` does not evaluate,
  a `<line>` through an undefined point, a `<rectangle>` or `<regularPolygon>` on symbolic
  vertices, a `<circle>` with a symbolic radius, a `<curve>` whose `<bezierControls>` are symbolic,
  a `<function>` with a symbolic domain endpoint, a `<polygon>` or `<polyline>` with a symbolic
  vertex, a `<vector>` with a symbolic head or tail, a `<ray>` with a symbolic endpoint, an
  `<angle>` through a symbolic point, a `<math>` or `<cell>` whose content is not a number — the
  result is `NaN`, so an undefined point is
  not drawn at the origin, a
  rectangle on symbolic corners does not report a width of exactly zero, a polygon on symbolic
  corners does not report a centroid pulled towards the origin, and an unclampable value
  does not report as the lower bound. `±Infinity` is still a value and still clamps. A shape in a
  `<stickyGroup>` with such a vertex can still be dragged: the constraint machinery reduces the
  vertex to `NaN` rather than dropping the whole drag.
- **Odd roots of negative numbers now grade consistently, in every spelling.** `\sqrt[3]{-2}`,
  `-\sqrt[3]{2}`, `(-2)^{1/3}` and the decimal `-1.2599…` are all read as the same number — the
  real cube root of −2. The old engine's grading was non-transitive here: it accepted
  `(-2)^{1/3}` for `\sqrt[3]{-2}` but rejected `-\sqrt[3]{2}` and the decimal for `\sqrt[3]{-2}`,
  because its simplifier read a cube root on the real branch while its numeric evaluator read it
  as the principal complex value. Everything the old engine accepted is still accepted, and the
  spellings it wrongly rejected now earn credit. Even roots are unchanged (`\sqrt{-4}` is still
  the imaginary `2i`), as is a fractional power whose denominator is even — `(-8)^{0.3333}` is
  `3333/10000`, not a cube root. A related plotting change: `<function>cbrt(x)</function>` and
  `<function>nthroot(x,3)</function>` now draw for negative inputs instead of stopping at the
  origin. Writing the same function as `x^(1/3)` still leaves that gap — the evaluator behind
  plotting takes the principal complex branch for a fractional power, as it did before, so a
  `<function>` and an `<answer>` can disagree about `x^(1/3)` at a negative input.
- **A `<function>`'s extrema are cleaner near a pole, and exact where the engine can be exact.**
  The critical points of a rational derivative are now taken from the engine directly rather than
  found by bracketing and refining, so the reported locations no longer carry refinement
  round-off. A derivative sample that lands on a pole now reads as "no value" rather than as
  `±Infinity`, so the cells beside it no longer bracket a sign change, which removes a
  long-standing spurious minimum: `(x+8)(x-8)/((x-2)(x+4)(x-5)^2)` reported a minimum at
  `4.999999948`, beside its double pole at `x = 5` (issue #940), and now reports only its four
  real extrema. A pole that no sample lands on is unchanged, and can still report a minimum
  next to it.
- **`<round>` rounds exact fractions.** `<round numDecimals="3">1/3</round>` answers `0.333`; it
  had stopped rounding anything the engine holds exactly. The trade-off is that a decimal literal
  with more than about seventeen significant digits now goes through a double on the way in, so its
  last digits can move.
- **`<line>`'s coefficients follow the equation as written.** `coeffvar1`, `coeffvar2` and `coeff0`
  are now the coefficients of *left-hand side minus right-hand side* for every spelling; they
  previously came out negated for whichever spellings the simplifier did not reorder. A line's
  direction is also canonicalized, so `5x-2y=3` and `2y-5x=-3` now point the same way and
  `<angle betweenLines>` draws the same ray for both.
- **A `<video>` that changes source resets its playback state.** `time` and `segmentsWatched`
  describe one particular video, so a new source starts from zero instead of inheriting the old
  video's position and having the player seek into the middle of a video nobody has watched.

The engine's WASM is inlined into the bundle rather than fetched, so no extra network request is
made, but the bundle carries it: the engine is 2.41 MiB uncompressed and 792 kB gzipped, against
roughly 1 MiB (about 290 kB gzipped) for the JavaScript library it replaces. Building DoenetML from
source now requires a Rust toolchain with the `wasm32-unknown-unknown` target and a matching
`wasm-bindgen-cli`.
