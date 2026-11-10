# Every list is a sequence, laid out by when its count settles

Status: proposed 2026-11-10. Step 1 of the Migration is done, with its
departures recorded there. Drafted as 0038, and renumbered as `cells`
took 0038 to 0040 first.

A **sequence** is a count and a family of entries of one entry type. Every
ordered collection the language has is one: a `<mathList>`'s entries, a
point's coordinates, a tuple's entries, a matrix's rows, a function's
maxima, a `<collect>`'s items, a `<repeat>`'s iterations, a `<sequence>`'s
values, a mathInput's typed `1, 2, 3`. A scalar is a sequence of one. The
compile decides each sequence's layout from when its count settles: at
compile time (inline slots), at build time (one cell per entry and a
structural count cell), or at tick time (a capped list padded with the
missing value, or a projection out of a math handle). One index step,
`Item(k)`, addresses an entry of any of them: an integer from 1 to the
count names the entry, anything else names the missing value. An entry is
a row of the component table over aliased cells, so a parent, a renderer
and a target see it as a component of the entry type without one being
built.

## Context

The JavaScript core represents "an ordered collection" six ways, each with
its own answer to how the count is known, how entry `k` is addressed, where
a write to entry `k` goes, what a reference to the whole produces and how
it is drawn:

- a list inside one math value (`list`, `tuple`, `vector`, `interval`,
  `set`, `matrix` heads), exposed through the `vector`, `list` and `matrix`
  array state variables, whose inverse rebuilds the tree keeping its head;
- array state variables inside a component (`xs`, `maxima`, `vertices`,
  `matrix`, `selectedIndices`, `currentResponses`), about 200 definitions,
  addressed by mangling `$P.xs[2]` into the string `x2` and parsing it back
  (about 40 copied `getArrayKeysFromVarName` bodies), with whole references
  made by `wrappingComponents` recipes;
- composites, one component per item (`<repeat>`, `<collect>`, `<group>`,
  `<sort>`, `<shuffle>`, `<split>`, `<intersection>`), indexed by the Rust
  resolver over replacements and updated by an add, delete, withhold and
  rearrange calculus;
