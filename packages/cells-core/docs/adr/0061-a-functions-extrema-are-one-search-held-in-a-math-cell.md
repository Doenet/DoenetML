# A function's extrema are one search, held in a math cell

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
  `<number>` it is not yet evaluated (a number aliasing a math cell
  holds its handle), the same gap `<number extend="$mi[2]"/>` has.
- Not done: an interpolated function's (a `<function>` through points,
  maxima and minima), and `<pointList extend="$f.extrema"/>`, a list
  whose count follows a value (ADR 0041 step 4's structural list).
