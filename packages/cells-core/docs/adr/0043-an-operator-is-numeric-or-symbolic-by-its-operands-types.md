# An operator is numeric or symbolic by its operands' types

Status: proposed 2026-11-23. Implemented for the one-input operators, the
operators over a list of operands and `<angle>`'s measure; see
Consequences for what is left. Extends ADR 0005 (a `<math>` lowers when
its leaves are numeric) from `<math>` to the operators, through ADR 0032's
type pass, with ADR 0011's one engine.

The current core's operators over math (`MathOperators.js`, the abstract
`MathBaseOperator` and `MathBaseOperatorOneInput`) compute over
expressions: `<abs>x</abs>` is `|x|`, `<sum>x 2x</sum>` is `x + 2x`
(`3x` with `simplify`), `<floor>2.1x</floor>` is `floor(2.1 x)`. The list
ones decide per evaluation whether to compute numerically
(`isNumericOperator`: every math operand is a number, unless
`forceSymbolic` or `forceNumeric` says otherwise); the one-input ones
always build the expression and evaluate it when it has no free variable.
This core's operators were numeric only, an operand it could not lower a
NaN.

## Decision

**The kind of an operator's result is decided statically, per element,
by the compile's type pass.** An operator is symbolic when any operand can
be a non-number, and numeric otherwise; `forceSymbolic` and `forceNumeric`
decide it instead (numeric wins when both are written, as in the current
core). "Can be a non-number" is what the type pass already decides for
math text (ADR 0032, `Types::symbolic`): a free symbol, or a reference to
a port that stands for an expression of type `Math` (a symbolic `<math>`,
an unbound `<mathInput>`, a symbolic operator). A numeric operator is
exactly today's: the same operators over numbers, the same inverses, the
same cost.

An operator over math has two ports beside its operands
(`components/operators/over_math.rs`):

- `expr`: a math cell when the element is symbolic, else no value. It is
  `Flow::MathHandle` over an **operator expression** (`Expr::Operator` in
  the compile's arena, made by `PlanCtx::operator_expr`): the operands'
  expressions (each operand's math text, a literal, or a reference's
  leaf), whose symbols and leaves the type pass reads, and a text the
  engine parses (`SymText::Spelled`, each operand spelled in parentheses:
  `(x) + (2 x)`, `min((x), (3))`). `forceSymbolic` plans `Flow::SymExpr`
  instead, always math; `forceNumeric` plans no value. A build makes it as
  any symbolic math: an `Instantiate` over the operands' leaves, rerun when
  one changes (ADR 0008), or a constant handle when it has none.
- `value`: `Flow::ValueOf(expr, numeric)`, an `Evaluate` of `expr` when the
  type pass typed `expr` math, else an alias of a hidden port holding the
  operator over numbers. The build and the template graph pick one by the
  port's type, as they pick a `<math>`'s value (`Flow::MathValue`).

What the engine does to the instantiated expression is its `Post`, which
grows from a `<math>`'s simplify and expand to the one-input operators:
`Abs`, `Sign`, `Floor` and `Ceil` (a number when the expression evaluates
to one, else `abs(..)` and the like), `RoundDecimals(n)` and
`RoundDigits(n)` (numbers and constants floated, then every number
rounded), and `SmallToZero(threshold)`. One `Post::apply` serves the tick,
the build's constants and the template graph. A list operator applies a
`<math>`'s `simplify` and `expand`.

The engine's parser applies DoenetML's functions (`min`, `max`, `mean`,
`median`, `sum`, `prod`, `variance`, `std`, `count`, as the current core's
`appliedFunctionSymbolsDefault`) and `gcd` and `lcm`, so an operator's text
parses as the function (`min(x, 3)`, not `m i n (x, 3)`), and so does an
author's. `Tree` gains `Call`, a function of several arguments.

`<angle>`'s measure is an expression too (`radiansExpr`, `degreesExpr`,
each standing for `radians` and `degrees`): a measure written as math text
is kept as written (`radians="pi/2"` is `π/2`, `alpha` is `α`), as
`forceSymbolic` keeps it, since the current core keeps it so; a reference
is one when what it names can be; a number or three points are numbers.
The other unit is the engine's conversion, simplified (`180 α/π`).

## Considered options

- **Decide at tick time, per value**, as the current core does. Rejected
  for the reason ADR 0005 gives: the program's shape cannot depend on
  values, and the numeric fast path, with its inverses, would be lost to a
  check on every run.
- **Lower every operator through its expression** (an `<abs>` as the math
  `abs(x)`, lowered when numeric), so a `<math>` and an operator are one
  thing. Rejected: the lowering knows `+ - * / ^` and a few calls, and an
  operator's own numeric instruction (`Reduce`, a rounding projection, an
  `<abs>`'s inverse, a `<min>` of one operand that writes it) would be
  lost or re-derived.
- **A symbolic instruction per operator** (`SymKind::Abs`, ..) over the
  operands' cells. Rejected: an operand may be a number or an expression,
  which an instruction cannot tell from a cell; a template's leaves already
  say which (`Tree::Cell { math }`), and an `Instantiate` already reruns on
  a changed leaf.

## Consequences

- An operand the type pass cannot prove a number makes the element
  symbolic, even when its value is a number at every tick: a `<sum>` over
  an unbound `<mathInput>` holding `1` is an `Instantiate` and an
  `Evaluate` (four instructions more in `fold.spec`'s references case),
  and gives the same number.
- Math text with no free symbol is a number, here as in ADR 0005: the
  current core's `<sum><math>6/2</math> 17 1</sum>` is `6/2 + 17 + 1`, this
  core's 21; `<sum>6/2 17 1</sum>` likewise. `pi` is a number to the
  tokenizer, so `<abs>pi</abs>` is a number too.
- A request on a symbolic operator is dropped: no inverse is symbolic. The
  current core writes `abs`'s argument (`absInverse`); here, a request
  that would change a numeric operator's kind (typing `x` into an input
  bound to `<abs>-9</abs>`) cannot, as the kind is fixed when compiled.
- A symbolic `<round>` reads `numDecimals` and `numDigits`, and a symbolic
  `<setSmallToZero>` its `threshold`, as written: with a reference, the
  element is numeric only.
- `<median>` and `<count>` are numeric only, as in the current core;
  `<clampNumber>`, `<wrapNumberPeriodic>`, `<isInteger>` and `<isNumber>`
  stay numeric (the current core's are NaN over math too).
- A `<variance>` or `<standardDeviation>` is symbolic only when
  `population` is written as a literal: the expression's shape depends on
  it.
- Element children (`<sum><math>x</math> 3</sum>`) are the operands of a
  list's children, ADR 0041 step 2, refused until that step reads them;
  an element child of a one-input operator is refused. Once a list's
  children read an element as an entry, `over_math::operand_exprs` reads it
  as a leaf, as it reads a reference.
- Left: `<extractMath>` and `<convertSetToList>` (the math tokenizer has no
  sets, and extracting needs the engine's tree), and the current core's
  `simplify` levels (ADR 0011).
