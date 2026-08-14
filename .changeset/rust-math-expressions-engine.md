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
- **Equality testing of odd roots differs from before in both directions, and one of them will
  cost credit.** `\sqrt[3]{-2}` and `-\sqrt[3]{2}` are now recognized as the same number — the old
  engine graded them different, although it displayed the first as the second. In exchange,
  `\sqrt[3]{-2}` and `(-2)^{1/3}` are now graded *different*, because the engine reads a fractional
  power of a negative number as its principal complex value while it reads a root as the real one.
  So an `<answer>` expecting `\sqrt[3]{-2}` marks a typed `(-2)^{1/3}` **wrong** where it used to
  mark it right, and the same for `\sqrt[3]{-2}` typed against an expected `(-2)^{1/3}`, and for a
  decimal typed against an expected `(-2)^{1/3}`. Perfect powers are unaffected: `(-8)^{1/3}`,
  `\sqrt[3]{-8}` and `-2` all still compare equal, which is what makes this easy to spot-check
  wrongly. If an item of yours accepts a fractional power of a negative number, check it.
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
made, but the bundle carries it: the engine is 2.41 MiB uncompressed and 790 kB gzipped, against
roughly 1 MiB (about 290 kB gzipped) for the JavaScript library it replaces. Building DoenetML from
source now requires a Rust toolchain with the `wasm32-unknown-unknown` target and a matching
`wasm-bindgen-cli`.
