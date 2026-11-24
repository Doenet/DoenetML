# Every list is a sequence, laid out by when its count settles

Status: proposed 2026-11-10. Step 1 of the Migration is done,
step 2's first three pieces, step 3, step 4 in part, step 5 in
part (no point merge), and step 6 in
part, with their
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

- **Indexing.** (Superseded in part by ADR 0046: past the end is the
  missing value, shown as `＿`, which an operator propagates and a
  comparison reads as false; it is not the empty value of the type, and
  it is not dropped as an operand.) Entries are numbered from 1. Past the end is not an error:
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

   *Piece 1, done 2026-11-10*, on today's declaration format (ADRs 0039
   and 0040 are drafts). `ListPoints::Given` holds entries of a kind
   (`EntryKind`): a point, two cells, as before, or a value, one cell
   (`ComponentType::list_width`), and every reader of a list takes
   entries `list_width` cells at a time. `<numberList>`, `<textList>`
   and `<booleanList>` (`components/values/*_list.rs`) are static
   sequences: `children: List` splits their text at the spaces outside
   any bracket pair (`ListPiece`), each piece a given value and each
   reference an entry aliasing what it names, so a write through an
   entry lands on the list's own piece or on the reference's source.
   Their entries are `numbers`, `texts` or `booleans` (`number2`),
   their count `numComponents` (`numValues`); `$l[k]`, `$l[$k]` and
   `$l.numbers[k]` are entry steps (step 1), and a `$ref` child naming a
   boolean list's entry shows as a `<boolean>` (`Role::BooleanValue`).
   A paragraph shows a list as its entries separated by commas, each as
   its kind reads (`rendered_text`), and the bridge draws one as a
   `<text>` of the same until entries are rows (step 3). A choose holds
   what its branches hold, so `$tl[$k]` and `$r[$k].t.value` show as
   text, not as a string id. Tested by the three types' specs, `tests/sequence.rs` and a
   `value-lists` document in `tests/every_count.rs`; the golden diff is
   identical.

   *Piece 2, done 2026-11-23.* What a reference contributes among a
   list's (or an operator's) children is told from the records, never
   the plans (ADR 0029; `compile/stages/plan/lists.rs`): a reference by
   a path of names to a value list, in its template or one around it,
   contributes that list's entries (`Splice::Entries`), each read as
   `$l[k]`, so a write through one lands where the referent's entry
   comes from; a literal index past such a list's end contributes none
   (`Splice::Nothing`); anything else one value, as before. The count is
   the referent's pieces, its references' contributions in turn and its
   literal `maxNumber`, a bare copy's its referent's; the read is
   recorded, so a box it names boxes the reader. A list operator's count
   follows its children's the same way, as its list declares
   (`from_children`: as many for `<sort>`, `<shuffle>` and the
   cumulative operators, one fewer for `<differences>`), so
   `<differences><cumulativeSum>$nl</cumulativeSum></differences>` reads
   its entries. `list_entries`
   (`PlanCtx`) gives the value lists and every operator over a list of
   operands (`<sum>`, `<mean>`, the cumulative and index operators,
   `argMin`, `argMax`, `<sort>`) the same entries.

   - Element children of a `children: List` type are outlined as its
     components and read through a plan naming each
     (`ListPiece::Element`), as a reference to them is: an entry, or a
     nested list's entries.
   - A reference inside brackets makes its piece math text
     (`ListPiece::Math`); a `<numberList>` piece that is no plain number
     reads as the math it is (`1+1`, `8/2`, `pi`), `x` and `@` as the
     missing value.
   - `<mathList>` (`EntryKind::Math`): a piece is a given expression (a
     write through its entry lands on it), a reference the expression its
     one cell stands for, an element child's likewise. A cell that holds
     math stands for its own expression: a leaf naming it inside math is
     a math leaf, and a `$ref` child naming it shows as a math
     (`mathValue`, `TextKind::Held`; the wasm binding's `cell_holds`).
   - `maxNumber` (literal) on the value lists; `mergeMathLists`
     (literal) and the one-child rule split a `<math>` child of literal
     list text (`1,2,3`) into the list's own pieces.
   - Decision 5 where one value is read: a list of none, or an entry
     past a list's end, is the missing value (`<number>$empty</number>`);
     an operator reads one operand per entry.

   Tested by the specs, `tests/value_lists.rs` and a `nested-value-lists`
   document in `tests/every_count.rs`. Departures:

   - `mergeMathLists` splits only a literal `<math>` child: its items are
     the list's own pieces, so a write through one lands on the list, not
     on the `<math>`, which the current core rewrites. A reference to a
     list-valued math (`<mathList>$lm</mathList>`), and the flag bound to
     a cell, are left: the first needs the engine's `list` head (decision
     8), the second is structural (step 4).
   - An element child of a list or of an operator over a list of
     operands is an entry (decision 9), where the principles review's
     COMP-1 refuses an element inside `<math>` or `<number>` content: a
     list reads its element children as this decision makes them
     meaningful, and every other value still refuses one. A
     `mergeMathLists` set by a reference is refused (VAL-7) rather than
     read as false.
   - A reference to a list in an iteration (`$r[1].l`), or a `<sequence>`
     or a sampler among a list's children (`from_children` none), still
     contributes one value,
     refused as an arity mismatch when it names several: their counts are
     structural (step 4).

   Left for the next pieces:

   - `<math>$l</math>` as a `list` head, and `<math>$emptyM + 1</math>`
     as the blank expression: a math cell holds no `list` or `tuple`
     (`Engine::parse_tree` refuses them), which decision 8 gives it.
   - `<text>$tl</text>` joined with commas: a text's value is one string
     id, and a join of entries a write can change makes a string during
     a tick, which no operator does. It needs either a text whose value
     is a sequence of strings, shown joined, or strings made in a tick.
     *Done 2026-11-23* by strings made in a tick (ADR 0053): a `<text>` of
     one reference to a static sequence joins its entries, and every value
     list has a `text` prop, its entries joined.
   - A `<mathInput>` bound to a math entry is numeric, as every bound one
     is, so a number typed into it is written into a math cell as a
     handle; an input bound to a cell that holds math needs to write an
     expression. (Done in piece 3.)
   - `<intervalList>` (intervals), `<pointList>` of its own points and
     `<vectorList>` (drawn and dragged entries are step 3, and a
     point's coordinates a capped sequence step 5), `unordered` (a flag
     on a comparison of two sequences, decision 7) and display settings,
     which no value of this core rounds yet.
   *Piece 3, done 2026-11-23*, on decision 8's values with entries in a
   math cell:

   - `<intervalList>` (`components/values/interval_list.rs`): a
     `<mathList>` whose pieces of text and math text have their pairs
     made intervals (`Tree::intervals`, `Post::Shapes`); a reference or an
     `<interval>` child is an entry as it is.
   - A `<mathInput>` bound to one reference (`bindValueTo`, a reference
     child) has as its `expr` the expression the reference stands for, a
     math leaf alone (`Flow::MathHandle`), so the type pass makes it the
     referent's math cell itself when it holds one (a symbolic math's, an
     input's, a math list's entry, a subset's) and no value when it holds
     a number. It shows that expression, and typing writes an expression
     there, never a number into a math cell as a handle; the bridge and
     the parity adapter request on `expr` whenever it holds math and is no
     constant.
   - `<subsetOfReals>` (`components/values/subset_of_reals.rs`,
     `sym/subset.rs`): the JavaScript core's `subset-of-reals` utilities,
     a subset held normalized as sorted pieces, read from intervals,
     points, `R`, `emptyset`, unions and intersections (`or`, `and`, a set,
     a list), complements (`^c`), inequalities, equations and memberships
     in its `variable` and set-builder notation; written back merged, as
     intervals or as inequalities (`SymKind::Subset`). A write to it
     writes the subset as it is written to what it reads (its inverse),
     so a copy, an extend and a bound input all reach the input it reads.
     Its `points`, `pointsClosed`, `intervals` and `isolatedPoints` are
     each a math cell holding a list (one entry alone, none empty): their
     counts follow the value, and they have no cap (decision 2's "stays
     inside the math handle"); `$S.points[2]` is not planned.
   - Constant math text the compile's parser does not read and the
     engine reads whole, a relation (`4 < x <= 5`, `x = 2`, `x in (0, 1)`),
     is a constant math (`Expr::Shape` with no entries), and a
     `<mathInput>`'s prefill likewise (`Tree::Written`); with a reference
     in it, it is still refused.
   - Decision 7's flags on the comparison: an award's or answer's
     `matchPartial`, `unorderedCompare` and `matchByExactPositions` choose
     the engine's comparison (`SymKind::Compare`, `sym/compare.rs`), and a
     side of `=` that is one reference to a `<math>` written `unordered`
     makes that comparison unordered, read from the referent's source at
     the comparison, never carried by the value. `$a = $b`, two
     references the planner cannot tell apart from numbers, is compared
     in the engine when the type pass finds one stands for an expression
     (`Post::ComparePair` under `Flow::ValueOf`), else as numbers.

   Tested by the specs, `tests/subsets.rs`, `tests/bound_math_input.rs`,
   `tests/match_partial.rs` and `tests/shapes.rs`. Departures:

   - `displayMode` of a `<subsetOfReals>` is literal (a bound one warns
     and shows intervals): the operator reads no string. `format="latex"`
     math text and `<subsetOfRealsInput>` are not done.
   - `unordered` on a `<math>` counts only where it is alone on a side of
     `=`, written literally; `<math unordered="$b">` and an unordered math
     inside a list are not read.
   - A `<math>` written `(1, 2, 3)` is still a tuple component, one cell
     per entry, so `$t = $u` over two of them, and `matchPartial` over
     them, wait for step 5's merge; a list (`1, 2, 3`) works.
   - `<matrix>` is not done: see the open question below.

   Open question (`<matrix>`): its rows and columns are written
   `<row>` and `<column>`, and `<row>` is already the tabular's row. The
   current core sugars them into `<matrixRow>`/`<matrixColumn>` by their
   parent. This core settles a tag's type from the tag alone
   (`ComponentType::from_tag`, outlining), so a matrix needs either a
   type settled by its parent (a declaration on `<matrix>`: "a `<row>`
   child is a `<matrixRow>`", read by outlining), or rows written as
   `<matrixRow>` only, or rows as math text (`<matrix>[[a, b], [c, d]]`).
   The parity file needs `<matrixInput>` (the inner-inputs work) as
   well.
3. **Entries as rows.** Rows per entry, renderer address `list:k`, targets.
   Test: `listentrytargets.test.ts`, `listcomponentvaluelistgraphs.test.ts`.

   *Done 2026-11-23.* A type whose list's entries are its own
   (`ListPoints::Given` with no attribute: the value lists, the list
   operators, the samplers and `<sequence>`, `<pointList>`) has a row
   per entry (`ComponentType::entry_row`): a `number`, `text`,
   `boolean`, `mathValue` or `point` (the roles `Value`, `TextValue`,
   `BooleanValue`, `MathValue`, `ListPoint`), a child of the list, whose
   entry ports (`entry_ports`) alias the entry's cells. A build makes
   them after the copies of lists take their ports (`expand_rows`,
   `build/expand/rows.rs`) and the template graph alike
   (`compile/graph/rows.rs`); a `$ref` copy of a list has rows of its
   own over its own entries. An element child of the entry's type that
   contributes one entry is its own row (`ElemPlan::entry_elems`, from
   `PlanCtx::element_rows`), so a click on it is a click on both.
   `<pointList>` is a static sequence of its own points
   (`PlanCtx::point_entries`: `(1,2)` pieces, references, authored
   points, another point list's points spliced, a list prop's items,
   `maxNumber`); `$pl[k]` steps to its row (`Collection::ListPoints`,
   as for a point list made from a list prop), so `$pl[k].x` is a port of
   the row and a drag of the row lands on the entry's source. A link
   (`triggerWhenObjectsClicked`, `<callAction target>`) to `$l[k]` names
   the row, and an event on a row is one on its list too. The bridge
   draws each list as its rows, each by its own contract, separated by
   commas outside a graph (`LIST_LIKE`), `asList="false"` turning them
   off; the core's text of a list and of a point is likewise. Tested by
   `point_list.spec.rs`, `tests/value_lists.rs` and the bridge tests.
   Departures:

   - The row of a value list's entry (`$l[k]`) is reached only as a
     link; a value read of `$l[k]` is still the entry step of step 1, and
     `$l[k].text` and `$l.text` (a port of every row) are not planned.
     A point list's `$pl[k]` is the row in both.
   - A link through an index by a cell (`$pl[$i]`) names nothing: links
     are resolved per build, and the index is a cell.
   - A `<math>` child of a `<mathList>` is not its own row (the row is a
     `mathValue`, the child a `math`); its entry is drawn by a made row.
   - A list's element children that are not rows (a nested list, a child
     of another type) stay in the table under the list, not among its
     children; a `<label>` child of a list is not among them either.
   - An event's key (`document/act.rs`) tells components the compile made
     apart by their place under the nearest authored component, so two
     made rows are not one.
   - `<ref to="$pl[2]">`, a legend's label for an entry, `<vectorList>`
     (whose rows need a vector's tail and head wiring) and display
     settings are not done; `<intervalList>` waits for the interval
     component.
4. **Structural sequences.** `<sequence>`, the samplers, a list with a
   repeat or a structural reference among its children, `<collect>`'s
   items, `<repeat for>` over any sequence, `maxNumber="$n"`. Test:
   `listcomponentsamplers.test.ts`, `listcomponentcollections.test.ts`,
   `repeatIterationValues.test.ts`, `repeat*Lists.test.ts`.

   *In part, 2026-11-24:*

   - **A sequence's layout is chosen per element.** A type declares
     the attributes its count follows and the type it is when one of
     them is no literal number (`structural { when: [from, to, step,
     length, exclude], is: StructuralSequence }`, `Structural`):
     outlining reads what each attribute holds, before anything is
     planned, and `ComponentType::laid_out` gives the element its type,
     so a `<sequence>` of literal numbers stays a static sequence (its
     entries constants, rows per entry) and one with a reference or
     math (`to="$n"`, `from="2-5"`, `exclude="$x"`) is a structural one,
     an internal type with the tag `sequence`
     (`components/values/structural_sequence.rs`).
   - **A structural sequence is a repeat with an item** (ADR 0040,
     decision 3): `structure: Repeat { count: numComponents }`, `item:
     Number(item)`, `children: None`, so its body is one `<number>` per
     iteration and a change of its count a rebuild that keeps essential
     values by (scope, position, slot) (ADR 0004, ADR 0017). Its
     parameters are one instruction over the given ones
     (`VecOp::SequenceParams`, the current core's
     `calculateSequenceParameters`, shared with the static planner as
     `program::sequence_parameters`), its count another
     (`SequenceCount`, at most `MAX_SEQUENCE`), and entry `k` a third
     (`SequenceEntry`). `$s[k]` is iteration `k`'s number, `$s.numComponents`
     the count, `<collect from="$s" componentType="number">` its numbers.
   - **Its `exclude` is a capped list** (decision 2): ten table ports
     padded with the missing value, read as a list's entries are
     (`AttrKind::Entries`, `PlanCtx::list_entries`): a reference to a
     static sequence spliced, a piece mixing references and text math
     (`$n2-$n1`), a math cell (a math list's entry) evaluated.
   - **A static `<sequence>` or sampler among a list's children.** A
     type whose planner makes its entries declares how many its record
     makes (`static_count`), so `<sum>$s</sum>`, `<numberList>$s
     7</numberList>` and `exclude="$every3"` read its entries
     (`Splice::Entries`), where they read one value before.
   - **`<repeat for>` over any sequence.** Over a static sequence (a
     value list, a list operator, a static `<sequence>`, a sampler), the
     count is a constant and the item `$l[i]`, an entry step by the
     iteration's index cell (an index outlining makes beside the item
     when no `indexName` names one); over a structural sequence, the
     count is its count's cell and the item aliases each prop of
     iteration `i`'s item. Outlining settles the item's type once every
     name is in the table (`settle_repeat_items`): the row type of the
     sequence's entries (`entry_row`), or its declared item. A write
     through the item lands where the entry comes from.
   - **A repeat's and a collect's text** is its items separated by
     commas (an iteration's children one item), unless `asList="false"`
     or an item holds a block, as the bridge draws them; `hide` on either
     `<sequence>` hides it from its text and the bridge.
   - `tests/every_count.rs` builds a `structural-sequences` document at
     every count; its range check of constants holds a repeat whose
     count is a constant at that count (`builds_at_reachable`), since a
     forced count past it is no build a session makes and puts an
     iteration's index outside the range the check gave it (a
     `<repeatForSequence length="3">` with its index read met the same).
     Tested by `structural_sequence.spec.rs`, `sequence.spec.rs` and
     `tests/structural.rs`.

   Departures, and what is not done:

   - The static sequence keeps the static layout; decision 2 classes
     by the leaf kinds as written, so constant math (`to="2+3"`) is
     structural with a count no tick changes, not static.
   - A structural sequence has no `numbers` list prop, no rows of its
     own (its numbers are its iterations' items) and is not copyable:
     a bare `$s` (in a `<p>`, among a list's or an operator's children,
     `<math>$s</math>`) is refused as a copy of a repeat is. A list whose
     children include a repeat or a reference to a structural sequence
     (a structural list), `<collect>`'s items read where a list's are
     (`<sum>$c</sum>`, `$c` in a `<p>`), a `<repeat for>` over a
     collect, a repeat or a point list, and `maxNumber="$n"` are not
     done: each needs a list whose entries are gathered per build, the
     collect's machinery read as a sequence, which no planner reads yet.
   - A sampler's `numToSelect`/`numSamples` stays a literal: a count
     read from a constant (`numToSelect="$n"`, ADR 0037) is known only
     once the check evaluates the constants, after the plans are made.
     *2026-11-24*: `<selectFromSequence>` is a list like the samplers,
     its picks its entries and rows (`values`, `number1`, ...), `value`
     the first; one pick is the `SequencePick` it always was, several a
     `Draws` of the sequence (`withReplacement`, `sort`), so a literal
     `numToSelect` other than 1 is done, and a select of one reads as a
     number by decision 1. `length` counts its sequence when every
     parameter is a literal. `excludeCombinations`, `coprime`, letters
     and math are not done.
   - `type="letters"` and `type="math"` sequences, and `validSequence`,
     are not done.
   - `<matrixInput>`, whose grid follows its size: *done 2026-11-24*
     (ADR 0045, Migration 3), a repeat of rows each a repeat of boxes,
     the matrix an aggregate over the boxes the build stamped.

   *`<matrix>`, 2026-11-24*, the open question of piece 3 answered by a
   parent-declared type (ADR 0055): a `<matrix>`'s `<row>` and `<column>`
   children are `<matrixRow>` and `<matrixColumn>`, each a list of
   entries read as a `<mathList>`'s. The matrix is a math cell
   (`Flow::SymExpr`) whose expression is its entries by row, made a
   matrix in the engine (`Post::Matrix`, `Engine::matrix`): of its rows,
   else its columns turned, else its children as one entry (a 1 by 1
   matrix), or one reference alone the expression it names; rows shorter
   than the longest, and a literal `numRows`/`numColumns`, filled with
   `defaultEntry`. `numRows`, `numColumns` and `matrixSize` (the two) are
   constants. Tested by `matrix.spec.rs` and the bridge test. Not done:
   a size that follows a value (refused; it is a structural matrix),
   rows and columns as named sequences.

   *`<matrix>`, continued 2026-11-24* (ADR 0060): `$A[i][j]` is decision
   3's projection, entry then entry inside the expression a matrix holds:
   two of step 5's in-handle entry steps (`EntryIndex::IN_HANDLE`,
   `SymKind::Entry`), the engine reading a matrix by rows (row `i` a
   tuple, a transposed vector its one row), by literals or cells, the
   blank past the size; a write through it writes the matrix's entry,
   the row replaced in the matrix and the matrix's template inverting
   entrywise. `extend="$x.value"` makes a matrix of the
   value, and one holding a copy of a value reads its size from it
   (`SymKind::MatrixSize`). `<matrixInput>` is done (ADR 0045).
   `matrix.test.ts` still waits on `<numberList extend="$A.matrixSize">`
   (a value list extending a combined prop), a size that follows a value
   and a `defaultEntry` by reference.
5. **Dynamic sequences.** The capped list with a live length: point
   coordinates first (merging point, tuple and vector), then a mathInput's
   list, then maxima and intersections with their caps. Test:
   `point.test.ts` (dimension changes), `math.test.ts` ("components of
   math"), `functionTag.test.ts` (extrema).

   The point, tuple and vector merge is deferred (the user's decision,
   2026-11-24); the pieces below come first.

   *The capped list, 2026-11-24.* A type's list may be capped
   (`ListProp::live`, declared `capped: [x, y], live: numPoints, hidden:
   hidden`): its entries are as many as the cap its planner makes, those
   past the live length (a table prop the planner wires) the missing
   value. The list's companion sequence (ADR 0053) is each entry's
   `hide`, 1 past the live length, and a made row's `hide` aliases it
   (`ListShape::row_hide_slot`), so a row past the live length is drawn
   by no renderer; a path names no entry past it (`$int[3]`,
   `Document::resolve_path`) and the list's text stops at it. The first
   capped list is `<intersection>` (`components/geometry/intersection.rs`,
   `VecOp::Intersect`): where two lines, segments, circles or polygons
   (a `<polygon>`'s given vertices, a `<triangle>`'s three, a
   `<rectangle>`'s four) meet, as the current core finds them, its cap
   from the two figures (`Figure::cap`: one for two lines, two where a
   circle meets a line or a circle, a polygon as many as its edges'), a
   point found twice kept once where a polygon is one of them. Its
   points are `point` rows, `points` the list, `numPoints` the live
   length; a drag of one is dropped. Tested by `intersection.spec.rs`,
   `tests/dynamic_sequences.rs` and the bridge test. Departures:

   - A vector operator writes at most `MAX_VEC_IN` cells (an
     intersection of two polygons of four vertices is 16 points and a
     count, 33), the step's buffer taking the heap past 16.
   - A `<polyline>` (a collect of its points, structural) and a
     `<regularPolygon>` (its vertex count is its `numVertices`) are not
     figures yet, and the intersection's warning when a third figure
     appears in a case (`$cc.l3`) is the load's, not a tick's.

   *A sequence inside the handle, 2026-11-24.* A value with no cap (a
   mathInput's `1, 2, 3`, a `<math>` reading one, a subset's `points`)
   stays inside its math cell, and `[k]` on it is an entry step of width
   0 (`EntryIndex::IN_HANDLE`): on a type whose default prop is one cell
   standing for an expression and that has no list
   (`ComponentType::handle_sel`: `<math>`, `<mathInput>`), `$m[k]`,
   `$m[i][j]` (entry then entry) and the current core's names `$m.x`,
   `$m.y`, `$m.z`, `$m.x4`; on any one-cell prop, `$S.points[2]`,
   `$f.maxima[1][2]`. Whether it is a projection is decided from the
   port's type, the same in the type pass, the template graph and the
   build (`math_target`): a cell that stands for an expression gives
   `SymKind::Entry` over that expression and the index (a constant, an
   iteration's index or a cell), the missing value for an index that is
   no integer from 1 to the count; a number is a sequence of one (`$n[1]`
   the cell, any other index the missing value, a cell index a `Choose`
   with the integrality guard). A write through an entry writes the
   value with that entry replaced, its head kept (the inverse of
   `Entry`), so a `<mathInput bindValueTo="$m.y">` writes the input it
   came from. `numDimensions` of a `<math>` and a `<mathInput>` counts
   the entries (`SymKind::Count`; 1 for a scalar, a number or the blank
   expression). `<repeat for="$mi">` has an iteration per entry: its
   count is `$mi.numDimensions`, so a change of the count is a rebuild,
   and its item a math value, `$mi[i]` by the iteration's index. Tested
   by `tests/dynamic_sequences.rs`. Departures, and what is not done:

   - A list or an operator reading `$mi` as its entries (`<mathList>$mi
     </mathList>`, `<sum>$mi</sum>`, decision 5's projection) is not
     done: the count follows the value with no cap, so such a list is
     structural (a rebuild per count), the structural list of step 4,
     which no planner reads yet. `<math>$mi</math>` reads the value
     whole, as before. Still open after the extrema (2026-11-24), with
     `<pointList extend="$f.extrema"/>`, the same list over a prop's
     value: a list element is laid out when outlining meets it, before
     the type of what its one reference names is known, so a list that
     is structural by its referent would be made a repeat-like element
     with a body after the names settle (as `<repeat for>`'s item is),
     and an operator reading one needs the items gathered per build, or
     a symbolic reduction inside the handle instead of a rebuild.
     *Done 2026-11-24* (ADR 0063, the user's decision): such a list is
     settled once names resolve, by its referent's type, a repeat-like
     list over the value (its entries the value's read as a list's,
     `SymKind::ListItem`), static over another list; an operator over one
     math value reduces its entries inside the value (`Post::Reduce`).
     A bare reference to one reads the value as a `<math>`; a list over
     a value with any attribute beside `name` and `extend` stays static.
   - A function's maxima, minima and extrema: *done 2026-11-24* (ADR
     0061). They have no cap the type knows (the current core searches a
     grid of a thousand cells and recurses, `utils/extrema.js`), so by
     decision 2 they stay inside the handle, a math cell holding a list
     of `(x, f(x))` tuples, which `$f.maxima[1][2]` addresses as above.
     One search per direction (`SymKind::Extrema`, a port of the current
     core's) writes the local, global and infimum ones as one value its
     props are entries of. `<pointList extend="$f.extrema"/>`, a list
     whose count follows that value, is the structural list of step 4:
     *done 2026-11-24* (ADR 0063), settled late as a list over the
     value. An interpolated function (a `<function>` through points,
     maxima and minima) is a capped list of cubic pieces, its count `3 n +
     1` for `n` points given (ADR 0061), and its extrema its pieces'.
   - A matrix's entries (`$A[i][j]`) are not entries of a list head: the
     engine's matrix is not a sequence of rows yet.
   - A write through an entry of a `<math createVectors>$m</math>` is
     dropped: its expression is an instantiation with a post, which has
     no inverse (a `<math>$m</math>` is an alias of `$m`'s and writes
     through). The current core writes the vector back to `$m`.
   - A mathInput's `numListItems`, `list`, `vector` and `matrix` props,
     and the entries of a mathInput's value as rows, are not done.
6. **Order.** `<sort>` as a permutation aggregate with an order port;
   `<shuffle>` seeded. Test: `sort.test.ts`, `shuffle.test.ts`.

   *Done in part 2026-11-23*, with ADR 0053 (text in the tick). A
   `<sort>` or `<shuffle>` holds its operands as one kind, decided from the
   records: numbers, else maths, else texts (`components/operators/
   sort.rs`); its order is a hidden port per position (`SymKind::Order`
   comparing as the current core's `compareExtractedValues`, or a
   `Shuffle` of the positions by a draw), and each entry a `Choose` over
   the operands by it. Its entry kind is `EntryKind::Any`, read as each
   cell holds it. `type` (`number`, `math`, `text`), an invalid `type`
   warned and dropped, bare text read as numbers when every piece is one,
   and `asList`. Tested by the spec and `tests/text_in_tick.rs`.
   Departures:

   - A write through a sorted entry is dropped (its branch is `Shown`): the
     operand it shows decides the order, so the write would move it and no
     round trip is stable. A shuffled entry writes its operand.
   - Points and vectors (`sortByComponent`, `sortVectorsBy`, `sortByProp`)
     and booleans: *done 2026-11-23* by a width per element (ADR 0053,
     Migration): a sort or shuffle of points or booleans decides its
     entries' kind, its rows points or booleans, every reader of a list's
     cells reading them through the element's `ListShape`. A `<choiceInput>`'s
     `choiceOrder` (`shuffleOrder`) is a second sequence with no list
     before it (`sequence:`).

   - The order is public as a second named sequence over the element's
     own ports (decision 1), the list's `companion`: `componentOrder`, one
     cell per entry after the entries (`PropAt::Companion`). Its entries
     are rows (step 3), `mathValue` rows of `EntryKind::Any`.
7. **Glossary.** `CONTEXT.md` gains *sequence*, *entry*, *capped list* and
   *live length*, and *point list* and *tuple* are rewritten as sequences.
