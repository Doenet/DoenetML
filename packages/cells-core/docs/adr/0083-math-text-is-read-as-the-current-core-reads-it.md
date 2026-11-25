# Math text is read as the current core reads it

Status: proposed 2026-11-25. Five gaps of the math front end (sweep 4):
numeric math calling a function, math text the compile's parser does not
read, the `<math>` attributes that say how to read it, a line whose
equation is a math value, and a point written as vector arithmetic. Follows ADR 0005 (numeric math lowers), ADR 0043
(a math is symbolic as written), ADR 0075 (which found the first gap) and
ADR 0008 (no symbolic inverse).

## Context

- **Numeric math calling a function.** Math text that lowers to numbers
  (a `<number>`'s text, a point's coordinate, a numeric attribute:
  `Flow::Math`, "lowered if numeric, else NaN") knew `+ - * / ^` and
  DoenetML's `round`, `floor`, `min`, `max` and `clamp`. `sin(1)` read as
  the symbol `sin` times 1, so `<number>sin(1)</number>`, `<point>(1,
  5sin(1))</point>` and `x="8cos($theta)"` were NaN; so were `e` and
  `Infinity`. The current core evaluates such text with math-expressions'
  `evaluate_to_constant`, which knows the elementary functions and `e`.
- **Text the compile does not read.** The compile tokenizes and parses
  every math text itself (`compile/ir/expr.rs`) to find its references,
  its symbols and whether it lowers. Text outside that small grammar was
  refused (`cells-bad-math: unexpected '\'`, `'_'`, `'"'`, `unexpected
  token RParen`), though the engine, which reads a symbolic math's text
  itself, parses it: LaTeX, `x^()` (a missing operand), `a ± b`,
  subscripted symbols, `vec a`. The current core reads all of these.
- **How a math's text is read.** `format="latex"`, `splitSymbols` and
  `functionSymbols` were unsupported attributes. The engine's parser has
  each as an option.
- **A line's equation that is a math value.** A line's equation is read
  at compile time as linear coefficients over its text; a reference to a
  math input (`<line>$equation</line>`) has no `=` in its text and was
  refused ("a line equation needs one '='"), which broke the one-line
  `<angle>` tests.
