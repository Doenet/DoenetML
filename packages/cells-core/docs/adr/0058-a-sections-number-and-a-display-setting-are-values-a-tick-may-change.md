# A section's number and a display setting are values a tick may change

Status: proposed 2026-11-24. Follows ADR 0054 (its open items), ADR 0053
(text made in a tick), ADR 0019 (outputs) and ADR 0021 (an attribute
nothing reads is refused).

A section's full number and title are text cells a reference reads,
made in the tick as a join is; a `<page>` passes both numbering
sequences through; a math's and a number's display settings are props,
so one given by a reference follows it. An extend of an extend takes
what its chain of referents gives.

## Context

ADR 0054 left four things open that a reader of the current core
expects: `$sec.title` and `$sec.sectionNumber` as values
(`sectioning.test.ts`, "copy and overwrite title", the auto-naming
cases), `<cascade>` and `<page>`, and a number display setting given by
a reference (`displayDigits="$n"`) or taken from a sole child, which the
bridge read as literal text (`$n`, no number: no digits at all). A
section's number can change during a tick (a case that switches, a
repeat whose count changes), so its text cannot be made at build time;
a setting that follows a reference needs a cell.

A pre-existing bug sat beside them: `<math extend="$b" label="q"/>` of
`<math name="b" extend="$a" displayDecimals="5"/>` held the blank
expression. An extend with overrides read its referent's own record and
its referent's own math text, so a referent that was itself an extend
gave nothing it took from its own referent.

## Decision

1. **A section's number and title are text cells.** A section has two
   more props, `sectionNumber` and `title`, text, neither rendered (the
   renderer composes the heading itself, ADR 0054 decision 5), so they
   cost no cell until a reference reads one (ADR 0019).
   - `sectionNumber` is its `number` after its nearest numbered
     ancestor's `sectionNumber`, joined with `.`, when it includes its
     parent's number and is no item of its parent's list, else its
     `number` alone: what `Document::section_number` composes. Whether it
     includes the parent's is its own literal; whether it is a list item
     is its own tag's or its parent's `asList`, read up the tree as a
     prop of the nearest ancestor that passes no list items through
     (`PlanCtx::ancestor_prop`, a reference with the hops to that
     ancestor, a dependency in the tree, ADR 0050), and chosen between
     the two texts by a `Choose`.
   - `title` is its last `<title>` child's literal text
     (`PlanCtx::last_child_text`; a clone's is its original's), else its
     automatic title: its word (`renameTo`, else its tag's) and its
     `sectionNumber`, joined with a space, as `includeAutoName`,
     `includeAutoNumber`, `includeAutoNameIfNoTitle`,
     `includeAutoNumberIfNoTitle` and `noAutoTitle` say, as the current
     core's `title` reads them. Those five are literal attributes the
     planner reads now, no longer presentation alone; the renderer still
     reads them for the heading.
   - The text is made by a new text-valued operator, `SymKind::JoinWith
     { n, kinds, sep }`, ADR 0053's join with a separator (`.` or a
     space) in place of `, `: it interns what it makes, so the text
     changes exactly when a number does, and costs a string per distinct
     text (ADR 0053 decision 5).

2. **`<page>` passes both sequences.** ADR 0054's third flag:
   `Numbering::PassesBoth` (`flags: [container, passes_both]`). Both
   numbering walks count through it as through a structure; a section's
   parent, whose `asList` makes it a list item, is its nearest ancestor
   that is neither a structure nor such a type
   (`ComponentType::passes_list_items`), in `Document::is_list_item` and
   in `sectionNumber` alike. It is no structure otherwise: its children
   are its own, and the scoring walk goes through it as through any
   container.

3. **A display setting is a prop.** A type that shows a number declares
   the six settings as props, `displayDigits: display` and so on
   (`PropFrom::Display`), rendered, planned after the type's planner as an
   anchor is (`plan_display`): the element's own attribute, a literal as
   the number it means (a bare or `true` flag on, a bare
   `displaySmallAsZero` its default threshold) or a reference as the
   value it names; without the attribute, not given (NaN). Inheritance
   stays the reader's, as `utils/numberDisplay.js` resolves it: the
   bridge takes a setting from the nearest of the element and its
   referents that writes it, digits and decimals together, reading the
   element's cell where its type has one, so a reference is followed
   (and a change redraws) and a cell not NaN is what says the element
   writes it, a reference being no literal attribute. A bare copy aliases
   its referent's cells and an extend with overrides plans only what it
   writes, so both agree with that walk. `<math>` and `<number>` declare
   them now.

