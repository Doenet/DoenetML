# An extend of a prop is the value as the type reads it

Status: proposed 2026-11-24. Builds on ADR 0032 (a reference plan is a
path of steps ending at a port), ADR 0023 (an extend takes the referent
as it is bound), ADR 0025 (an extend across related types is the value as
the element's type), ADR 0041 (every list is a sequence) and ADR 0046 (a
reference that names nothing is a warning).

## Context

The gap list's largest reference row was `cells-path-too-deep` (43
tests, "built as an error"). Read against the tests, none of them is a
path deeper than the step language of ADR 0032 can say. Every one is
`extend="$x.prop"` (or `[k]` after it), and the message came from
`plan_extend_prop`, which refused any type that declares no
`extend_value` with the path error:

| shape | tests | example |
| --- | --- | --- |
| a pair-valued prop extended as a `<vector>` | 27 | `<vector extend="$v.displacement"/>`, `<vector extend="$r.direction"/>` |
| a combined prop extended as a value list | 6 | `<numberList extend="$A.matrixSize"/>` |
| a list prop extended as a value list | 5 | `<mathList extend="$fis.iterates"/>` |
| an entry of a point list extended as a point list | 4 | `<pointList extend="$l.points[$n]"/>` |
| a prop of a free `<when>` | 1 | `<when extend="$w.value"/>` |

Five more ("unsupported construct") were an index on a prop the type
lacks (`$p.styleDescription[1]`, `$P.xs[$i]`), which the path walk
reported as too deep before it looked the prop up.

Of the related rows, `cells-uncopyable-type: cannot copy a <graph from
another scope>` (15) is a container copy whose `extend` the outlining of
container copies could not take to one element of its own template: in
twelve the reference names nothing (`$invalid`, `$p.badProp`,
`$m.latex`, `$P.label`, `$s.cellB1`, props this core lacks), and in
three it reaches a component through a select's pick (`<p
extend="$sel[1]"/>`). `cells-no-default-prop` (20) is a bare reference
to a collect, a group, a repeat or a setup read as a value, no path: it
does not share the cause.

The current core makes each `extend` of a state variable by the
variable's `shadowingInstructions`: a vector-valued variable creates a
`<vector>` whose `displacement` is the value, an array of numbers a
`<numberList>` of its entries. Here the value of a prop is its port's
cells, and a planner type reads attributes and children, never a port.

## Decision

1. **A type declares how an extended value is given.** Two more
   `ExtendValue` forms, beside `Scalar`, `Point`, `Expr` and `List`:
   `Attr(name)`, the value is the attribute `name`, and `Children`, the
   value is the element's one child, a reference. An element of such a
   type extending a prop is planned by its type's planner from its own
   record with the reference as that attribute (a `Point` attribute takes
   it as a point-valued reference, a `Scalar` or `Value` one as a source)
   or as its children, where it wrote none itself; what it writes wins.
   It shares no given leaf with the referent, as an extend of a prop never
   did: the referent is a port, not an element. `<vector>` declares
   `Attr(displacement)`, so `<vector extend="$v.displacement"/>` is
   `<vector displacement="$v.displacement"/>`: its tail its own, a drag
   writing the displacement back. The value lists (`<numberList>`,
   `<mathList>`, `<textList>`, `<booleanList>`) declare `Children`.

2. **A combined prop is a fixed sequence of entries.** Extended as a
   list's children, a combined prop (`PropSel::Parts`: `matrixSize`,
   `displacement`, `coords`) gives an entry per part, each a reference to
   that part's port, as the current core's array variables do. A list
   prop (`$l.numbers`) is spliced as any reference to a static sequence
   is (ADR 0041); a one-cell prop is one entry.

3. **An extend that names nothing extends nothing.** A reference that
   names nothing is planned as `Step::Nothing` and warned where it is
   written (ADR 0046). Its `extend` is now no extend at all: a container
   keeps its own children and takes no clones, and any element is planned
   from its own record. `<p extend="$p.badProp"> there</p>` is the
   paragraph " there", as in the current core.

4. **An index on a prop the type lacks names nothing.** `$p.noSuchProp[1]`
   is the unknown prop's warning, not a path too deep, so the element
   builds with the missing value (decision 3 when it is an extend).

What this changes in the step language of ADR 0032: nothing. A path still
ends at a port; what changed is how an element reads a port it extends.

## Not done, and the decisions they need

- **An entry of a point list extended as a point list**
  (`<pointList extend="$l.points[$n]"/>`, 4 tests) stays refused, as ADR
  0041 step 1 records. The current core makes a list of one point, or of
  none when `$n` names none, so `Ps[1]` exists only for a valid index. The
  options: (a) keep refusing; (b) a list of exactly one entry, the
  missing point when the index names none (static, but `Ps[1]` always
  exists, unlike the current core); (c) a list whose count is 0 or 1 by
  the index, structural, rebuilt when the index moves in or out of range
  (ADR 0041 step 4).
- **A container copy through a select's pick** (`<p extend="$sel[1]"/>`,
  3 tests): the copy's clones would be of children in another template
  (the option's), named under the copy in this one. Outlining clones only
  within one template. The options: (a) keep refusing; (b) clone across
  the template boundary, rebasing each clone's references through the
  path, as an extend's record is rebased (`compile/rebase.rs`), which
  makes a copy's names depend on which option the seed picks, so its
  names would be a choice's interface (ADR 0009); (c) read such a copy
  as a reference to the pick (a `$sel[1]` child), with no names of its
  own.
- `<mathList extend="$fis.iterates"/>` needs `<functionIterates>`'s
  `iterates` to be the list of iterates (here it is their count), and
  `<when extend="$w.value"/>` a free `<when>`; neither is a path.
- An index on a known one-cell text prop (`$p.styleDescription[1]` once
  `styleDescription` exists) reads the missing value here (ADR 0041:
  a scalar is a sequence of one); the current core warns
  `doenet-w0100`. Whether this core warns too is left open.

## Consequences

- `cells-path-too-deep` now means a path the step language cannot say;
  27 + 6 of its 43 tests load (`vector.test.ts` 12 to 25 passing,
  `ray.test.ts` 11 to 21, `matrix.test.ts` 0 to 3).
- Tests: `vector.spec.rs` ("an extend of a pair-valued prop is a vector
  of that displacement"), `number_list.spec.rs` ("an extend of a prop is
  the list of that prop's entries"), `tests/extend.rs`
  (`an_extend_that_names_nothing_extends_nothing`).
  `tests/diagnostics.rs`'s outlining failure under a cloned subtree now
  copies a container holding a repeat, since an extend that names nothing
  no longer fails.
