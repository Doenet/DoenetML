# Constants depend on the source and their scope alone

Status: proposed 2026-10-30. Every migration step is done; see
Migration. Drafted as 0026, and renumbered as `cells` took 0026 (composed
inverses) and 0027 (the compile runs in passes) first.

A **constant** is a cell whose value is a function of the source, the
document seed and the scope it is in, and of nothing else: not of state,
not of the iteration counts. No tick changes a constant, and no rebuild
changes one for a scope that still exists. A cell whose value follows
the counts is derived, computed from the count cells like any other
derived cell. A constant that depends on the document alone, the same
in every instance of its template slot, is a **document constant**; one
that depends on its scope too is a **scope constant**. Document constants
are made once per session, in a pool at the front of the cells that every
build reuses, so a rebuild makes none of them again. An instruction
whose every input is a constant is evaluated once and becomes a constant
itself.

The class has been called *fixed*. It is renamed *constant*, and the
word *fixed* is kept for the DoenetML attribute, whose effect is a
*hold* (ADR 0022).

## Context

### What "fixed" means today

A cell is essential, fixed or derived (`CONTEXT.md`). The fixed cells are
whatever is neither: an author's value no student can write (ADR 0018),
an operator's constant (`Builder::const_slot`), a written expression's
math handle, an iteration's index, a `<selectFromSequence>` pick, a
collect's count, a section's number, an empty section's credit, the
missing-referent NaN and the dead cell (ADR 0019). They share only that
no instruction computes them in the build that made them. Some of them
change on a rebuild, since a section's number and a collect's count
follow the counts, so "fixed" does not promise what it sounds like.

The word means other things too: the `fixed` attribute, which holds an
element (ADR 0022); a curve's *fixed shape*, which compiles to a tape;
`Counter::fixed`, the sections counted at build time. A sentence like "a
literal `fixed` holds by a constant flag, so the classing makes the
element's values fixed cells" uses three of them.

The plan's names have drifted since ADR 0018 moved the class decision
from the planner to the probe's walk. `Source::Literal` is documented
as "an essential cell with this initial value", and `Wire::essential`,
`Wire::essential_from`, `Wire::text_essential` and
`Source::MathEssential` make one, though each becomes a fixed cell when
no student can reach it. `Source::Fixed`, a value that is never state,
and `Source::Literal`, one that is state when reachable, are a real
distinction that the names do not show.

### What a rebuild does with them

A rebuild (ADR 0004) builds the whole document again from the compile
(ADR 0015). Every fixed slot of every stamped instance gets a source in
`resolve` and a cell in `emit`, and nothing is shared between builds,
or between instances beyond `const_slot`'s operator constants. A written
expression with no cell leaves is imported into the engine and, under
`simplify` or `expand`, simplified, once per instance per build
(`build/expand/math.rs`, `sym_source`), though every instance gets the
same handle.

Measured 2026-10-30 with a throwaway test, native release build, pruned
load, rebuilding a `<repeatForSequence>` from `n` to `n + 1` iterations
whose body is a point at `x="$v"`, then also a held point, a `<text>`, a
`<number>$v * 2 + 3</number>`, a `<number>2 * 3 + 4</number>` and a
symbolic `<math>`:

| Body | `n` | Cells / fixed | Instructions / reading only fixed cells | Rebuild |
|---|---|---|---|---|
| the point | 1000 | 6,015 / 2,007 | 3,006 / 3,000 | 1.6 ms |
| and the rest | 1000 | 15,018 / 8,010 | 6,009 / 6,000 | 7.6 ms |
| and the rest, `simplify` on the math | 1000 | 15,018 / 8,010 | 6,009 / 6,000 | 13.1 ms |
| and the rest | 5000 | 75,018 / 40,010 | 30,009 / 30,000 | 40.6 ms |
| and the rest, `simplify` on the math | 5000 | 75,018 / 40,010 | 30,009 / 30,000 | 70.3 ms |

What it shows:

- Fixed cells are about half the cells, and most are copies: each
  iteration has its own `2` and `3` for the held point, its own string
  id, its own `10`, its own handle for the same expression.
- `emit` is the largest phase of the rebuild (27 of 43 ms at 5000).
- `simplify` on a constant expression takes `resolve` from 12 to 40 ms
  at 5000, about 5.5 µs an iteration, all of it computing one handle
  again.
