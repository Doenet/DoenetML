# Seeded selections over constants: what changes if a select may read references

An analysis, not a decision; ADR 0037 is the decision it led to, and
where the two differ the ADR wins: superseded by it. ADR 0037 is landed
(its *As landed* section says where the code departs from it); in
particular `numToSelect` must be a document constant, so the
structural-input path of questions 1(b), 5 and 9 is not built. Written against `cells` at `3cf22a4`,
assuming ADR 0032 step 8 was done. It has since landed (`e1478f0`): the
check stamps, defines and walks the **template graph** (`compile/graph/`),
the four records are `PortAttrs` bits in each template's `Checked` table,
and `build/abstract_build.rs` and `View` are gone; ADR 0035 and ADR 0036
fix what the check reads and what a build may read of it. File references
below are to the code at `3cf22a4`; where the text says "the abstract
analysis", read the template graph's define (`compile/graph/define.rs`).

## The rule under analysis

Today a load-time choice may read nothing but literals. `<selectFromSequence>`
declares `from`, `to`, `step` and `numToSelect` with the `Literal` attribute
kind (`components/structure/select_from_sequence.rs`), `<select>` reads
`numToSelect`, `withReplacement` and each option's `selectWeight` through
`literal_attr` while outlining (`compile/outline/choice.rs`), and the
refusal says why: *"a load-time choice depends only on the document seed
and literals"* (`compile/source.rs`). ADR 0009 lists the ban among its
consequences.

The proposed rule: **a seed-based selection may rely on any value that
user interaction cannot change.** In the core's vocabulary (ADR 0018, ADR
0028) that is: every parameter of a select must be a *constant*, document
or scope, after folding. A `<number>` nothing inverts onto is one; an
iteration's index is one; another select's pick is one (a scope
constant); a fold over those is one. An essential cell is not, nor is
anything derived from one, nor a counted value, nor a cell a reactive
choice's gate reaches.

