# Divisions and list items are numbered in two sequences

Status: proposed 2026-11-23. Builds on ADR 0028 (counted values), ADR
0038 (the core names no component type) and ADR 0044 (document-wide
counters), whose open item this settles.

A division is numbered among the divisions beside it, looking through a
`<div>`; a `<part>`, a `<task>` and a `<problems>`' problems are numbered
among their parent's list items instead, which a `<div>` bounds. Both are
the section's `number` aggregate; a type declares what it is to each
sequence.

## Context

The current core numbers sections in two sequences
(`utils/sequenceNumbering.js`):

- **Divisions** (`DIVISION_SEQUENCE`): every
  `_sectioningComponentNumberWithSiblings` (the divisions, an aside, a
  part) takes the next number among the divisions beside it. The sequence
  passes through a `<div>` (and `<statement>`, `<introduction>`,
  `<conclusion>`, which are divs), a `<cascade>`, a `<page>` and the
  wrappers an external copy arrives in; every other component bounds it,
  numbering the divisions among its children from 1.
- **List items** (`LIST_ITEM_SEQUENCE`): a section that is a list item (a
  `<part>` or `<task>` always, any sectioning child of a component with
  `asList`, which `<problems>` and `<exercises>` default to) takes the
  next number among every sectioning sibling (an unnumbered `<proof>`
  too), passing through a `<cascade>` and a `<page>` only. It shows no
  parent's number. A list item still takes its place among the divisions.

A composite (a group, a choice, a repeat) is no container there: its
replacements are its parent's children, which is what this core's
structure kinds are to the aggregate.

Until now this core had one sequence, the divisions', through the
structure only: a section inside a `<div>` started over at 1, and a part
was numbered among its sibling divisions.

## Decision

1. **What a type is to the sequences is a declaration** (ADR 0038). A
   numbered type (`numbered: Titled(..)`) is an item of both. Two more
   declarations, both flags on a type that is neither numbered nor
   structure (`Numbering`):
   - `passes_divisions`: the divisions' sequence passes through it (a
     `<div>`, `<statement>`, `<introduction>`, `<conclusion>`); it bounds
     the list items.
   - `unnumbered_division`: a sectioning component with no number (a
     `<proof>`): a place among the list items, none among the divisions,
     and it bounds both.
   Any other type bounds both. `<statement>`, `<introduction>` and
   `<conclusion>` were `structure: Transparent`; they are pass-throughs
   now, as the divs they are in the current core.

2. **A numbered type says which of its sections are list items**:
   `numbered: Titled(include, label, title, listItem, asList)` names two
   constant 0/1 props, `listItem` (always a list item: `<part>`,
   `<task>`, by tag) and `asList` (its sectioning children are list
   items: `<problems>`, `<exercises>` by default, the `asList` attribute,
   a literal since it decides the wiring). A section is a list item when
   its own `listItem` is on, or its parent's (the nearest ancestor that is
   no structure) `asList` is.

3. **One walk, two counters.** The aggregate walk
   (`build/expand/aggregate.rs`, and the template graph's twin
   `compile/graph/aggregate.rs`) counts each component's children in a
   division counter and, when one of them is a list item, a list-item
   counter, each with the gate of the cases between it and the child. A
   pass-through continues the division counter and starts its own list
   items; a list item's `number` is the list-item counter's, and the
   division counter advances past it all the same. A component with no
   list item keeps no list-item counter, so a document without one builds
   the same cells as before.

4. **The full number is the core's**: `Document::section_number` ("2.1")
   leaves out the parent's number for a list item, and the wasm `Core`
   exports `section_number` and `is_list_item`. The bridge sends the
   core's string (reading the `number` cells it is made of, so a count
   that changes recomputes it); the test adapter reads it too.

5. **A heading is composed where it is read.** A section's `title`,
   `titlePrefix` and `sectionName` are the renderer's words around the
   number and the `<title>` child: the test adapter composes them as the
   current core's `composeTitlePrefix` does, in English, from the number
   the core holds, the title child's text and the heading attributes
   (`includeAutoName`, `includeAutoNumber`, their `IfNoTitle` defaults,
   `noAutoTitle`), which a section now accepts as presentation. `renameTo`
   is read on a `<problems>` and an `<exercises>` and refused on the other
   divisions, as in the current core.

## Considered options

- **A `<div>` as `structure: Transparent`.** Numbered right for the
  divisions, but every sequence would pass through it, the list items'
  too, and a part in a div would continue its problem's parts; and it
  would make a div's children a sticky group's members.
- **A second aggregate prop for the list-item number.** Two cells per
  section where one is ever shown; a section is a list item or not by
  constants, so one `number` holds whichever it is.

## Consequences

- Sections inside a `<div>` continue the sequence around them, through
  cases and repeats at runtime (`tests/numbering.rs`); parts are numbered
  as in the current core beside a proof, an aside or a div.
- `<cascade>` and `<page>` are pass-throughs of both sequences in the
  current core; the cells core has neither component yet. Each would
  declare it: `passes_divisions` does not cover the list items, so a
  third flag (passes both) comes with the first of them.
- `$sec.title` and `$sec.sectionNumber` as references read a string made
  from a number that can change in a tick; they wait for text joined in
  a tick (the brief's decision 7). The hosting page's
  `initializeCounters` (a division counter's start) is a load option the
  compile does not see yet, and waits too.

## Migration

1. Done (2026-11-23): `Numbering`, `passes_divisions`,
   `unnumbered_division`; `Numbered::list_item` and `as_list`; the
   section's `listItem`, `asList`, `renameTo` and heading attributes; the
   two counters in both walks; `Document::is_list_item`; the wasm
   exports; the bridge's division number; the adapter's `sectionNumber`,
   `enumeration`, `isListItem`, `title`, `titlePrefix`, `sectionName` and
   `level` for the divisions, an aside and a proof.
2. Open: `<cascade>` and `<page>` (pass-throughs of both sequences);
   `initializeCounters`; a section's title and number as references.
