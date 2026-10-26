# Saved state carries over only edits that are safe for every student

Status: proposed 2026-10-23. Every migration step is done; see Migration.
Amended 2026-10-24: step 3 defines an input's *starting value*, which
`tests/safe_edits.rs` found the first wording too loose about.
Amended 2026-10-26: the essential cells an input writes are no longer a
condition of their own. The derivation names every essential cell it
reads, so an unchanged derivation already keeps them; step 4 has three
conditions, and the old 3 and 4 are now 2 and 3.

When an author publishes a new version of a document, a student's saved
state carries over to it only if the edit is *safe for every student*:
everything any student could see or reach in the old version restores
exactly, and stays reachable, in the new one. The compile decides this
from the two sources alone, with no student's state, by comparing what
students can act on and what those inputs depend on. Whether students in
progress then move to the new version is the author's choice when they
publish, not the core's. The claim that the check is never optimistic is
tested, not assumed. State never crosses core releases: an attempt stays
on the release it started on, and a document edit is checked and restored
under that release.

## Context

Saved state (`document/state.rs`) is the essential cells that differ from
their defaults, one entry per cell: `[scopePath, [node, k], slot, kind,
value]`. Derived cells, credit among them, are not saved; they are
recomputed from the essential cells. A restored value can never make the
document unbuildable: every error depends on the source alone (ADR 0014)
and the probe covers every count and every pick, so restored values only
reach structures the load's check accepted.

So most edits need nothing of saved state: text, layout, hints, feedback,
formulas that feed only what is displayed, an answer's correct answer and
awards (`submitted` is essential, `credit` derived, so the answer
regrades). But today any edit can break it, silently:

- An entry names its element by DAST `NodeId`, the node's position in the
  parsed tree, and its prop by its position among the element's slots,
  hidden slots included. `restore_state` writes each value into whatever
  cell now has that key and parks an entry with no such cell. Against
  `<numberInput name="a"/><numberInput name="b"/>` with `b` set to 7:

  | Edit | After restore |
  |---|---|
  | Insert `<p>Intro</p>` first | `a` is 7, `b` its default |
  | Delete `a`, add `c` after `b` | `c` is 7, `b` its default |
  | Make `b` a `<mathInput>` | restores without error; 7 lands in a math cell as a handle it never was |

- The same `NodeId` seeds every `<select>` (`seeded_stream`,
  `build/expand/choice.rs`), so inserting a paragraph above one draws the
  student a different variant under the responses they submitted.
- A value equal to its default is not saved. When the author changes a
  point's starting position, a student who left the point there, or put
  it back on purpose, finds it moved.
- Nothing checks that a restored value is still reachable. When an author
  raised a graph's `xmin`, students whose points were left of the new
  bound could no longer see or drag them.

An earlier draft of this ADR tried to carry over as much as possible: it
diffed the two versions' essential cells and gave each kind of change a
rule (drop, replay as a request, remap). Every rule had edge cases where
the restore succeeded and quietly gave the student the wrong thing: a
changed default, a copy gaining an override, a formula between an
essential cell and a dragged point, branches identified by position. This
ADR carries over less, and what it carries over is exact.

## Decision

### 1. Saved state names cells by stable keys

An entry names its cell by keys an ordinary edit does not move:

- **Element.** A named element is its name path from the document
  (`r[*].q`; a repeat's iterations and a choice's branches are levels of
  the path, a branch named by its own stable key, not its position). An
  unnamed element is its nearest named ancestor's path, its tag, and its
  position among that ancestor's descendants of the same tag. An element
  the compile makes (an answer's implicit input, a copy's clones) is the
  element it is made for and its position among those, as `ElemKey` is
  now.
- **Prop.** A public prop is its name in the component's definition (ADR
  0016). A hidden slot is named by the planner that makes it; one without
  a name is not saved.
- **Value type.** Each entry keeps its `kind`. `restore_state` never
  writes a value whose kind differs from its cell's value type.

A select's stream is seeded from its stable key, not its `NodeId`, so the
same select with the same options draws the same pick in every version.

### 2. Saved state holds every value a student touched

