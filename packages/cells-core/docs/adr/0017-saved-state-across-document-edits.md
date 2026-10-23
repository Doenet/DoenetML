# Saved state survives an edit to the document when its schema allows

Status: proposed 2026-10-23.

A student's saved state should restore into a later version of the same
document whenever every value in it still names a cell of the same meaning
and type. Whether it does is decided by comparing the two versions'
*essential schemas*, the essential cells each version's compile can make,
never by comparing their graphs or by trying the restore and seeing what
happens. What cannot carry over is dropped, replayed as a request, or makes
the state incompatible, by rules fixed here, and the author is told which
before publishing.

## Context

Saved state (`document/state.rs`) is the session's essential cells that
differ from their defaults, one entry per cell:
`[scopePath, [node, k], slot, kind, value]`. Derived cells, credit among
them, are never saved; they are recomputed from the restored essential
cells. So most edits an author makes, even ones that reshape the graph,
need nothing of saved state at all:

- Text, layout, titles, hints and feedback have no essential cells.
- A formula, an operator, a derived component, a `<conditionalContent>`
  condition or an answer's weight changes derived cells and literal
  parameters, which are recomputed.
- Changing an `<answer>`'s correct answer or its awards changes `correct`
  and the award comparisons; `submitted` and `numSubmissions` are
  essential and unchanged, and `credit` is recomputed against the new key.

And a restored value can never make the document unbuildable. Every error
depends on the source alone (ADR 0014), and the probe covers every count
and every pick, so restoring old values, including counts that grow
repeats, only ever reaches structures the load's check already accepted.

What does go wrong is identity and meaning. An entry names its element by
DAST `NodeId`, a node's position in the parsed tree, and its prop by the
slot's position among the element's slots, hidden slots included.
`restore_state` writes each value into whatever cell has that key, and
parks an entry with no such cell without a word. Against
`<numberInput name="a"/><numberInput name="b"/>` with `b` set to 7:

| Edit | After restore |
|---|---|
| Insert `<p>Intro</p>` first | `a` is 7, `b` its default |
| Delete `a`, add `c` after `b` | `c` is 7, `b` its default |
| Make `b` a `<mathInput>` | restores without error; 7 lands in a math cell as a handle it never was |

The same `NodeId` seeds every `<select>` (`seeded_stream`,
`build/expand/choice.rs`), so inserting a paragraph above one draws the
student a different variant, with the responses submitted to the old one
still in place.

So today any edit invalidates saved state, and nothing notices.

## Decision

### 1. Saved state names cells by stable keys

An entry names its cell by keys an ordinary edit does not move:

- **Element.** A named element is its name path from the document
  (`r[*].q`: a repeat's iterations are a level of the path, as in
  `scopePath` now). An unnamed element is its nearest named ancestor's
  path, its tag, and its position among that ancestor's descendants of
  the same tag in document order. An element the compile makes (an
  answer's implicit input, a copy's clones) keeps today's rule of the
  element it is made for and its position among those, over the new key.
- **Prop.** A public prop is its name from the component's definition
  (ADR 0016), not its position. A hidden slot is named by its planner,
  which declares the name with the slot (an answer's extra response slots
  by the response they hold); a hidden slot without a name is not saved.
- **Value type.** Each entry keeps its `kind`, and the schema records the
  type of each cell, so a mismatch is found rather than written.

A select's stream is seeded from its stable key, not its `NodeId`.

The format is version 3. Versions 1 and 2 are still read, but only into
the document version they were saved from (step 3); they carry no stable
keys to migrate by.

### 2. Each compile emits an essential schema

`Compiled` gains a schema: for each template (the document, each repeat
body, each branch), each essential slot's stable key, component type, prop
name, value type and a domain (below). Like the diagnostics, it depends
on the source alone (ADR 0014), so the language server and the editor can
compute it without loading the document. Its hash, the *schema
fingerprint*, is saved with the state.

A **domain** says what a value means beyond its type, where an edit could
change that while the type stays the same:

- a `choiceInput`'s `selectedIndex` is a position among its choices;
- a select's pick (step 4) is one of its options;
- everything else, so far, is *free*: any value of its type means the same
  thing in both versions. A slider is free, because it stores
  `preliminaryValue` and derives its clamped index, so a changed range is
  absorbed by the graph.

