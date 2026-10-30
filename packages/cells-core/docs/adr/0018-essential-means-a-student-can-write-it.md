# Essential means a student can write it

Status: proposed 2026-10-24. Every migration step is done; see Migration.
Amended 2026-10-29: a literal `<number>`'s value is a value slot like any
other literal, classed by the walk (see Settled while implementing).

A cell is essential when a student's action can write it, and only then.
Every other value the author wrote, given as a literal or left to a
default, is a fixed cell, a constant like a literal under `fixed`. The
compile decides each template slot's class once, from the source, by
walking back from every input through the inverses that can write; every
build of the document uses that class. The essential cells are then
exactly the state a student can change: enough to hold a student's state,
with the seed, and no more than the inverses' rules can prove a student
might write. To make that a contract and not only a count, the core
accepts a request only on an input's cell, the cells a renderer may
request; a submit and a trigger become actions the core carries out, not
requests on cells.

## Context

`CONTEXT.md` defines an essential cell as "part of the minimum independent
data needed to recreate the document state" and "the only cells a write can
ultimately land on". The second holds. The first does not: a cell's class
is chosen by where its value comes from, not by whether anything can
change it.

| Class | Today | Example |
|---|---|---|
| fixed | a constant, or a literal under a literal `fixed` | `<point x="1" fixed/>` |
| essential | every other literal or attribute default | a point's `x="1"`, its default `hide`, a section's `weight` |
| derived | computed by an operator | `<number>2 $n</number>` |

How far that is from what a student can change, counted on the golden set
and `fixtures/sir.doenet` by walking back from every interactive prop (ADR
0017, phase 3) through every input of every operator, a hold's flag aside.
The walk overcounts, so the second column is an upper bound:

| Document | Essential | Writable |
|---|---|---|
| golden set, 11 documents | 226 | 164 |
| `sir.doenet` | 622 | 16 |
| total | 848 | 180 |

About four in five essential cells are author values nothing can change:
634 are `point.hide` defaults, one per point; the rest are weights, a
repeat's `from`, `to`, `step` and `maxNumber`, sticky group settings, some
text values and hidden slots. They are constants in all but name, and they
cost where essential cells cost: a rebuild carries every essential value
over (`Session::values`), a save scans every essential cell, and ADR
0017's signature must treat every one's default as a leaf that might be
student state.

Nor is the line "literal or not". Some literals are student state:

- A point's `x="1"` is the author's starting value and the cell a drag
  writes.
- `<number name="k">2</number>`, read by `<point x="$k $n"/>`: a drag of the
  point inverts `Mul`, which writes its first input, so the author's 2 is
  what the student changes.

What decides is whether a request can reach the cell, which only the
graph knows.

## Decision

### 1. A cell is essential when a student's action can write it

A student acts in two ways. A request starts from a cell a renderer may
request: an interactive prop (ADR 0016's definitions mark them; ADR 0017,
phase 3), which covers a drag, typing and a pan. An action (step 4)
starts from the cells it writes: a submit from an answer's `submitted`
cells and submission count, a trigger from each `<updateValue>`'s target.
Either reaches essential cells only through inverses. So a slot is
**writable** when one of those starting slots reaches it backward
through:

- an alias (a reference, a copy's shared state): the two are one cell;
- an operator's inverse, to the inputs that inverse may write (step 2);
- a hold (a dynamic `fixed`), to the value it holds, never to its flag.

A slot whose source is a value (`Literal`, a type's default included,
`TextLiteral`, `MathEssential`, `MathEssentialFrom`) is **essential** when it is
writable, and **fixed** otherwise, with the same value. Derived slots are
unchanged.

### 2. Every operator declares the inputs its inverse may write

A scalar operator's inverse names the input it writes (`Add` and `Mul`
write their first, `Offset` its one); a vector operator's writes the
inputs its rule in `program/vector.rs` names (`ProjectCircle` writes `P`,
never `C` or `r`; `First` and `WeightedMean` write none); `Evaluate`'s
writes its expression. Each declares this beside its inverse (`ops!`, the
vector table), and the round-trip tests of ADR 0016, step 4, check that
every write an inverse makes is to an input it declares. A declaration may
name an input the inverse writes only for some values; it may never leave
one out.