A request that writes an essential cell marks it *touched*, and saved
state holds every touched value, whether or not it equals the default.
Writes by a load, a restore or a rebuild do not mark it. Untouched values
are not saved and take the new version's default. So when an author moves
a point's starting position, a student who placed the point keeps it
where they put it, even back at the old start, and a student who never
touched it sees it at the new start.

*View state* is an essential cell that only pan and zoom write: a graph's
`xmin`, `xmax`, `ymin` and `ymax` when they are its own. It is saved with
the default it had, and on restore a view value whose default changed is
dropped, so the author's new bounds win over a student's old pan. The
classification is per cell, not per prop: with `xmin="$n"` a pan inverts
onto `n`, an input, and that cell is the student's work, never dropped.

The format is `{"v": 3, "core": <release>, "doc": <signature>, "state":
[...]}`, the release being step 6's and the signature step 3's. No saves
of versions 1 or 2 exist, so their reader is removed.

### 3. The compile computes the document's input signature

Beside its diagnostics, and like them a function of the source alone, the
compile produces the document's *input signature*, per template (the
document, each repeat body, each branch), so it covers every iteration.

**Inputs** are every prop a renderer may send a request to, every answer
a student can submit, every `updateValue` and `triggerSet`, and every
select. Which props are inputs is declared, not inferred: each component
definition marks its interactive props (`interactive` in its prop table,
ADR 0016), including those a whole-shape drag moves (a line's, a circle's,
a polygon's points). A test checks that `packages/cells-viewer` sends
requests only to declared props, since the core accepts a request on any
cell and an action the declaration misses would go unchecked. For each
input the signature records:

- its stable key, value type and *domain*, the values a live request on
  it can take;
- its *derivation*: everything that decides what the input shows and
  whether a student can act on it. That is the operators and literal
  parameters on every path from an essential cell to the input; the
  defaults of the essential cells on those paths, except the input's
  *starting values*; and the same for whatever decides whether the input
  exists or can be acted on: the count of every repeat and the choice of
  every branch around it, the gates of the cases around it, `hide`, and a
  hold.

A default is the input's *starting value*, which the author may change,
only when it is the whole value of something the student drags or types
into, and nothing else is calculated from it: the cell is one of the
input's own props, no operator around the input reads it, and no other
input reaches it. A student who changed it gets their value back; one who
did not sees the new start, and nothing else moves with it.

- `<point x="1" y="2"/>`: `x` is the point's own prop and nothing is
  calculated from it. Changing `x="1"` to `x="4"` is allowed.
- `<circle through="$a $b" radius="4"/>`: the radius is not something the
  student drags; the circle's centre is calculated from it and from the
  points the student placed. Changing it would move their circle, so it
  is part of the derivation.
- A polygon whose fourth vertex is calculated from the other three: the
  first vertex is the student's to drag, but the fourth is calculated from
  it. Changing its start would move the fourth, so it is part of the
  derivation.

An earlier wording exempted every default that only one input reaches,
which allowed the circle's and the polygon's edits.

The derivation names each essential cell on those paths by its stable key
and value type, so it also fixes the essential cells the input writes
(for `updateValue` and `triggerSet`, the cells they set) and which other
elements share them: a copy that shares its original's state reads the
original's cell, and one given an override reads its own.

The derivation is recorded as a hash of the plans involved, which name no
iteration (ADR 0015). The hash is taken over stable keys and literals
only, never over the compile's internal ids (`ElemId`, slot offsets,
`Arg::Own` and `Arg::Elem` positions). Hashing an internal id would make
an unrelated insertion look unsafe, and worse, would let two different
elements that land on the same position hash alike.

The domains so far:

| Input | Domain |
|---|---|
| A point in a graph | inside the graph's bounds as the author set them, whether or not the student can pan: a point a student does not know to pan to is as lost as one they cannot reach |
| A number, math or text input | any value of its type |
| A math input | also its parse settings, which decide what typed text means |
| A slider | any number: it stores `preliminaryValue` and clamps the index it derives |
| A `choiceInput` | its choices by stable key, in order, since it stores a position |
| A select | its options by stable key, in order, and their count |
| An answer | its responses and its limit on attempts, once the core has one |

A domain given by cells (`xmin="$n"`) is compared by derivation, as
above, and not by value.

