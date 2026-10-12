# Plan 2: real functionality on the cell architecture

The brief is `docs/history/instructions2.md`. This file records the decisions reached
before implementation. Vocabulary is in `CONTEXT.md`; the one hard-to-reverse
decision is ADR 0003.

## Bar for the verdict

A snag is **fatal** if a feature needs an escape hatch that puts
component-organized code back in the core (a per-component custom forward or
inverse function), or if an interactive path exceeds 50 ms on documents the
current core handles. A snag is **noted** if it needs a new core concept that
is generic rather than per-component (a new cell kind, a rebuild step).
Everything else passes. Each area ends with a verdict paragraph in
`results/NOTES.md`.

Budgets: 50 ms per drag tick and 50 ms per rebuild, at 10k components.
Changing an iteration count is a common action (a slider revealing points),
not a rare one.

## Order of work

1. Inverses (slider). Small; sharpens the operator set.
2. Arrays and repeat. Largest and riskiest.
3. Types. Expected to dissolve; see below.
4. Symbolic. Design note plus a tiny experiment.

## 1. Inverses: `<slider>`

Scope: numeric mode only (`from`, `to`, `step`, `initialValue`,
`bindValueTo`); no items children, no text mode. A minimal React range
renderer so it joins the Playwright drag measurement.

`from`, `to`, `step` are cells (Doenet allows `step="$s"`). A constant
attribute folds into a literal-parameter operator at build time. `Clamp` gains
a cell-bounded variant. New primitives are added freely (Round, Floor, Div,
Min, Max); a custom-closure operator is never added. If a step cannot be
composed from primitives, that is the finding.

Chain, all ordinary operators:

    numItems = floor((to - from) / step) + 1
    index    = clamp(round((pre - from) / step), 0, numItems - 1)
    value    = from + index * step

`pre` is the slider's own essential cell, or an alias of the bound
component's value cell when `bindValueTo` is set. No slider-specific code
handles binding; if the bound value is itself derived, inversion continues
through that component's operators.

Inverse rules (ADR 0003): idempotent operators (Round, Clamp) invert by
projection, so the bound component receives the snapped value as in Doenet.
Requests are not given a third outcome; the renderer reads the cell after the
tick. An inverse may reject on domain grounds (non-integer ask on an integer
cell) through the existing dropped-request path, so a request may name any
cell including `index`.

Tests: slider bound to a derived number bound to an input; slider bound to a
slider with a different step (two projections in one chain); slider whose step
is bound to another slider.

## 2. Arrays and repeat

Only `<repeatForSequence>` is implemented, with `length="$n"` as the dynamic
driver and `valueName`/`indexName` giving fixed cells per iteration. `<repeat
for>` is noted as equivalent once a group concept exists.

Array props have a fixed shape per component; all dynamism routes through
structure. `$list[3]` and `$r[k]` are positional, 1-based.

**Iteration count** = clamp(floor(n), 0, cap), with NaN as 0 and a default cap
of 10,000. It is a derived cell and a structural cell.

**Rebuild.** When a structural cell changes during a tick, the core rebuilds
the whole document from the retained wire bytes within that tick and sets a
`rebuilt` flag on the tick result; the renderer then re-reads the component
table. No in-place graph edits. Essential values survive by **essential key**
(document path including repeat name and 1-based iteration position, plus
prop), so N going 10 → 5 → 10 brings iteration 7 back with its last values.
Cell indices may move after a rebuild; the renderer first treats a rebuild as
a reload. Index-stable allocation by key is built only if measurement shows
React re-render breaks the budget. Scoped (subtree) rebuild is the fallback
if whole-document rebuild crosses 50 ms at 10k components.

**Missing referents.** `$r[32]` with 10 iterations resolves to a NaN cell;
after a rebuild that creates iteration 32, the reference aliases the real
cell. The recurrence `$r[$i-2]` gets NaN for the first two iterations. Indices
in references are static per iteration; dynamic indices (`$r[$n]`) are a
follow-up, likely a Select operator.

**Collect.** `<collect>` over a repeat is included in the fixture. Its count
is a function of structure and is recomputed during rebuild; `$c[k]` is
positional. Value-sized arrays elsewhere in Doenet (solveEquations,
extrema, split, pointList with maxNumber) are treated in the design note as
structural cells whose producer is an operator; nothing new is built for
them.

## 3. Types

Integer-ness is an invariant maintained by operators (Round, Floor, counts)
and checked by inverses, not a storage type. All cells stay `f64`; integers
to 2^53 are exact. Typed storage arrays are built only if this hits a wall.
The current core has no static types either; `<integer>` is a rounding
component.

Booleans are 0/1 in `f64`: a `<booleanInput>` drives a point's `hidden` prop
and the renderer reads it. Measurement: a Round-heavy chain against the plain
chain, expected to show no cost.

## 4. Symbolic

Assumption: a Rust expression library under our control will exist. The core
holds an **expression arena**; a **math cell** holds a handle into it, and
symbolic instructions sit in the same program and schedule as numeric ones.

**Lowering** is static: a `<math>` whose leaves are all number literals or
number-typed components becomes numeric operators and never a math cell.
Anything else is a math cell with a derived `f64` cell holding
evaluate-to-constant (NaN when not numeric), which is what `<number>` with
math children reads. No author-facing distinction between computational and
symbolic math.

Experiment: a fifty-line hand parser for `+ - * /`, parentheses, numbers,
`$ref` and single-letter symbols; one handle-typed cell kind; one evaluate
instruction; a document showing both lowered and symbolic math. Inverses
through symbolic operators are out of scope.

## Fixtures and measurement

Generated documents: slider through a chain of numbers to an input; slider
bound to a slider with a different step; repeat of N points with length from
a numberInput plus a collect over it; repeat with the i-2 recurrence;
booleanInput hiding points.

Measurements: rebuild time against N at 100, 1k, 10k and 50k with the 50 ms
line marked (50k is there to find the crossing); slider drag through the
bound chain in Playwright; Round-heavy versus plain chain. Current-core
baseline for slider drag and N change at 100 and 1,000.

## Follow-ups, recorded not decided

- Cross-session essential keys (reloading a document).
- Dynamic indices via a Select operator.
- Conditional content (structure depending on a boolean cell).
- Inverses through symbolic operators.
- Scoped rebuild and index-stable rebuild, unless measurement forces them.
- `<repeat for>` over a group.
