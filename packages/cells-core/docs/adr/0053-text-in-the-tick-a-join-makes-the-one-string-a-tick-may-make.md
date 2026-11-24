# Text in the tick: an operator reads strings, and a join makes the one string a tick may make

Status: proposed 2026-11-23.

An instruction may read the document's strings while a tick runs, and one
kind of instruction may add a string: a **text-valued operator**, the join
of a sequence's entries (`<text>$tl</text>`, a list's `text`) and a value's
text (a join of one). It interns what it makes, so equal text has one id.
A sort compares texts by reading them; it makes none.

## Context

Before this, a tick never touched the string table. A text cell held a
string id that the build or a renderer's request had interned
(`Document::intern`, appended to the session's `runtime_strings` so every
later build keeps the id), and the only operator over text was `Eq` on two
ids, which is sound because interning gives equal text one id.

Two things the language asks for need more:

- **Order** (ADR 0041 decision 7): `<sort>` of texts compares them
  alphabetically, and a sort of texts, numbers and maths together compares
  each by its text (`sort.test.ts`, "sort texts, numbers, maths"), as the
  current core's `compareExtractedValues` does. That reads strings, and the
  text of a number or an expression, during a tick.
- **Reading a sequence where one text is read** (ADR 0041 decision 5): a
  `<text>` of a text list is its entries joined with commas, and a list's
  `text` prop is the same. When an entry can change, the joined string is
  new text made in the tick.

The user decided (sweep 2, decision 7, and its amendment) that operators may
read the string table during a tick, and that a string may be made in a
tick for joining text, with later text-valued operators such as
concatenation in view.

## Decision

1. **Reading.** A program step carries the document's strings
   (`program::Texts`, lent through `SymRun::texts`): the table, the index
   from text to canonical id, and the session's list of strings added since
   load. Any symbolic instruction may read a string a text cell names.
   A string id is never compared as a number except by `Eq`.

2. **What an input holds.** A cell's value does not say whether it is a
   number, a string id or an expression handle. An instruction that reads
   text (`SymKind::Join`, `SymKind::Order`) is told each input's kind when
   emit binds it, from the cells' value types (two bits an input, at most 64
   inputs), the same in every build since the types come from the type pass.

3. **Making a string.** Only a text-valued operator makes one:
   `SymKind::Join` (the text of each input, joined with `, `; a number as
   it is shown, a boolean `true`/`false`, an expression as the engine
   prints it, the missing value `＿`; no input is the missing value). It
   interns the result: the id the text already has, else a new id appended
   to the table and to the session's `runtime_strings`. A folded join (all
   inputs constants) runs once at emit against the table the document will
   have, and adds to the same list.

4. **Interning keeps change detection.** Because equal text gets one id, a
   join's cell changes exactly when its text does, so the recompute's
   bitwise change test and `Eq` on ids stay right; a join whose inputs did
   not change is not run again (the symbolic memo).

5. **Growth.** The table only grows: a string made once keeps its id for
   the session, so a later build, a failed rebuild's undo and a saved
   value's id all stay valid. It grows by the distinct strings the document
   has made, not by the ticks: typing back a text seen before adds nothing.
   A text input typed into and joined grows it by one string per distinct
   value it passes through. Nothing collects strings no cell names any more;
   if a long session shows that to matter, a collection at a rebuild (which
   renumbers every cell anyway) is the place for it. Saved state does not
   carry the added strings: an essential text value is saved as its text
   and interned again on load.

6. **Where text is made from a reference.** A `<text>` whose content is one
   reference reads it by what the records say the referent is (its type's
   declared prop, `Reader::ref_value_kind`): a static sequence is its
   entries joined (one text entry is that entry, aliased); a value the
   records say is a number, a boolean or a math is its text, joined from
   one; anything else (a text, or what the records cannot tell, such as a
   reference through a choice) stays an alias, which a write can go back
   through.

