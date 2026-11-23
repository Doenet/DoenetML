# Missing is a value of its own, and a reference that names nothing is a warning

Status: accepted 2026-11-23. Supersedes ADR 0013's rule that an unknown
reference is an error on its element, and ADR 0041's reading of a missing
entry as the empty value of its type (its "Indexing" item in Context).

A reference that names nothing is **missing**: no referent, a name several
components share, a property or an index its referent does not have, an
index past the end. It is reported as a warning where it is written, and
the element it is in builds as usual, holding the missing value where the
reference stood. The missing value is a cell value of its own, told apart
from the NaN of a computation that has no value, and it shows as the blank
`＿`. A value computed from it is missing, as the DoenetML principles say
(VAL-5, D37, D40).

## Context

Before this, a reference that named nothing was an error: the element it
was in became an `_error` component, so a point with `x="$typo"` vanished
from its graph, and a paragraph holding `$typo` vanished from the page
(ADR 0013: "an unknown reference is its warning `doenet-w0104` and our
error, since the element did not build"). And a reference that did resolve
to nothing, an index past the end, read a shared NaN cell, so it showed as
`NaN`, the same as `0/0`, and an operator treated it as a NaN.

The principles take the other side on both counts, and the maintainers
chose the principles:

- **VAL-5 (Tier 1).** A reference to one thing that isn't there is missing,
  and shows as `＿`. It never equals anything. Only an empty collection
  shows nothing.
- **NAME-1 (Tier 1), D37.** An ambiguous or unknown name is a warning and a
  blank, not an error: components do not disappear because a reference
  in them is wrong.
- **D40.** `NaN` is kept for a computation on present inputs that has no
  value. A number or a boolean cannot hold a blank, so one computed from a
  missing operand is missing (`<number>$nothing + 1</number>`,
  `＿ and true`); a math can, so the blank takes part (`x + ＿`). A
  comparison is not a computation: `＿ = 1` is false.

## Decision

1. **One value, `MISSING`.** `program::MISSING` is a quiet NaN with a
   payload of its own; `program::is_missing` tests the bits. It is a NaN,
   so every check that a cell holds no number still holds, and nothing it
   reaches equals anything. The build's missing cell and the template
   graph's missing node hold it, and so does a `Choose` with no active
   branch or entry. Moving a cell keeps its bits; arithmetic need not, so
   no rule depends on a NaN's payload surviving an operation.
2. **Every operator says what a missing input gives.** A scalar operator is
   strict by default: any missing input makes its output missing
   (`scalar_ops!` checks before it evaluates). An entry marked
   `missing: reads` reads a missing input as the NaN it is: the
   comparisons (`Lt`, `Le`, `Eq`), the tests (`IsInteger`, `IsFinite`),
   `Copy`, a choice index, and `NanTo`, so that an award whose condition is
   missing earns 0, not a missing credit. A vector operator is strict
   unless `VecOp::strict_in_missing` says otherwise: a choice (`First`,
   `Choose`), a reorder (`Sort`, `Shuffle`, which keep a missing entry and
   put it last), a draw, a shape's identity and the weighted mean of credit
   pass it through, and the positional reductions compare it false.
   Every other reduction, shape, projection and fit made from a missing
   value is missing.
3. **The engine's blank.** A missing leaf, and a math leaf with no
   expression (a blank input), are instantiated as the engine's `Blank`,
   so a math shows `x + ＿`. Evaluating an expression that holds a blank
   gives `MISSING`; comparing one stays false.
4. **A reference that names nothing is planned, not refused.** `plan_ref`
   turns `UnknownName`, `AmbiguousName`, `UnknownProp`, `NotIndexable`
   and `PathTooDeep` into a warning with the same code at the reference's
   node, and a plan of one step, `Step::Nothing`, which every walk (the
   seal's, the template graph's, the build's) reads as missing. The
   element it is in builds; a reader of it reads the missing value. A
   warning raised twice for one node is reported once.
5. **It shows as `＿`.** The core's text (`format_number`, `text_value`,
   booleans, `math_text`) prints the blank for a missing value and `NaN`
   for a NaN. The bridge reads the cell's bits through a `Uint32Array` over
   the same memory (`CellsTable::isMissing`), since a JavaScript number
   need not keep a NaN's payload, and sends the blank for a number's text,
   a math's LaTeX, a text, a list entry, a point's coordinate in text, and
   a boolean's value. A missing point in a graph has NaN coordinates and is
   not drawn.
6. **A lowered math shows the blank too.** A `<math>` the core lowers to
   operators (ADR 0005) has no expression to hold a blank, so its `expr`
   port is `SymKind::InstantiateBlank` over its value and its leaves: NaN
   while the value is there, the math's text instantiated, in the order
   written, while it is missing (`<math>1 + $l[5]</math>` shows `1 + ＿`).
   The engine runs only then; otherwise the instruction is one check. Its
   cell keeps its port's type, a number, since only the display reads the
   handle. `round`, `floor`, `min` and `max`, which the engine reads and
   prints, show the blank in place (`round(＿) + 1`, `min(＿, 3)`); a
   `clamp`, which it does not, and text it does not parse keep a NaN
   expression and show `＿`.

## Consequences

- A typo in a reference no longer removes the component around it: the
  author sees a warning and a blank where the value would be.
- `NaN` on the page now means a computation with no value, never a missing
  reference.
- Diagnostics stay a function of the source (ADR 0013, ADR 0014): a
  reference names nothing or not from the DoenetML alone.
- A spec's expected `MISSING` matches only the missing value and an
  expected `NaN` only a NaN (`testing::spec`), so a test says which it
  means.
- A drawn `<math>` the core lowers costs one more instruction, which
  calls the engine only while its value is missing (one in the golden
  set).
- The checks every operator now makes on its inputs cost one comparison
  of bits per input, in the tick's inner loop.
- Not done here: a property a type has but that holds no value now
  (`$c.maxNumber` with no limit) is missing by the same cell, but a few
  props still compute a plain NaN where the principles want a blank; and
  the standalone `cells-viewer`'s own renderers still print `NaN`.