### 3. The compile decides, per template slot, once

The class is a fact about the source, so the compile records it per
template slot, and every build of the document reads it (ADR 0015):

- A document with repeats or selects is checked through the probe, whose
  graph holds every edge any count or pick can create (ADR 0012, ADR
  0014). Emit runs the walk on the probe's graph and records the writable
  template slots in `Compiled`; every later build classes its slots from
  that record. A slot writable at some count is writable in the probe, so
  no build meets a write it did not expect.
- A document without either has one structure, and its first build is its
  check (ADR 0015). Emit runs the walk on that build's graph and classes
  its cells by it; there is no other build.

The walk runs before cells are numbered, over emit's union-find classes,
so a fixed value is numbered with the fixed cells and nothing is moved
afterwards.

### 4. A request names an input's cell

The core accepts a request only on an *interactive* cell: a cell of a
prop some component's definition marks interactive. A request on any
other cell is refused before inversion and reported in the tick's
`dropped`, as a request on a fixed cell is. Each build makes the set as a
bit per cell, from the component table, so a tick checks a request
without reading components (ARCHITECTURE.md's rule for the tick). This
narrows ADR 0001, under which the core inverted from whatever cell was
named; the interface is still addressed by cell.

A request on an interactive cell still inverts as before, through derived
cells to essential ones, so what a student can change is exactly what
step 1 makes essential. A missing mark now fails where it is made: the
renderer's request is refused, and ADR 0017's viewer test, which fails on
a request to a cell that is not interactive, finds it before a student
does.

A submit and a trigger are actions, not requests on cells. `submit(answer)`
copies the answer's responses into its `submitted` cells and counts the
submission; `trigger(button)` requests each `<updateValue>`'s new value on
its target. Each carries out its writes inside the core, as one tick,
through the same inversion and rebuild a request uses, so a submit is
undone with the tick when its rebuild fails, as a request is. An answer's
`submitted` and `numSubmissions` and an `<updateValue>`'s `target` are
then not interactive: a page cannot set a student's submission count or
a submitted response directly, which an answer's limit on attempts will
rest on. Their cells are still essential, since an action writes them,
and step 1's walk starts from them as it does from interactive cells.

### 5. Tests are held to the same contract

A spec tests a component in isolation, and a mark is production
behaviour, so no prop is marked for a spec's sake. A prop no renderer
requests, like a circle's `radius` or a slider's `index`, is reached as a
document reaches it: through an input bound to it, such as `<mathInput
bindValueTo="$c.radius"/>`. The binding is an alias, so the input's cell
is the prop's cell, and the request is the same request on the same cell:
the spec still tests the circle's own inverse, in a document of one
circle and one input. Without the input, the radius of that document's
circle is fixed (step 1): nothing a student does can change it, so there
is no inverse to test.

A test of the core's machinery rather than a component (forcing a
repeat's count in `tests/every_count.rs`, an inversion through a
`<number>` in `tests/requests.rs`) uses `testing::request_unchecked`,
behind the `testing` feature, as `LoadOptions::check_cycles` is: a
request on any cell, inverted as before. It writes only essential cells,
so it cannot make a fixed value change; it only skips the check that the
cell is an input's.

### 6. Sufficient and as small as the rules allow

- **Sufficient.** Every write a request or an action makes lands on a
  writable cell, by the walk's construction and step 2's tests; a restore writes only
  what a save holds, and a save holds only touched cells (ADR 0017). With
  the seed, which decides every select's picks, the touched essential
  cells are a student's whole state.
- **Small.** Every essential cell is one some input's inverse can reach.
  It is larger than the cells a student does reach only where the rules
  are conservative: an inverse whose target depends on values declares
  every target it may pick, and the probe folds iterations, so an edge
  some count has is assumed at every count.

## Considered options

- **Keep the class by source, and skip unwritable cells only when
  saving.** Smaller saves, but every other cost stays (carried values, the
  rebuild's undo, ADR 0017's leaves), and the word keeps two meanings.
- **Decide per build, from each build's own graph.** Simpler, but a slot
  could be fixed at one count and essential at another, which is a fact
  about a structure, not the source; ADR 0015 keeps those apart.
