# A list declares several named sequences, and hides its rows by its own

Status: proposed 2026-11-25. The user's decision of sweep 4 (a): a list
may declare several named sequences, its per-row hide sequence separate
from its public ones. Builds on ADR 0041 (every list is a sequence;
decision 1 lets a type offer several named sequences, decision 2 the
capped list) and ADR 0053 (a type's second named sequence over its own
ports). Completes ADR 0078 decision 6 (a tally with no declared
categories) and part of ADR 0079's "Not done" (a multivariate sample's
`means` and `variances`).

## Context

A list declared at most one second sequence over its own ports, its
`companion` (ADR 0053): one cell per entry after the entries, public by
its name (`<shuffle>`'s `componentOrder`, `<choiceInput>`'s
`choiceOrder`, `<tally>`'s `categories`). A capped list (ADR 0041 step 5,
`<intersection>`) used that same slot for each entry's `hide`, which its
made rows alias (`ListShape::row_hide_slot`), so the hide sequence was a
public prop (`$int.hidden`) and a capped list could have no other named
sequence. That blocked two things: a `<tally>` with no declared
categories, which the user made a capped list (ADR 0041 decision 2:
capped at its operands, padded with the missing value, a live count of
distinct values) that also has `categories`; and a
`<sampleMultivariateRandomNumber>`'s `means` and `variances`, two lists
beside its values.

## Decision

1. **A list names several sequences, each one cell per entry.**
   `ListProp::sequences` (`sequences: [a, b]` after a value list's
   `values:` in `component!`; `sequence: name` for one with no entries
   before it, as before) lists them in order; each is public by its name
   (`PropAt::Sequence(i)`), laid out after the entries, one cell per entry,
   in the order declared, and set by its planner with
   `ElemWiring::set_sequence(name, wires)`. A path may index one as it
   indexes a value list (`$s.means[2]`).
2. **A capped list's hide sequence is its own.** A capped list
   (`ListProp::live`, `capped: [x, y], live: n` for points, `live: n`
   after a value list's `values:`) has one more cell per entry after its
   named sequences, which has no name and is no prop: entry `k`'s `hide`,
   which a made row of it aliases (`ListShape::hide_slots`,
   `row_hide_slot`). Its planner sets it with `ElemWiring::set_hides`, or
   `hide_past(live, also)`: 1 past the live length, else the list's own
   `hide`. An element's props are its table's, then its entries' cells,
   then each named sequence's, then the hide sequence's (`ListShape`).
3. **A tally with no declared categories is a capped list of numbers.**
   Its cap is its operands, one entry each; its live length
   (`numComponents`) is the number of distinct values among them, the
   `k`-th entry counting the `k`-th in order, the rest the missing value
   and their rows hidden; its `categories` are those values, each the
   first operand equal to it (shown, so a request on it is dropped). A
   symbolic operator, `SymKind::TallyDistinct`, finds them: values equal
   as `SymKind::Tally`'s are, a value that is no number by kind (a
   malformed `<number>`) no value, ordered by value when every one is a
   number, else by text, as `SymKind::Order` orders them (the current
   core's `distinctValues`). A tally with declared categories is the same
   capped list with every entry live; `numComponents` is its count.
4. **A multivariate sample's means and variances are its named
   sequences.** `<sampleMultivariateRandomNumber>` declares `means` and
   `variances`, one per category, from `VecOp::Moments` of the
   multivariate hypergeometric (the categories' sizes its excludes): `n K
   / N` and `n p (1 - p) (N - n) / (N - 1)`, 0 for a population too small
   to divide by, NaN where the parameters describe no population, as the
   current core's `means` and `variances`; with no `numDraws`, the
   missing value, as its values are.

## Consequences

- `<sort>`/`<shuffle>`'s `componentOrder`, `<choiceInput>`'s
  `choiceOrder` and declared `<tally>` `categories` read as before. An
  `<intersection>`'s hide sequence is no longer the prop `hidden`; its
  rows hide as before (tests read a row's `hide`).
- `countoperators.test.ts` passes 33 of 53 (from 30);
  `samplemultivariaterandomnumber.test.ts` 19 of 30 (from 14).
- Departures and what is not done:
  - A `$ref` child naming a named sequence (`<p>$t.categories</p>`) still
    shows its first entry only (the user's decision: leave as is), and a
    named sequence's entries have no names of their own (`$s.mean2`,
    `$t.category2`).
  - A tally's inferred category is the first operand equal to it as that
    operand holds it: `<tally type="math">2/2 1 1</tally>`'s is `2/2`,
    where the current core labels it with the number `1`.
  - A reference to a tally with no declared categories among another
    list's or an operator's children contributes its cap of entries, the
    padding past the live length among them (the missing value); the
    current core's contributes only the counts. `<tally>`'s
    `doenet-i0050` stays undone (ADR 0078).
  - A normal mixture's `means`, `standardDeviations`, `variances` and
    `weights` (ADR 0079) are not done: each has a count of its own (the
    means', or one standing for all), not one per drawn value, and a
    named sequence here is one cell per entry of the list. Left for a
    decision: a named sequence with a static count of its own per element
    (ADR 0041 decision 2's static layout, its count carried with the
    element as a sort's entry kind is), a capped one at the mixture's
    most components with a live length each, or a math prop holding the
    list inside its handle (`$s.means[2]` an entry step on it).