7. **Sorting** (ADR 0041 decision 7). `<sort>` and `<shuffle>` hold their
   operands' values as one kind, decided once per element from the records:
   numbers; else expressions when one operand can be math (each operand a
   math cell); else texts when one is text (each other operand its text,
   made by a join of one). Bare text is split at spaces and read as numbers
   when every piece is a real number to the engine, else as text, unless
   `type` says. The order is a port, a hidden port per position holding the
   1-based operand that comes there: `SymKind::Order` compares (by value
   when every operand is a number or evaluates to one, a NaN last; else by
   text, a number written as JavaScript writes it; equal ones keep their
   order), and a shuffle's is a `Shuffle` of the positions by a draw, a
   load-time constant (ADR 0037). Each entry is a `Choose` over the
   operands by its position's order. A write through a shuffled entry lands
   on its operand; one through a sorted entry is dropped, since the operand
   it shows decides the order and the write would move the entry (each
   branch is `Shown`, a copy that drops a request), which no round trip
   could make stable.

8. **The user's decisions (2026-11-23).** Dropping a write through a
   sorted entry, and making a value's text in a tick (`<text>$n</text>`,
   numbers and maths as text in a text sort) the same as a join, are
   confirmed. The order is public as a **second named sequence** over the
   element's own ports (ADR 0041 decision 1 allows several): a list may
   declare a `companion`, one cell per entry after the entries
   (`ListProp::companion`, `PropAt::Companion`); `<sort>` and `<shuffle>`
   declare `componentOrder`, and `<choiceInput>` is to declare
   `choiceOrder`, with `shuffleOrder` making `selectedIndex` the displayed
   position, a pick by the order for credit, and the choices drawn in the
   shuffled order. A sort or shuffle of points or vectors is to have its
   own entry width, its operands' (2 for points), so its rows are points
   drawn and dragged (a shuffle's; a sort's are read-only), with
   `sortByComponent`, `sortVectorsBy` and `sortByProp` as far as they fit,
   and booleans by the same mechanism.

## Considered options

- **A text whose value is a sequence of strings, shown joined** (ADR 0041
  step 2's notes). No string is made, but every reader of a text (a
  comparison, an answer, a `<textInput>` bound to it) would then read a
  sequence, and `Eq` on a joined text would need its own instruction.
  Rejected: the join is a value, and interning keeps it one id.
- **A scratch string per instruction, overwritten each tick.** No growth,
  but the id would no longer name the text: the change test would miss a
  change and `Eq` would compare slots. Rejected.
- **Make the strings at build time only.** Enough for constant lists,
  which fold; not for an entry a student writes.
- **Writes through a sorted entry land on the operand** (the current
  core's behaviour). Unstable under the round trip (ADR 0026's check):
  asking again moves the entry. Rejected by the user: a write through a
  sorted entry is dropped; one through a shuffled entry lands on its
  operand.

## Consequences

- `<text>$tl</text>`, `$tl.text` and `<text>$n</text>` read as the current
  core's, and a joined text compares with `=` like any text.
- A tick may grow the string table. The growth is bounded by the distinct
  texts made, and the strings are dropped with the session.
- `<sort>` and `<shuffle>` sort and shuffle numbers, texts, maths,
  booleans, points and vectors. A sort's entry kind is `EntryKind::Any`:
  what its operands hold, read as its cell holds it, its rows (ADR 0041
  step 3) `mathValue` rows, which the bridge draws as a text when the cell
  holds one; one of points or booleans has entries of its own kind and
  width (see Migration), its rows points or booleans.

## Migration

- *Done:* reading and making strings in the tick, joins, `<sort>` and
  `<shuffle>` of numbers, texts and maths, and the companion sequence with
  `componentOrder`.
- *Done 2026-11-24:* a join with a separator, `SymKind::JoinWith`, the
  next text-valued operator: a section's full number ("2.1") and title
  ("Section 2.1") as text a reference reads (ADR 0058).
- *Done 2026-11-24 (ADR 0067):* a concatenation, `JoinWith` with
  `Sep::Empty`, a text answer's content of text and references; and two
  operators that read strings and make none: `TextEquals`, comparing an
  answer's texts, and `TextNumber`, a text read as a number.