### 3. Restoring compares schemas, entry by entry

When the fingerprint matches, state restores as it does today. Otherwise
the restore diffs the old schema (kept with the document version, or
recovered from the saved state's own keys and kinds) against the new one,
and classifies each saved entry:

| Class | Example | Action |
|---|---|---|
| Same key, type and domain | anything in Context above | write it |
| Key gone, no prop of that name remains | an input deleted | drop it, reported |
| Key's prop remains but is no longer essential | a free point given `x="$n"` | replay the value as a request on the prop's cell, so it inverts through the new graph or is dropped by it |
| Type changed | `numberInput` to `mathInput`; a text answer made math | drop it, reported; never written |
| Domain changed | a `choiceInput`'s choices reordered or added | remap by the choices' own stable keys if the old domain recorded them, else drop it, reported |
| New key | an input, answer or repeat added | the default, as now |

Then the state as a whole is

- **compatible** when every entry was written or replayed;
- **compatible with loss** when some entries were dropped: restored if the
  author allowed loss for this edit;
- **incompatible** when a load-time choice's pick cannot carry over
  (step 4), or an answer's `submitted` entry was dropped and the author
  did not allow it: not restored, and the student keeps the old version.

`restore_state` never writes a value whose kind differs from its cell's
value type, in any version of the format.

### 4. Load-time picks are saved, not re-derived

A select's (and a `selectFromSequence`'s) pick is saved as state, by the
stable key of the chosen option, rather than re-derived from the seed on
every load. An edit elsewhere then never changes a student's variant. A
pick whose option is gone, or a select whose option list changed shape,
makes the state incompatible: the student's responses were made against
that variant.

### 5. A changed answer regrades unless the author says otherwise

Regrading is what the graph does on its own and is the default. An answer
can instead keep the credit earned: `submit` also writes an essential
`creditAtSubmission`, and a restore asked to keep credit sets a flag that
makes the answer's credit read it until the student's next submit. The
choice is the author's, per edit, when they publish; the core only offers
both.

### 6. The editor reports before publishing

Because the schema depends only on the source, the editor diffs the
published version's schema against the draft's and tells the author, before
anyone's state is touched, what the edit costs: "students in progress keep
everything", "2 inputs reset", or "variants change; students in progress
stay on the old version". The same diff, dry-run against one student's
saved state, is what the platform runs before migrating it.

A rename changes a stable key. The editor records the renames it makes in
a map published with the version, which step 3 applies to the old schema
before diffing; a rename made by hand is a delete and an add.

## Considered options

- **Tree-diff the two sources.** Match old nodes to new by an edit-script
  algorithm (GumTree and its kin) instead of stable keys. Handles unnamed
  elements better and needs no rename map, but every document version must
  be kept and the match is a heuristic whose mistakes are silent
  misplacements, the failure this ADR exists to stop. Kept as a possible
  fallback for unnamed elements whose same-tag position moved.
- **Author-assigned ids on every element** (`_key` attributes the editor
  writes). Exact, but it puts machinery in the author's source and does
  nothing for documents written outside the editor.
- **Diff the graphs.** Compare instructions or derived cells. Rejected:
  the graph is not what state depends on; most graph changes are harmless
  and the harmful changes are visible in the schema alone.
- **Restore and validate after.** Load the new version, restore, and reject
  if anything looks wrong. Rejected: a misplaced value looks exactly like a
  right one, as the table in Context shows.

## Consequences

- An edit that touches no essential cell keeps every student's state:
  wording, hints, feedback, formulas, correct answers.
- Saved state grows: names and prop names instead of numbers, and a pick
  per select. Still only the cells that differ from their defaults.
- Planners must name the hidden slots they want saved. A planner that does
  not loses that state across edits but never misplaces it.
- A `choiceInput` needs its choices' stable keys in its domain; until it
  has them, any change to its choices drops the selection.
- Unnamed elements are the weak case: inserting a second `<mathInput>`
  before an unnamed one under the same named ancestor moves its key. The
  editor's report says so, and naming the input fixes it.
- `CONTEXT.md` gains *essential schema*, *schema fingerprint* and *domain*,
  and its *element key* changes to the stable key.