- Nearly every instruction reads only fixed cells. The repeat's `v` is
  three instructions an iteration (`Add(i, -1)`, `Mul(step)`,
  `Add(from)`) over the iteration's index, and `$v * 2 + 3` two more over
  `v`; a symbolic `<math>` evaluates its fixed handle once an iteration.
  These run at every load, every rebuild and every `Recompute::Full`
  tick, and always give the same value.

The bridge, after a rebuild, recomputes and diffs every element
(`doenetml-worker/src/cells/bridge.ts`, `_afterTick`), constant props
included, since every cell index may have moved.

## Decision

### 1. A constant depends on the source and its scope alone

A cell is a **constant** when its value is a function of the source, the
document seed and its scope, and nothing computes it at tick time. It is
essential when a student's action can write it (ADR 0018), and derived
when an instruction computes it. Every cell is one of the three.

So a value that follows the counts is not a constant. Three of today's
fixed values do, each counted by the build from the structure it
stamped:

- **A collect's count**, when it gathers from a repeat's iterations.
- **A section's number**, after a repeat or a collect from one that
  holds a section, and inside a repeat whose iterations count a section
  through a repeat of their own (iteration 2 counts iteration 1's).
- **A section's credit**, and its percentage, when a scored item lies in
  a repeat below it: at a count with none, the credit is the constant 1
  of a section with nothing to score.

Each is a **counted value**: a derived cell holding the number its build
counted, an `OpSpec::Copy` of an operator's constant, in every build,
whatever the count. A build cannot tell which values are counted,
since at a count with nothing to count it sees no repeat contribute; the
probe, whose one iteration stands for every count, finds them and
records their template slots (`Compiled::counted`), as it records the
writable and live ones, and every build reads the record. The copy
reads no count cell: a change of count rebuilds the document, which
counts again, and the cycle check reads the probe's stand-ins, which do.
Folding (step 4) never folds a counted value. A value the build counts
from a scope alone (a section's number inside an iteration, counting
the iterations before it) is a scope constant.

What the remaining constants are, by what they depend on:

| Constant | Depends on | Kind |
|---|---|---|
| A given value no student can write (ADR 0018) | the source | document |
| An operator's constant (`Arg::Const`) | the source | document |
| A written expression's handle, its `simplify` or `expand` applied | the source | document |
| `NO_VALUE`, an undefined value's NaN, the missing-referent cell, the dead cell | nothing | document |
| A literal hold flag (`fixed`, `fixLocation`) | the source | document |
| A synthesized point's `hide` | nothing | document |
| An iteration's index | the scope | scope |
| A `FirstIteration` source's constant | the scope | scope |
| A `<selectFromSequence>` pick | the seed and the scope | scope |
| An instruction's value over constants (step 4) | its inputs | document when they all are, else scope |

A rebuild may change which cell a prop names (a missing referent that
an iteration now provides, ADR 0004); it changes no constant's value.

### 2. Document constants and scope constants

A constant is a **document constant** when its template slot gives the
same value in every instance: every iteration, every branch built. It
is a **scope constant** otherwise. A document constant may be written
inside a repeat; what makes it one is that it does not depend on the
scope it is stamped in. The two are kinds of constant, not classes of
their own: every rule about constants (inversion, holds, liveness,
saved state) is the same for both. What differs is where the cell is
made (step 3) and whether its index survives a rebuild.

The compile decides it per template slot, once, from the source, as it
decides what is writable (ADR 0018) and live (ADR 0019), and records it
(`Compiled::document_constants`). A constant is a document constant only
when its plan names a value from the source alone
(`Source::gives_document_constant`: a given value, a constant written in
the plan, math text with nothing to read); anything else is a scope
constant, whether it reads its scope (`IterIndex`, `SequencePick`,
`FirstIteration`, a seed) or is wired after expansion (a section's
number, a credit). Calling a document constant a scope constant costs
only a cell per instance; the reverse would give scopes one value that
differs between them, so the rule names what qualifies. A folded
instruction (step 4) is a document constant when every input is.

### 3. Document constants are made once per session

The **constant pool** holds one cell per distinct document constant,
keyed by its value type and its bits, as `const_slot` keys operator
constants: the document constants of the compile's record (step 2), the
operators' constants and the missing-referent cell. It is the front of
every build's cells, and it belongs to the session (`Session::pool`):

```
 [ document constants | scope constants | essential | derived ]
   the session's pool,  ── made by every build, in this order ──
   in the order first made
```

A build starts its cells from the pool and gives a document-constant
slot no cell of its own: its prop names the pool's cell. A document
constant the pool lacks, one a template stamped for the first time
needs, is appended, so the pool only grows and no pooled cell moves: a
document constant's index is the same in every build of the session,
and a cell this build does not use stays, holding its value, with
nothing naming it. Scope constants are made by each build; they are
cheap and the same in every build that stamps the scope, so nothing
caches them.

The dead cell is not pooled: it is not live, and a pooled NaN, the
missing-referent cell, is.

### 4. An instruction over constants is a constant

An instruction whose every input is a constant, its hold flags included,
is evaluated once and its outputs become constants: document constants when
every input is one, scope constants otherwise. Each build decides its own
folds (`Builder::folded_slots`), since most foldable instructions are the
anonymous steps of lowered math, which no template slot names: an
operator folds when every input is a given value no student can write, a
constant or another fold, made in its own scope or one around it. That
scope rule keeps a fold from turning on whether a referent exists (`$r[3].x`
is the missing cell at count 2 and a real one at 3), so whether a slot folds
is the same in every build; the missing-referent cell is never read as a
constant, and a counted value (step 1) never folds. Emit numbers a fold's
outputs among the constants, binds the instruction as any other, and runs
the folds once, in their own order, as the build ends; the program keeps
none of them. Symbolic instructions fold the same way, with the session's
engine. A document-constant fold is to be evaluated when the load makes the
pool (phase 6).

This changes no value and no tick's outcome. A request that reaches a
derived cell whose ancestors are all constants is dropped today, after
inverting down to them; it is dropped at the folded constant instead.
What an instruction computes from constants it computed at every load,
rebuild and full recompute, always the same.

### 5. The vocabulary

| Was | Is |
|---|---|
| fixed cell, `n_fixed`, `is_fixed`, `fixed_defs` | constant, `n_const`, `is_const`, `const_defs` |
| `Source::Fixed`, `BuiltSource::Fixed`, `Wire::fixed` | `Source::Const`, `BuiltSource::Const`, `Wire::constant` |
| `Source::Literal`, `TextLiteral`, `MathEssential`, `MathEssentialFrom` | `Source::Given`, `GivenText`, `GivenMath`, `GivenMathFrom` |
| `BuiltSource::Literal` | `BuiltSource::Given` |
| `Wire::essential`, `essential_from`, `text_essential` | `Wire::given`, `given_from`, `given_text` |
| fixed shape (`fixed_shape`) | constant shape |
| `Counter::fixed` | `Counter::known` |
| `PropAt::Fixed` (a prop at a set position) | `PropAt::Position` |
| `cell_class`'s `"fixed"` (`cells-wasm`, the viewer's `cellClass`) | `"constant"` |
| "Constant" (an operator's literal) | an operator's constant: a document constant |

A **given value** is a value the source gives a prop, by an attribute or
a default: essential when a student can write it, a constant otherwise.
*Literal* keeps only its plain meaning, text written in the source (a
literal attribute, a literal `fixed`). *Fixed* names only the DoenetML
attribute; what it does to an element is a *hold*, and an element it
holds is *held*.

### 6. What does not change

- Essential cells, their keys, saved state and the session (ADR 0015,
  ADR 0017): no constant is state.
- Holds (ADR 0022). A hold on a constant is moot, since no request
  passes a constant, and the held-slot copy (`OpSpec::Copy`) of a
  constant folds to the constant.
- The interactive bit (ADR 0018). A document constant an interactive prop
  names (a held point's `x`) drops a request as a fixed cell does today.
- The cycle check and diagnostics (ADR 0012, ADR 0014), which run on the
  probe's unfolded graph.
- Pruning (ADR 0019): the pool holds only live document constants, and a
  dead slot still names the dead cell.
- The flat `f64` array and its zero-copy view (ADR 0001).

## Considered options

- **Document constants and scope constants as two classes**, beside
  essential and derived. Rejected: the tick treats them alike, so every
  rule would say "or". Where they differ is where the build puts them
  and whether an index survives a rebuild, which the kind says.
- **Keep the structure values as constants of one build** ("build
  constants"). Rejected: it keeps a class whose values change on a
  rebuild under a name that says they do not, and every consumer that
  caches a constant must know which. Each has a derived form already
  (the probe's collect count, the gated section number); the cost is a
  few instructions where a repeat is involved.
- **Counted values as formulas over the count cells**: the count times
  what one iteration contributes, where every iteration contributes the
  same, else a sum of each iteration's contribution. Deferred: the graph
  would read the counts, but nothing needs that edge (a count change
  rebuilds; the cycle check has the probe's), and count 0, nested
  repeats, a select in an iteration and sections collected among a
  section's siblings each need their own wiring. It can replace the
  copy for the common case later without changing any value.
- **Cache scope constants in the session**, as essential values
  are. Rejected for now: an index or a pick costs less to compute than
  to look up, and is the same either way.
- **A constant pool outside the cells**, a second array instructions
  read. Rejected: every instruction's inputs and the renderer's reads
  would have to say which array, and the tick's speed rests on one
  contiguous array (`docs/tick-design-decisions.md`, #4).
- **Share a constant per template slot, not per value.** Simpler to
  record, and still collapses the iterations, but keeps the duplicates
  between slots (seven `1`s in the measured body). Per value costs one
  hash lookup per slot at load, which `const_slot` already pays.
- **Folding only the document constants.** Leaves most of the measured
  instructions, which read an iteration's index.

## Consequences

- A rebuild resolves, emits and simplifies no document constant, and its
  cells and instructions shrink by what folds; in the measured body,
  nearly every instruction. The measurement is to be repeated per step.
- A document constant keeps its cell index across rebuilds. The bridge may
  then skip, after a rebuild, the props that name only pool cells; that
  is a change of its own.
- `Recompute::Full` and the load's first compute run only instructions
  that read state.
- The input signature (ADR 0017, `build/signature.rs`) hashes a constant
  by its value, as it hashes a fixed cell today; a folded cell hashes as
  a constant, not as its instruction. A graph's literal bounds read the
  constant range.
- `tests/every_count.rs` checks the definition: at every count and seed,
  every constant of a (scope, template slot) has the same value in every
  build that stamps it; `tests/constants.rs` checks that the pool keeps its
  cells across rebuilds.
- `CONTEXT.md` merges *Fixed cell* and *Constant* into *Constant* (with
  *document constant* and *scope constant*), adds *Given value*, *Counted
  value*, *Constant pool* and *Fold*, and uses *held* where it said a
  `fixed` element. `ARCHITECTURE.md`'s idea, emit, the session, "A
  document loads" and "A repeat's count changes" describe the pool and the
  fold.

## Migration

Each phase leaves the tree green; `scripts/golden-diff.sh` is identical
after each.

1. **Symbolic constants once per load.** `sym_source` keeps each
   constant expression's handle, after its `post`, per (expression,
   post) in the load, so each is imported and simplified once. No other
   change; the measured `simplify` cost leaves the rebuild. *Done
   2026-10-30*; see below.
2. **Counted values become derived.** A collect's count, a section's
   number and a section's credit as in step 1. The `every_count.rs` check
   above, which fails before this phase on a section after a repeat.
   *Done 2026-10-30*; see below.
3. **Rename** (step 5), code and docs, with no behavior change. *Done
   2026-10-30*; see below.
4. **Document or scope constant**, recorded per template slot by the probe
   beside the writable and live records; a census test prints it per
   golden document and `sir.doenet`. *Done 2026-10-30*; see below.
5. **Fold** (step 4): the probe records folded template slots; emit
   evaluates scope-constant folds; a full recompute after load changes no
   constant (tested). Spec cost snapshots move and are rewritten with
   `SPEC_UPDATE=1`. *Done
   2026-10-30*; see below.
6. **The pool** (step 3): the load makes it, builds start from it, and
   document-constant slots name it without a source. `is_essential` and `is_const`
   become range checks after the pool. Measured with `perf-diff.sh` and
   `cells-bench` against the commit before phase 1. *Done
   2026-11-01*; see below.
7. **Docs.** `CONTEXT.md` and `ARCHITECTURE.md` as above; this ADR's
   status. *Done 2026-11-01*.

Settled while implementing phase 1:

- The handles are kept in the session (`Session::math_constants`), not
  in `Compiled`: a handle is a position in the session's engine, and the
  probe builds with an engine of its own (`build/probe.rs`), so a handle
  the compile kept would name nothing in the document's engine. The
  cache is shared with every build's session as the engine is, and only
  grows as the engine does, so a failed rebuild leaves it valid.
- An expression is constant exactly when its parsed tree has no cell
  leaves, which the source decides, so the key needs no scope.
  `sym_source` looks it up before parsing, after the check that refuses
  a numeric-only function in a math cell, so a build reports the same
  errors as before.
- Values are unchanged: the engine already gave an equal expression the
  same handle, so the cache saves the import and the `simplify` or
  `expand`, not a different result.
- Measured with the benchmark of Context, rebuilding from 5000 to 5001
  iterations: with `simplify` on the math, 68.0 ms before and 33.2 ms
  after; without it, 40.2 ms and 35.0 ms (the import alone).

Settled while implementing phase 2:

- The probe's operator for a collect's count was a stand-in for the
  cycle check's edges (a `Max` over the counts, `Builder::reads`), never
  its value, and the probe numbered a section after a repeat as a
  constant like any build. So no build had a derived form to take, and
  none could tell at count 0 that a value was counted: the record
  (`Compiled::counted`) and the copy replace "as the probe wires it".
- The check is `a_constant_is_the_same_in_every_build` in
  `tests/every_count.rs`. Each build records, for tests, what every live
  template slot's own source makes it (`Structure::slot_classes`); every
  document with a repeat is built at counts 0 to 4 and back in one
  session, and a slot that is a constant in one build must be the same
  constant in every build of its scope. Every golden document and
  `sir.doenet` passed before this phase; five documents in the test
  (`STRUCTURE_VALUES`) failed, one per kind of counted value, and pass.
- A `prefill` naming a collect's count seeds from the copy's constant,
  since a seed is taken before the first compute.

Settled while implementing phase 3:

- Two names the table lacked were renamed with it: `PropAt::Fixed`, a
  prop at a set position, and the string `cell_class` returns for a
  constant, which the viewer's `cellClass` types; no caller compared it
  with `"fixed"`.
- *Fixed* is left where it is plain English that names no cell (a fixed
  table of test values, a fixed array, the vertex a pivot keeps fixed),
  and where it names the attribute or a held element. *Fixed at load*,
  meaning decided once, became *settled at load*.
- The earlier ADRs keep their words: they record what was decided when.
  `CONTEXT.md` and `ARCHITECTURE.md` use the new vocabulary; *Constant*
  now holds what *Fixed cell* and the old *Constant* entry did, beside
  *Given value* and *Counted value*.
- The spec cost snapshots name their count of constants `constant`, not
  `fixed`; no number in them changed.

Settled while implementing phase 4:

- The record is `Compiled::document_constants`, made by the probe from
  the slots whose plan `Source::gives_document_constant` and which are
  constants there (a given value only when no student can write it).
- `a_constant_is_the_same_in_every_build` checks it: a template slot the
  record makes a document constant has the same value in every scope its
  template is stamped in, at every count and seed. Recording iteration
  indices and picks as document constants instead fails it at once.
- The census is `tests/constants.rs`, at load, pruned. Over the golden
  set: 203 constants, 129 of them document constants holding 51
  distinct values, 34 scope constants, and the rest no template slot's
  (an operator's constant, the missing-referent and dead cells).
  `sir.doenet`: 1232 constants, 624 document constants holding 10
  values, 604 scope constants.
- Every document has at least one scope constant, its own credit: a
  value wired after expansion is a scope constant by the rule above,
  even in the document's scope, where there is one instance. Counting a
  constant in the document's own scope as a document constant would be
  right, since phase 2 makes it the same in every build, but would make
  the pool's correctness rest on phase 2 having found every counted
  value; it is left for phase 6 to decide.

Settled while implementing phase 5:

- The probe does not record folds, as step 4 first said: most foldable
  instructions are lowered math's anonymous steps, which a record by
  template slot cannot name, so each build decides by its own walk under
  the scope rule. What that gives up is pruning a constant read only by
  folds, which stays live; constants are the cheapest cells.
- `LoadOptions::fold`, on by default and off only in tests, turns folding
  off. `folding_keeps_every_live_value` (`tests/live.rs`) loads every golden
  document and `sir.doenet` both ways, pruned, at four seeds and counts 0
  to 4, makes the same requests, submits and triggers on both, and finds
  every live cell equal; `a_full_recompute_changes_no_constant`
  (`tests/constants.rs`) finds no instruction writing a constant and no
  cell changed by a full recompute after load.
- Over the golden set, 90 of 275 instructions fold (42 of the 179 live
  ones). In the benchmark of Context at 5000 iterations, 30,000 of 30,003;
  its rebuild goes from 41 ms to 37 ms, since the folds run once in
  emit in place of the load's first compute.
- A curve's `Sample` folds like any other instruction. It first did
  not: the bridge drew a function's curve only when its `samples` cell
  was derived, since a function of several variables has one absent
  constant there and no curve (`CURVE` in
  `doenetml-worker/src/cells/contracts.ts`); in a graph whose `fixAxes`
  holds its bounds, a function's samples read only constants and would
  fold, and its curve would vanish. The bridge reading a cell's class
  for a fact about the source was the flaw, and the core's own
  `output_bits` made the same one, spanning the run of samples only when
  its head was derived. Now `<function>` and `<derivative>` have a
  `curve` prop, rendered, a constant the planner sets to 1, or to 0 for a
  function `is_vector_function` finds of several variables or returning
  a tuple; `samples` is `sampled: curve`, so its run is output when
  `curve` is nonzero, whatever class its cells have; the bridge draws a
  curve when `curve` is 1; and `folded_slots` has no exception.
  `a_folded_curve_is_still_drawn` (`tests/constants.rs`) loads a curve
  with and without `fixAxes`, finds its samples folded only with it, and
  every sample an output holding x² either way; the bridge test
  `draws a curve whose samples are folded into constants` draws it. No
  golden document has a curve under `fixAxes`, so the golden values are
  the same; the dump lists the new `curve` prop, and the four documents
  with curves fingerprint differently by its constant cell.
- The spec cost snapshots move only by instructions becoming constants:
  in every changed case, cells, essential cells and components are the
  same, and the constants grow by what the folded instructions wrote.

Settled while implementing phase 6:

- The pool belongs to the session, not to the load, and grows when a
  build needs a document constant it lacks, as step 3 now says. Made by
  the load, it would have to give every template's document constants
  their values without building them; appended to, it gets the value the
  build already has, and keeps every pooled cell where it was.
- The pool holds the operators' constants and the missing-referent cell
  beside the record's document constants. The dead cell stays out (step
  3). Folds stay per build: a fold of document constants is evaluated by
  every build and is a scope constant here, where step 4 said the pool
  would hold it.
- The essential cells follow the constants, where step 3 put them between
  the pool and the scope constants: so the constants are one range,
  `..n_const`, with the pool its first `n_pool`. Whatever read an
  essential cell's index as its position among the essential cells reads
  `Document::essentials` now: inversion and refusal take that range,
  saved state, the session's record and the input signature subtract
  `n_const`.
- A pooled cell is live when any slot that shares it is. Taken from one
  slot, as an unpooled cell's liveness is, it was dead in `sir.doenet`
  loaded unpruned while an output read it (`tests/live.rs`'s census).
- A build still reads each document-constant slot's planned value to
  find its pooled cell; it makes no cell for it and imports no math for
  it (phase 1).
- `a_document_constant_keeps_its_cell_across_rebuilds`
  (`tests/constants.rs`) checks that a repeat's literals share one pooled
  cell in every iteration, and that the pool's cells keep their values and
  indices through rebuilds to five, zero and two iterations. The census
  reports the pool: over the golden set 70 of 163 constants are pooled,
  where 131 document-constant slots each had a cell; in `sir.doenet` 624
  document-constant slots share 12 pooled cells.
- In the benchmark of Context at 5000 iterations, cells go from 75,033 to
  40,027; the rebuild is unchanged within noise (44 ms to 43 ms), since a
  build still visits every slot. The spec cost snapshots move only by
  constants shared: in every changed case, essential cells,
  instructions and components are the same, and cells and constants fall
  together.