The invariant the rule protects, which no ADR states yet: **what the seed
chose does not move while a student works.** Picks are a function of
(source, seed, scope) and of nothing a tick writes. ADR 0018 §6 rests on
it ("with the seed, which decides every select's picks, the touched
essential cells are a student's whole state"), and so does ADR 0009
("a load-time choice costs nothing after the build"). It is worth writing
down because the machinery could support more than the rule allows: a
`<select>` whose `numToSelect` reads an input would rebuild and redraw
consistently (the stream draws picks as a prefix, so a larger count keeps
the earlier picks), but the student's problem would change under them.
The rule is a pedagogical invariant with an architectural expression, not
a limit of the core.

## Where things stand

- A `<selectFromSequence>`'s `value` is a leaf, `Leaf::Scope(ScopeConst::
  SequencePick { from, step, count })`, with the three numbers baked in by
  the planner, which also checks the sequence is nonempty and the step
  nonzero. The build draws it at expand (`build/expand/mod.rs`,
  `plan_source`) from `seeded_stream(scope, key)`. It is a scope constant
  (ADR 0028's table), never pooled, remade by every build.
- A `<select>` draws which options to stamp at expand
  (`build/expand/choice.rs`, `pick`), from `ChoiceDef::num_to_select`,
  `weights` and `with_replacement`, all literals read while outlining.
  The compile checks it can draw (`numToSelect` against the options with
  positive weight) there, because ADR 0014 moved that check out of the
  draw.
- The compile computes no value. Even the abstract build never ran its
  instructions and folded nothing (`folded_slots` returns early under
  `folds_iterations`); after step 8 there is no build at all in the
  compile. Every diagnostic is a fact about types, names, classes, shapes
  and the graph.
- Values the build needs *before* it can stamp come from exactly one
  place: the structural cells, read from the previous pass's cells
  through `Counts` (`session.rs`), keyed by (scope, node). A load builds
  until every repeat's count cell matches what it was stamped with
  (`document/load.rs`, `settle`), in at most structural depth + 1 passes,
  a bound the compile computes.
- Folds are decided per build, at the end of emit, by `folded_slots`: an
  operator folds when every input is a constant, a non-essential given or
  a fold, *made in its own scope or one around it*. There is no compile
  record of which derived ports are constant; ADR 0028 phase 5 chose not
  to record folds, since most foldable instructions are lowered math's
  anonymous steps.
- The one existing "read a value at build time" rule is the prefill seed
  (`ScopeConst::Seed`, `emit.rs::seed_cells`): the source must be a given
  or a constant, never computed, checked by the source's *kind*, so the
  check needs no value. It is stricter than "constant": it refuses an
  operator over constants that would fold.

## Questions

### 1. Where is a parameter's value needed, and does the compile–build line move?

The line today: the compile knows classes and shapes, never values; a
build learns values only by computing, and learns structure only through
the session's `Counts`. A reference in a select's parameter needs a value
in three places, and they differ in kind:

**(a) The pick's value** (`<selectFromSequence>`, `numToSelect="1"`).
Today the value is drawn at expand. It need not be: make the pick an
instruction. The planner wires

```
draw:  Leaf::Scope(ScopeConst::Draw)             a uniform in [0, 1) from seeded_stream(scope, key)
value: VecOp::SequencePick over (draw, from, step, to, exclude_1 .. exclude_m)
```

`from`, `to`, `step` become ordinary ports (`Scalar` attributes with
defaults) that the type pass types `Num` and the record classes. The
draw is the only scope-dependent leaf; the parameters are whatever the
author wrote. When every input is a constant the instruction folds, so
after emit the value is a scope constant exactly as today; when a
parameter reads a sibling scope (another select's pick, which the fold's
scope rule does not enclose) it stays an instruction that a full
recompute runs once and the dirty closure never does. No value is needed
at expand, the compile–build line does not move, and the planner's
arithmetic (`count`, the emptiness check) leaves the planner, which has
no values. This is the cheap part.

**(b) The pick's structure** (`<select numToSelect="$k">`, weights,
`<selectFromSequence numToSelect="$k">`). Which templates are stamped,
or how many values the element holds, is decided at expand, before any
cell exists. A value needed there is by definition a structural input,
and the core has one mechanism for those: the pass loop. `Counts` would
generalize to *structural inputs* keyed by (scope, node), each a small
vector (a count; a select's `numToSelect` and weights); pass 0 stamps a
select with unknown inputs as it stamps a repeat with no count, with no
picks; the pass's compute gives the parameters their values (folded or
not, they are cells); `structure_settled` compares what each select was
stamped with against what its parameter cells now hold. Because the
parameters are constants, they settle by pass 2 and never change again
in the session, so a select never causes a rebuild in a tick, which is
the invariant above restated. The compile must bound the passes: a
select whose structural parameter reads inside a repeat's iterations
adds one to the depth, as a count reading there does, and the same
repeat-graph edge makes a select that reads its own picks a cycle.

A scope-dependent structural parameter (`numToSelect="$i"` in a repeat)
*forces* this mechanism: its value differs per iteration, and the compile
cannot enumerate iterations. A document-constant parameter does not: the
compile could evaluate it (see 3) and specialize `ChoiceDef::num_to_select`
to the number, and the build would not change at all. That is a real
staging choice (see Migration).

**(c) The domain check.** Whether the sequence is empty, whether
`numToSelect` exceeds the drawable options, whether `exclude` empties the
set: facts about the source that ADR 0014 requires the compile to find,
which today it reads off literals. With references they need values. This
is the one place the line moves, and question 3 is about it.

So: (a) moves nothing, (b) reuses the structural-cell mechanism with a
generalized `Counts`, and (c) asks the compile to evaluate constants.

### 2. "Cannot be changed by user interaction" must become a compile fact

The rule's predicate is not recorded anywhere today. The writable record
(ADR 0018) says which *given* leaves a student can write; folding says per
build which *derived* slots are constant, and deliberately not per
template slot. The rule needs a **constancy attribute** on every port,
computed by the abstract analysis after classing: a port is constant when
its source is a constant leaf, a given leaf the writable walk does not
reach, a scope leaf, or an operator (or alias, or lowered math, or
symbolic template) whose every input is constant, and it is not a counted
value and not held by a non-constant flag. This is `folded_slots`'
predicate lifted to the compile and stripped of its scope rule, which the
abstract graph does not need because every referent exists in it. Each
build keeps deciding its own folds; it may read the attribute as it reads
the writable record, but the scope rule still decides whether to fold in
*this* build.

Three places where "constant by class" and "cannot change" come apart,
each needing a decision:

- **A reference that may be missing.** `to="$r[1].n"` where `n` is a
  literal inside a repeat with `length="$k"`, `k` an input. `n` is a
  constant by class, but at count 0 the reference is the missing
  referent, so the parameter's value follows the count, which the
  student moves. The fold rule dodges this through its scope rule ("the
  missing-referent cell is never read as a constant"); the compile needs
  it explicit. Definition: a reference is *stable* when no step on its
  path can land past the end in any build, which holds for a plain
  reference, for `Iter` or `Item` into a repeat or collect whose count is
  itself constant with the index inside it (checkable by the evaluator of
  question 3), and for `Item(Picks, k)` with `k` within the select's own
  constant `numToSelect`. A select's parameter may read only through
  stable references. `$r[5].n` under `length="3"` is then always missing:
  a constant NaN, which the domain check refuses.
- **Counted values.** `$c.count` over a repeat with a literal length never
  changes, but ADR 0028 classes every counted value derived. Keeping that
  (a select may not read a counted value) is simplest and loses little; the
  abstract analysis could refine it, since after step 8 it knows which
  repeats a collection crosses and whether their counts are constant.
- **Gates and interface names.** `$cc.x` through a reactive choice is a
  `Choose` by the choice cell; it is constant only when every condition
  is, which the attribute decides correctly with no special case.

The diagnostic for a refused parameter should name the path: "`to="$k"`:
`k` can be changed by dragging `p`". The writable walk already has that
path (it walks from inputs backward through `request_targets`); recording
the first input that reaches each writable leaf costs one slot per leaf.
Authors will meet this diagnostic in a form that looks arbitrary from the
select's side, since whether `<number name="k">2</number>` is constant
depends on whether some `<point x="$k $n"/>` elsewhere inverts onto it, so
the explanation is not optional.

The check is a check-stage error (it needs the records), so the select is
boxed in place by the fixpoint, like an abstract-analysis failure after
step 8. Boxing another element can turn a parameter constant (the point
that dragged `k` is gone), so classing follows the boxing fixpoint, as
the check already reruns until every element builds.

### 3. Every variant error-free: the domain check needs values

ADR 0014's amendment exists because *an author previewing one seed could
publish a document that boxed an option for the students who drew it*.
Allowing references reopens that hole at the value level:

```xml
<selectFromSequence name="a" from="1" to="5"/>
<selectFromSequence name="b" from="1" to="$a - 3"/>
```

Two of the five draws of `a` give `b` an empty sequence. The compile
cannot see it from classes; the build must not report it (a build has no
variant for an author's error); a tick never produces a diagnostic. Four
positions, three of them bad:

- **Totalize the operator** (an empty sequence picks `from`, an
  oversized `numToSelect` picks fewer): no error anywhere, and the
  author is never told. Against ADR 0016's no silent NaN, and silent
  even without the NaN.
- **Keep "the compile computes no value" literally**: then a domain can
  be checked only when its parameters are literals, so references are
  allowed in name and refused in practice. Pointless.
- **Report it as a load-time finding at this seed** (a `rebuild_error`
  analog): the viewer's list would differ from `diagnose`'s, which ADR
  0013 forbids.
- **Give the compile a constant evaluator.** Evaluate every document
  constant port exactly, over the closed IR, with the operators'
  evaluations and a throwaway engine for symbolic constants (the
  abstract build had one). For a scope-dependent constant evaluate
  *abstractly*: an interval (or a finite set) that holds for every
  scope, as the abstract build's one iteration stands for every
  iteration. `$i` is `[1, cap]`; a draw is `[0, 1)`; a sequence pick is
  `[from, to]`; an operator applies an interval rule declared beside
  its evaluation and inverse in `scalar_ops!` (a new column, like
  `writes`), with anything undeclared going to ⊤. The domain check then
  asks "is the sequence nonempty for every value in the interval", and
  refuses when it cannot say so.

The fourth is the one consistent with the ADRs: it is sound and
conservative in exactly ADR 0012's sense ("can report a loop that no
single count realizes, never miss one"), the finding is a function of the
source alone, and it is the same from `diagnose` and from a load. It also
refuses things authors will try: `to="10 - $i"` is refused because at
iteration 10 the sequence is empty, which is right (ADR 0012 ignores caps
for the same reason), and `step="$s"` with `s` from a pick whose range
contains 0 is refused. The example above is refused with "the sequence
may be empty for some draws of `a`", which is the truth.

A cheaper first form: allow document constants (exact) and *affine*
expressions over scope constants (`$i + 2`, `$a - 3`), which the index
planner already parses (`IndexPlan`'s terms), and refuse the rest as
"cannot bound". Intervals over affine terms are exact. The general
interval column can come when something needs it.

What the evaluator costs beyond the check: a new capability of the
compile, operators' interval rules, an engine in `diagnose`. What it
gives beyond the check: ADR 0028 phase 6 deferred "a document-constant
fold is to be evaluated when the load makes the pool", and left the pool
to grow per build because the load "would have to give every template's
document constants their values without building them". This evaluator
is that; the pool could be made by the load from the compile's values,
and no build would evaluate a document-constant fold again.

### 4. "Every diagnostic can be answered before any values are computed"

Kept, with one word made precise. Three tiers of fact:

1. Facts about the source that need no value: types, names, shapes,
   classes, cycles, depth, and now *whether a select's parameters are
   constant* and *whether its references are stable*. Every current
   diagnostic and every new refusal of a parameter is here.
2. Facts about the source that need the value of a constant: whether a
   sequence is empty, whether `numToSelect` exceeds the options, whether
   `exclude` leaves nothing. A document constant's value is a function of
   the source, so the fact is one too; a scope constant's is a function
   of the source and the scope, and the fact holds "for every scope" or
   is refused.
3. Nothing may depend on a seed, a count, or state. Unchanged.

The rule becomes: **the compile computes no cell; it may evaluate a
constant port, exactly when it is a document constant and abstractly
when it depends on its scope, and a diagnostic may read that and nothing
else.** Reading the seed stays out, which is why question 3's example is
refused rather than checked per draw: the compile is seed-independent by
construction (ADR 0014's amendment), and `tests/diagnostics.rs` holds
the list equal at every seed.

### 5. `numToSelect` is shape, not value

`from`, `to`, `step` and `exclude` change which number is drawn.
`numToSelect` changes how many cells, components or templates exist. That
is the difference between an instruction and a structural cell, and it
is why `numToSelect` complicates the picture more than the others:

- On `<select>` it decides how many option templates are stamped: a
  structural input, question 1(b). The draw itself (`pick`) is unchanged
  once the number is known.
- On `<selectFromSequence>` it is unsupported above 1 today. Above 1
  the element holds a list of picks, and a list's length is fixed by
  planning (ADR 0032 decision 1; ADR 0016 removed fixed-maximum lists).
  With a reference the length is a value, so the element is a repeat in
  disguise: `numToSelect` its count (a structural cell that must be
  constant), one scope per pick for `$s[k]` and saved-state keys (ADR
  0017 already keys a pick by its position among the picks), and a draw
  without replacement as a chain of instructions, pick `k` over the
  draw and picks `1..k-1`, all constant, all folded. The alternative, a
  capped list with a live length port, has no cap to use when the
  bound is a reference.
- In both, the stream makes picks a prefix-stable sequence, so the
  settling passes converge rather than redraw: pass 1's two picks are
  pass 2's first two.

If `numToSelect` must be a *document* constant (not merely constant), the
compile's evaluator gives the number and the build keeps a literal, as
today; only `numToSelect="$i"` and `numToSelect="$a"` for a pick `a` need
the structural-input path. That restriction is worth considering as a
first step, since it keeps `settle`, `Counts` and the depth bound out of
the change entirely.

### 6. `exclude` is a list of ports

`exclude="$a 7 $b"` is a list of scalar references; its *length* is
static (the attribute's items), only the values move. The attribute
kinds have no scalar list today (`Points(max)` is the only list), so one
is needed. The operator takes the excludes as inputs after the three
parameters, which bounds their number by `MAX_VEC_IN`. The value: the
sequence's count less the excludes that fall in it, then the draw indexed
past them, as the JavaScript core's `getSingleIndex` does.

The domain check is where it bites: with values the compile subtracts
the excludes that are in range; with intervals it cannot tell whether an
exclude is in range, so the sound rule is to assume every exclude may
hit: `count_min − m ≥ numToSelect`. For the common use, excluding what
another select drew from a sequence of five, `5 − 1 ≥ 1` passes. For
`exclude="$a $b $c"` over `from="1" to="3"` it refuses, correctly, since
some draws leave nothing.

`excludeCombinations` and `sortResults` depend on `numToSelect > 1` and
on a rejection-sampling draw; they stay unsupported. `withReplacement`
and `type` are modes, not values, and stay literal, as should
`selectWeight` unless someone needs it: weights are a structural input
(the draw reads them at expand) and so cost the same machinery as
`numToSelect` for much less use.

### 7. Picks as instructions: what the rest of the core sees

- **Classing (ADR 0018).** `SequencePick` declares `writes: none`, so the
  writable walk stops at a select, as it stops at `First` and
  `WeightedMean`. Nothing upstream of a select becomes essential through
  it. A parameter that is essential for another reason is what question
  2 refuses.
- **Liveness (ADR 0019).** A pick's value is live when something reads
  it; a structural parameter is a root, as a repeat's count is. Each
  select owns its stream, so a pick nothing reads and nobody draws
  changes no other pick: liveness and the draw stay independent.
- **Sharing (ADR 0033).** Two selects with equal parameters are not
  merged, because their draw leaves are different cells; the share stage
  must not treat two `ScopeConst::Draw` leaves as equal (leaves are
  never shared today, so this holds, but it is now load-bearing).
- **Constants and the pool (ADR 0028).** A pick is a scope constant as
  before, never pooled, remade per build by the fold; a parameter that is
  a document constant is pooled as any given is. The ADR's table row "a
  `<selectFromSequence>` pick: the seed and the scope" becomes "a fold
  over its draw and its parameters".
- **Types.** The type pass types the parameters `Num`; a `Text` or `Math`
  parameter is a type error or a coercion row (`Evaluate` of a math
  constant), not a build-time arity error.

### 8. Saved state, the input signature and safe edits (ADR 0017)

Sufficiency holds as before: picks are functions of (source, seed,
scope). The rule is what keeps the restore order-free: picks are decided
before any essential value is read, and that stays true because a fold
reads no essential. The signature today hashes a `<selectFromSequence>`'s
value as a constant and a `<select>`'s domain as `Domain::Options {
keys, num_to_select }`. With references the pick hashes as an operator
over its inputs' derivations, so changing `to` makes every input
downstream unsafe (the variant would change under the student, which is
right), and the domain becomes `OptionsBy(hash)` when `numToSelect` is a
reference, as `BoundsBy` already is for a graph whose bounds are
references. The draw leaf hashes by the element's stable key, which is
what the stream is seeded from.

### 9. Rebuilds mid-session

No parameter changes in a tick, so no select triggers a rebuild. A
repeat's count change that stamps a *new* iteration containing a select
with structural parameters stamps it with no picks, computes, and passes
again, as a nested repeat does; `Session::counts`'s hint ("a repeat in an
iteration that disappears and reappears is stamped with it") extends to
the generalized structural inputs so a returning iteration settles in
one pass. The bound is the compile's depth, which must count a select's
structural parameter as a count-like edge.

### 10. The cycle check and the depth (ADR 0012)

Value-level parameters add ordinary labelled edges into the pick
instruction; a select's parameters reading its own picks' content is an
SCC and reported. Structural parameters add edges on the repeat graph
(now a *structure* graph of repeats and selects): a select whose
`numToSelect` reads inside a repeat's iterations depends on that repeat;
a repeat whose count reads a select's pick depends on the select; a loop
is a cycle; the longest path is the depth. Since constants cannot form a
cycle, the only cycles possible through a select are ones the constancy
check would refuse anyway, but the cycle check runs first and reports
first.

### 11. Variant enumeration

The JavaScript core's `determineNumberOfUniqueVariants` gives up on any
non-literal `numToSelect`, `exclude` or sequence bound; the principles
alignment already records that unique-variant enumeration is best-effort
here (D17). The evaluator of question 3 makes it exact when every pick's
domain is a document constant and enumerable by finite expansion when a
pick depends on other picks; nothing here needs it, but nothing closes it.

## What changes, by file

| Where | Change |
|---|---|
| `components/structure/select_from_sequence.rs` | `from`, `to`, `step` as `Scalar` ports; `exclude` as a scalar list kind (new); planner wires `ScopeConst::Draw` and `VecOp::SequencePick`; its emptiness and step checks leave it |
| `compile/plan.rs` | `ScopeConst::SequencePick` becomes `ScopeConst::Draw`; a constancy attribute per port beside the records |
| `program/vector.rs` | `SequencePick { n_exclude }`, `writes: none`, an interval rule; `scalar_ops!` gains an interval column |
| `compile/outline/choice.rs`, `compile/planning/choice.rs` | `numToSelect` and weights no longer read at outline (outlining plans nothing, ADR 0030); `ChoiceDef` holds a literal or a port planned in `plan_choice`; the drawability check moves to the check stage |
| the abstract analysis (step 8) | constancy over ports; stable references; the select-parameter check with its explaining path; structure-graph edges and depth for structural parameters; the domain check over evaluated constants |
| `compile/check.rs`, a new `compile/eval.rs` | the constant evaluator: exact over document constants, intervals (or affine) over scope constants; a throwaway engine for `diagnose` |
| `session.rs`, `document/load.rs`, `build/structure.rs`, `build/expand/choice.rs` | `Counts` generalized to structural inputs; `structure_settled` compares a select's stamped parameters; `pick` reads them; only if scope-dependent `numToSelect` is allowed |
| `build/signature.rs` | `Domain::OptionsBy(hash)`; a draw leaf hashed by stable key |
| `diagnostics` | codes for a non-constant parameter (with the input that reaches it), an unstable reference, a domain that may be empty |
| ADR 0009 (the ban), ADR 0014 (where the draw check lives), ADR 0028 (the pick's row; the deferred pool evaluation), `CONTEXT.md` (*Load-time choice*, *Constant*), `ARCHITECTURE.md` ("A document loads") | text |
| `tests/every_count.rs`, `tests/diagnostics.rs`, `tests/constants.rs` | a document with reference-parameterized selects at every seed and count; the diagnostics equal at every seed for a domain that is empty at some draw; no pick changes after the golden request script (already implied by `a_full_recompute_changes_no_constant`) |

## A staging that keeps each step honest

1. **Constancy and stable references as port attributes**, with the
   explaining path, and nothing using them yet. Tested against
   `folded_slots` at every count and seed: nothing a build folds is
   outside the record.
2. **`<selectFromSequence>` parameters as ports, the pick as a folded
   instruction**, for parameters that are document constants only, with
   the compile's exact evaluator doing today's domain check on the
   evaluated values. The golden diff changes only by documents that
   loaded with the refusal. This already covers the two examples in the
   rule's statement when the referenced constant is a document constant.
3. **Scope-dependent parameters** (`$i`, another pick) with the affine
   or interval bound and the conservative domain check.
4. **`<select numToSelect>` and `exclude`** as document constants, resolved
   by the evaluator, with no structural machinery.
5. **Scope-dependent `numToSelect`** through generalized structural
   inputs, if wanted: the only step that touches `settle`, `Counts` and
   the depth bound.

## Open decisions

- Whether the compile may evaluate constants at all (question 3). Every
  honest form of the domain check needs it; the alternative is to keep
  the parameters literal where the domain depends on them.
- Interval column on every operator, or affine-only over scope
  constants.
- Whether a counted value over constant counts is constant (question 2).
- Whether `numToSelect` must be a document constant (question 5), which
  decides whether the structural-input generalization is part of this
  change.
- Whether weights may be references at all.
- The precise wording of the invariant, for ADR 0009 or a new ADR: *a
  load-time choice is a function of the source, the seed and its scope;
  nothing a tick writes reaches its parameters.*