- list components (Doenet/DoenetML#2157 to #2163): one component holding
  arrays, presented as one child, one renderer and one target per entry,
  with document passes (`utils/dast/listForms.ts`, `repeatLists.ts`)
  deciding statically which collects, sorts, shuffles and single-value
  repeats become one;
- attributes typed as lists (`xs`, `vertices`, `input`, `means`);
- an answer's responses, concatenated by hand.

Every pair needed a bridge (`mergeMathLists`, `arrayListReplacement`,
`listEntryResolverNodes`, `convertToCopy`'s `endsWith("List")`), and the
bridges hold the special cases. The one assumption under all six is that
any count may change at any time, driven by any value; that is where the
lazy array entries, the replacement calculus, the state ids and the three
indexing paths come from.

The suites written for the list components (`test/tagSpecific/
listcomponent*.test.ts`, `listentrytargets.test.ts`,
`compositesInTypedContainers.test.ts`, `repeat*Lists.test.ts`,
`baseComponent/compositeCommas.test.tsx`, `copying/value_references.test.ts`)
run each document with the conversion on and off and demand identical
results, so they state the language independently of the mechanism. Read
together they pin:

- **Indexing.** Entries are numbered from 1. Past the end is not an error:
  the reference reads the empty value of its type (`NaN`, `""`, `false`,
  `＿`), draws nothing in a paragraph, adds no entry to a list, is dropped
  as an operand (`<sum>$l[9] 5</sum>` is 5), equals nothing in a
  comparison and refuses a write. A second index reads a coordinate of the
  entry (`$tl[2][2]`). An index may be any expression and re-resolves as it
  or the list changes.
- **Transparency** (principle COMP-4). Every parent reads a sequence as its
  entries: a `<p>` separates them with commas, a `<math>` makes a `list`,
  `<sum>` sees one operand each, a typed list absorbs another's entries, a
  `<point>` takes `($nl[1], $ml[1])`. A sequence of one is a scalar wherever
  a scalar is read; an empty one is nothing.
- **Entries behave as components.** Drawn by the entry type's renderer with
  id `list:k`; a click, focus, `<ref>` (`#pl:2`), legend, `<callAction>` and
  annotation target; `$l[2].text` is its property and `$l.text` one value
  per entry; display settings its own if set, else the list's; `fixed` and
  `hidden` from the list unless its source sets them; `extend` linked,
  `copy=` a snapshot.
- **Writes go to the source.** A write through an entry lands where the
  entry came from: the list's own text, an authored child, a referent, a
  nested list's entry, a collected component. Computed results refuse; a
  fixed list or source refuses.
- **Positional state.** State belongs to position `k`: a value written into
  iteration 3 survives the repeat shrinking and regrowing, and a written
  entry past the current end is kept.

This core already holds the pieces for all of this: a prop "maps to one
cell or an ordered list of cells" (`CONTEXT.md`), a tuple is one cell per
entry, a list prop of points has the length the author gave (ADR 0016), a
repeat's count is a structural cell and a rebuild keeps essential values by
(scope, template slot) (ADR 0004), an index past a count is the shared
missing cell, a dynamic index is a `Choose` over the items (ADR 0032 step
6), and ADR 0032 proposed, but did not build, a capped `List(T, cap)` for
counts that follow values. What it lacks is the one notion over them: there
is no `<mathList>`, `<numberList>`, `<sequence>` or `<matrix>`, a point is
two coordinates and three or more make a different type, a coordinate index
is a separate selector (`Parts`) limited to literal 1 and 2
(`compile/read/refs.rs`), `$p[$k]` and `$l.points[$k]` are refused, and
every list-related parity file passes nothing
(`CELLS_CORE_PARITY.md`).

## Decision

### 1. One notion: a sequence

A sequence is a count and entries of one entry type: number, text, math,
boolean, point, vector, interval, or a scope of a template. Everything
indexable is a sequence. A component type names the sequence a bare
`$x[k]` addresses (coordinates for a point, entries for a list, iterations
for a repeat, children for a group), as the JavaScript core's
`variableForIndexAsProp` does, and may offer several named sequences over
the same cells (a matrix's `rows` and `columns`). A scalar is a sequence
of one, so "a list of one is a value" holds in both directions: `$m[1]` of
`5` is `5`, and `<math>2 $one</math>` with a one-entry list is `2 * 7`.

There is no second kind of collection. A point's or tuple's coordinates, a
matrix's rows, a list of points and a function's maxima (pairs of location
and value) are sequences, and a sequence of sequences is how a
two-dimensional array is written, so `$pl[2][1]`, `$m[1][2]` and
`$f.maxima[1][2]` are each "entry, then entry". The coordinate selector
`Parts` goes.

### 2. The layout follows when the count settles

The compile classes every sequence by when its count is known, from the
leaf kinds and never from runtime values (as ADR 0005 chooses lowering):

- **Static** (compile time): the count is a fact of the source. A literal
  list, a polygon's written vertices, `(a, b, c)`, `<sequence length="4">`.
  Entries sit inline in the element's slots with no count cell (ADR 0016).
- **Structural** (build time): the count reads a cell, and a change of it
  is a change of the document's shape. A repeat's iterations, a collect
  across repeats, a list whose children include a repeat or a reference to
  a structural sequence, `maxNumber="$n"`, `<sequence to="$n">`, a matrix
  input's size, `<repeat for>` over any sequence. One cell per entry per
  build; the count is a structural cell; a change is a rebuild, with
  essential values kept by (scope, position, slot).
- **Dynamic** (tick time): the count is part of a value and moves with it.
  A point's dimensions as a coordinate is typed, a function's maxima under
  a drag, an intersection's points, a mathInput's list. A **capped list**:
  `cap` cells padded with the missing value and a live length cell, the cap
  known from the type (three coordinates; four meetings of two conics;
  `MAX_TUPLE`). Where no cap exists the sequence stays inside the math
  handle, and `Item(k)` is a symbolic projection with the missing value
  past the end; or it is declared structural and rebuilt.

The padding is the "nothing past the end" rule: an entry past the live
length *is* a cell holding the missing value, so every consumer's reading
of it falls out of the layout.

### 3. One index step

A reference is a path of steps whose kinds the compile decides from the
type the path has reached (ADR 0032). `[k]` is always `Item(k)` on the
sequence the path has reached. An index is a constant, an iteration index
or one cell. It names an entry when its value is an integer from 1 to the
count, and otherwise names the missing value: zero, a negative, a
non-integer (`$r[3.4]`), past the end, not a number. An index is never
rounded. The rule is the same on a component (`$P[2]`) and on a prop
(`$P.xs[2]`). A `name` after an index is a port of the entry's type.

How `Item(k)` is bound follows the layout of decision 2, not the step: an
alias for a static or structural entry, a `Choose` over the entries by the
cell for a dynamic index, guarded so that a value that is not an integer
in range selects the missing cell, and a symbolic projection for an entry
inside a handle. `$p[$k]` and `$l.points[$k]` are allowed, each a small
`Choose`. A literal `$P[3]` on a two-dimensional point reads the missing
value instead of failing to compile.

### 4. An entry is a row of the component table

An entry of a sequence gets a row per build: type the entry type, parent
the list, ports aliasing the entry's cells. It costs columns and no graph
node (components and props are names, `ARCHITECTURE.md`). A renderer
addresses it as `list:k`; a `<ref>`, trigger, legend or `<callAction>`
resolves to it as to any component; `$l[2].text` is a port of that row and
`$l.text` the same port of every row. Row counts are bounded by the build,
so no entry is visited lazily.

### 5. Reading a sequence where a value is expected

A planner that reads children reads a sequence of `n` entries as: `n = 0`,
the missing value; `n = 1`, that entry; `n > 1`, the type's aggregate (a
`list` head over the entry cells for math, the comma-joined text for text,
one operand per entry for an operator). This is one rule for
`<math>$l</math>`, `<text>$tl</text>`, `<sum>$l</sum>`,
`displayDigits="$one"` and `<point>($nl[1], $ml[1])</point>`.

`mergeMathLists` is a corollary: a typed list reading exactly one child
whose value is a list of its entry type takes that value's entries as its
own, statically when the child is a literal and by projection from the
handle when it is an input. An attribute to force or forbid the split
stays.

### 6. A write is a request on the entry's cell

An entry aliases its source, so the JavaScript core's routing by
`entryStructure` is the aliasing itself: a text piece is an essential cell
owned by the list element and keyed by position; a child's entry is the
child's cell; a reference's entry is the referent's cell; a collected entry
is the source's cell. An operator's result is a derived cell whose inverse
drops; a fixed list holds its cells (ADR 0022). A written entry kept past
the end is an essential value keyed by (scope, position) that a shorter
build does not visit and a longer one finds again, the session's existing
rule for iterations.

### 7. Order and presentation stay out of the layout

`<sort>` is a permutation aggregate carrying an order port (ADR 0032);
`<shuffle>` is a seeded permutation; `unordered` is a flag on the
comparison instruction, never on the data; commas are the bridge's, with
"innermost decides" from the shared helper (ADR 0025).

### 8. Shapes inside a value

The symbolic engine keeps the heads `list`, `tuple`, `vector`, `altvector`,
`array`, `interval`, `set` and `matrix`, with the JavaScript core's equality
lattice (a vector equals a tuple of the same entries; a list does not equal
a tuple; an interval compares by exact positions and closedness; a set is
unordered). `createVectors` and `createIntervals` are normalizations in the
compile's parse stage. Point, tuple and vector are one shape: a capped
sequence of coordinates with a live length, so `$P.xs[3]` on a
two-dimensional point reads the missing value and a third coordinate typed
into a bound input grows it.

### 9. The questions the JavaScript core answers two ways, answered once

- An index that is not an integer in range names nothing, on a component
  and on a prop alike (the JavaScript core rounds an index read through a
  dependency, `value_references.test.ts:333`, and refuses a literal one).
- `[i][j]` is entry then entry.
- An element written inside a container is one item of it, and a
  reference's items are spliced, for indexing and for `<repeat for>` alike
  (the JavaScript core splices for `<repeat for>` only).
- One text splitter: spaces outside any bracket pair.
- `hide` on a child hides its entry everywhere.
- `copy=` of any sequence is a snapshot.
- A sequence has one public count.
- An `extend` to a sequence of another entry type (`<textList
  extend="$ml"/>`) is decision 5's reading into that type, not a refusal.

## Considered options

- **Keep two kinds of index step, `Item` for a sequence and `Part` for a
  value with coordinates.** The first draft of this design did. Rejected:
  no test distinguishes "coordinate 3 does not exist" from "entry 3 does
  not exist", every observable rule is the same for both, and the split
  reproduces the JavaScript core's three indexing paths. What varies is
  the layout, which the compile already picks from the type.
- **Make every sequence structural**: one cell per entry, a rebuild on any
  change of count. Rejected: a drag of a function would rebuild the
  document for its maxima, against "the tick never consults structure"
  (ADR 0032, breaks the premise).
- **Keep every list inside a math value** and project entries
  symbolically. Rejected: a renderer draws each point of a list from cells,
  and a drag inverts through them; a handle has no cells to request.
- **The JavaScript core's fully dynamic arrays**: any count follows any
  value, entries materialized by name on demand. Rejected: it is what ADR
  0015 gives up so that a tick is a program over cells, and the list
  component work of 2025 shows the static decision is what makes those
  documents cheap.
- **Round a non-integer index**, as the JavaScript core does for an index
  read through a dependency. Rejected: an index is a name, and `3.4` names
  nothing; the resolver and the target lookup already say so.

## Consequences

- One rule for addressing, reading, writing and drawing an ordered
  collection, whatever made it. The `listcomponent*`, `listentrytargets`,
  `compositesInTypedContainers`, `repeat*Lists` and `compositeCommas`
  suites become the parity target for lists as a whole.
- `Parts` goes, and with it the arity check on coordinate indices; the
  missing value takes its place. `$p[$k]` and `$l.points[$k]` build.
- Point, tuple and vector merge into one type with a live length; a
  `<math>` written `(a, b)` and one written `(a, b, c)` are the same type
  at different lengths.
- Memory: a capped sequence pads to its cap, for the few types that need
  one; every other sequence has the length the author gave or the build
  counted.
- A `<repeat for>` over a mathInput's list rebuilds per keystroke, as
  `to="$n"` does today. Acceptable, and said.
- One JavaScript test changes if the cores are to agree: the index that is
  rounded (`value_references.test.ts:333`). Every other rule above is one
  the JavaScript suites already pin.
- `tests/every_count.rs` extends to every structural sequence, not only
  repeats; a capped sequence is checked at every live length up to its cap.

## Migration

Each step lands alone, with the golden diff unchanged unless it says
otherwise.

1. **The index rule.** `Item(k)` on every sequence; the integrality guard
   on `Choose`; `Parts` folded into the sequence of a point's coordinates;
   `$p[$k]` and `$l.points[$k]` allowed. Test: a document with `$P[3]`,
   `$P[0]`, `$P[2.5]` and `$P[$k]` loads and reads the missing value or
   the chosen coordinate.

   *Done 2026-11-10* (`tests/sequence.rs`, and an `entries` document in
   `tests/every_count.rs`; the golden diff is identical). A reference plan
   ends in *entry steps* (`EntryIndex`, `compile/ir/refs.rs`): `[k]` on
   the cells its port holds, taken one at a time for a coordinate and two
   at a time for a list's point. A build (`Builder::port_targets`) and
   the template graph (`Stamp::port_targets`) take them alike, a choose
   per cell for a cell index and the missing value for one that names no
   entry, and the type pass types them (`port_cells`, then the entries).
   `$P[k]`, `$c.center[k]`, `$l.point1[k]`, `$l.points[k]`,
   `$l.points[k][j]` and `$l.points[k].y` take a literal, a cell or an
   iteration's index name; an index that is a number but no integer in
   range (`3`, `0`, `-1`, `2.5`) reads the missing value where it was
   refused, on a repeat, a collect and a select as on a port. `Choose`
   chooses nothing for a choice that is no integer, and its range rule
   is the one branch a known choice chooses. Departures:

   - `PropSel::Parts` stays, as the static layout of a sequence of
     coordinates: a literal in range is still bound at planning to the
     coordinate's port, so a plan that read it before reads it the same.
     The arity check on coordinate indices is gone; removing the
     selector itself, decision 1's "`Parts` goes", is left to step 5,
     with the point, tuple and vector merge.
   - An iteration's index name in an entry step is read as the cell of
     the index it names, a choose, not a literal per iteration: the
     template graph stands one iteration for all, so a literal would
     name one coordinate in the graph and another in the build. A sum
     (`$P[$i + 1]`) is still `cells-dynamic-index`.
   - A table's points by a non-literal index (`$l.points[$k]` on a
     line) are read as one sequence of every table point's coordinates,
     so a table of more than four points is refused; none has that many.
   - `[k]` after an entry that is one coordinate (`$P[1][1]`) is still
     too deep, though decision 1 makes a scalar a sequence of one.
   - An entry of a list reads as one point where points are read
     (`vertices="$q $pg.vertices[$k]"`); where a whole list is read (a
     list's items, `<pointList extend="$pg.vertices[$k]"/>`) it is
     refused, as a literal entry already was.
2. **Sequences in the type table.** `ListProp` generalized from points to
   any entry type; `<mathList>`, `<numberList>`, `<textList>`,
   `<booleanList>`, `<intervalList>`, `<pointList>` and `<vectorList>` as
   static sequences of their children and text pieces, with decision 5's
   reading in every parent and decision 6's writes. Test:
   `listcomponentvaluelists.test.ts`, `listcomponentpointlists.test.ts`.
3. **Entries as rows.** Rows per entry, renderer address `list:k`, targets.
   Test: `listentrytargets.test.ts`, `listcomponentvaluelistgraphs.test.ts`.
4. **Structural sequences.** `<sequence>`, the samplers, a list with a
   repeat or a structural reference among its children, `<collect>`'s
   items, `<repeat for>` over any sequence, `maxNumber="$n"`. Test:
   `listcomponentsamplers.test.ts`, `listcomponentcollections.test.ts`,
   `repeatIterationValues.test.ts`, `repeat*Lists.test.ts`.
5. **Dynamic sequences.** The capped list with a live length: point
   coordinates first (merging point, tuple and vector), then a mathInput's
   list, then maxima and intersections with their caps. Test:
   `point.test.ts` (dimension changes), `math.test.ts` ("components of
   math"), `functionTag.test.ts` (extrema).
6. **Order.** `<sort>` as a permutation aggregate with an order port;
   `<shuffle>` seeded. Test: `sort.test.ts`, `shuffle.test.ts`.
7. **Glossary.** `CONTEXT.md` gains *sequence*, *entry*, *capped list* and
   *live length*, and *point list* and *tuple* are rewritten as sequences.
