# A parent may declare what a child tag is

Status: proposed 2026-11-24.

## Context

Outlining settles an element's type from its tag alone
(`ComponentType::from_tag`). DoenetML has tags whose meaning depends on
where they are written: a `<row>` is a table's row in a `<tabular>` and a
matrix's row in a `<matrix>`, and a `<column>` likewise. The JavaScript
core sugars a `<matrix>`'s `<row>` and `<column>` children into
`<matrixRow>` and `<matrixColumn>` while it expands the matrix
(`Matrix.returnSugarInstructions`). ADR 0041 step 2's third piece left
`<matrix>` open on this question, with three options: a type settled by
its parent, rows written as `<matrixRow>` only, or rows as math text.

## Decision

A type may declare what a child element of a given tag is under it:

```rust,ignore
// <matrix>
child_types { row: MatrixRow, column: MatrixColumn }
```

Outlining reads the declaration of the element a child is written under
(`ComponentType::child_type`) before the tag's own type, and the child is
of the declared type from then on: its record, its planner, its
references and the bridge see a `<matrixRow>`. A tag no parent declares
is the tag's own type, as before. The declared types are `internal`, made
only this way, so no author writes `<matrixRow>` and a `<row>` outside a
matrix is what the tag alone makes it.

The rule is one lookup, on the direct parent only: it neither looks
through a `<group>` nor reaches a grandchild, so what a child is stays a
fact of the source next to it.

## Considered options

- **Rows written as `<matrixRow>` only.** Rejected: the current core's
  documents write `<row>`, and the parity suite does.
- **Rows as math text** (`<matrix>[[a, b], [c, d]]`). Rejected: the
  current core has no such syntax, and a row of references and elements
  is a list's children, which the text form cannot hold.
- **A rewrite by attribute** (`rewrite`, the declaration that makes
  `<group rendered>` a conditional content). Rejected: it decides by the
  element's own attributes, and this decides by its parent.

## Consequences

- `ComponentDef` gains `child_types`; outlining asks the parent's type.
- `<matrix>` (`components/values/matrix.rs`) declares its rows and
  columns: each a list of entries read as a `<mathList>`'s.
- A future `<tabular>` keeps `<row>` for its own row type with no
  conflict.
