# A number read of a math cell is its value

Status: proposed 2026-11-24. Found by the sweep-3 triage of wrong values
in the list operators (`listoperators.test.ts`,
`listcomponentcollections.test.ts`). Generalizes what ADR 0041's
structural `<sequence>` did for its `exclude` and what
`Planning::read_as_number` does for a `<number>`'s value; follows ADR
0043 (`Flow::ValueOf`, picked by the type pass).

## Context

A cell that holds math holds a handle: the id of an expression in the
engine (ADR 0005, ADR 0041 decision 8). A `<mathList>`'s entries are
such cells, and so is an entry inside a math input's value. A reader that
computes with numbers and aliases that cell computes with the handle:
`<cumulativeSum>$ml</cumulativeSum>` over a math list `10 20 30` gave
`0, 1, 3` (the handles' running sums), a `<numberList>$ml</numberList>`
`0, 1, 2`, a `<median>` the middle handle and an `<indexOf target="20">`
0. Nothing was reported: the document loaded, and showed numbers.

Two readers already evaluated such a cell: a structural sequence's
`exclude` (each entry `Flow::ValueOf(held, held)`) and a `<number>`'s
value read from one reference (`read_as_number`). Every other reader of
a list's entries as numbers aliased them.

## Decision

**Where a list's entry is read as a number, a reference that may name a
math cell is read through `Flow::ValueOf(held, held)`**
(`PlanCtx::entry_number`): an `Evaluate` of the cell when the type pass
types it math, an alias of it otherwise. "May name a math cell" is what
the records tell of the reference (`ref_value_kind`: `Math`, or not
known); a reference to a number, a text or a boolean is aliased as
before, so a write through it still lands on its referent.

The readers: an operator's operands (`operators::operands`, for numbers
and for math; not for booleans, which read a value as a boolean), so the
scan operators, the index operators, the numeric reductions (`<median>`,
and the numeric path of every operator over math) and a sort's numeric
keys; and a `<numberList>`'s entries.

An index operator (`<argMin>`, `<argMax>`, `<indexOf>`,
`<searchSorted>`) that is given a text among its operands refuses it: a
text holds a string id, which no number comparison orders, and the
current core compares texts as text, which this core does not yet do for
these operators.

## Consequences

- A math list's numeric entries are the numbers they are wherever a
  number is read; a symbolic entry (`x`) is NaN there, as a symbolic
  `<math>`'s value is.
- A numeric reader of an entry that is math takes no write through it:
  an `Evaluate` has no inverse. A write through a number list over a math
  list is dropped where it was a write of a number into a handle before.
- An operator over math that is symbolic (ADR 0043) is unchanged: its
  value is its `expr` evaluated, and the numeric path it does not read
  costs nothing it did not cost before (the evaluated entry is a hidden
  port only the numeric value reads).
- Left: the scan operators over math (`<cumulativeSum>$ml</cumulativeSum>`
  of `x y z` is `x, x + y, x + y + z` in the current core) are numeric
  only, so they are NaN there; making them symbolic is ADR 0043's rule
  extended to a list of results, and the current core's scans give math
  entries, which `<collect componentType="math">` gathers.
