# A list over a math value is settled late, by its referent

Status: proposed 2026-11-24. The user's decision for ADR 0041 step 5's
open item ("a list or an operator reading `$mi` as its entries"): a list
whose content is one reference to a math value is settled once names
resolve, by the referent's type: structural (repeat-like, ADR 0041 step
4) over a math value, static over another list; an operator reading a
math value's entries reduces symbolically inside the value, with no
rebuild. Follows ADR 0041 (decisions 2, 3 and 5), ADR 0040 (decision 3,
an item per iteration) and ADR 0043 (an operator over math).

## Context

A math value can hold a list with no cap the type knows: a math input's
typed `1, 2, 3`, a `<math>` written `1, 2, 3`, a function's maxima,
minima and extrema (ADR 0061). ADR 0041 decision 2 keeps such a sequence
inside its math cell, `[k]` an entry step inside the handle. What was
left: `<mathList>$mi</mathList>`, `<numberList>$mi</numberList>`,
`<pointList extend="$f.minima"/>`, `<pointList
extend="$f.globalMinimum"/>`, lists whose count follows the value and
whose entries are components (rows a renderer draws, `$l[2]` a
component), and `<sum>$mi</sum>`, an operator whose operands are the
value's entries. The current core merges a math child whose value is a
`list` into the list's entries (`mergeMathLists`, `isMathList`: a `list`
head, never a tuple), and shadows an array state variable for an extend
of `globalMinimum` (a point, or none).

A list element is laid out when outlining meets it, before the type of
what its one reference names is known: whether `$x` is a math input or
another list is a fact of the name table, complete only once the walk is
done.

## Decision

1. **Settled late, by the referent's type.** Outlining records each
   `<mathList>`, `<numberList>` and `<pointList>` whose content is one
   reference: `extend` and no children, or one reference among its
   children, and no attribute but `name` (`may_be_over_value`). Once every
   name is in the table and every `extend` planned, it settles each
   (`settle_over_values`, before a repeat's item): the list is **over a
   math value** when the reference names a `<math>`'s or `<mathInput>`'s
   value (its handle prop), a prop that stands for an expression
   (`expr_of`, or `expr_when`, as a function's extrema props now declare),
   or an entry inside one (`$f.minima[2]`). It then takes the type its
   type declares (`over_value: OverValueMathList`, `ComponentType::
   over_value`) and a body with its item, as a repeat-like type has; its
   `extend` is no copy. Over anything else (`<mathList>$ml2</mathList>`)
   it stays the static list it is. The read of the referent's type is
   recorded, so a box it names boxes the list.

2. **A list over a math value is repeat-like.** `structure: Repeat {
   count: numComponents }`, an `item:` per iteration (ADR 0040): its
   `expr` is the value as a math cell (the reference as a leaf, a number
   made one), `numComponents` how many entries the value holds read as a
   list's, a structural cell, so a change of the count is a rebuild; its
   entry `k` is entry `k` of the value read as a list's
   (`SymKind::ListItem`). **Read as a list's**: a `list`'s items, anything
   else one entry, itself (a tuple is one point and one math), the missing
   value none (`SymKind::ListCount`), as the current core's
   `mergeMathLists` reads a math child. A math list's item is a math
   value, a number list's that entry evaluated, a point list's a point of
   its first two entries evaluated. A write through an entry writes the
   value with that entry replaced (the inverse of `ListItem`), so
   `<mathInput bindValueTo="$l[2]"/>` writes the math input the list is
   over.

3. **A bare reference reads the value.** The type `reads_as: Math`: `$l`
   in a paragraph is a `<math>` of the value, the entries' aggregate (ADR
   0041 decision 5), as a bare `$mi` is a math (ADR 0025). Where a value
   is read (`<math>$l</math>`, an operator's operand, `<number>$l</number>`)
   the reference reads the value, a math cell.

4. **An operator over one math value reduces inside it.** A `<sum>`,
   `<product>`, `<mean>`, `<min>`, `<max>`, `<gcd>`, `<lcm>`, `<mod>`,
   `<variance>` or `<standardDeviation>` whose operands are one reference
   alone that may be math (its records show it is, or do not tell) is
   planned as over that one operand, with a post that reduces the
   instantiated value's entries, read as a list's (`Post::Reduce`):
   `1 + 2 + 3`, `(x + y) / 2`, `min(x, y)`, the variance as the operator
   spells it over operands, then simplified or expanded as the element
   says. The kind is decided as ADR 0043 decides it: symbolic when the
   operand can be math, so a number is the numeric path's operand of one,
   which is the same value. A `<count>` or `<median>` of one reference its
   records show is math reads the value (`ListCount`; the `median` of its
   entries, evaluated), both numeric. Nothing is rebuilt.

## Considered options

- **Decide when outlining meets the list.** Rejected: the referent may be
  written after the list, and what a name is is the name table's.
- **A capped list over the value.** Rejected by ADR 0041 decision 2: no
  cap is known for a typed list or a function's extrema.
- **An operator over the structural list's items** (gathered per build).
  Rejected by the user's decision: the reduction is inside the value,
  and an operator over a math input would rebuild on every count.
- **`Entry` and `Count` for the entries.** Rejected: they read a tuple's
  entries (`numDimensions`), where a list reads a tuple as one entry.

## Consequences

- Three internal types (`components/values/over_value.rs`), tags
  `mathList`, `numberList` and `pointList`; two symbolic instructions
  (`ListItem`, `ListCount`) and a post (`Post::Reduce`).
- A list with any attribute beside `name` and `extend` (`maxNumber`,
  `displayDigits`, `mergeMathLists`) stays static, as before: its
  attributes are the static list's, which the structural one does not
  read. A display setting on a list over a math value is not done.
- A bare reference reads the value as a `<math>`: a number list over
  `1/3` shows `1/3`, where the current core's list shows `0.333`; a
  point list's shows its points as a math does.
- A container copy holding one (`<section extend="$s"/>` of a section
  with a list over a value) is refused and boxed, as one holding a
  repeat is: a clone has no node to key its count by, and the clones are
  made before the lists settle. The current core copies it.
- An index by a cell into the list as a component
  (`<point extend="$pl[$k]"/>`) is refused, as for any repeat; read a prop
  (`$pl[$k].x`) or use a literal index.
- A function's extrema props declare `expr_when` (they hold an
  expression), so a reference to one reads as math where the records are
  read (`ref_value_kind`).
