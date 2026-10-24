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
might write.

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

### 1. A cell is essential when a request can write it

A request starts from a cell a renderer may request: an interactive prop
(ADR 0016's definitions mark them; ADR 0017, phase 3), which covers a drag,
typing, a pan, a submit and an `<updateValue>`'s target. It reaches
essential cells only through inverses. So a slot is **writable** when some
interactive slot reaches it backward through:

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

### 4. What the core accepts is unchanged; what it can change is not

The core still accepts a request on any cell (ADR 0001). A request that
reaches only fixed cells is dropped, as a request on a literal under
`fixed` is today. So a request, declared or not, can change only what
some declared input can change. A prop a renderer requests but no
definition marks loses its state: its cells are fixed. ADR 0017's viewer
test, which fails when a renderer requests a cell that is not interactive,
is what keeps the marks complete.

### 5. Sufficient and as small as the rules allow

- **Sufficient.** Every write a request makes lands on a writable cell,
  by the walk's construction and step 2's tests; a restore writes only
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
- The interactive marks become load-bearing: a missing mark makes an input
  dead rather than untested.
- A test that requests a cell no input can write (a `<number>` set
  directly) now finds it fixed; it requests through an input instead.
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
4. **Tests and the golden diff**: tests that request a cell no input
   writes request through an input; the golden diff's values identical;
   load, rebuild and memory measured against the commit before (callgrind
   and `perf-diff.sh`), and the cells-core parity run in the JavaScript
   worker compared before and after.
5. **ADR 0017** follows: the signature's leaves and the starting value as
   in Consequences, `tests/safe_edits.rs` unchanged and green.
6. **Docs**: `CONTEXT.md`'s *essential cell* and *fixed cell*,
   `ARCHITECTURE.md`'s description of emit's classes.
