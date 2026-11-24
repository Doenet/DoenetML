# A function's extrema are one search, held in a math cell; a spline is pieces

Status: proposed 2026-11-24. Follows ADR 0041 (decision 2: a sequence
with no cap stays inside the math handle) and ADR 0049 (a function is its
pieces, each an expression in a variable on a domain).

## Context

The current core's `<function>` and `<piecewiseFunction>` have `minima`,
`maxima` and `extrema` (lists of points `(x, f(x))`), their counts, and
`globalMinimum`, `globalInfimum`, `globalMaximum` and `globalSupremum`
(a point, or none). `utils/extrema.js` finds them numerically: a grid of
a thousand cells over the domain (the whole line cut to `200 xscale`), a
root of the derivative where it changes sign across a cell (the exact
critical point when the engine has the derivative's every root, else
`fzero`), `fminbr` on any other cell, a finer grid where a cell has more
structure, and the domain's ends tried for the global ones. The
maximum is the negative's minimum. A piecewise function's are its
pieces', each on what of its domain no earlier piece takes, with the
ends between pieces tried alone.

How many extrema there are is no fact the type knows, so by ADR 0041
decision 2 they stay inside a math cell, and `$f.maxima[1][2]` is an
entry step into it (`EntryIndex::IN_HANDLE`). What was missing is the
search.

## Decision

- **One symbolic instruction per direction.** `SymKind::Extrema { max,
  piecewise }` reads the function as `SymKind::EvalFunction` does (its
  domain's four cells, then each piece's six), after its `xscale`, and
  writes one math cell: the tuple of the local extrema (a list of
  points), the global one and the infimum (or supremum), each a point or
  the empty list for none. The props are entries of it (`SymKind::Entry`
  by a constant index): `minima`, `globalMinimum`, `globalInfimum`, and
  the same of the maxima. `extrema` merges the two lists by location
  (`SymKind::MergeExtrema`), and each count is a `SymKind::Count`. A
  search runs only when what it reads changes, and only when something
  reads its props: pruning leaves a function no one asks about as cheap
  as before.
- **The search is the current core's, ported** (`sym/extrema.rs`,
  `sym/brent.rs`), with its tolerances, its exact critical points (the
  engine's `critical_points`) and its pole rejection.
- **The function is evaluated as the current core's compiled function
  evaluates it**: in real arithmetic, so a pole of a quotient is
  infinite (`1/x` at 0, an infinite supremum at an open end), with the
  engine's complex evaluation where real arithmetic does not reach. A
  value that is complex (`sqrt(x)` below 0) is no NaN to the current
  core: its cell is searched, finds nothing, and ends a minimum begun at
  its left; the port does the same.
- A `<function>` and a `<derivative>` (one piece) are searched on their
  domain; a `<piecewiseFunction>` is searched piece by piece. A function
  of several variables, or one with no expression, has none.

## Considered options

- **A capped list of extrema.** Rejected by ADR 0041: no cap is known
  (the current core's grid finds as many as there are cells).
- **Each prop its own search.** `minima` and `numMinima` would search
  twice; one search per direction, its parts read as entries, searches
  once.
- **The engine's evaluator as it is** (`evaluate_fast_f64`). It gives no
  number at a pole (`1/x` at 0, a complex quotient by zero), where the
  current core's infinities decide the global extrema at an open end.

## Consequences

- A `<function>`'s table gains `xscale` and ten extrema props; nothing
  is computed for a function whose extrema no one reads.
- `$f.minima[2][1]` read by a `<math>` is the location. Read by a
  `<number>` it was not evaluated (a number aliasing a math cell held
  its handle), the same gap `<number extend="$mi[2]"/>` had; *since
  2026-11-24* a number reading what may be a math cell evaluates it
  (`Planning::read_as_number`).
- `<pointList extend="$f.extrema"/>`, a list whose count follows a
  value (ADR 0041 step 4's structural list): *done 2026-11-24*, a list
  over a math value settled late (ADR 0063). The extrema props declare
  `expr_when`: each holds an expression.

## Interpolated functions

Added 2026-11-24, with ADR 0041 (decision 2: a sequence whose count
moves with a value is a capped list when the type knows a cap).

### Context

The current core's `<function>` given `through`, `maxima`, `minima` or
`extrema` points (and `throughSlopes`, `xscale`, `yscale`) is a spline
(`Function.js`: `calculateInterpolationPoints`,
`computeSplineParamCoeffs`). It orders the points given with a location,
places those given without one, adds a point between two extrema of one
kind (or near ones of the other kind) so each stands out by `yscale`,
adds a point beyond each end, gives every point without a slope the
monotonic cubic's (Steffen 1990), and joins each two points by the cubic
with their values and slopes; the first and last cubics run on to the
infinite ends. A coordinate a point does not give (`(2)`, `(2, )`,
`( , 3)`) is chosen by its neighbors. Its numerical function, extrema and
curve are read from the cubics; it has no formula.

How many points the spline has depends on the values (an extremum gains
a point before it only when its neighbor is too near), but never more
than three per point given and one at each end.

### Decision

- **The spline is pieces** (ADR 0049): piece `k` is the cubic in `x -
  x_k`, written in Horner form in the function's variable, on `[x_k,
  x_{k+1})`, the first from -∞ and the last to ∞. A `<function>` given
  points is planned as a piecewise function of them.
- **The pieces are a capped list**: one symbolic instruction
  (`SymKind::Interpolate { n }`) reads the `n` points given (each its
  kind, which of its coordinates and slope are given, and their values)
  with `xscale`, `yscale` and the variable, and writes `3 n + 1` pieces'
  cells, those past the spline's count left out (a domain of NaN). Its
  first output is the pieces as one value (a list of tuples) for a reader
  that evaluates the function anywhere (`Document::function_value`),
  which the function's `pieces` prop holds.
- **The rest is a piecewise function's.** Its curve is sampled from the
  pieces (`SymKind::SampleFunction`); its extrema are searched piece by
  piece (above), where the current core reads them from the cubics'
  coefficients; its `domain` cuts it as any function's.
- **A point is written as the current core writes one**: a reference to
  a point, or a tuple, its coordinates expressions evaluated. A tuple of
  one entry is the value, `(2, )` the location alone. A point the spline
  cannot place (two at one location) makes the function NaN everywhere.

### Considered options

- **A function type of its own, evaluated from coefficients.** Rejected:
  every reader of a function (its curve, `function_value`, extrema)
  would need a second representation; pieces are the one they read.
- **A structural list of pieces** (a rebuild when the count changes).
  Rejected: a cap is known, and a drag of a point through would rebuild.
- **Extrema from the coefficients**, as the current core's. They agree
  with the piecewise search within its tolerance; a second search is not
  worth its code.

### Consequences

- A `<function>` given at most 16 points (the instruction writes at most
  255 cells); more is refused.
- `<evaluate>` of an interpolated function and a point constrained to
  one read its formula, which it has none of: not done. Neither is a
  `<derivative>` of one, nor the warnings the current core gives for a
  point it skips.