- **Mark state in the definitions** (`state` beside `interactive`). A
  definition knows its own interactive props, but not what reaches its
  other props through references: `<number name="k">2</number>` is state
  only when an input's inverse reaches it.
- **Keep accepting a request on any cell** (ADR 0001 as it was). Nothing
  a student does needs it, and with step 1 such a request can change only
  what an input can, but in combinations no interface makes, and a missing
  mark goes unnoticed in the core. Its one user is the core's own tests,
  which have `request_unchecked`.
- **Mark a prop interactive for its spec.** A circle's `radius` would
  then be requestable in every document, a production behaviour no
  renderer asked for. A bound input reaches the same cell.
- **Make every author literal fixed, and only inputs' own props state.**
  Changes the language: a drag of `<point x="$k $n"/>` writes `k` in the
  current core and here today. Whether it should is a separate question;
  this ADR keeps every write that is possible now possible.

## Consequences

- `CONTEXT.md`'s *essential cell* becomes what it already claims to be:
  the state a student can change, and the only cells a write lands on.
- On `sir.doenet`, 10 essential cells instead of 622; a rebuild
  carries, and a save scans, only those.
- ADR 0017 simplifies: every leaf of an input's signature is state some
  input can write, an unwritable author value is a fixed cell hashed by
  its value, and a *starting value* is the default of an essential cell
  that is the input's own prop, nothing else is calculated from, and no
  other input reaches.
- The interactive marks become load-bearing: a renderer's request on an
  unmarked prop is refused, and ADR 0017's viewer test finds it first.
- A spec reaches a prop no renderer requests through a bound input; a test
  of the machinery uses `request_unchecked`. Counted when this was
  written: the requests on cells no definition marks came from
  `tests/every_count.rs` and `tests/diagnostics.rs` (repeat and function
  iterate counts), `tests/requests.rs`, `tests/evaluators.rs`,
  `tests/inverse_context.rs` and unit tests (`<number>` values and
  test-only components), and a few specs (`circle.radius`,
  `slider.index`); never the viewer. The JavaScript worker's parity
  harness was not counted; what it requests outside the marks shows in
  `CELLS_CORE_PARITY.md`.
- An answer's submission count is no longer something a page can set.
- ADR 0017's settled point that the core does not refuse a request on a
  prop that is not interactive is reversed here.
- `is_essential` and `cell_class` answer the new question. The viewer's
  `MathInput` reads `cell_class` to tell a symbolic input from a bound
  one; an unbound mathInput's `expr` is interactive, so it stays essential.
- The golden diff's values are unchanged; its programs change where cells
  move from essential to fixed.

## Migration

Each phase leaves the tree green. Phase 1 needs nothing new; 2 needs 1;
3 can run beside 1 and 2; 4 needs 2 and 3; 5 needs 4; 6 needs 4; 7
comes last. The request contract (step 4) goes before the class (steps
1 and 3), not after it: the tests a refused request breaks are most of
those the class would break, and moving them once, to an input or to the
machinery's hooks, leaves the class phase to change programs and
snapshots only.

1. **Declared writes** (step 2). `OpSpec::writes()` gives the input
   positions an inverse may write as a mask, a `u64` since a vector
   operator reads at most `MAX_VEC_IN` (64) inputs. In `scalar_ops!` an
   `exact` or `projection` entry writes its first input and a `drops`
   entry none; every entry writes `A`, `Hold` included, which never
   writes its flag. The
   `inverses` tests in `program/scalar.rs` check that the position each
   inverse returns is declared. `VecOp::writes` sits beside
   `VecOp::invert` and becomes a column of the table in `vector.rs`:
   `Shape` its 2n coordinates, never the pivot; `CircleCenterPoint`
   (C, P); `CirclePoints` every point; `CircleTwoPointsRadius` both
   points, never `r`; `PolarSlope` (m, d); `PolarDirection` (u, d);
   `LinePointsFromCoeffs` (a, b, c); `ProjectCircle` and `ProjectLine`
   `P`; `Choose` every branch cell, never the choice cell; `First` and
   `WeightedMean` none. Vector operators have no round-trip tests yet
   (ADR 0016, step 4 moved only the scalar ones), so a new table of
   inputs per `VecOp` inverts each output alone and all together and
   checks every cell in `Produced::writes` and every point of
   `Produced::groups` against the mask. `SymKind::Evaluate` writes its
   expression, the only symbolic operator with an inverse
   (`tick/invert.rs`); the others write none.
