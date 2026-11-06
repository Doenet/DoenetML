# A load-time choice reads constants, and the compile evaluates them

Status: accepted 2026-11-06. Proposed 2026-11-06; every migration step
is done, with the departures recorded under Migration. Builds on ADR 0009 (choices split by timing),
ADR 0014 (every error depends on the source), ADR 0018 (essential means a
student can write it) and ADR 0028 (constants); on ADR 0032 step 8, the
template graph (`compile/graph/`), over which the check stamps, defines
and walks; on ADR 0035 (the check reads definitions, never a program) and
ADR 0036 (a build reads the IR and its port attributes, never the graph).
The analysis behind it is `docs/seeded-selections-over-constants.md`.

A load-time choice may read any value that user interaction cannot
change: a constant, document or scope, in ADR 0028's sense. `<number
name="n">10</number>` that nothing inverts onto, an iteration's index,
another select's pick, and an expression over those are all allowed as a
`<selectFromSequence>`'s `from`, `to`, `step` and `exclude` and as a
`<select>`'s `numToSelect`. To keep ADR 0014's promise that every variant
is error-free, the check gains a **constant evaluator** over the template
graph's cells: it computes a document constant exactly and a scope
constant as a range, through a range rule each operator declares, and
checks every select's domain for every value its parameters can take. The
compile still makes no program and computes no cell.

## Context

Today a load-time choice reads literals and nothing else. The planner of
`<selectFromSequence>` declares `from`, `to`, `step` and `numToSelect`
with the `Literal` attribute kind and bakes the three numbers into a leaf,
`Leaf::Scope(ScopeConst::SequencePick { from, step, count })`, which a
build draws at expand (`build/expand/mod.rs`) and the template graph
draws at seed 0 for its definition (`compile/graph/expand.rs`, `drawn`);
outlining reads a `<select>`'s `numToSelect` and weights through
`literal_attr`, whose refusal says why: *a load-time choice depends only
on the document seed and literals*. ADR 0009 lists the ban. Authors want
`<selectFromSequence to="$n"/>`, `to="$a * $b"` over two other picks, and
`exclude="$a"`.

What the ban protected is not written down anywhere. It is this: **what
the seed chose does not move while a student works.** ADR 0018 §6 rests on
it ("with the seed, which decides every select's picks, the touched
essential cells are a student's whole state"), and so does ADR 0009's "a
load-time choice costs nothing after the build". The machinery could do
more: a `<select>` whose `numToSelect` read an input would rebuild and
redraw consistently, since the stream draws picks as a prefix. But the
student's problem would change under them. The invariant is pedagogical,
and literals were only its cheapest expression.

The honest expression is ADR 0028's class. A cell is a constant when its
value depends on the source, the seed and its scope, and nothing a tick
writes. A select whose parameters are constants draws the same way in
every build of a session, and a student can do nothing to change what it
drew. That is exactly what the ban guaranteed.

Three things stand in the way, and each is a fact the compile does not
have today:

- **Whether a derived port is constant.** `PortAttrs::WRITABLE` (ADR
  0018, ADR 0032 step 8) classes given leaves; whether an *operator* over
  them is constant is decided per build, at the end of emit, by
  `folded_slots` (`build/emit.rs`), and ADR 0028 phase 5 chose not to
  record it.
- **Whether a reference always resolves.** `$r[1].n` where `n` is a
  constant inside a repeat whose count is an input is constant by class
  and the missing referent at count 0. The fold rule dodges this with its
  scope rule ("the missing-referent cell is never read as a constant");
  nothing names it. In the template graph the read lands in the one
  iteration with a `Reset` label, which says nothing about whether the
  iteration exists.
- **The domain.** Whether the sequence is nonempty, the step nonzero and
  `numToSelect` within the options are facts about the source that ADR
  0014 moved into the compile, where they are read off literals. With a
  reference they need a value, and the compile has never computed one.
  The check stamps the graph, defines it and walks it (ADR 0035); a
  node's definition carries a constant leaf's value (`Def::Const(Some(v))`,
  `Def::Given(Some(v))`) but nothing computes an operator's.

The third is where the line between compile and build moves, and it is
the only place it moves.

```xml
<selectFromSequence name="a" from="1" to="5"/>
<selectFromSequence name="b" from="1" to="$a - 3"/>
```

Two draws of `a` give `b` an empty sequence. ADR 0014's amendment exists
because an author previewing one seed could publish a document that
boxed an option for the students who drew it; a reference in `to`
reopens that hole at the value level. A build cannot report it (a build
has no variant for an author's error), a tick never produces a
diagnostic, and a finding at this seed would make a load's list differ
from `diagnose`'s (ADR 0013). The check must find it, for every draw.

## Decision

### 1. A select's parameters are ports, and must be constant

`from`, `to`, `step` and `exclude` of `<selectFromSequence>` and
`numToSelect` of `<select>` are attributes of ordinary kinds (`Scalar`,
a scalar list for `exclude`, `Number(1)` for `numToSelect`), planned into
ports, typed `Num` by the type pass, and classed like any port. The
`Literal` kind is no longer theirs.

Each must be **constant**, a fifth port attribute, `PortAttrs::CONSTANT`,
that define over the template graph (`compile/graph/define.rs`) sets
after its walks: a port is constant when its cell's definition is a
constant leaf, a scope leaf, a given leaf the writable walk does not
reach, or an operator, alias or vector output whose every input is
constant; and it is not counted (`PortAttrs::COUNTED`), and not held by a
flag that is not constant. This is `folded_slots`' predicate lifted to
the check and stripped of its scope rule, which the template graph needs
not, every referent existing in it. A counted value is never constant,
even over repeats whose counts are; a value through a reactive choice's
interface is constant exactly when every condition is, with no special
case. A stamped build reads the attribute as it reads the four others
(ADR 0036); each build keeps deciding its own folds under the scope rule.

The attribute also requires every read on the port's paths to be a
**stable reference**: one whose referent exists in every build the
session can reach. A read is stable when no step of its reference is an
`Iter` or `Item`, or when every such step enters a collection whose
count is constant with an index the evaluator (step 2) proves inside it,
or enters a select's picks within its constant `numToSelect`. `$r[1].n`
under `length="$k"` with `k` an input is refused; under `length="3"` it
is accepted, and `$r[5].n` under `length="3"` is the missing referent in
every build, a constant NaN that the domain check refuses.

A parameter that is not constant is an error on the select, raised by the
check and boxed in place by the linking fixpoint (ADR 0032, step 7), as
a prefill the rule refuses is. The diagnostic names what reaches it: the
writable walk records, for each writable leaf, the first input that
reached it, so the message is "`to="$k"`: `k` can be changed by dragging
`p`". Whether a `<number>` is constant depends on what inverts onto it
elsewhere, so the explanation is part of the rule, not a nicety.

### 2. The check evaluates constants: exactly, or as a range

The check gains an evaluator over the template graph's cells
(`compile/graph/eval.rs`), run after define, reading each cell's
definition as the walks do (ADR 0035). For a cell it gives a **range**,
`[lo, hi]` in `f64` or ⊤ (anything):

- a document constant evaluates **exactly**, a point range, by applying
  the operators' evaluations along its definition and, for a `<math>`
  constant, an engine of the evaluator's own, as the signature has one
  for what a math value hashes as (`compile/graph/signature.rs`);
  handles stay the session's (ADR 0028 phase 1);
- a scope leaf has a range: an iteration index is `[1, count]` when the
  repeat's count is a document constant, else `[1, cap]`; a draw is
  `[0, 1)`; a select's pick is the range of its own sequence;
- an operator applies its **range rule**, a declaration beside its
  evaluation, its inverse and its `writes` in `scalar_ops!` (`range`, a
  fourth column): `Add` sums endpoints, `Mul` takes the corners, `Floor`
  floors them, `Div` is ⊤ when the divisor's range holds 0, `Sin` is
  `[-1, 1]`. A vector or symbolic operator with no rule is ⊤; `Clamp`,
  `Choose` (the union of its inputs), `First` and the comparisons
  (`[0, 1]`) have rules from the start;
- a text leaf, a missing referent and anything with no rule is ⊤.

The contract of a rule: **the range holds every value the operator can
produce from inputs in the input ranges**; it may be wider, never
narrower. A test beside `program::scalar::inverses` samples inputs across
declared ranges, evaluates, and asserts containment, so a rule that lies
fails where it is written, not in a student's variant. Ranges are plain
`f64` with no outward rounding; the emptiness test below uses the same
`1e-10` tolerance the pick uses, so a one-ulp miss at a boundary can
misjudge a boundary case by one value, never a variant's existence.

The compile still makes no program and computes no cell: the evaluator
walks definitions, as ADR 0035 says the check may, and reads no seed and
no state. ADR 0014's rule is kept with one word made precise: a
diagnostic depends on the source alone, *and may read the value of a
constant*, exactly for a document constant and for every scope at once
for a scope constant. The template graph's seed-0 draw of a pick
(`drawn`) goes with the leaf (step 4): the graph never holds a value a
seed decides.

### 3. The domain is checked for every value

With the ranges, the check that today reads literals reads ranges, and
holds only when it holds for every value in them:

- `<selectFromSequence>`: `step`'s range excludes 0; `count = floor((to −
  from) / step + 1e-10) + 1` is at least `numToSelect` for every `from`,
  `to`, `step` in their ranges, less the excludes, where an exclude is
  counted as hitting unless its range is disjoint from the sequence's;
- `<select>`: `numToSelect` is a nonnegative integer at most the options
  with positive weight (without replacement), for every value in its
  range.

A domain that may be empty is an **error** on the select: "the sequence
is empty when `a` is 1 or 2", "empty at iteration 10". The example above
is refused; `to="$a + 3"` is accepted; `to="10 - $i"` under a repeat of
twenty is refused, since iteration 10 reaches it, as ADR 0012 reports a
loop at any count that closes it. ⊤ anywhere in a parameter is refused as
"cannot bound". The check is sound and conservative in ADR 0012's sense:
it may refuse a document no draw breaks, and never accepts one some draw
does.

### 4. A `<selectFromSequence>`'s pick is an instruction

Its `value` is no longer a leaf holding three numbers. The planner wires
a hidden port `draw`, `Leaf::Scope(ScopeConst::Draw)`, a double in
`[0, 1)` from the high bits of `seeded_stream(scope, key)`, and

```
value: VecOp::SequencePick { n_exclude } over (draw, from, step, to, exclude_1 .. exclude_m)
```

the sequence's `count` from the three parameters, the draw indexed into
it past the excludes, as the JavaScript core's `getSingleIndex` does.
`SequencePick` declares `writes: none`, so the writable walk stops at a
select as it stops at `First`, and it is total: an empty domain gives
NaN, which step 3 guarantees no build meets. When every input is a
constant made in its scope or one around it, the instruction folds (ADR
0028) and the pick is a scope constant as before; when a parameter reads
a sibling scope (another select's pick), it stays an instruction that a
full recompute runs once and the dirty closure never does. In the
template graph the draw is a constant node with no value, as a math
handle's is, and the pick an operator node over it, so the graph's
definition of a pick holds no draw. The draw leaf is a hidden port, never
saved (a constant), and hashed in the input signature by the element's
stable key, which seeds the stream. Two selects with equal parameters are
not merged by sharing (ADR 0033), since their draw leaves are different
cells; leaves are never shared, and that is now load-bearing.

Nothing about this needs a value at expand: the compile–build line does
not move for a value-level parameter.

### 5. `numToSelect` is a document constant, and the build sees a number

`numToSelect` is shape, not value: on `<select>` it decides how many
option templates are stamped. A value needed at expand is a structural
input, and the core's one mechanism for those is the pass loop. This ADR
does not take that step. A `<select>`'s `numToSelect` must be a
**document constant** (not merely constant): the evaluator gives its
number, the check records it beside the ports' attributes in the
template's `Checked` table, one number per choice as the structural
depth is one per document, and `build/expand/choice.rs` reads it where
it reads `ChoiceDef::num_to_select` today. That keeps ADR 0036's line: a
build reads a fact the check recorded, never a node or an edge of the
graph. `numToSelect="$i"` or `numToSelect="$a"` for a pick `a` is refused
as "must be the same in every scope". `numToSelect > 1` on
`<selectFromSequence>` stays unsupported. Weights, `withReplacement`,
`type` and `sortResults` stay literal; `excludeCombinations` stays
unsupported. `numToSelect` leaves outlining, which plans nothing (ADR
0030), and is planned with the choice's `hide` in `plan_choice`; the
drawability check moves to step 3.

So every value a build needs is a number in the compile when the check
is done, as today, and expand, define and emit do not change.

### 6. The invariant

*A load-time choice is a function of the source, the seed and its scope;
nothing a tick writes reaches its parameters.* ADR 0009's consequence
"load-time choice attributes that are not literals" is amended to point
here. ADR 0028's table row for a `<selectFromSequence>` pick becomes "a
fold over its draw and its parameters: the seed and the scope".

## Considered options

- **Keep the parameters literal.** What exists. Rejected: the invariant
  is about what a student can change, and a literal is only one way to
  be unchangeable; `to="$n"` with a constant `n` is as safe as `to="10"`.
- **Totalize the operator and check nothing** (an empty sequence picks
  `from`; an oversized `numToSelect` picks fewer). Rejected: silent, even
  without the NaN, against ADR 0016's "no silent NaN" and ADR 0014's
  reason for existing.
- **Report an empty domain at load, for this seed.** Rejected: a load's
  list would differ from `diagnose`'s (ADR 0013), and the author who
  previews one seed is told nothing.
- **Affine-only ranges.** Allow scope-dependent parameters only as sums
  and differences over scope leaves, which `IndexPlan` already parses,
  with exact ranges and no per-operator rule. The cheaper first step,
  and what the general rule degenerates to. Rejected as the decision:
  authors will write `to="$a * $b"`, and the range column has a second
  consumer, ADR 0017's condition 3 (below), which inspects arbitrary
  operator chains, not index expressions.
- **Record folds in the compile instead of a constancy attribute.** ADR
  0028 phase 5 rejected it: most folds are lowered math's anonymous
  steps no template slot names. The attribute is per port, which is what
  a planner's parameter is, and the graph has a node per such value
  anyway.
- **Allow a counted value over constant counts.** The template graph
  could tell, since it knows which repeats a collection crosses. Rejected
  for now: little use, and ADR 0028's rule is one sentence.
- **Scope-dependent `numToSelect` through structural inputs.** `Counts`
  generalized to per-(scope, node) vectors; pass 0 stamps a select with
  unknown inputs as it stamps a repeat with no count; `structure_settled`
  compares; the depth counts a select's parameter reading inside a repeat
  as a count does; a select reading its own picks is a cycle on the
  structure graph. Sound, and a prefix-stable stream makes the passes
  converge rather than redraw. Deferred: it is the only part that touches
  `settle`, `Counts` and the depth bound, and nothing above needs it.
- **Weights as references.** The draw reads them at expand, so they cost
  the structural-input step for much less use. Deferred with it.

## Consequences

- `<selectFromSequence to="$n"/>`, `to="$a * $b"`, `from="$i"`,
  `exclude="$a"`, and `<select numToSelect="$n">` load when their
  parameters are constants and their domains hold for every draw, and are
  refused with a reason that names the input or the draw otherwise.
- `scalar_ops!` carries a fourth declared property, a range rule, tested
  for soundness like the inverses. Every new operator declares one or
  gets ⊤.
- The check evaluates constants. This is a new capability with two later
  users: ADR 0017's condition 3 ("a new input reads no old essential
  unless its domain holds every value its derivation can produce") is a
  range computation over the operators between an old input and the new
  one, and today is answered conservatively; ADR 0028 phase 6 left the
  pool to grow per build because "the load would have to give every
  template's document constants their values without building them",
  which the evaluator does. Each is a step of its own, so a regression in
  `tests/safe_edits.rs` or the pool's census is attributable.
- `diagnose` evaluates document constants, with an engine, per edit. The
  evaluator walks each constant cell once; on a document of hand-written
  size it is nothing beside the stamping (`docs/load-cost.md` has the
  stamping's cost, and `load-diff.sh` measures the step).
- The planner of `<selectFromSequence>` does no arithmetic: it reads its
  record and wires ports, which is what ADR 0034 made a planner.
- The golden diff changes only by documents that loaded with the
  refusal, which add rather than change values, and by the draw
  (`SequencePick` with a draw leaf and the same stream gives the same
  pick; a test holds every golden pick equal before and after).
- `CONTEXT.md`'s *Load-time choice* says what a choice may read; *Constant*
  gains the pick's new row; a *Range* entry names the evaluator's value.
  `ARCHITECTURE.md`'s Check item lists the evaluator after define.

## Migration

Each step lands alone, with the golden diff unchanged unless it says
otherwise.

1. **`PortAttrs::CONSTANT`, with stable references.** Define over the
   template graph sets it after its walks and records the explaining
   input per writable leaf; nothing reads it yet. Test: at every count
   and seed of every golden document and fixture, nothing a build folds
   is outside the attribute (`tests/every_count.rs`), and a read the
   attribute calls stable never resolves to the missing referent in any
   build of the sweep; `tests/template_graph.rs` gains documents where
   a hold, a gate, a counted value and an unstable read each decide it.
2. **The range column.** `range` in `scalar_ops!` and in the vector
   table, ⊤ where undeclared; the sampling test of its contract. No
   caller.
3. **The evaluator.** `compile/graph/eval.rs`: exact over document
   constants (with an engine of its own), ranges over scope constants, ⊤
   elsewhere. Test: on every golden document, the exact value of every
   document constant equals the cell a load gives it, and every scope
   constant's cell at every seed and count lies in its range.
4. **`<selectFromSequence>` parameters as ports, the pick as
   `SequencePick`**, with literals only: the attribute kinds change, the
   planner loses its checks, step 3 runs the domain check on the exact
   values, the leaf `SequencePick` and the graph's `drawn` go. Test:
   every golden pick is unchanged; `tests/homework.rs` unchanged; the
   spec cost snapshots move by the draw port and the folded instruction
   only.
5. **References allowed**, value-level: the constancy and domain checks
   switched on for `from`, `to`, `step` and `exclude`, with the
   scalar-list kind. Test: `tests/load_errors.rs` gains the document of
   Context (refused), its `to="$a + 3"` form (accepted), `to="10 - $i"`
   (refused), `to="$k"` with `k` dragged (refused, naming the point) and
   with `k` free (accepted); `tests/diagnostics.rs` holds each list equal
   at every seed. The golden diff adds documents.
6. **`<select numToSelect>` as a document constant**, planned in
   `plan_choice`, evaluated into the template's `Checked` table and read
   from there by `expand_choice`. Test: the drawability refusals of
   `tests/choice.rs` unchanged through the new path; `numToSelect="$i"`
   refused with its message.
7. **Docs.** ADR 0009's amendment, ADR 0028's row, `CONTEXT.md`,
   `ARCHITECTURE.md`, and `docs/seeded-selections-over-constants.md`
   marked as superseded by this ADR where they differ.

### As landed

All seven steps landed together. Where the code departs from the text
above, it is here.

- **Where constancy lives.** `PortAttrs::CONSTANT` is set from
  `compile/graph/eval.rs` (`Constants`), after define, rather than inside
  define itself: the stable-reference verdicts need the evaluator's
  ranges (a count's value, an index's), so constancy and evaluation are
  one fixpoint. Each round marks the non-constants from their seeds (a
  given value the writable walk reaches, a counted value, a read whose
  need is unstable) and judges every need over them; a verdict only gets
  worse, so it ends. Define records the explaining input per writable
  leaf (`Defined::written_by`) as its walk reaches it.
- **Holds.** A flag that is not a constant makes a *computed* value not
  one; a value nothing computes (a given leaf no student writes, a
  constant) stays a constant under any hold, as a build's fold rule has
  it. The golden `fixed.doenet` holds a literal `hide` by an input's flag,
  which a build makes a constant: the attribute must mark it.
- **Needs.** A walk records what it needs as it steps (`Need`, `Cond`,
  `Count`), and every read it makes carries the need
  (`TemplateGraph::read_needs`, a hold's flag's read among them). An
  `Iter` step into the reader's own iteration needs nothing; any other
  `Iter` or `Item` step needs its index inside the count; a cell index is
  never proved stable. A need that lands past the count in every build is
  the missing value: a read of it ranges over ⊤, which the domain check
  refuses as "cannot be bounded".
- **Ranges.** `Range` is `program/range.rs`; ⊤ also stands for "may be
  NaN", so a rule that can give NaN from inputs in its ranges gives ⊤
  (`Mul` of an unbounded range by one that holds 0, among others, which
  the sampling test found). The range column is written after the
  inverse in a `scalar_ops!` entry, not before it, so the macro can tell
  it from the inverse's kind. `VecOp::SequencePick`'s rule allows the
  count's `1e-10` past `to`.
- **Scope values the graph holds one value of.** Besides the iteration
  index and the draw (`ScopeLeaf`), a section's number inside a repeat
  or after a select is held by the graph for one iteration or every
  option at once; the evaluator gives it ⊤ (`ScopeLeaf::Varies`), which
  `tests/every_count.rs` found.
- **Select stand-ins.** The graph reads every option of a select without
  the value mattering; the evaluator ranges a stand-in's port over its
  members' (`TemplateGraph::select_reads`).
- **Literal parameters are constants.** A literal `from`, `to`, `step`,
  `exclude` or `<select numToSelect>` is planned as a constant, never a
  given value, so with the classing off (`LoadOptions::classify`) it is no
  essential cell, as a literal `hide` is not.
- **`numToSelect` while planning.** A bare `$s` or `$s.x` names the one
  option a select picks, which planning must know; a literal
  `numToSelect` is still read while outlining for that
  (`ChoiceDef::num_to_select`, now an `Option`), and a reference makes
  such a path an error asking for an index. The drawability check moved
  to the check for every `numToSelect`, literal or not, with its
  messages unchanged; the build reads the number from `Checked::picks`
  (`Plans::num_to_select`), as does the input signature's `Domain`.
- **Messages.** A parameter a student can change is
  `cells-choice-not-constant` ("`<selectFromSequence to="$k">`: a
  load-time choice may read only values no student can change, and
  'k.value' can be changed by a student through 'p'"); a domain that may
  be empty, a step that may be 0, a bound that cannot be bounded and a
  `numToSelect` that differs between scopes are `cells-choice-domain`,
  naming the parameters' ranges ("its sequence can be empty (from is 1,
  step is 1, to is from -2 to 2)") rather than the draws that empty it.
- **Tests.** `tests/load_errors.rs` holds the documents of step 5 and 6,
  and the hold, gate, counted value and unstable read that decide a
  parameter's constancy (through the select's diagnostics rather than in
  `tests/template_graph.rs`), each at eight seeds and against `diagnose`.
  `tests/every_count.rs` checks that every constant a build makes is
  marked (`every_constant_a_build_makes_is_one_the_check_marked`) and lies
  in its evaluated range, exactly for a point
  (`every_constant_lies_in_the_range_the_check_evaluated`), over a new
  construct of picks over constants. It does not separately check that a
  read called stable never resolves to the missing referent. The golden
  diff is unchanged (`programs` differs for `choices.doenet`, whose select
  gained its `numToSelect` port); `program::vector` holds the pick equal
  to the draw it made before, bit for bit.