- **A point written as vector arithmetic.** `<point>(3,4) + 2(1,-1)</point>`,
  `<point>2$m - 3$P</point>`, `vertices="2(2,-3)+(3,4) 3$P $P+2$m"`: the
  current core evaluates the vector; here a point's text had to be one tuple
  or one reference ("expected a tuple like (x, y)", "unexpected Num in a
  point list").

## Decision

1. **Numeric math calls the engine's functions.** `Func` grows the
   elementary functions under the names the engine reads (`sqrt`, `cbrt`,
   `abs`, `sign`, `ceil`, `exp`, `log` and `ln` (natural), `log10`, the
   trigonometric and hyperbolic functions and their inverses, `arc` and `a`
   spellings), each lowered to a scalar operator (`Sin`, `Exp`, ...; `sec`
   as `1 / cos`, `asec(x)` as `acos(1 / x)`), with no inverse (a request
   through one is dropped, as through `Pow`). A call over literals folds
   when parsed, so `<point>(1, 5sin(1))</point>` is a point of two given
   values that drags. Where math lowers, `e` is Euler's number and
   `infinity` (`Infinity`, `∞`) is infinite; `π` is `pi`. A power that is
   an indeterminate form (`0^0`, `∞^0`, `1^∞`) is NaN, as
   `evaluate_to_constant` gives, where `f64::powf` gives 1. This is the
   smaller of the two designs ADR 0075 names: the lowering covers every
   test that met the gap, and an `Evaluate` of the instantiated expression
   would add a symbolic instruction per such math and change the graph,
   the build and the type pass.
   - A `<math>` keeps a call to one of these as written: the type pass
     counts it as a reason the math is symbolic (`calls_written`), as it
     counted the symbol `sin` before, so `<math>sin($t)</math>` shows
     `sin(1)` as it did and as the current core does. DoenetML's own
     `round`, `floor`, `min`, `max` and `clamp` stay numeric only.
   - A condition reads text naming one of these functions or `e` as the
     engine does, as it did before (`names_engine_math`), so `log10(10^3)
     = 3` under `symbolicEquality` compares as written, whatever the
     compile folded it to.
2. **A math's own text the compile does not read is the engine's.** The
   text of a `<math>` (and of the other types that settle from their text,
   `<interval>` and `<subsetOfReals>`) is tokenized leniently: a run of
   text the tokenizer does not read is one `Token::Opaque`. When the
   compile's parser does not read the text, and the engine parses it whole
   (a missing operand the blank, `x^＿ + ＿/2`), it is
   `Expr::Written(leaves)`: math only the engine reads, over the text's
   references, always symbolic (as ADR 0041 decision 8 made a constant
   relation, `Expr::Shape(vec![])` before, now `Written` too). Text the
   engine does not parse either (`(1 + 2`) stays an error, and so does a
   call to `clamp` that does not parse (the engine has no `clamp`). Any
   other math text (attributes, conditions, a point's coordinates) is read
   as before.
3. **A math's literal `format`, `splitSymbols` and `functionSymbols` say
   how the engine reads its text** (`sym::ParseOpts`, read while
   outlining, `Outline::math_read`): as LaTeX, without splitting
   multi-letter symbols, with other function symbols. The options ride on
   the math's `SymText` (`Nodes { opts }`), so every place that parses that
   text (the build, the template graph, its signature and check) parses it
   with them, and equal text with other options is no equal math
   (`share`). Text read with options is always the engine's, but for a
   number as written. LaTeX holding a reference is refused: a reference is
   spelled as a leaf symbol the LaTeX parser would split. Each attribute
   is literal: one written with a reference is refused (`cells-banned`),
   since reading the text again in a tick is no reading the compile does.
4. **A line's equation that is a math value is read in the tick.** When a
   line's equation is one reference and nothing else, its coefficients are
   `SymKind::LineCoeffs` over the expression the reference stands for (an
   alias of it, as a math of that reference alone is) and the line's two
   variables (constant math cells holding the symbols): three outputs, `a`,
   `b`, `c` of `a v1 + b v2 + c = 0`, each NaN when the value is no such
   equation (no single `=`, not linear in them, another free symbol),
   computed by sampling the difference of the two sides
   (`Engine::line_coeffs`). It has no inverse (ADR 0008): a drag of the
   line is dropped where the current core writes the equation back. An
   angle along one line takes its vertex from the line's coefficients,
   `-(a c, b c) / (a² + b²)`, as the current core's `nearestPoint` does,
   so it is exact (`(-0.4, 0.2)` for `y = 2x + 1`).

5. **A point written as vector arithmetic is that arithmetic per
   coordinate** (`compile/read/vector_math.rs`). Where a point's text is no
   tuple and no lone reference, it is parsed as math, and a sum or
   difference of pairs (a tuple of two, or a reference to a point: its `x`
   and `y`), a pair times or over a scalar, or a pair negated, is a pair
   whose each coordinate is the same arithmetic over the coordinates,
   lowered as any numeric math (a literal folds; a request writes through
   the operators as through any lowered math, so a drag of `2$m - 3$P`
   writes `P` when `m` is fixed). A point list whose items are not all
   tuples and references is read so too, its items the pieces between
   spaces outside any bracket pair. Anything else (a product of pairs, a
   matrix times a point, a pair of other than two entries) stays refused.

## Considered options

- **An `Evaluate` of the instantiated expression for numeric math with a
  call** (ADR 0075's alternative). Rejected as the larger design: the
  lowering covers the tests. It would give the engine's exact
  simplification (`8 sin(2π)` is exactly 0 in the current core, which
  `angle.test.ts`, "systematically vary angle", holds); the lowering gives
  `-2.4e-16`.
- **Lowering a `<math>` that calls a function too** (`<math>sin($t)</math>`
  a number, as `<math>$n + 1</math>` is). Rejected for now: it would
  change what such a math shows from what it showed and what the current
  core shows. The user's rule for `$n + 1` (ADR 0043) could be extended to
  it; that is the user's call.
- **Reading the options by printing the parsed text back as default
  text.** Rejected: a symbol kept whole (`xyz`) prints as text the default
  parser splits.
- **A blank for any math text the engine does not parse either**, as the
  current core shows one. Rejected: it would hide an author's error with
  no diagnostic.

## Consequences

- `1/0` lowers to a signed infinity (`-1/0`, `4/-0`), as the current
  core's `<number>` gives. A symbolic math evaluating a pole (`sin(1)/0`,
  a function at its asymptote) is still NaN: the engine's evaluation
  (`evaluate_to_constant`, complex) has no sign for it.
- A call over a reference's value is an operator with no inverse: a drag
  of `<point x="cos($t)">` drops its `x`, where the current core writes
  `$t` back only for a linear expression anyway.
- A `<math>`'s text with a reference and something only the engine reads
  in a form its builder tree cannot hold (`$n ± 1`, `2^($n) x_1`) is
  refused where it was refused before, now with the engine's reason.
- `<math>min($a)</math>`, `<math>round($a, 1)</math>` are the engine's
  reading (`min(2)`, `round(2, 1)`), where the compile refused their
  arity; `tests/math.rs` records it.
- A bound `splitSymbols="$x"` (re-parsing math in a tick) is refused, and
  so are `assumptions`, `parseScientificNotation` and the options on a
  `<mathList>` or `<mathInput>`; an extend or copy of a math with its own
  options (`<math extend="$m" splitSymbols="false"/>`) reads the source's
  text as the source does.
- `<line>`: the drag tests of a line of a math input
  (`line.test.ts`, "dynamic equation") fail by the dropped drag; a
  line's `equation` prop (`$g.l.equation`) does not exist.
- An angle along one line costs twelve cells more (`angle.cost`).

## Migration

Done 2026-11-25, all five. Tested by `tests/math_functions.rs`,
`tests/math_reading.rs`, `tests/line_equation.rs`, `tests/vector_points.rs`,
`tests/math.rs` and the spec snapshots (`function.cost`, `angle.cost`).
