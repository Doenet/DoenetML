# Counts are a static sequence of numbers, counted from what they count into

Status: proposed 2026-11-25. Sweep 4's count operators (`<tally>`,
`<binCounts>`) and `<sortIndices>`, following ADR 0041 (every list is a
sequence) and ADR 0053 (a type may declare a second named sequence over
its own ports).

## Context

The current core's `<tally>` and `<binCounts>` (`CountOperators.js`) are
list components of numbers, one count per category or per bin, whose
length is not the length of their input: a tally's is the number of
categories, declared (`categories="1 2 3"`) or, when none are, the
distinct values it is given; a bin count's is one less than its cut
points (`bins`), or none when they describe no bins. `<sortIndices>`
(`SortIndices.js`) is the permutation `<sort>` applies, a list of
positions as long as its operands.

A list operator here (`<sort>`, `<cumulativeSum>`) is a static sequence
whose count follows its children (`entries: children`); a sampler's
follows its record (`static_count`). Neither says "as many as an
attribute's entries", and a reference among those entries to another
list (`categories="$cats"`, `bins="$edges"`) contributes as many entries
as that list has.

## Decision

1. **`<sortIndices>` shares `<sort>`'s order.** Its planner is `<sort>`'s
   reading of the operands and its order port (`sort::wire_order`, `Out::
   Indices`); its entries are that order, numbers, a static sequence as
   long as its children. A request cannot change one.
2. **A count is a number.** Every count is a number entry of a static
   sequence (`values: number of Number`), as the current core's are
   `<number>`s.
3. **Counted from an attribute's entries.** A type may declare that its
   static sequence counts the entries one of its record's attributes
   makes (`counted_entries { pieces, count }`): the pieces of that
   attribute, each reference to a static sequence among them its entries,
   and its count a function of theirs. A `<tally>`'s is one per declared
   category; a `<binCounts>`'s one less than its cut points, none when
   fewer than two or when written cut points do not ascend. A reference to
   either among a list's children (`<sum>$t</sum>`,
   `<numberList>$t</numberList>`) contributes its entries.
4. **What describes no bins is decided when compiled.** `bins` absent,
   fewer than two cut points, or written cut points that decrease or are
   no number give no entries and the current core's warning
   (`doenet-w0138`, `w0139`, `w0141`); operands that are texts give a 0 per
   bin and `w0140`. Cut points that follow a value and come not to ascend
   make each count the missing value (ADR 0046), the count unchanged: the
   current core withholds every count instead. `VecOp::BinCounts` counts as
   the current core's `countValuesInBins`: `[a, b)`, the last bin closed, or
   `(a, b]` (`closed="right"`), the first closed.
5. **A tally compares the way its operands are read.** Its operands are
   read as `<sort>` reads them (one kind for them all). A written category
   is compared as a number when they are numbers or math and it is one
   (`1/2`), as true or false when they are booleans, else as its text; a
   category given as a reference is its cell (`SymKind::Tally`). A value
   that is no number by kind equals nothing, so a malformed `<number>`
   matches no category, not even one spelled `NaN`. Written categories that
   compare equal are `doenet-w0142`. The categories, as written, are the
   tally's second named sequence (`categories`).
6. **Not decided here: a tally with no declared categories.** Its count is
   the number of distinct values, which follows the values. ADR 0041
   decision 2 makes that a dynamic sequence, a capped list (its cap the
   number of operands), but a capped list of numbers with a second named
   sequence of categories beside its hidden rows is machinery the core does
   not have; a structural count (rebuilt as the distinct values change) is
   the alternative. It is refused, but for no operands (no categories).
   So is the info a tally gives for values outside its categories
   (`doenet-i0050`), a diagnostic of the values a tick makes, where every
   diagnostic is of the document text alone.

## Consequences

- `countoperators.test.ts` passes 30 of 53 (from 0); `sortIndices` passes
  its cases of `listoperators.test.ts`.
- A paragraph showing a tally's categories (`<p>$t.categories</p>`) shows
  the first only: a `$ref` child naming a second named sequence is placed
  as one value, as `$s.componentOrder` of a sort is. That is a gap of
  `$ref` children, not of the tally.
- `binEdges`, the cut points read back, is not a prop: a second named
  sequence has one entry per entry of the list, and a bin count has one
  fewer than its cut points.
