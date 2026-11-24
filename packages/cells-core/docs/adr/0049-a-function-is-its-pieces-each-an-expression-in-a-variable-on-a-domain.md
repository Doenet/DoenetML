# A function is its pieces, each an expression in a variable on a domain

Status: proposed 2026-11-23. Builds on ADR 0005 (static lowering of
math), ADR 0011 (one symbolic engine), ADR 0018 (essential means a
student can write it), ADR 0029 (a planner reads no other element's plan)
and ADR 0038 (the core names no component type).

A function of one variable is not one value of the engine. It is a domain
and a list of pieces, each an expression, the variable it is in and the
piece's own domain, all of them cells. Its value at `x` is the first
piece whose domain holds `x`, missing outside the function's domain. A
`<function>` is one piece; a `<piecewiseFunction>` is its children's.

## Context

Before this, `<function>` and `<derivative>` were an expression handle in
`x`, sampled over the graph's x-range: `domain` was refused, a function in
another variable (`variables="q"`) evaluated to missing everywhere, and
`<piecewiseFunction>` and `<curve>` did not exist.

The current core holds a function's domain as an `interval` value (one per
input) and reads it, everywhere a number is wanted, as four numbers
(`find_effective_domain`: the endpoints and whether each end is open; an
endpoint with no numeric value is no bound). Its numerical function
returns NaN outside it. A `<piecewiseFunction>` tries its children in
order (`returnPiecewiseNumericalFunctionFromChildren`), leaving out a child
whose domain is not numeric, and its own domain, without one, is the
least interval holding its children's. Intervals as values are another
wave's work, so this one must not invent an interval type.

## Decision

- **The domain is four cells**, as the current core reads it: lower and
  upper endpoint, and whether each end is closed (1) or open (0). The
  planner reads `domain` the way the current core parses an interval
  (`compile/read/maths.rs`, `plan_interval`): one interval, `[a, b)`,
  each endpoint math text or a reference, `infinity` spelled as a word or
  `∞`. Anything else (several intervals, a reference to an interval) is
  the warning `cells-bad-domain` and the whole line, as the current core
  warns and uses the real line. No interval value is made.
- **The variable is a math cell** holding its symbol, so a function in
  `q` evaluates, samples and differentiates in `q`, and a `$f` reference
  carries it.
- **Symbolic operators take a function as its cells**
  (`program/instr.rs`): `EvalFunction` (an input, the function's domain,
  then its pieces), `SampleFunction` (a range, then the same) and
  `DerivativeBy` (d/dv in the function's variable). An endpoint of the
  function's domain that is no number is no bound; a piece whose domain
  has one is left out, each as the current core does. A curve of one
  piece on the whole line, in a constant variable, still compiles to a
  tape at build time (ADR 0005), so a plain function costs what it did.
- **A function-like type declares it** (`constrain_target { function:
  expr }`, `FUNCTION_PROPS`): its expression, variable and domain props.
  A `<derivative>`, `<clampFunction>` or `<wrapFunctionPeriodic>` of `$f`
  takes `$f`'s variable and domain; `<evaluate>` and a point constrained
  to it read them, the point held in the domain (`VecOp::IntoDomain`: at a
  closed end there, at an open end a millionth of the end's size inside,
  as the current core's numerical nearest point lands just inside).
- **A curve is sampled over the graph's range cut to the domain**
  (`VecOp::DomainRange`), so its ends are the domain's.
- **A `<piecewiseFunction>` reads its `<function>` children's ports**
  (`PlanCtx::children_playing(Role::Function)`, a value read, not a plan,
  ADR 0029). They are not drawn on their own (`Renders::InGraphAlone`).
  Like the current core's, it has no formula: math that reads it is
  refused (`cells-no-default-prop`) rather than reading a blank, and its
  derivative is not taken. `<evaluate>` and `<constrainTo>` of one are
  refused for now: their planner cannot reach its pieces.
- **A `<curve>`** is a function's graph (`curveType` 0, one function or
  one entry), a parametric curve (1: two functions, a function returning
  a tuple, or a tuple `(x(t), y(t))` in `variable`), each coordinate
  sampled as a piece from `parMin` to `parMax`; or a Bézier spline through
  `through` (2), sampled by `SampleBezier` over parameters 0 to `n - 1`,
  its control vectors found from the spline as the current core finds
  them (centripetal or uniform, `splineTension`), or given by
  `<bezierControls>`: vectors in order, each symmetric, or
  `<controlVectors>` with `direction` (`symmetric`, `both`, `previous`,
  `next`, `none`) and `pointNumber`. Its function children are members of
  its record, not components. Its through points are its list: a drag
  moves one (`moveThroughPoint`), and its control vectors follow, being
  relative. `<equilibriumCurve>` is a curve with a 0/1 `stable` its
  switch requests.
- **A reader may evaluate a function anywhere**
  (`Document::function_value`, wasm `function_value`): through the core's
  engine and the function's cells, for a reader that samples a function
  itself (the parity adapter's `numericalfs`).

## Consequences

- A `<function>` has five more props and `<evaluate>` of one reads them:
  four more constant cells, pooled. A `<derivative>` of `$f` cannot see at
  plan time that `$f`'s domain is the whole line, so it cuts its range by
  one more instruction (`tests/live.rs`'s census, 178 to 179).
- A symbolic instruction with no inputs runs once: a derivative of a
  constant expression, taken at build time, used to never run.
- Not done: dragging a control vector, and `changeVectorControlDirection`
  (the vectors `<bezierControls>` gives are fixed); `flipFunction`,
  `extrapolateForward` and `extrapolateBackward`, `periodic`, and a
  function of several variables' domains (each refused as an attribute
  nothing reads); a curve's `fs` for the parity adapter; interpolated
  functions through points, maxima and minima. A function's extrema, a
  dynamic sequence (ADR 0041, step 5), are searched over its pieces by
  ADR 0061.
