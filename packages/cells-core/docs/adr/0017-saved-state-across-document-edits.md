# Saved state carries over only edits that are safe for every student

Status: proposed 2026-10-23.

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
- the essential cells it writes (for `updateValue` and `triggerSet`, the
  cells they set): stable key, value type, and which other elements share
  them (a copy and its original);
- its *derivation*: everything that decides what the input shows and
  whether a student can act on it. That is the operators and literal
  parameters on every path from an essential cell to the input; the
  defaults of the essential cells on those paths, except those only this
  input writes; and the same for whatever decides whether the input
  exists or can be acted on: the count of every repeat and the choice of
  every branch around it, the gates of the cases around it, `hide`, and a
  hold.

The derivation is recorded as a hash of the plans involved, which name no
iteration (ADR 0015). The hash is taken over stable keys and literals
only, never over the compile's internal ids
(`ElemId`, slot offsets, `Arg::Own` and `Arg::Elem` positions). Hashing
an internal id would make an unrelated insertion look unsafe, and worse,
would let two different elements that land on the same position hash
alike.

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

### 4. An edit is safe for every student when four conditions hold

Between the published version's signature and the draft's:

1. **Every old input is unchanged.** It exists under the same stable key
   with the same value type, and its domain is the same or larger: bounds
   that only widen, choices only appended. A select's options are
   identical.
2. **The essential cells it writes are unchanged.** Same stable keys, same
   value types, shared with exactly the same elements.
3. **Its derivation is unchanged,** defaults and existence included.
4. **Every new input reads no old essential cell,** unless its domain
   holds every value its derivation can produce. A new `<point x="$n"/>`
   would otherwise start wherever each student's `n` puts it, outside the
   graph for some.

New inputs that meet condition 4, new answers and new selects are
allowed. Everything else may change freely: text, layout, hints,
feedback, formulas that feed only what is displayed or credited, correct
answers, awards, weights, the conditions of content that holds no input,
and the starting value of an input that only it writes.

**Why this is enough.** Every essential cell an old input reads holds,
after the restore, either a value the student actually had (step 2) or a
default that is unchanged (condition 3), in a cell with the same key, type
and sharing (condition 2). Through an unchanged derivation, the input then
shows exactly what it showed before, exists exactly when it did before,
and can be acted on exactly when it could before. That value was in the
old domain, which the new one contains (condition 1), so everything the
student could see and reach, they still can. A new input starts from new
cells or inside its domain (condition 4). Nothing here depends on any
student's values, so it holds for every student.

Each condition rules out a failure found in drafting:

| Failure | Caught by |
|---|---|
| A raised `xmin`; a reordered `choiceInput` | condition 1 |
| A type change; a copy given an override | condition 2 |
| `q.x = 2*$n` changed to `3*$n`: `q` moves though `n` restores exactly | condition 3, operators |
| `q.x = $k*$n`, `<number name="k">` changed from 2 to 3 | condition 3, defaults |
| `length="$n"` changed to `$n/2`: iterations with the student's work vanish | condition 3, existence |
| A `fixed`, `hide` or condition added around an input | condition 3, acting on it |
| A new point at `x="$n"` | condition 4 |

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
attempt is pinned to, and the restore is today's, by stable keys: every saved key exists in the new version (condition 2), so
nothing is parked, remapped or replayed. An answer whose correct answer
changed regrades; what that does to a score already recorded is the
platform's policy, chosen in the same dialog.

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