4. **An extend of an extend reads its chain.** An extend with overrides
   is planned from its record merged over each link's record of the
   chain of referents it stands on, nearest first, and a `<math>` that
   writes no text reads the nearest link's text, rebased through the
   paths that reach it (`Planning::inherit`); the chain goes through a
   link extending an element of its own type (bare, a clone or with
   overrides) and stops at one that extends nothing, a prop or another
   type, whose value is then the text's one leaf. What the copy shares
   with its referent (`link_given_leaves`) is unchanged: its immediate
   referent's ports, which hold what the chain gives.

## Considered options

- **A section's number as an aggregate the build fills.** The numbering
  walk knows the ancestors' number slots, so it could fill the text too;
  but both walks (the build's and the template graph's) would gain an
  arm, where a reference up the tree is a plan fact every stage already
  handles.
- **Settings as hidden ports of any element with the attribute.** No
  table change, but a hidden port is no output and has no name a reader
  can find; a declared prop is both, and a type that shows no number
  declares none.
- **Settings inherited through the cells** (an extend's setting the
  referent's port when it writes none, as `plan_anchor` does). The
  coupling of digits and decimals (an element writing one turns the
  other off, `ignoreShadowsIfHaveAttribute`) needs to know which element
  wrote a setting, which a shared cell hides; the reader's walk knows.

## Consequences

- `<text extend="$sec.title"/>`, `$sec.sectionNumber` and the
  auto-naming cases read as the current core's, through cases and
  repeats at runtime (`tests/section_text.rs`).
- Problems each on a page in a `<problems>` are its items, and sections
  on pages are numbered as written beside each other (`tests/page.rs`,
  `page.spec.rs`).
- `displayDigits="$n"`, `padZeros="$b"` follow what they name
  (`tests/display_settings.rs`, the bridge tests). The golden census
  counts 6 more instructions, dead: the choices' interface number
  chooses its display settings among the cases'. With every author's
  value essential (`tests/writable.rs`), the golden set counts 7 more,
  its sections' title texts, which no student's action writes.
- A title of a section is English, as `Document::section_title` was;
  the hosting page's language is not seen.

## Migration

- *Done 2026-11-24:* decisions 1 to 4. The parity adapter reads a page's
  `isListItem` and `asList`; the bridge draws a page as a `div`.
- *Open:*
  - A `<title>` that holds more than literal text (a reference, markup)
    gives the missing value as `title`; its text needs a join of a
    container's children. A heading flag given by a reference does too.
  - A section inside an `<aside>` that includes its parent's number: an
    aside keeps no `sectionNumber`, so the section's is missing.
  - *Done 2026-11-24, ADR 0071:* a setting taken from a sole child that
    is one reference (`<math>$n</math>` showing as `n` does), by a
    reference to the child's referent's setting; a `<number>`'s and a
    `<math>`'s `text` and `valueForDisplay`, rounded, by the core
    (`Document::display_settings`, the same rule as the bridge's walk).
  - The settings of a point, of the operators and of a `<mathInput>`:
    each type would declare the props.
  - A page in a list renders every child, where the current core renders
    only what the list renders (`childIndicesToRender`).
  - *Done 2026-11-24, ADR 0062:* `<cascade>`, by the first option, a
    declared per-child gate, as the user decided; its numbering is
    `passes_both`. What follows is this ADR's record of the question.
  - **`<cascade>`, not implemented.** The current core's cascade reveals
    no step by a reader's action: a step is shown once every step before
    it is complete (`numCompleted`, the leading steps whose
    `creditAchievedForProgress` is 1 or none, a hand-graded answer
    counting once answered), held-back sections keep their heading and
    hide their children (`hideChildren`), the rest are hidden, and one
    `<cascadeMessage>` is chosen per gap. The steps, the count and the
    message are derived values; what the core lacks is a gate per child
    that a parent's derived value sets (ADR 0040's `gate` gates all of a
    type's children by one prop, and nothing hides a child's children
    while showing its heading), and a progress credit apart from
    `creditAchieved`. Options: a declared per-child gate (`gate:
    Step(numCompleted)`, the k-th child there while the count reaches
    k, a section's heading outside it); or the hiding as the renderer's,
    from `numCompleted` alone, with no gate in the core, which would
    leave hidden steps scored and their values computed. Either is a
    decision this ADR does not take. Its numbering, a pass-through of
    both sequences, is `passes_both` when it comes.
