# Constants depend on the source and their scope alone

Status: proposed 2026-10-30. No migration step is done.

A **constant** is a cell whose value is a function of the source, the
document seed and the scope it is in, and of nothing else: not of state,
not of the iteration counts. No tick changes a constant, and no rebuild
changes one for a scope that still exists. A cell whose value follows
the counts is derived, computed from the count cells like any other
derived cell. A constant that is the same in every instance of its
template slot is **shared**; shared constants are made once per load, in
a pool at the front of the cells that every build reuses, so a rebuild
makes none of them again. An instruction whose every input is a
constant is evaluated once and becomes a constant itself.

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

So a value that follows the counts is not a constant. Each of today's
fixed values that does becomes derived, wired as the probe wires it or
as a gated value already is:

- **A collect's count** is the operator over the gathered repeats'
  counts that the probe already stands in for it, in every build. A
  collect that gathers no original from an iteration keeps a constant
  count, as it does today.
- **A section's number** counts the sections before it through a cell
  that sums what each repeat before it contributes, chained as
  `Counter::before` chains the gates of cases today. Only sections
  outside every repeat and every case count in the constant part.
- **A section's credit** with scored items only inside repeats is the
  mean at every count, with no scored item giving the same credit as
  today's constant, 1. A section with no scored item anywhere in its
  template keeps the constant credit.

What the remaining constants are, by what they depend on:

| Constant | Depends on | Shared |
|---|---|---|
| A given value no student can write (ADR 0018) | the source | yes |
| An operator's constant (`Arg::Const`) | the source | yes |
| A written expression's handle, its `simplify` or `expand` applied | the source | yes |
| `NO_VALUE`, an undefined value's NaN, the missing-referent cell, the dead cell | nothing | yes |
| A literal hold flag (`fixed`, `fixLocation`) | the source | yes |
| A synthesized point's `hide` | nothing | yes |
| An iteration's index | the scope | no |
| A `FirstIteration` source's constant | the scope | no |
| A `<selectFromSequence>` pick | the seed and the scope | no |
| An instruction's value over constants (step 4) | its inputs | when they all are |

A rebuild may change which cell a prop names (a missing referent that
an iteration now provides, ADR 0004); it changes no constant's value.

### 2. A shared constant is the same in every instance

A constant is **shared** when its template slot gives the same value in
every instance: every iteration, every branch built. It is
**per-scope** otherwise. Shared is a property of a constant, not a class
of its own: every rule about constants (inversion, holds, liveness,
saved state) is the same for both. What differs is where the cell is
made (step 3) and whether its index survives a rebuild.

The compile decides it per template slot, once, from the source, as it
decides what is writable (ADR 0018) and live (ADR 0019): a slot's source
in the plan says whether it reads its scope (`IterIndex`,
`SequencePick`, `FirstIteration`), and a folded instruction (step 4) is
shared when every input is.

### 3. Shared constants are made once per load

The load makes the **constant pool** after the compile: one cell per
distinct shared constant, keyed by its value type and its bits, as
`const_slot` keys operator constants today. A math handle is imported,
and simplified or expanded as its source asks, once. The pool holds the
shared constants of every template slot the live record keeps, stamped
in the first build or not, so a later rebuild never needs one it lacks;
its size is bounded by the distinct constants in the source.

The pool is the front of the cells, and it is kept with what the load
fixed (`Loaded`):

```
 [ shared constants | essential | per-scope constants | derived ]
   made by the load,  ── made by every build, in this order ──
   reused by every build
```

A build starts its cells from the pool and does not resolve or emit a
slot whose template slot is a shared constant: its prop names the pool's
cell directly. Since the pool's length is fixed for the load, a shared
constant's index is the same in every build. Per-scope constants are
made by each build, as fixed cells are today; they are cheap and the
same in every build that stamps the scope, so nothing caches them.

The dead cell and the missing-referent cell are the pool's first cells.

### 4. An instruction over constants is a constant

An instruction whose every input is a constant, its hold flags included,
is evaluated once and its outputs become constants: shared when every
input is shared, per-scope otherwise. The probe decides which template
slots fold, after the writable walk and before the live walk, so an
input read only by folded instructions can be dead. A shared fold is
evaluated when the load makes the pool, in the probe graph's order; a
per-scope fold when emit makes the scope's cells. Symbolic instructions
fold the same way, with the session's engine.

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
| "Constant" (an operator's literal) | an operator's constant: a shared constant |

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
- The interactive bit (ADR 0018). A shared cell an interactive prop
  names (a held point's `x`) drops a request as a fixed cell does today.
- The cycle check and diagnostics (ADR 0012, ADR 0014), which run on the
  probe's unfolded graph.
- Pruning (ADR 0019): the pool holds only live shared constants, and a
  dead slot still names the dead cell.
- The flat `f64` array and its zero-copy view (ADR 0001).

## Considered options

- **Two classes, document constants and scope constants.** Rejected:
  the tick treats them alike, so every rule would say "or". Where they
  differ is where the build puts them, which a property says.
- **Keep the structure values as constants of one build** ("build
  constants"). Rejected: it keeps a class whose values change on a
  rebuild under a name that says they do not, and every consumer that
  caches a constant must know which. Each has a derived form already
  (the probe's collect count, the gated section number); the cost is a
  few instructions where a repeat is involved.
- **Cache per-scope constants in the session**, as essential values
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
- **Folding only the shared constants.** Leaves most of the measured
  instructions, which read an iteration's index.

## Consequences

- A rebuild resolves, emits and simplifies no shared constant, and its
  cells and instructions shrink by what folds; in the measured body,
  nearly every instruction. The measurement is to be repeated per step.
- A shared constant keeps its cell index across rebuilds. The bridge may
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
  build that stamps it, and the pool is identical across them.
- `CONTEXT.md` merges *Fixed cell* and *Constant* into *Constant* (with
  *shared* and *per-scope*), adds *Given value* and *Constant pool*, and
  uses *held* where it said a `fixed` element. `ARCHITECTURE.md`'s emit,
  "A document loads" and "A repeat's count changes" describe the pool and
  the fold.

## Migration

Each phase leaves the tree green; `scripts/golden-diff.sh` is identical
after each.

1. **Symbolic constants once per load.** `sym_source` keeps each
   constant expression's handle, after its `post`, per (expression,
   post) in the load, so each is imported and simplified once. No other
   change; the measured `simplify` cost leaves the rebuild.
2. **Structure values become derived.** A collect's count, a section's
   number and a section's credit as in step 1. The `every_count.rs` check
   above, which fails before this phase on a section after a repeat.
   `seed_cells`'s stand-in for a collect's count becomes the ordinary
   case of seeding from a derived count.
3. **Rename** (step 5), code and docs, with no behavior change.
4. **Shared or per-scope**, recorded per template slot by the probe
   beside the writable and live records; a census test prints it per
   golden document and `sir.doenet`.
5. **Fold** (step 4): the probe records folded template slots; emit
   evaluates per-scope folds; a full recompute after load changes no
   constant (tested). Spec cost snapshots move and are rewritten with
   `SPEC_UPDATE=1`.
6. **The pool** (step 3): the load makes it, builds start from it, and
   shared slots name it without a source. `is_essential` and `is_const`
   become range checks after the pool. Measured with `perf-diff.sh` and
   `cells-bench` against the commit before phase 1.
7. **Docs.** `CONTEXT.md` and `ARCHITECTURE.md` as above; this ADR's
   status.
