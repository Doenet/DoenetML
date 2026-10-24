# Essential means a student can write it

Status: proposed 2026-10-24.

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

A slot whose source is a value (`Literal`, `TextLiteral`, `Default`,
`MathEssential`, `MathEssentialFrom`) is **essential** when it is
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
document reaches it: through an input bound to it, such as `<numberInput
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
- On `sir.doenet`, at most 16 essential cells instead of 622; a rebuild
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

1. **Declared writes** (step 2): `ops!` and the vector operators declare
   the inputs their inverses may write; the round-trip tests check every
   write against the declaration.
2. **The walk** (step 1), in emit, over the union-find classes, before
   cells are numbered; first only measured, with a census test over the
   golden set and the fixtures beside the counts in Context.
3. **The class** (steps 1 and 3): unwritable value slots become fixed;
   the probe records the writable template slots in `Compiled` and later
   builds read them. `tests/every_count.rs` checks that every build at
   every count and seed classes each template slot as the record does,
   and that no tick writes a fixed cell.
4. **Requests on inputs only** (step 4): the interactive bit per cell,
   built with the component table; `request` and `request_points` refuse
   other cells; `submit` and `trigger` carry out their writes inside the
   core, and the answer's and `<updateValue>`'s props they write lose
   their marks; `testing::request_unchecked` for the machinery's tests;
   specs reach unrequested props through bound inputs (step 5).
5. **Tests and the golden diff**: tests that request a cell no input
   writes request through an input; the golden diff's values identical;
   load, rebuild and memory measured against the commit before (callgrind
   and `perf-diff.sh`), and the cells-core parity run in the JavaScript
   worker compared before and after.
6. **ADR 0017** follows: the signature's leaves and the starting value as
   in Consequences, `tests/safe_edits.rs` unchanged and green.
7. **Docs**: `CONTEXT.md`'s *essential cell*, *fixed cell* and
   *request*, `ARCHITECTURE.md`'s description of emit's classes and of the
   tick, and a note in ADR 0001 pointing here.
