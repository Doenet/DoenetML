# An entry inside a matrix is written back entrywise

Status: accepted 2026-11-24. Builds on ADR 0008 (symbolic instructions
in the tick), ADR 0018 (essential means a student can write it), ADR
0041 (decisions 3, 6 and 8) and ADR 0045 (a type owns a fixed set of
inner inputs, a matrix input's grid).

## Context

A `<matrix>` holds its value in one math cell, the matrix its entries
make (`Post::Matrix` over a template whose leaves are its rows' entry
cells; ADR 0041, decision 8). A `<matrixInput bindValueTo="$A">` shows
each entry of the bound value in a box, and in the current core typing
into a box writes the matrix's entry; the size controls resize the bound
value. `$A[i][j]` reads an entry (decision 9: entry, then entry), and a
`<mathInput bindValueTo="$A[2][1]">` writes it.

ADR 0008 gave the symbolic instructions no inverse rule. Two have one in
the request engine already, because only the engine can compute it:
`Evaluate` writes a constant expression, a subset's value writes the
subset as written (`tick/invert.rs`). An entry inside a math value is
the same kind of request.

## Decision

1. **An entry of a value is read by rows.** ADR 0041 step 5's entry
   inside a handle (`SymKind::Entry`, whose inverse writes the value
   with the entry replaced) reads a matrix by rows, row `k` a tuple of
   its entries, and a transposed vector (`(a, b)^T`, `(a, b)'`) as its
   one row; replacing a row writes that row of the matrix, or the vector
   still transposed. Entry (row, column) is two such steps, which is how
   a matrix input reads a value: a matrix; a tuple or vector as a column
   (its entry `i` a scalar, whose one entry is itself); a transposed one
   as a row; anything else 1 by 1. `SymKind::MatrixSize` reads its rows
   or columns, and a request on it writes the value resized, a vector
   staying one while it stays a column; it writes its input 0
   (`SymKind::writes`). How many entries a math holds (`Count`,
   `numDimensions`) is unchanged: a matrix is not counted by rows.
2. **A matrix of entries inverts entrywise.** A `<matrix>`'s template
   (`Instantiate` with `Post::Matrix`) given a desired matrix of its own
   size writes each entry that is one cell alone and changed: the
   expression to a math cell, its value to a number cell; an entry that is
   no cell alone (a filled `defaultEntry`, an expression) is left as it
   is. A matrix of another size is dropped. Its template writes every
   input (`u64::MAX` in the build, the template graph and the program), so
   the record finds its entries writable through it (ADR 0018).
3. **`$A[i][j]` on a `<matrix>`** is two in-handle entry steps (ADR
   0041 step 5: its default prop stands for an expression and it has no
   list), by literals or cells, typed math; an index past the size reads
   the blank. A write through it replaces the entry in the row, the row
   in the matrix, and the matrix's entries (decision 2).

## Considered options

- **Bind each box to the matrix's entry cell by aliasing**, as a list's
  entry is (decision 6). Rejected for now: a `<matrix>` holding a copy of
  a value (`<matrix>$A</matrix>`, `extend="$A.value"`) has no entry cells,
  only the expression, and the bound value may be any math (a `<math>`,
  a math input, another matrix input's value); the projection covers all
  of them, and ends at the entry cells when there are some.
- **A rebuild per write.** Rejected as ADR 0008 rejected it for every
  keystroke.

## Consequences

- A bound matrix input's boxes, its size controls, `$A[i][j]` and an input
  bound to it write the matrix's entries; copies follow.
- A `<math>` whose expression is constant math text holds no state a write
  could land on (ADR 0028), so a matrix input bound to one cannot change
  it; nor a `<math>(a, b)</math>`, a tuple component until ADR 0041 step 5
  merges tuples into the sequences.
- A matrix template of more than 64 entries writes only the first 64 (the
  `writes` mask).