- *Done 2026-11-23:* a per-element entry width (decision 8). An element
  of a type whose entries are its operands' (`EntryKind::Any`) may decide
  its entries' kind: its plan's list is `ListLen::Entries(n, kind)`
  (`ElemWiring::with_entries`), and every reader of a list's cells reads
  them through the element's `ListShape` (`components/shape.rs`: its type
  and the kind it decides, so its width, length, slots, companion, prop
  names and row type), never the type's width alone: the template graph
  (`Stamp::shape`, `GraphComp::own_entry`), the seal's types, share, the
  build's slots, rows and copies, and the document (`ComponentTable::
  own_entries`, a sparse column: only such elements, and their copies,
  which take their referent's). `ComponentType`'s own `list_len`,
  `list_slot` and the rest remain for an element whose entries are its
  type's.
  `<sort>` and `<shuffle>` of points have entries of two cells, `x` then
  `y` (a vector is its displacement, a reference to its `displacement`
  prop, as the current core compares it), so their rows are points: a
  drag of a shuffled one lands on the point it shows, one of a sorted one
  is dropped (`Shown`; the load notes it, an info per coordinate, as for
  any drop). A point compares by its coordinate `sortByComponent` (a
  literal; one it does not have compares as the missing value, so the
  points keep their order), the tail's with `sortVectorsBy="tail"`; any
  operand by its prop `sortByProp`, spelled in any case, when it names an
  element with a one-cell prop so called (a reference to that prop,
  `PlanCtx::ref_prop`), else the missing value. Booleans every operand is
  sort as booleans (false first), each entry a boolean (`type="boolean"`
  reads bare text so); booleans among texts or numbers are their text.
  Points among other values are refused. Tested by `sort.spec.rs`, a
  `sorted-points` document in `tests/every_count.rs` and the bridge tests.
  Departures and what is left:
  - A reference to an entry of a sort of points (`$s[2]`), or such a sort
    among another list's children, reads one cell an entry: an entry
    step's width is planned from the records (`EntryIndex::width`), which
    say a sort's entries are its operands' and not which; making it the
    referent's as built (`ListShape` of the built element) is left.
  - `sortByProp` reads a prop of the operand's element when the operand
    names one by a path of names; an entry of a list (`$l[2]`) has none
    here. `numDimensions` and points of other than two coordinates wait
    on ADR 0041 step 5.
  - A point list among a sort's children is one operand (refused), not
    its points: splicing a list of points into a sort is left.
- *Done 2026-11-23:* `<choiceInput shuffleOrder>`. A type may declare a
  second public sequence with no list of entries before it (`sequence:
  choiceOrder` in `component!`, `define::sequence_only`): a list of zero
  cells an entry whose companion is one, so the element has no rows and
  its text is unchanged (`ListShape::list_len` counts the companion's
  cells; `entry_row` is none for no cells an entry). A choice input's
  `choiceOrder` is the 1-based position among its choices of the one
  shown at each place: in order, or a `Shuffle` of the positions by a draw
  (ADR 0037), all but the last with `preserveLastChoice`, as the current
  core's. `selectedIndex` is a place as shown, as the current core's
  `selectedIndices`; an answer's credit picks the choice `choiceOrder`
  names there (`plan_choice_answer`, a `Choose` of the order, as the
  current core's `childIndicesSelected`). The bridge sends the cells as
  the renderer's `choiceOrder`, so the choices are drawn in that order,
  and `inline` (now a presentation attribute); the parity adapter reads
  `choiceOrder`, `choiceTexts` (each choice's text, in that order),
  `selectedIndex` and `selectedIndices`, and the literal flags. Tested by
  `tests/choice_input.rs` and the bridge tests. Left: a copy with
  attributes of its own (`<choiceInput extend="$ci" inline="false"/>`, a
  `<shuffle extend="$s" asList="false"/>`) draws its own order, keyed by
  its own element, where the current core's copies share the original's
  (a bare copy aliases it): whether a copy shares its referent's draw is a
  copy rule for every load-time choice, not decided here. `selectedValue`,
  a choice's `selected` and `selectMultiple` are not modelled.
- *2026-11-24 (ADR 0074):* the per-element entry kind is not only for a
  type whose entries are its operands': a type whose entries follow its
  `type` (`ComponentType::entries_by_type`: `<sequence>`,
  `<selectFromSequence>`) declares entries of a number, and an element of
  letters or math decides strings or expressions. A sequence of letters'
  entry is `SymKind::Letters`, the letters of a number, which looks its
  string up by text: the planner interns every string it can be, so it
  makes none (decision 3's one maker stays the join). `SymKind::
  LetterNumber` reads a text as its letters' number.