### 4. An edit is safe for every student when three conditions hold

Between the published version's signature and the draft's:

1. **Every old input is unchanged.** It exists under the same stable key
   with the same value type, and its domain is the same or larger: bounds
   that only widen, choices only appended. A select's options are
   identical.
2. **Its derivation is unchanged,** defaults and existence included, and
   with it the essential cells it reads and writes: same stable keys, same
   value types, shared with exactly the same elements.
3. **Every new input reads no old essential cell,** unless its domain
   holds every value its derivation can produce. A new `<point x="$n"/>`
   would otherwise start wherever each student's `n` puts it, outside the
   graph for some.

New inputs that meet condition 3, new answers and new selects are
allowed. Everything else may change freely: text, layout, hints,
feedback, formulas that feed only what is displayed or credited, correct
answers, awards, weights, the conditions of content that holds no input,
and an input's starting values (step 3).

**Why this is enough.** Every essential cell an old input reads holds,
after the restore, a value the student actually had (step 2), a default
that is unchanged, or a starting value the student never changed, in a
cell with the same key, type and sharing (condition 2).
Through an unchanged derivation, the input then shows exactly what it
showed before, but for a prop the student never changed, which shows its
new start; nothing is calculated from a starting value, so nothing else
moves with it. It exists exactly when it did before, and can be acted on
exactly when it could before. That value was in the
old domain, which the new one contains (condition 1), so everything the
student could see and reach, they still can. A new input starts from new
cells or inside its domain (condition 3). Nothing here depends on any
student's values, so it holds for every student.

Each condition rules out a failure found in drafting:

| Failure | Caught by |
|---|---|
| A raised `xmin`; a reordered `choiceInput` | condition 1 |
| A type change | condition 1 |
| A copy given an override | condition 2, the cells it reads |
| `q.x = 2*$n` changed to `3*$n`: `q` moves though `n` restores exactly | condition 2, operators |
| `q.x = $k*$n`, `<number name="k">` changed from 2 to 3 | condition 2, defaults |
| A circle's `radius` changed: the circle through the student's points moves | condition 2, defaults |
| A polygon's first vertex moved, which its fourth is calculated from | condition 2, defaults |
| `length="$n"` changed to `$n/2`: iterations with the student's work vanish | condition 2, existence |
| A `fixed`, `hide` or condition added around an input | condition 2, acting on it |
| A new point at `x="$n"` | condition 3 |

`compare_versions` (beside `diagnose` in `compile/check.rs`) takes the two
sources and returns whether the edit is safe and, if not, which inputs
fail which condition, tied to their nodes, so the editor can show them.

### 5. The check is tested for soundness

The check may be conservative: a "not safe" edit may harm no one (an
input every student left alone). It must never be optimistic, and that is
tested, as `tests/every_count.rs` tests the cycle check against the
probe: `tests/safe_edits.rs` takes every golden document and fixture,
applies generated edits to it (literals, formulas, defaults, bounds,
inserted, removed and renamed elements, added inputs), and runs generated
sessions of requests and submits on the original. Whenever
`compare_versions` says an edit is safe, the session's saved state,
restored into the edited version, must show every old input with the
values it had and inside its new domain, and every new input inside its
domain. A failure is a hole in the check, found before a student finds
it.

### 6. State never crosses core releases

What a derivation computes depends on the core as well as the source: an
operator's evaluation, math lowering, the symbolic engine's revision, a
planner. Nothing in a document's signature sees those, so the same source
under two releases can restore the same state to different values. State
therefore stays with the release that made it:

- Every build of the core carries a *release id*, its crate version and
  source revision, and saved state records it (`core`).
- `restore_state` refuses state whose release id is not its own, with an
  error, before reading any entry. No release reads another's state, even
  a patch release, and no signature or version scheme makes an exception.
- The platform runs several releases at once. An attempt is pinned to the
  release it started on and stays there until the student starts a new
  attempt; a new attempt starts on the current release.
- `compare_versions` runs under the pinned release, on both document
  versions. A new version that release cannot load (a tag added in a
  later release) is not safe for the attempts pinned to it, and the
  editor says so.

