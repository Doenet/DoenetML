# Equal computations share one cell

Status: accepted 2026-11-04. Steps 1 and 2 are done; step 3, a decision,
is open (see Migration).

Two instructions of one build that apply the same operator to the same
input cells compute the same value in every tick, so a build keeps one
of them and gives both their cells. Emit, which already merges aliased
slots into cells with a union-find (`build/emit.rs`), merges equal
instructions the same way, to a fixpoint, before it numbers the cells.
"Two props equal by construction share one cell" (ARCHITECTURE.md) then
holds for derived props as it holds for aliases, and an extend that
overrides nothing an instruction reads shares that instruction with its
referent, whatever its planner did.

## Context

### What an extend shares today

A bare extend aliases every port to its referent's (`plan_bare_copy`,
`compile/planning/copies.rs`). An extend with any attribute or child of
its own, `name` and `extend` aside, is planned again from its record
merged under the referent's (ADR 0032, decision 3), and linking aliases
only its *given leaves*: the ports a `GivenId` names, which the copy did
not give itself (`link_given_leaves`, `compile/link/mod.rs`). Every
derived port of the copy is a new instruction over the copy's own ports.

So `<circle name="d" extend="$c" styleNumber="2"/>` shares `c`'s center,
radius and through-point leaves, and makes its own squared radius, its
own clamped radius, its own center and radius vector operators, and its
own area, diameter and circumference, each over cells that are `c`'s.
A table type is the same: `plan_attrs` emits a `Computed` prop under
`extend` as a fresh operator (`compile/planning/attrs.rs`), so
`<clamped extend="$c" hi="2"/>` recomputes `atLeastLo`, which reads only
the shared `value` and `lo`.

The copy's derived cells are right, so no spec fails. They cost cells,
instructions and tick time, once per copy, for values the document
already holds; and they are what an author sees as "a copy that
recomputes", which the cell model promised not to make.

### Why planning does not share them

