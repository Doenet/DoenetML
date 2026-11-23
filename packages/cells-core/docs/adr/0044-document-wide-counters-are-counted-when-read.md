# Document-wide counters are counted when read

Status: proposed 2026-11-23. Builds on ADR 0009 (choices split by
timing: every case of a reactive choice is built, and an inactive one is
gated), ADR 0019 (outputs), ADR 0020 (cells behind the shared renderer
interface) and ADR 0038 (the core names no component type).

A figure, a table and a footnote take a number from a counter that runs
through the whole document, apart from the sections: "Figure 2", "Table
3", a footnote's marker 4. A type declares the counter it advances, and
the document counts when the number is read, walking the built document
in order through the active cases. No cell holds the number.

## Context

The current core keeps named counters (`dependencyType: "counter"`,
`collateCountersAndPropagateToAncestors` in `DependencyHandler.ts`): each
component that reads a counter is listed, in the order of its parent's
active children, up to the document, and numbered 1, 2, ... in that list.
Three counters are read today: `sectioning`, which `Figure.js` and
`Table.js` share (so a document's figures and tables are numbered in one
sequence: Figure 1, Table 2, Figure 3), `footnote` (`Footnote.js`), and
`equation` (`MMeMen.js`, `MdMdnMrow.js`). A figure or table with
`number="false"` reads no counter, so it takes no number and leaves no
gap. A component inside an inactive case is no active child and is not
counted. The divisions do not draw from these counters: they are
numbered among their siblings (`utils/sequenceNumbering.js`), which the
core here does with an aggregate cell per section (`number`,
`Count` over `SectionsThrough`, `build/expand/aggregate.rs`).

The cells core sent "Figure" and an empty footnote marker until now
(`packages/doenetml-worker/src/cells/contracts.ts`), since it kept no
document-wide count.

Two ways to keep one:

- **A cell per counted component**, an aggregate like a section's
  `number`: 1 plus the gates of the counted components before it. Exact
  and reactive, and a reference could read it. But a document-wide count
  crosses every repeat and choice in the document, so each number is an
  operator over every gate before it (the counted-value machinery of ADR
  0028 for each repeat it crosses), and the sum grows with the document
  for a value nothing computes with: no DoenetML reads a figure's number
  as a number.
- **Counted when read**, as a section's full number is composed when read
  (`document/sections.rs`, the bridge's `sectionNumber`): walk the built
  tree from the root in order, skip a gate whose `active` is not 1, count
  what advances the same counter. Nothing is built, and nothing in the
  tick changes.

## Decision

1. **A type declares the counter it advances** (`counted:` in its
   `component!` block, `Counted`): the
   `Counter`, `Figures` (figures and
   tables, the current core's `sectioning`) or `Footnotes`, and
   optionally a 0/1 prop saying whether it takes a number (`counted:
   Figures(number)`, where `number: attr(1.0) { rendered }` reads the
   `number` attribute, a literal or a reference). The core names no type
   (ADR 0038): a new counted type, or a new counter, is a declaration.

2. **The number is counted when read.** `Document::counter_number(c)`
   walks the built document from the root, depth first in document order:
   a gate (`StructureKind::Gate`)
   whose `active` cell is not 1 is skipped with what it holds; a
   component whose type advances `c`'s counter and whose flag is on (or
   that has none) adds one; the walk stops at `c`. The number is that
   count, or none when `c`'s flag is off or `c` sits in an inactive case.
   A repeat's iterations are its children in the built tree, so each
   iteration's figures are counted in order; a rebuild (a count that
   changes) builds the tree the next read walks.

3. **What the walk read is a reader's to watch.**
   `Document::counter_reads(c)` lists the cells the walk read: the
   `active` cell of each gate it passed or skipped and the flag of each
   component it counted. Both are outputs already (a case's `active` is
   `rendered`, a counted type's flag is declared `rendered`), so a pruned
   load (ADR 0019) keeps them. The bridge records them as the element's
   reads (`Reads::counter`), so a case that opens before a figure
   recomputes the figure's name, as a changed cell recomputes any element.

4. **Which kinds share a counter** follows the current core: figures and
   tables share one; footnotes have their own; the sections share none of
   them, and none of them takes a place among the sections. An `<aside>`
   is a division in the current core (`SectioningComponentNumberWithSiblings`),
   so it is numbered among its sibling divisions by the sections'
   aggregate, declaring `numbered` and a `number` aggregate as a section
   does, not by a counter. The `equation` counter waits for numbered
   display math.

5. **The wire**: the wasm `Core` exports `counter_number(idx)` and
   `counter_reads(idx)`. The bridge sends a figure's `figureName` ("Figure
   2") and `figureNamePrefix` ("Figure 2: " before a caption), a table's
   `titlePrefix`, `codeNumber` and `xrefLabel`, and a footnote's
   `footnoteTag`; the words are English, as the rest of the bridge's.

## Considered options

- **An aggregate cell per counted component** (above): rejected for its
  size, a document-wide sum per number, for a value nothing computes
  with. Should a reference ever need `$fig.figureEnumeration` as a value,
  the walk is the definition such a cell would have to agree with.
- **Counting in the bridge**: the bridge sees the table and the cells,
  and could walk as the core does. But which types are gates and which
  advance a counter are the core's declarations; the bridge would carry a
  copy of them, as it does a section's tag list today.

## Consequences

- A figure, table or footnote is numbered as in the current core,
  through cases and repeats, at no cost to the load or the tick.
- `number` on `<figure>` and `<table>` is read by the core now (a prop),
  no longer refused on a figure or passed through as presentation on a
  table.
- The number is not a cell: `$fig.figureName` as a reference has nothing
  to alias. The test adapter reads it from `counter_number`, as the
  bridge does.
- `<part>` and `<task>` stay numbered among their sibling sections by
  the sections' aggregate. The current core numbers them among their
  parent's list items, a sequence that counts every sectioning sibling
  (an unnumbered `<proof>` too) and passes through `<cascade>` and
  `<page>` only, apart from the divisions, which also pass through a
  `<div>`. The two agree wherever this core has the containers involved,
  except beside a `<proof>`; passing the divisions' sequence through a
  `<div>` (which this core's aggregate does not yet do) would separate
  them, and is where a list-item sequence would be added.

## Migration

1. Done (2026-11-23): `Counter`, `Counted` and `counted:`; `<figure>`,
   `<table>` (`Figures(number)`) and `<footnote>` (`Footnotes`);
   `Document::counter_number` and `counter_reads`
   (`document/counters.rs`, `tests/counters.rs`); the wasm exports; the
   bridge's figure, table and footnote contracts; the test adapter's
   `figureName`, `tableName`, `footnoteTag` and their kin. `<aside>`
   numbered among the divisions (`containers/aside.rs`).
2. Open: the `equation` counter, with numbered display math; a
   list-item sequence for `<part>` and `<task>` once the divisions'
   sequence passes through a `<div>`.