So a core release needs no check of its own: it reaches a student only
through a new attempt, which has no state to carry.

### 7. The author decides whether students move

The core decides only whether an edit is safe. On publish, the editor
asks:

- **Safe:** "Students in progress will keep their work. Keep their work /
  Start them over." Keeping is the default. Starting over is the escape
  hatch for a change of meaning no check can see ("drag the point to the
  velocity" rewritten as "to the position").
- **Not safe:** "Students in progress cannot keep their work in this
  version. Leave them on the old version / Start them over", with the
  inputs that made it unsafe.

When a student moves to the new version, it runs under the release their
attempt is pinned to, and the restore is today's, by stable keys: every
saved key exists in the new version (condition 2, through the
derivation), so nothing is parked,
remapped or replayed. An answer whose correct answer changed regrades;
what that does to a score already recorded is the platform's policy,
chosen in the same dialog.

## Considered options

- **Carry over as much as possible, entry by entry.** The earlier draft:
  diff the essential cells and drop, replay or remap each entry. Rejected
  for the silent edge cases in Context, each needing its own rule.
- **Replay the student's requests.** Save the requests a student made
  (compacted to the last per input, with submits as barriers) and replay
  them through the new version's ordinary request path. Every result is
  then a state the new version allows, which would carry over many unsafe
  edits with a per-student report of what was dropped. Not needed while
  only safe edits carry over, since for those a snapshot restores exactly
  (step 4). If the platform may later want unsafe edits to carry over, it
  should start recording requests beside the snapshot early: a log only
  helps sessions recorded after it began.
- **Tree-diff the two sources** to match unnamed elements. A heuristic
  whose mistakes are silent misplacements; stable keys are enough for a
  check that only needs to say whether anything moved.
- **Author-assigned ids on every element.** Exact, but machinery in the
  author's source.
- **An attribute to reset one element's state.** Finer than starting
  over, but a mechanism in the core and an attribute authors must
  remember to change; starting over covers it.
- **Restore, then validate.** A misplaced value looks exactly like a
  right one (Context).
- **Let state cross core releases.** Version each operator, lowering and
  the engine, put the versions in the derivation hashes, and check a
  release against every published document like an edit. Rejected: a
  version bump forgotten in one release would restore wrong values with
  no check to catch it, and the platform can run several releases at
  once, so nothing needs state to cross one.

## Consequences

- The edits authors make most, wording, hints, feedback, correct answers,
  a point's starting position, a new input or question, keep every
  student's work.
- Some harmless edits are reported unsafe: renaming an input, removing one
  nobody touched, narrowing a graph no student's point was near, changing
  a default some input reads. The author can still start students over or
  leave them where they are.
- Renaming an input changes its key and so fails condition 1. An editor
  that makes a rename may record it in a map published with the version,
  which `compare_versions` applies to the old signature; a rename by hand
  is a removal and an addition.
- Unnamed inputs are the weak case: inserting a second unnamed
  `<mathInput>` before another under the same named ancestor moves the
  latter's key. The report names it, and naming the input fixes it.
- Component definitions declare their interactive props, and planners
  name the hidden slots they want saved.
- The platform keeps every release that has an attempt in progress. A
  core fix reaches a student only on a new attempt.
- An author's edit that needs a newer release (a new tag) reaches only
  new attempts; students in progress on an older release stay on the
  version they have, or start over.
- A restore is per student and a migration is per edit, so state is never
  migrated through a chain of versions: a student on version 1 moves to
  version 3 only if 1 to 3 is safe.
- Saves name the version they were made in (`doc`). A save from a tab
  still open on an older version must not overwrite state already moved
  to a newer one; the platform refuses it or restores it into the newer
  version first, if that edit is safe.
- `ARCHITECTURE.md`'s "Checking a change" gains `tests/safe_edits.rs`.
  `CONTEXT.md` gains *touched*, *view state*, *input*, *input signature*,
  *domain*, *derivation* and *safe for every student*, and its *element
  key* becomes the stable key.

## Migration

Each phase leaves the tree green. Phases 0 to 2 need nothing new; phase
3 can run beside them; 4 needs 1 and 3; 5 needs 4; 6 needs 5, though its
session generator can start after 3.

0. **Release pinning and format 3** (step 6). `cells_core::RELEASE` is
   the crate version and the source revision, set at build time, with a
   fallback when no revision is known. `save_state` writes format 3,
   with `doc` empty until phase 4. `restore_state` refuses any other
   format and any other release, with an error, before reading an entry;
   the readers of formats 1 and 2 go. `cells-wasm` exposes the release.
   **Done**: `crates/cells-core/build.rs` sets `RELEASE` to the version
   and the commit, marked `.dirty` when the crate's source or the lock
   file has uncommitted changes, or to `CELLS_CORE_RELEASE` when a
   platform build sets it; `Error::OtherRelease` is the refusal, and
   `Core.release_id()` the export.
1. **Stable keys** (step 1). An element's key replaces `ElemKey`'s
   `(NodeId, u32)`: computed by the compile beside its count of made
   elements, interned per `Compiled`, carried on `Elem` and in
   `Structure::essential_keys`. A scope path's level is the repeat's or
   select's stable key and the iteration, or the branch's key. A public
   prop is saved by its name in the definition; a hidden essential slot
   by the shared state it holds (`ElemWiring::essential`, `hidden_wire`),
   and not at all without one. `restore_state` skips an entry whose kind
   is not its cell's value type. `seeded_stream` hashes the select's
   stable key and the stable scope path, not `NodeId`. Each row of
   Context's table is a test in `tests/state.rs`; the golden diff is
   identical.
   **Done**: `compile/keys.rs`. The keys are text, kept in one buffer
   by every document, since one without repeats drops its compile after
   load. A slot a `fixed` holds is saved by its name too, in the hidden
   slot its source moved to, so adding a `fixed` moves no key; a test
   holds every essential cell of the golden set to having a name. A
   select's pick scope is its option and which pick of it this is. The
   golden diff differs only in select draws, which the new seeding
   changes once.
2. **Touched and view state** (step 2). The session keeps the touched
   essential values by scope and slot, so they survive a rebuild; a tick
   marks every essential cell its inversion writes, whether or not the
   value changed. A view cell is marked when it is built; its entry
   carries the default it had.
   **Done**: `Session::touched`, by scope and template slot; a tick that
   fails its rebuild takes its touches back. A restored value is
   touched, here and when a build takes it from `parked`. A view cell is
   known by its key rather than marked: a graph's `xmin`, `xmax`,
   `ymin` or `ymax` saved under the graph's own key, which a bound given
   by a reference never is.
3. **Interactive props** (step 3's declaration). `component!` marks a
   prop `interactive`, and the points a whole-shape drag moves; ADR 0016
   is amended to say so. The core exposes which cells are interactive,
   and a test of `packages/cells-viewer` fails when a renderer requests a
   cell that is not.
   **Done**: a prop is marked in its table (`value: attr(0.0) {
   interactive }`, a flag on `PropDef`), and a list whose points a drag
   moves is marked `interactive: true` (a flag on `ListProp`), which for a
   line's or segment's list marks the table props it names
   (`ComponentType::is_interactive_prop`). Marked: a point's `x` and `y`;
   the lists of the line, segment, circle and polygon, and the circle's
   `cx` and `cy`, which a whole-circle drag requests; a graph's `xmin`,
   `xmax`, `ymin` and `ymax`, for pan and zoom; the `value` of a
   `numberInput`, `booleanInput`, `textInput` and `slider` (computed,
   inverting onto `preliminaryValue`); a `mathInput`'s `expr` and, when
   bound to a number, `value`; a `choiceInput`'s `selectedIndex`; a
   `hint`'s `open`; an `updateValue`'s `target`, which a `triggerSet`
   requests; and what a submit writes (`Document::submit_requests`): an
   answer's `submitted` and `numSubmissions` and a response's
   `submitted`, since every answer is an input. A polyline is not dragged;
   its vertices are points, marked as points. `Document::interactive_cells`
   and `is_interactive` (`document/interactive.rs`), exposed by
   `cells-wasm`, give the cells; a cell several components share is
   interactive when any of them marks it. `CellStore` checks each request
   against them in development and tests, and
   `packages/cells-viewer/src/interactive.test.tsx` renders a document
   with every renderer in jsdom, uses every control, drag handler and
   board pan, and fails on a request the check refuses or a kind of
   control it did not reach. `tests/interactive.rs` checks the marking
   against the props the renderers request, that derived props are not
   marked, and that a submit and a trigger write only marked cells.
4. **The input signature** (step 3). `compile/signature.rs`, run on the
   build the check already makes (the probe, or the one stamped build of
   a document without repeats or selects), whose graph holds every edge
   any count or pick can create. An input's derivation is the backward
   closure from it and from the cells that decide whether it exists or
   can be acted on, each slot's plan hashed with `Arg::Own`, `Arg::Elem`,
   references and expressions resolved to stable keys, names and trees. A
   test inserts unrelated elements and checks that no hash moves. Format
   3's `doc` is the signature's hash.
   **Done**, in `build/signature.rs` since it reads the build: the
   signature is read off the probe, which `input_signature` and
   `compare_versions` build, not off a load, so a load pays nothing for
   it. A cell hashes as what it is: an essential cell by its key and
   prop, a fixed one by its value, a derived one by its operator with its
   literal parameters (`Op::unbound`) over its inputs' hashes, an
   expression with its leaves numbered by input. The defaults are kept
   beside the derivation, each with whether any other input's closure
   reaches its cell; a default may change only where it is the input's
   starting value in both versions. The cells an input writes were its
   closure's essential leaves but a hold's flag, until the 2026-10-26
   amendment folded them into the derivation; which elements share a
   cell never needed a list of its own, since a cell is named by the
   element that defines it, so a copy given an override writes another
   cell.
   Format 3's `doc` names the version by a hash of its source instead
   (`Dast::version_hash`), since a signature at every load would cost a
   probe; what a platform needs it for is which version a save was made
   in. The keys cost a load at most 3% more instructions
   (`points-10000`, callgrind, against phase 0), and memory grows by the
   keys' text: 8% on `chain-100000`, 53% on `select-1000`, whose many
   small elements have long keys; `points-10000` is unchanged.
5. **`compare_versions`** (step 4), in `compile/check.rs`, with an
   optional map of renames, its failures tied to nodes as diagnostics
   are; exposed by `cells-wasm`. Each row of step 4's table is a test.
   **Done**: `compile/compare.rs`, `tests/compare.rs`,
   `compare_versions_json`. A rename applies to the old version's keys
   before its signature is hashed, and to every key under the renamed
   one. Wrapping an input in a new conditional moves its key, so it
   fails condition 1 rather than the derivation's.
6. **`tests/safe_edits.rs`** (step 5): generated edits and sessions over
   the golden set and the fixtures, seeded, a short run in CI and a long
   one on request.
   **Done**: literals changed, paragraphs, inputs and points inserted
   (some reading an input), self-closing elements removed, elements
   renamed, over the golden set and five documents of inputs; with
   `SAFE_EDITS_LONG=1`, many more of each and `fixtures/sir.doenet`. The
   test found that exempting every default only one input reaches was too
   loose (a circle's radius, a polygon's vertex another is calculated
   from), which step 3's *starting value* now fixes. Its oracle allows
   what step 2 allows: an untouched prop takes the new start, and a
   graph's own bounds the author's new ones.
7. **Docs.** `ARCHITECTURE.md` and `CONTEXT.md` as Consequences says,
   `document/state.rs`'s header, and this ADR's status. The editor's
   dialog (step 7) and pinning an attempt to a release are the
   platform's, and not part of this migration.
   **Done**, but for the status, which stays proposed until the ADR is
   accepted.

Settled while planning:

- A restore writes no new touch, but an entry it restores was touched
  when it was saved and stays touched, or the next save would lose it.
- A name that is ambiguous under its nearest named ancestor (two
  `<point name="a">` in different unnamed `<p>`s) does not name its
  element; the element is keyed as an unnamed one.
- A select's branch is keyed by its option's key and, since a select may
  pick one option more than once, the pick's position among the picks of
  that option.
- The core does not refuse a request on a prop that is not interactive;
  the viewer's test is the check, as step 3 says. (Reversed by ADR 0018:
  the core accepts a request only on an input's cell.)