A `Plan` or `Whole` planner is a function from the whole record to the
whole wiring: it decides the circle's case from `center`, `radius` and
`through` together, and returns every port at once. The machinery cannot
tell from a finished wiring which outputs depend on which inputs, so it
reruns the function for a copy and shares what carried an identity
before the function ran, the given leaves. ADR 0023 deferred aliasing
every un-overridden port, and ADR 0032 bounded it to given leaves for
this reason (its considered options: "a planner that decides its wiring
from attributes and children together cannot tell, from a finished
wiring, which given leaf an attribute became").

What the machinery does have, once every element is planned, is the
dataflow: every derived port's source names the ports it reads. Whether
two derived ports are equal is a question about that graph, not about
the planner. The build has it in its plainest form, as instructions over
cells.

### What emit does now

`Builder::finish` unions every `BuiltSource::Alias` slot with its
target, names each cell by its slots' root, takes the one non-alias slot
of each cell as its definition (`SlotCells`), runs the orientation of
the author's operators (ADR 0026), classes the value slots (ADR 0018),
finds the live slots (ADR 0019), folds the instructions whose inputs are
all constants (ADR 0028), and numbers the cells. Nothing compares two
`BuiltSource::Op` entries: two operators over the same cells are two
instructions and two cells.

## Decision

### The rule

Two defining slots are *equal* when their sources are `BuiltSource::Op`
with the same `PlannedOp` (the same `OpSpec`, with the same constant for
an operator that carries one, or the same symbolic template and `Post`),
the same number of inputs, and inputs that are the same cells, position
by position; or when they are the `k`-th `VecOut` of two equal vector
heads, for the same `k`. Equality is over cells, after the alias
union-find, so an input aliased to another's is the same input.

Emit unions equal slots as it unions aliases, and repeats until nothing
changes: once `B` and `B'` are one cell, `C` over `B` and `C'` over `B'`
are equal in turn. The pass runs over the alias union-find's result and
produces the `SlotCells` the rest of emit reads; the kept definition of a
merged cell is the lowest slot, so the choice is the same in every build
that stamps the same elements in the same order, which every build of a
session does.

An instruction is kept for the kept definition only. A merged slot is
not an alias in the plan and does not become one: it is a derived slot
whose cell happens to be another's, as an aliased prop's cell is.

### What is not merged

- **Slots that are not live.** A dead class gets no cell and no
  instruction (ADR 0019); the pass considers defining slots the build
  binds, after the live walk, so a dead port stays on the dead cell.
- **Slots whose holds differ.** `Program::holds` flags a cell, and a
  request on a flagged cell is dropped; every cell of a held element is
  flagged (ADR 0022). Two equal slots merge only when the flag cells
  they would carry are the same set. Otherwise merging would hold a
  cell an unheld element owns, or free one a held element owns.
- **Slots whose request marks differ.** Whether a renderer may request
  a cell (`interactive`) and whether an action writes it
  (`written_by_action`) are bits per cell (`document/interactive.rs`,
  ADR 0018). Two equal slots merge only when their marks agree, so the
  refusal stays exact: a merge never makes a cell requestable that a
  prop's declaration did not.
- **Counted values** (ADR 0028) and **scope constants**, which are
  leaves, not operators. A leaf is never merged with anything: a given
  value is state with a key of its own, and a constant already has one
  cell per value through the pool.

Given leaves are shared by the compile's rule (ADR 0032) and never by
this one; this rule begins where that one ends, at the first operator
over shared cells.

### Where the pass sits

After the alias union-find and before `SlotCells` is made, so
orientation, classing, the live walk, folding and numbering all see the
merged cells. The abstract build runs the pass too: it runs expand and
emit through its view (ADR 0012), and its graph must cover every real
build's (`build/coverage.rs`), which it does when both merge by the same
deterministic rule, since a merge in a real build is between two
instructions over the same cells, and the abstract build, which folds
iterations into one, has at most fewer distinct cells for them.

Folding is unchanged and runs after: an instruction over constants is
folded once instead of once per copy.

`LoadOptions::share` turns the pass off, as `fold` and `prune` turn
theirs off, for the test that compares a shared load against an unshared
one.

### What it costs

One hash of each live defining slot per fixpoint round, over an
instruction's operator and input cells, which emit already has in hand;
a chain of `k` dependent copies converges in `k` rounds, and a round
with no merge ends the loop. The tick is cheaper by every instruction
dropped and touches fewer cells. The pass runs in the abstract build and
in every real build, including every rebuild.

## Considered options

- **Alias derived ports when linking, from the plans.** Walk a copy's
  ports in dependency order and alias each whose source equals the
  referent's same-position source, modulo inputs already aliased. This
  is the compile-closed form of the same rule: the abstract build, the
  live and writable walks and the classing would then see the sharing
  as plan facts rather than as a build's merge, and the cost would be
  paid once per load instead of once per build. It needs `Source` and
  `Flow` comparable (they derive only `Clone`), ports carried by name
  through the compile (ADR 0032, step 1, says they are not yet), and a
  rule for sources that are not plain operators (a lowered math, a
  symbolic template, an aggregate). It also shares only along an
  extend: two unrelated circles through the same points stay two. It
  is the right later step if the compile's analyses come to depend on
  the sharing; this ADR takes the build's form first, because it is a
  hundred lines that no planner knows about, and because its
  measurement (the cost snapshots, the golden diff, `perf-diff.sh`)
  says whether the link-time form is worth its machinery.
- **Make planners share.** Give a `Plan` planner a referent wiring to
  alias from, or split each planner into a case decision and a per-case
  wiring the machinery can compare. Every planner changes, and the
  sharing depends on each planner doing it; ADR 0016 keeps the
  language's rules out of the components.
- **Merge only along an extend.** Restrict the rule to a copy and its
  referent. Simpler to explain, and it misses what the general rule
  gets for the same price: equal computations between unrelated
  elements, and between the copies of one referent.
- **Merge leaves of equal value too.** A given leaf with the same value
  as another is not the same state: two inputs prefilled with 2 are two
  inputs. Constants are already one cell per value (ADR 0028). Leaves
  stay out.
- **Do nothing.** The copy's derived cells are correct and the golden
  diff is identical. The cost is per copy and per tick, and the cell
  model's statement about equal props is false for derived ones.

## Consequences

- An extend with an own attribute shares every derived cell whose
  inputs it did not change, by the dataflow and not by the planner:
  `d`'s area is `c`'s area, `d`'s clamped radius is `c`'s. A copy that
  overrides the radius shares the squared center distance of a through
  point if its case computes one over shared cells, and not its own
  radius chain, which reads its own leaf.
- A request on a merged cell inverts through the kept instruction to
  the same input cells either instruction read, so where it lands is
  unchanged. `tests/live.rs`'s rule that a pruned and an unpruned load
  agree on every live cell extends to a shared and an unshared one.
- The cost snapshots change (cells and instructions fall) for every
  spec case with an extend that has an own attribute, and for cases
  where two elements compute the same thing over the same cells. Values
  do not change: the golden diff is identical.
- `ComponentTable::prop_cells` already names non-contiguous and shared
  cells for aliases; a renderer sees nothing new. A saved-state key
  names an essential cell, which the pass never touches.
- Holds and request marks are compared, so the rule is exact at the
  price of a merge missed where a `fixed` copy and its referent compute
  the same value. The cost snapshots make a missed merge visible.
- The abstract build and every real build merge alike, which
  `tests/every_count.rs`'s coverage check now tests as it tests the
  labels: a merge the abstract build lacks and a real build makes is a
  dependency the abstract build does not cover, and fails there rather
  than as a missed cycle.
- Nothing in a component changes. A planner that could share more by
  aliasing (a table type's `Computed` prop under `extend`) need not,
  since the build shares it.

## Migration

Each step lands alone, with the golden diff identical.

1. **Scalar and vector operators.** *Done.* The pass in `Builder::finish`, over
   `BuiltSource::Op(PlannedOp::Spec(..), ..)` and `VecOut`, with the
   live, hold and mark exclusions and the fixpoint; `LoadOptions::share`.
   Tests: a unit test in `build/emit.rs` over the DAST builder
   (`testing/dast.rs`) and `<testValue>`, with an extend giving an
   attribute its chain does not read, that the copy's derived slots name
   the referent's cells, that a chain of three merges in one load, that
   a `fixed` copy's chain does not merge, and that a request through
   the copy's derived prop writes the shared leaf; `tests/live.rs`
   extended with a shared against an unshared load, given the same
   requests, submits and triggers, agreeing on every live cell;
   `tests/every_count.rs` unchanged. Rewrite the cost snapshots
   (`SPEC_UPDATE=1`) and review each fall with the case that caused it.
   Measure with `scripts/golden-diff.sh` (identical) and
   `packages/benchmark/scripts/perf-diff.sh`, with a fixture of extends
   each giving one attribute added beside the existing ones, since none
   of them exercises the case.

   As landed (`build/share.rs`):
   - The pass runs where this ADR places it, after the alias union-find
     and before `SlotCells`, so it runs before the live walk, not after
     it, and excludes no slot for being dead. Liveness is per cell (the
     walk marks cells, and the record marks a cell live when any of its
     template slots is), so this is the exclusion's effect without a
     second pass: a dead slot merged into a live cell costs no
     instruction, and two dead slots merged stay on the dead cell.
   - Three more things a merged cell carries are compared, beside the
     holds and the request marks, so a merge changes nothing about a cell
     but how many instructions compute it: the value types its slots were
     given, and whether it is an operator of the author's math, which
     orientation may turn (ADR 0026). And two vector heads merge only when
     their outputs would, position by position, since a merged head's
     outputs share cells; a head with an output that may not merge does
     not.
   - A slot with another source in later iterations (the abstract build's
     `later_sources`) never merges, as a counted value never does: in the
     abstract build it stands for instructions that are not equal in
     every iteration.
   - `build/coverage.rs` and `tests/every_count.rs` are unchanged: a merge
     joins two cells that read the same cells, so it adds no dependency
     and makes no cycle (a path through the merged cell was a path through
     one of the two), and the coverage check compares the graphs before
     emit, where the labels are.
   - `LoadOptions::share` is a `testing` option, as `fold` is.
   - Measured: the golden diff is identical (36 documents, six built
     differently). The live census falls from 189 to 178 instructions on
     the golden set (`choices.doenet`'s repeated conditions, `circles.doenet`'s
     copies, `fixed.doenet`'s two points held always that copy one value)
     and from 2025 to 1425 on `sir.doenet`. One cost snapshot changes:
     two circles through the same through points share their chain
     (16 cells and 2 instructions to 13 and 1). The fixture `extends-N`
     (`cells-docgen`) is a circle through three points and N extends of it
     each giving a `styleNumber`: at N = 100, 316 cells and 101
     instructions unshared, 16 and 1 shared.
   - Speed: `perf-diff.sh` could not run where this step landed (its
     `wasm-pack` fetches `wasm-opt`, which that network refused), so the
     pass was timed natively instead, in one release build with
     `LoadOptions::share` off and on (best of seven loads, best of fifty
     ticks on the first interactive cell):

     | fixture       | load, ms    | tick, µs  | instructions |
     | ------------- | ----------- | --------- | ------------ |
     | sir           | 7.6 → 8.8   | 0.1 → 0.1 | 2022 → 1422  |
     | circles3-1000 | 32.0 → 36.5 | 5.2 → 4.8 | 1000 → 1000  |
     | extends-1000  | 13.4 → 13.8 | 4.9 → 0.2 | 1001 → 1     |
     | chain-1000    | 5.3 → 5.6   | 10.9 → 11.0 | 1001 → 1001 |
     | points-1000   | 4.5 → 5.1   | 0.2 → 0.2 | 0 → 0        |

     The pass costs 3 to 16 percent of a load where nothing merges, more
     than "one hash per live defining slot per round" suggested: it
     gathers what each class carries over every slot, and hashes every
     defining operator in a last round that merges nothing. Making it
     cheaper (skip it when no two operators share a kind and first input;
     carry the marks the walks already compute) is open, and is part of
     what step 3 weighs. The wasm comparison should be rerun with
     `perf-diff.sh` where it can fetch its tools.
2. **Symbolic instructions.** *Done.* `PlannedOp::Template`, whose memo
   (`SymState`) is per instruction: a merged pair keeps one memo. Test:
   a `<math>` extended with an own `simplify`-free attribute shares its
   `Instantiate`, and `tests/constants.rs`'s check that a folded curve is
   still drawn holds for a shared one.
   As landed: two templates are equal when they have the same `Post`,
   the same input cells, and the same tree once each leaf is mapped to its
   cell's root, so two `<math>`s with the same text over the same cells
   share one `Instantiate` (one instruction, one memo) whether or not one
   extends the other. The test is in `tests/constants.rs`: two functions
   with the same expression share their samples, which still fold and are
   still drawn. It is not an extend because an extend of a `<function>`
   seeds its expression (`GivenMathFrom`, a leaf this rule never merges),
   and an extend of a `<math>` does not take its referent's expression in
   this core today (its `expr` is blank, with or without sharing): a
   separate bug. The golden set and `sir.doenet` have no two equal
   templates, so the census and the cost snapshots are unchanged; the
   golden diff is identical, one document built differently.

3. **Measure, then decide the link-time form.** With the snapshots and
   `perf-diff.sh` in hand, decide whether the compile's analyses need the
   sharing as plan facts (the first considered option), and if so, take
   it as a step of ADR 0032 with this pass kept as the build's check that
   nothing equal is left unshared.