2. **The walk, measured** (step 1). `build/writable.rs`: after emit's
   union-find, a walk over its classes from the start slots, before
   cells are numbered. A start slot is a slot of a prop the definition
   marks interactive, or one a new flag `{ written_by_action }` marks:
   the answer's and a `<response>`'s `submitted`, the answer's
   `numSubmissions` and `<updateValue>`'s `target` (step 4); it is still
   only measured here, so the marks stay as they are. From a class the
   walk goes to its defining slot: an `Op` or a `VecOut`'s head to the
   classes of the inputs `OpSpec::writes` names, a value slot (`Literal`,
   and `MathEssential` and `MathEssentialFrom` once expanded)
   is marked writable, a `Fixed` slot ends it. The result is a bit per
   class. A census test over the golden set and the fixtures prints
   essential and writable counts per document beside Context's table,
   and asserts writable is at most its upper bound there (180 in all, 16
   on `sir.doenet`); the counts it finds replace that column when the
   ADR is accepted. The signature's own walk (`build/signature.rs`,
   `essential_leaves` with `writes`) reads `OpSpec::writes` too, in
   phase 6, not before.
3. **Requests on inputs only** (steps 4 and 5).
   - Emit builds a bit per cell, interactive or not, where it fills
     `prop_cells`; `Document` keeps it, and `is_interactive` and
     `interactive_cells` read it instead of scanning every component as
     `document/interactive.rs` does now.
   - `Document::tick` refuses a request, or a point group with a point,
     on a cell without the bit, before snapping and inverting, and
     reports it in `dropped` as an infinite value is.
   - `submit` and `trigger` call the tick as actions, which skip that
     check (`Document::tick_unchecked`); `cells-wasm`'s `submit` calls
     `Document::submit`, which ticks through the document's evaluator as
     its requests do, so `submit_requests` is crate-private and no
     `submit_with` is needed. `cells-wasm` gains `trigger`; the viewer's
     `TriggerSet` (`renderers/Text.tsx`) calls it instead of requesting
     the target itself, and `src/interactive.test.tsx` drops
     `number.value` from what renderers request and checks the press
     sets `k`.
   - The answer's and `<response>`'s `submitted`, the answer's
     `numSubmissions` and `<updateValue>`'s `target` lose `interactive`
     and gain `written_by_action`. The signature (`build/signature.rs`)
     finds an input by its interactive props and takes them as its
     `props` and the start of what it writes, so in the same commit it
     reads a prop either flag marks (`ComponentType::is_input_prop`);
     otherwise answers and `<updateValue>`s would drop out of it. So
     does `testing`'s record of each input's values, which
     `tests/safe_edits.rs` compares after a restore; its generated
     session, which requests random interactive cells and then submits
     every answer, presses every `<triggerSet>` and lone
     `<updateValue>` too, since their targets are no longer among those
     cells. `tests/safe_edits.rs` stays green with its signature hashes
     unchanged.
   - `testing::request_unchecked`, behind the `testing` feature,
     inverts a request on any cell as `request` did. The tests the
     Consequences count move: a spec of a component through a bound
     input (`circle.radius` through `<mathInput bindValueTo=
     "$c.radius"/>`, `slider.index` and a line's `coeff0` likewise); a
     test of the machinery (`tests/every_count.rs`,
     `tests/diagnostics.rs`, `tests/requests.rs`,
     `tests/inverse_context.rs`, `tests/math.rs`'s inversions through
     lowered math, the unit tests with test-only components through
     `request_prop`) to `request_unchecked`.
   - The JavaScript worker's harness (`test-core-cells.ts`) runs
     `npm run parity:cells` before and after; a request it makes on an
     unmarked cell shows as a new gap in `CELLS_CORE_PARITY.md`, and is
     either moved to an action or kept as a named gap, never marked
     interactive for the harness's sake.
4. **The class** (steps 1 and 3).
   - `Compiled` gains `writable: Option<Arc<[Bits]>>`, one bit per
     template slot of each template (`Template::n_slots`, indexed by
     `slot_off + pi`, as `essential_key`'s template slot is). The probe
     sets it in `compile/check.rs` beside `structural_depth`, marking
     the template slot of every value slot the walk marks; the probe
     stamps each template once, so one probe slot stands for each
     template slot, and two that meet are or-ed.
   - Emit classes a value slot by the record when there is one, and by
     its own walk when there is none: the first build of a document
     without repeats or selects, its only build, which keeps no
     `Compiled` to rebuild from (`Document::rebuild` returns early). A
     load with `check_cycles` off and a repeat or select has no probe
     and so no record; there every value slot is essential, as before
     this ADR, which keeps the cycle tests' documents as they were.
   - In emit's counting and numbering loops an unwritable value slot
     goes with the fixed slots, with its literal or default as its
     value, and gets no essential key, slot or default. `seed_cells`
     writes `essential_defaults` only for an essential cell, so a seeded
     slot classed fixed takes its seed as its value; none is today,
     since a `mathInput`'s `expr` is interactive.
   - `LoadOptions::classify` (`testing` feature, on by default) turns
     the walk off: every value slot essential. A machinery test whose
     document no input reaches loads with it off rather than gain an
     input it is not about. It also gives the soundness test: for every
     golden document and fixture at counts 0 to 4 and four seeds, in
     `tests/every_count.rs`, every build classes each template slot as
     the record does, and a request on every interactive cell, and every
     submit and trigger, inverts with `classify` off only to cells whose
     stable key is essential with it on. That checks the walk against
     the inverses themselves, not against its own declarations.
   - Spec cost snapshots (`tests/specs/snapshots/`) move where cells
     become fixed and are rewritten with `SPEC_UPDATE=1` in the same
     commit, reviewed against the census.
5. **Measured** against the commit before phase 3: `golden-diff.sh`
   with every value identical; load, rebuild and memory on
   `sir.doenet` and the golden set with `perf-diff.sh` and callgrind;
   the parity dashboard. The walk is linear in slots and runs once per
   load with a repeat or select, in the probe, so the load should not
   slow; a rebuild and a save should be faster on `sir.doenet`.
6. **ADR 0017** follows. `essential_leaves` with `writes` follows
   `OpSpec::writes` instead of every input but a hold's flag; an
   unwritable author value is a fixed cell, so the signature hashes it
   by its value in the derivation and no longer lists it among
   `defaults`. The starting value as in Consequences. A test in
   `tests/safe_edits.rs` for the case the change opens: an edit after
   which a cell a student wrote is fixed (the input's written cells
   change, so the edit is not called safe), and the rest of the file
   unchanged and green.
7. **Docs.** `CONTEXT.md`'s *essential cell*, *fixed cell*, *request*
   and *tick*; `ARCHITECTURE.md`'s idea, emit, "A user drags a point"
   (the refusal) and "An answer is submitted" (an action, not a
   request), "Add an operator" (declare the writes), and "Add a
   component type" (a missing mark refuses the renderer's request); the
   header of `document/interactive.rs`, which says the core accepts any
   cell; a note in ADR 0001 and in ADR 0017's settled points pointing
   here; this ADR's status.

Settled while planning:

- The record is of template slots, not of classes or cells: a value
  slot defines its own class, so its own template slot names it in
  every build, whatever aliases join it.
- Every scalar inverse writes its first input, so the scalar
  declaration follows from the inverse's kind, not a field every entry
  repeats. An entry that writes another input will need a form that says
  so; the test fails until it has one.
- `request_unchecked` alone cannot reach a value no input reaches,
  which is fixed after phase 4; the machinery tests that need one load
  with `classify` off. Step 5 holds otherwise.
- A request refused for not being an input's is reported in `dropped`,
  with no new field in `TickOutcome`; the viewer's test already names
  the cell when it happens.

Measured when the migration was done, against the commit before phase 3:

- **Census** (`tests/writable.rs`): the golden set's 226 essential cells
  are 154, and `sir.doenet`'s 622 are 10, under Context's upper bounds of
  164 and 16. Each point's default `hide`, a slider's `from`, `to` and
  `step`, a repeat's counts given as literals and a circle's `radius`
  without an input bound to it are fixed.
- **Golden diff**: every value identical after phases 3 and 4; phase 4
  changes the programs of all 12 documents.
- **Speed and memory**, natively (`cells-bench`, release, the minimum of
  five runs in each of three interleaved rounds), since
  `packages/benchmark`'s driver needs the JavaScript and Rust workers
  built: a load within the noise, ±5%, on every fixture; a rebuild 1.00
  to 1.05, so not faster on `sir.doenet` as Consequences expected, the
  build itself being the cost; resident memory 0.78 on `sir.doenet` and
  the `recur` fixtures, 0.91 on the `points` and `adventure` fixtures and
  about 1 elsewhere. A save was not timed.
- **Parity** (`CELLS_CORE_PARITY.md`, the base's core and this one through
  the same harness): no test newly fails, and one newly passes, that a
  repeat's value cannot be written through a reference.

Settled while implementing:

- `<numberInput>` has no `bindValueTo` in this core, so a spec binds a
  `<mathInput>` (step 5's example says so now).
- A literal `<number>`'s value was a fixed cell before this ADR
  (`compile/attrs.rs`), so a trigger whose target is one set nothing, and
  the viewer's and the core's tests of a trigger targeted a `<boolean>`.
  Since 2026-10-29 it is a value slot like a point's literal coordinate:
  essential when an input is bound to it, a point's coordinates read it,
  or an `<updateValue>` targets it, and a fixed cell otherwise, which is
  the walk's decision, not the planner's. DoenetML's authors rely on
  `<number name="n">3</number><mathInput bindValueTo="$n"/>` changing `n`
  (`docs/principles-alignment.md` §3.4), and the special case had made
  the number the one literal the classing never got to see.
- `tests/every_count.rs` and `tests/diagnostics.rs` force counts with
  `request_unchecked`, not `request`: with the classing on, a literal
  count is fixed either way, but before it the forced ticks would have
  been refused and the tests weakened silently.
- The unit tests of the copy rules run over test-only components no input
  reaches: `testing::request_prop` is unchecked and `testing::dast::load`
  loads with the classing off.
- The interactive bit is made in `Document::new`, from the component
  table, once per build, rather than in emit; the cost is the same.
- The golden script (`cells-bench/src/script.rs`) no longer requests a
  `<number>`, which no renderer does. The JavaScript harness's
  `changeRadius` is a named gap; no test calls it.
- The walk follows the probe's later-iteration sources, so it sees the
  edges the cycle check sees. No document here needs it (a later
  iterate's source writes nothing, or folds onto its own slot), and the
  soundness test does not notice its absence.
- The soundness test catches an undeclared write where it is the only way
  to a cell: dropping `PolarSlope`'s distance from its declaration fails
  it on `lines.doenet`. Dropping `CircleCenterPoint`'s point does not,
  since the golden circles' through points are inputs themselves; the
  `writes` tests in `program/vector.rs` catch that one.
- Phase 6's rows are in `tests/compare.rs`, beside the other rows of ADR
  0017's table, with one for the narrower declaration: a point at `$a +
  $b` writes `a` alone.

Settled after the migration (2026-10-26):

- The signature's own write walk is gone. Once every essential cell is
  one some input writes, the union of the cells each input writes was
  the essential set on every golden document and fixture, and an input
  whose derivation is unchanged wrote the same cells in every edit of
  `tests/compare.rs` and of `tests/safe_edits.rs`'s long run: the
  derivation names every essential cell it reads by key and type, and
  every operator by kind, which fixes its declared writes. So ADR
  0017's condition 2 (the cells it writes) folds into its derivation,
  and condition 4 reads old state from the inputs' `defaults`.
  `Input::cells`, `essential_leaves`'s `writes` and `Op::writes` go;
  `OpSpec::writes` stays the one declaration, which the writable walk
  reads. Phase 6's row for `$a + $b` went with the condition it tested.

## Amendment: one record for every build, 2026-10-29

Every document is probed now (ADR 0015's amendment of the same date), so
every build classes its value slots by the probe's record; the first
build of a document without repeats or selects no longer classes by its
own walk, and a load with `check_cycles` off still has a record, since
only the probe's loop checks are skipped. `Classes` is gone: `Compiled`
holds the record, or none with the classing off. Under the `testing`
feature each build still runs its own walk and keeps the keys it would
make essential (`Structure::walked_essential_slots`), which
`tests/every_count.rs` checks the record against.
