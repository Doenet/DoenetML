# Aligning the cells core with the DoenetML principles

A review of the cells core (`packages/cells-core` at `ace73af`, the `cells`
branch) against `docs/principles/` on branch `claude/wizardly-cray-9tas6j`
(`7b76e1f`). The principles distill DoenetML's behavior into tiered rules:
Tier 1 are author guarantees a new core must hold before it ships, Tier 2
consistency invariants it should hold, Tier 3 incidental behavior it may
drop. This document asks two questions of the cells core: where does it
already *embody* a principle, so that nothing needs building, and where
does it depart from one, so that something does. Where a departure also
points at machinery the core could shed, the simplification is named.

Method: the principles (README, the five rule documents, `decisions.md`,
`testing-principles.md`), `ARCHITECTURE.md`, `CONTEXT.md`, ADRs 0009,
0014, 0016, 0017, 0018, 0019 and 0020, the compile (`compile/mod.rs`,
`copies.rs`, `refs.rs`, `fix.rs`, `attrs.rs`, `ctx.rs`, `condition.rs`,
`choice.rs`), the build's resolver (`build/expand/resolve.rs`), the
component definitions, the bridge (`packages/doenetml-worker/src/cells`)
and `CELLS_CORE_PARITY.md`. Claims marked **[probe]** were checked by
loading the document through the crate's Rust DAST builder
(`testing::dast`) and reading cells or sending requests; the probe files
were not kept.

## 1. The short version

The cells core's *data model* is the principles' author model, often more
directly than the current core's: a reference shares cells, so REF-2,
REF-6, SAVE-2 and CTX-7 hold by construction; a repeat stamps a template
per scope, so COMP-7 and D12 hold with no code; choices follow ADR 0009,
which is D13 and D22(b); picks are seeded from stable keys (D17); errors
are boxed elements (D14); a missing referent is one NaN cell (D10). These
should be recorded in `decisions.md` as settled by the cells core, and
the parity report should stop counting the Tier 3 tests they retire.

Three things stand between the core and Tier 1, in order of size:

1. **`copy` does not exist**, and `copy="$x"` is silently ignored: the
   element is built as a fresh default (CPY-1 to CPY-8, **[probe]** §3.1).
2. **The inherited attributes** are missing or incomplete: `fixed` on a
   `<graph>` or `<group>` does not reach its points, and `fixLocation`,
   `draggable`, `disabled` and `styleNumber` are not read at all (CTX-1 to
   CTX-5, **[probe]** §3.3).
3. **An `extend` with its own attributes behaves like a copy**: it
   re-plans the inherited attributes from the referent's source text in
   its own scope, so a `$n` inherited through it binds to the nearest `n`
   where the extend sits (REF-6, **[probe]** §3.2). The same path loses
   inherited values across a scope (`extend="$r[2].P" y="5"`) with no
   diagnostic.

Beside those, six smaller Tier 1 items each take a day or less (§3.4 to
§3.9): a literal `<number>` is a fixed cell, children added inside a
container `extend` are dropped, a `<label>` child on a point is an error,
a bare `$mi` makes a second input, related-type extends are refused, and
list-like content gets no commas.

The one place the core *contradicts* a decision the principles lean
towards is credit (ANS-1 against ADR 0017's "the answer regrades"); that
is D16 and needs a maintainer call, not code first.

## 2. Where the core already is the principle

Nothing in this section needs building. Each row is a place where a
principle, or a decision the principles leave open, is the cells core's
design already. They are worth recording in `decisions.md` and in the
tags of the parity report, so that the tests that pin the *old*
mechanism count as expected failures rather than gaps.

| Principle or decision | How the cells core gives it |
|---|---|
| REF-2 a reference is linked both ways; REF-6 an extend keeps the source's bindings, however deep | A bare `extend` aliases every prop to the referent's cells (`plan_with_extend`, `Source::Inherit`). There is no second state to drift, and no "re-resolve, fall back on failure" path (#1805) |
| SAVE-2 a shadow's state is saved once | Aliased props share one essential cell with one key |
| CTX-7 a reference is fixed when its source is | A `Hold` on the source's slot is upstream of every alias (`tests/fixed.rs` `a_copy_of_a_dynamically_fixed_point_is_fixed`) |
| CTX-1 `fixed` still follows its definition; nothing pushes into it | `Fix::Literal` turns essential literals into fixed cells and holds references and math; forward evaluation is untouched, inverses drop (`compile/fix.rs`) |
| VAL-6 to VAL-8 three attribute forms | `plan_value`: literal, exactly one reference (an alias, so two-way), else math (an operator chain with inverses) |
| VAL-5 and D10 one representation of a missing value | The shared fixed NaN cell (`missing_slot`); `$r[32]` and an index past a list both land there |
| COMP-4 which mechanism built a list is invisible; COMP-7 iterations come back as they were; D12 "state belongs to iteration k" | One mechanism (stamp a template per scope); essential values are keyed by (scope, template slot) and survive a rebuild (`Session`, ADR 0004) |
| COMP-8, VAR-1, D17 selections are made once and survive adding content | Picks are drawn from the seed and the choice's *stable key*, never stored (ADR 0009, ADR 0017 §1) |
| COMP-10 a case keeps its state; COMP-11 and D13/D22(b) the branch interface | ADR 0009: every branch is built, an interface name is a `Choose` over the branches, a flip is a tick |
| NAME-7 and D14 a cycle is a located diagnostic and the rest renders | ADR 0012 and ADR 0013: the probe rejects a loop at any count, the element is boxed |
| NAME-3, REF-8 names inside a copy are private and an unnamed reference adds no names | `push_elem_visible_to(.., stop)` registers a clone's names only up to the copy (`names_resolve_through_containers_and_copies`) |
| NAME-1 nearest match wins, a tie is reported | `Compiler::lookup` walks ancestors, own name first, unique descendant next, several is `AmbiguousName`; reported as `doenet-w0105` **[probe]** |
| INT-2 derived values are never stored; INT-4 rigid drags; INT-5 projection | ADR 0018 (only what a student can write is essential), ADR 0006 (point groups), ADR 0003 (project then write), which is D15's first recommendation |
| SAVE-3 keyed by document, not build order; SAVE-5 indices are not identity; D30 | ADR 0017 stable keys; the bridge numbers elements by stable identity so a rebuild is an update |
| REF-7 an extend of a repeat or select shows the same content | `extend` of a `<select>`, `<conditionalContent>` or `<case>` is `Banned` (ADR 0009); the warning forms w0168/w0169 become load errors, which D4 allows |
| D15 recommendation 5, "say when a binding is one-way" | ADR 0018's classing knows statically which cells an input can reach; the diagnostic is one lookup away |

Two further alignments are vocabulary, and cost nothing:

- **`CONTEXT.md` calls the product of `$p1` or `extend` a "Copy".** In the
  principles and the author docs a *copy* is `copy="$x"`, pasted and
  unlinked, and `$x`/`extend` is a *reference*. The glossary should say
  "reference" and reserve "copy" for `copy=`; otherwise every conversation
  about CPY-1 starts with a definition.
- **`ARCHITECTURE.md` and the ADRs cite `CELLS_CORE_PARITY.md`'s 10.8%.**
  `testing-principles.md` §1 estimates that about 23% of the suite fails
  on coupling alone. Grouping that report by principle id and tier (§5
  below) would give the number the ADRs actually want: Tier 1 passed over
  Tier 1 total.

## 3. Tier 1 departures, with the fix and the simplification

Each entry: the rule, what the core does today, where, the smallest
change that gives the rule, and where that change also removes machinery.

### 3.1 `copy` does not exist (CPY-1 to CPY-8, NAME-4, CTX-9)

**Today.** No code reads a `copy` attribute. `<point name="Q" copy="$P"/>`
loads with no diagnostic and `Q` is a new point at (0, 0) **[probe]**.
`CELLS_CORE_PARITY.md` shows the cost: 0 of 34 in `unlinked copy.test.ts`,
0 of 9 in `unlinked_copy_reload.test.ts`, 0 of 6 in `copy_of_extend.test.ts`.

**Now, before any design:** make an attribute the planner does not read a
load error on the element (`copy`, `fixLocation`, `draggable`,
`disabled`, and anything else the schema lists that the type's planner
ignores). ADR 0016's "no silent NaN" rule already says a combination the
planner cannot honor is a diagnostic, never a wrong value; an attribute it
never looks at is the same case. This one lint turns three of the probes
below from wrong answers into reported gaps. **Done: ADR 0021** records
every attribute lookup and boxes any element with one nothing read, apart
from the attributes a renderer reads (`styleNumber`, `displayDecimals`,
and the like).

**Design that fits the core.** CPY-1 says a copy behaves as the source's
DoenetML pasted in place. The compile already *plans from source text*,
so the paste is a compile-time operation, not a runtime one:

- **Paste at compile.** `copy="$x"` plans x's DAST subtree again as new
  elements under the copy, in the copy's scope, named only beneath the
  copy's name (NAME-3; `push_elem_visible_to` already does this for
  container clones). Attributes written on the copy override (REF-3 by
  the same merge `plan_with_extend` does), children written inside are
  appended (REF-4).
- **References inside the pasted part point into the copy** (CPY-3): the
  copy's elements are planned afresh, so a `$mi` inside them resolves to
  the copy's `mi` by the ordinary lookup. No `remapRefResolutions`.
- **References to things outside** (CPY-6, decision D1): the compile can
  give either answer. Re-planning in the copy's scope is D1(a), today's
  behavior. Planning outside references in the *source's* scope and
  keeping the resulting `RefPlan` is D1(b), the recommended rule, and
  it is the same fix §3.2 needs for `extend`. Pick (b) once, for both.
- **The reader's current state is carried** (CPY-2): the core already has
  the exact primitive, the **seed** (`CONTEXT.md`: "the value an essential
  cell takes when it is first built, read from another cell", used for
  `prefill="$n"`). A copy's essential slots are seeded from the source's
  current cells at the build that first stamps the copy. Through a reload
  the copy's own essential values are saved under its own keys (ADR
  0017), so CPY-2's "keeps that snapshot" holds with none of
  `copySnapshot.js`: no remaking at save time, no `stateId` comparison.
  This is the simplification `references-extend-copy.md` asks for under
  CPY-2 ("keep the behavior and drop the mechanism").
- **Random choices are carried** (CPY-8): a `<select>` inside the pasted
  part is seeded from its stable key; give the pasted select the
  *source's* key for seeding (it is a copy of that select) and a child
  added inside the copy its own key. #2342's two bugs cannot arise.
- **A copy of a reference pastes what the reference points to** (CPY-4):
  resolve the `extend` chain at compile time before pasting, merging each
  link's own attributes on top (D5's generic rule). No
  `attributesDefiningPrimaryValue`.
- **A copy of a property holds a value** (CPY-5): a prop path has no DAST
  to paste; the copy is a value element whose essential slot is seeded
  from the prop's cell and never aliased to it.

What this costs the core: templates grow by the pasted elements, once
per copy at compile; the probe and the cycle check see ordinary
elements. What it removes compared with main: the whole of
`Copy.js`'s serialization path, `remapRefResolutions`, the snapshot
compare at save time, and `copyVariants`.

### 3.2 An `extend` with overrides re-plans the referent's source in its own scope (REF-6, REF-3, NAME-4)

**Today.** `plan_with_extend` gives the planner a `base` node, the
referent's DAST element, and `PlanCtx::attr` reads an attribute from the
element or, when it omits it, from `base`; the value is then planned in
the *extend's* scope (`PlanCtx::scalar_of`, `plan_flag`). So:

```xml
<section name="A"><number name="n">1</number><point name="P" x="$n" y="0"/></section>
<section name="T"><number name="n">2</number>
  <point name="Q" extend="$A.P" y="5"/>   <!-- Q.x is 2; REF-6 says 1 -->
  <point name="R" extend="$A.P"/>         <!-- R.x is 1: a bare extend aliases -->
</section>
```

**[probe]** confirms `Q.x = 2`. The extend has silently become a copy
with D1(a) binding, which is the behavior the principles single out as
the most surprising one in the language. The same path explains two
more probes:

- `<point name="Q" extend="$r[2].P" y="5"/>` gives `Q = (0, 5)` with no
  diagnostic **[probe]**: `plan_elem_target` returns `None` for any path
  with an index or across templates, so `base` is `None` and the planner
  takes its defaults for everything the extend did not write (REF-3:
  "an attribute you don't write comes from x").
- `shared_state`, `Given`, `attr_or_inherited` and the copy rules' unit
  tests exist to re-share the *essential* slots that re-planning would
  otherwise have made private.

**Smallest fix.** When an attribute is inherited from `base`, plan it in
the referent's scope, not the extend's: `plan_elem_target` knows the
referent element, so its `name_scope` is at hand. That alone gives
`Q.x = 1`.

**The simplification.** The principles state an extend as "x itself,
with the changes written on it". In cells that is: *every prop the
extend does not override aliases the referent's slot; every prop it
overrides is planned from the extend's own attribute*. The referent's
slots already hold whatever its planner made of its attributes
(literal, reference, math, constraint), so aliasing a slot is
re-deriving nothing and inherits correctly across scopes and indices,
because expansion resolves the alias per instance (`Arg::Ref`). With
that rule:

- `base: Option<NodeId>` leaves `PlanCtx`; planners read only their own
  element, which is ADR 0016's stated goal ("writable without knowing …
  the probe");
- `shared_state`, `Given`, `attr_or_inherited` and `plan_flag`'s three
  cases go, since "share unless overridden" is now the default for
  every slot, essential or not;
- `plan_extend_prop`'s per-type match (point, number, math, pointList)
  becomes the one rule "the value props alias the named prop" plus the
  type table of §3.8.

The one thing aliasing does not give is REF-10 (Tier 2): `<math
extend="$m" simplify="none"/>` re-reads m's children with its own
`simplify`. The principles name the rule worth keeping, "attributes that
control how the content is read apply to the extend's reading of the
same content". Declare those few attributes on the type (`reads_with {
simplify, splitSymbols }`); only when the extend overrides one of them
is the referent's content re-planned, and then in the referent's scope.

### 3.3 Inherited attributes: `fixed` stops at the element; four attributes are not read (CTX-1 to CTX-5)

**Today.** `plan_fix` reads `fixed` from the element's own node only.

```xml
<graph fixed><point name="P">(1,2)</point></graph>   <!-- P drags; CTX-5 says it does not -->
<group fixed><point name="P">(1,2)</point></group>   <!-- same -->
```

**[probe]** confirms both drags land. `fixLocation`, `draggable`,
`disabled` and `styleNumber` appear nowhere in `src/` (one comment
aside). `<point draggable="false">`, `<section disabled>` and
`<graph styleNumber="2">` are accepted and ignored.

**The fix is one primitive.** `inherited-attributes.md` §5 reduces every
one of these to four parameters: combine (OR or nearest wins), whether
an own setting overrides, what passes through a linked reference (own
attribute or effective value), and whether it protects writes. The
cells core is the easiest place to implement that table, because a
container's chain is static at compile time: an element's ancestors in
its template are its `name_scope` chain up to `ROOT_SCOPE`, and the
template's parent element continues the chain across a repeat or
branch. One function, `inherited(t, e, name, combine)`, folds the chain
into a `Source` (a constant when every link is literal, an `Op::Max`
over flag cells when any is a reference), and:

- `fixed` and `fixAxes` feed `Fix::apply` as they do now; `plan_fix`
  calls `inherited` instead of `d.attr(el, "fixed")`;
- `fixLocation` is the same hold applied only to slots a type marks
  `location` (a new mark in `component!`, beside `interactive` and
  `rendered`: a point's `x`, `y`; a circle's center and radius; a line's
  points). The core already has the per-prop mark pattern, so this is
  data;
- `hide` uses OR with no own-override (CTX-5: nothing inside a hidden
  container can unhide itself). The bridge already drops a hidden
  subtree, which gives the visible result; the fold makes `$x.hidden`
  right too;
- `styleNumber` uses nearest-wins and becomes a cell the bridge reads
  (today it reads literal attributes, so a group's style never reaches
  its points);
- `disabled` uses OR, own overrides, and D8(a) comes free: an extend
  aliases its source's effective `disabled` slot, because that slot is
  what the fold produced;
- `draggable="false"` is not a cell rule but a request rule: refuse a
  request on a location slot when the request is the renderer's drag of
  *that* component. The bridge builds requests from renderer actions
  (`actions.ts`), so it is the natural place, and it matches the
  principles' own note that this belongs "in the writer".

Writes to `fixed` through a reference (D7, B1, B2) cannot go wrong in
this model: a reference has no `fixed` slot of its own to forward a
write to, and the hold is upstream of every alias.

### 3.4 A literal `<number>` is a fixed cell (INT-1, INT-2, ACT-2)

**Today.** `compile/attrs.rs` turns `<number>3</number>` into
`Source::Fixed(3)`, with the comment that the current core cannot change
it by a drag. ADR 0018 records the consequence: "a trigger whose target
is a literal `<number>` sets nothing". But INT-1's own Tier 1 example is
this document:

```xml
<number name="n">3</number><mathInput bindValueTo="$n"/>   <!-- type 5: n = 5 -->
```

**[probe]** the typed value is dropped and `n` stays 3; so does an
`<updateValue target="$n" newValue="7"/>` (ACT-2), and `<number
name="n">3</number>` under `<point>($n, 0)</point>` cannot be dragged.

**Fix (done 2026-10-29).** Plan it as `Source::Literal(3)`, like a point's literal
coordinate. ADR 0018's classing then decides, per template slot and from
the source alone, whether anything a student does can reach it; a
literal nothing reaches stays a fixed cell, so the golden documents'
cell counts move only where an input or action actually binds a number.
The special case, the ADR's "named gap" and the viewer tests that
target a `<boolean>` instead of a `<number>` all go.

### 3.5 Children written inside a container `extend` are dropped (REF-4, REF-4a)

**Today.** `plan_container_copy` replaces the element's children with
clones of the referent's. The element's own children were planned by
`add_elem_inner` and are then orphaned, silently:

```xml
<p name="p">a<text name="t">x</text></p>
<p name="pe" extend="$p">b</p>    <!-- shows "ax"; REF-4 says "axb" -->
```

**[probe]** `pe` renders `ax`, no diagnostic.

**Fix.** Append the planned own children after the clones. REF-4a (of a
single-use child the last one wins, so a `<label>` or `<title>` added
inside an extend replaces the source's) then follows if the bridge's
`label()` and the section-title contract take the *last* such child;
today `labelChildren` takes the first, which is the `<table>`/`<figure>`
accident D25 proposes to remove.

### 3.6 A `<label>` child on a point is an error; references carry no label (CTX-11, REF-4a)

**Today.** The point planner treats every element child that is not
`<constraints>` as a constraint:

```xml
<graph><point name="P">(1,2)<label>A</label></point><point extend="$P"/></graph>
```

**[probe]** loads with `cells-unsupported: <label> constraint`; `P` is
boxed, so `$P` is then "unknown reference" and both points vanish.
Labels on points are in most graphs in the docs. Beyond the crash, the
bridge reads a label from the component's own `<label>` children or
`label` attribute, so a reference to a labelled point (the common `$P`
in a second graph) has none, against CTX-11 rule 5.

**Fix.** Planners skip presentational children (`<label>`,
`<shortDescription>`) by one shared predicate, as `is_blank` skips
whitespace. For CTX-11 and for VAL-4/CTX-10 (display settings travel
with a value), add one column to the `ComponentTable`: the component a
reference stands for (`referent`). The bridge then reads a
presentational attribute as "own, else the referent's, else the
default", which is CTX-8 and CTX-11 stated once, and also fixes
`displayDecimals` on `$n`, which today is lost because the anonymous
number has no literal attributes of its own (`contracts.ts`,
`formatNumber(.., table.attr(c, "displayDecimals"))`).

### 3.7 A bare reference to an input makes a second input (REF-1a, D21)

**Today.** `<mathInput name="mi"/><p>$mi</p>` makes a `mathInput` in
the paragraph **[probe]**; REF-1a says `$mi` is the math the reader
entered, and `<mathInput extend="$mi"/>` is how to ask for a second box.
Authors rely on this everywhere feedback shows "you entered $mi".

**Fix.** D21 asks that the rule be "a declared, schema-visible property
of the class". The cells core already keys behavior on declarations:
add `implicit_prop: value` to the input types' `component!` blocks (and
`answer`, `award`, `choice` if D21 keeps them), and let a macro child
whose referent type declares one, and which names no type of its own,
become a value element of that prop. That is the one table the docs and
the core then share.

### 3.8 A related-type `extend` is refused (REF-5, D26)

**Today.** The build raises `ExtendTypeMismatch` whenever the referent's
type differs from the element's: `<math extend="$n"/>` of a number,
`<text extend="$n"/>`, `<mathInput extend="$m"/>` of a math all fail
**[probe]**. For an *unrelated* pair that is exactly D26's rule, and
better than main's silent default. For the related pairs it is a gap.

**Fix.** Declare D26's table once (math, number, text and boolean among
each other; point, vector and coords; an input from its value type and
back; a list from the matching scalar or list) and let `plan_extend_prop`
read it: the element's value props alias the referent's default prop,
through the conversion operator where one is needed (number to text is
a format, text to math a parse). Nothing else in the core changes, and
the error message for the rest can quote D26's wording.

### 3.9 List-like content gets no commas (COMP-2)

**Today.** The bridge splices a repeat's, collect's or select's content
into its parent (`TRANSPARENT`) with no separators; neither `asList` nor
a comma appears in the bridge. COMP-2 is Tier 1 for the defaults: the
items of a repeat, select, collect or list are comma-separated in text,
on screen and inside `<math>`, and `<group>` is not a list unless
`asList`.

**Fix.** The prototype's FlatDast already uses `compositeLists.ts` in
`@doenet/utils` for this; the bridge should call the same helper where
it splices, so that the sub-rules (innermost decides, an inner list is
one item, hidden items skipped) are one implementation across cores.

### 3.10 A live index is refused (NAME-2)

**Today.** `$r[$i]` is accepted only when `i` is an iteration index name
(`plan_index`); any other index, such as a `<numberInput name="i"/>`,
is `cells-dynamic-index` **[probe]**. NAME-2 says an index is read live
and rounded, and `value_references.test.ts:286` pins it.

**Fix, within ADR 0012.** The core already has the shape it needs: a
branch interface name is a `Choose` operator over every branch's cells.
A dynamic index into a repeat (capped, as every repeat is) is a
`Choose` over the stamped iterations' cells, selected by the rounded
index cell, with the missing NaN past the end. The probe labels it as
reading every iteration, which keeps the cycle check conservative, and
no rebuild is involved. Dynamic indices into lists (`$l[$i]`) fall out
the same way.

### 3.11 Credit is derived, not recorded (ANS-1, D16)

**Today.** `build/expand/scoring.rs` wires `credit` from the live
`checked` of `submitted` against the current award, and ADR 0017 states
the consequence as a feature ("the answer regrades"). ANS-1 says credit
records the last submission and only "just submitted" turns false when
what is correct changes; gradebooks depend on that, and it is Tier 1 in
effect.

**What to do.** This is a decision (D16) before it is code. If D16 keeps
credit as a record, the cells change is small and local: `credit`
becomes a `written_by_action` essential cell that `Document::submit`
writes from the live comparison at submit time, and `justSubmitted` is
the derived cell. It would then be saved (it is a value a student's
action wrote, which is ADR 0018's definition of essential), and the
safe-edit check (ADR 0017) would carry it over unchanged.

## 4. Smaller alignments, Tier 2 and reporting

- **Ambiguity and duplicate names.** An ambiguous `$n` becomes an
  `_error` element with `doenet-w0105` as an *error* **[probe]**; NAME-1
  says a warning and nothing shown. Two siblings with one name fail the
  element (`cells-duplicate-name`) **[probe]**, where NAME-1 only makes
  *references* to them ambiguous. Both are the same small change:
  register the duplicate as `AMBIGUOUS`, keep the elements, and box
  only the references, at warning level.
- **`<p extend>` of a non-container** (`<p extend="$m"/>`) is refused as
  a type mismatch; D26 agrees it should be, with a message that says to
  write `<p>$m</p>`.
- **CTX-6 generated values are fixed by default.** A repeat's
  `valueName` is `SequenceValue` with a computed chain, so it is already
  not writable; `fixed="false"` on the repeat (the opt-in main gives) has
  no meaning here yet. Decide whether to keep the opt-in; if so it is an
  essential slot seeded from the sequence value.
- **REF-9 and ACT-4** (a named extend is its own click target and
  carries no triggers) are bridge-level identity questions; nothing in
  the core contradicts them, and nothing tests them.
- **Testing.** `testing-principles.md` proposes a black-box API any core
  can implement and native Vitest tags per principle id. Two things the
  cells side can do now: tag `spec!` cases and the `tests/*.rs` cases
  that pin a rule with its id in the case name (`"REF-3: an attribute on
  an extend replaces the source's"`), and have `scripts/cells-parity.mjs`
  print a table by principle id and tier before its table by gap, with
  `changed:` marks for the tests ADR 0009 and the decisions above retire.
  `CELLS_CORE_PARITY.md` then answers "does the core hold Tier 1?" rather
  than "how many of 5,302".
- **Tier 3 tests the core should not chase.** The documents list them;
  the ones the parity report currently counts against the core are the
  census and `_ref` assertions, `core.core.*` reads (about 1,119 tests),
  the saved-state key formats, the blocker and freshness unit tests, and
  the reuse-versus-rebuild heuristics. None describes a behavior an
  author can see.

## 5. Feedback to the principles documents

Three places where the cells core gives a cleaner answer than the
decision text assumes, which the principles branch could adopt:

- **D13 and D22.** ADR 0009 is option (b) with one refinement: the
  single-case `<conditionalContent condition>` exposes nothing because
  its implicit else is empty. If (c) is chosen instead (names visible
  like a group's), the cells build already has the per-branch `Choose`
  and needs only the resolver to treat sibling cases as exclusive.
- **D14.** "Every cycle is an error on the authored component, and the
  rest renders" is exactly ADR 0012 plus ADR 0013; the decision can be
  marked settled for the new core.
- **D17.** Seeding from (seed, stable key) is implemented; the principles
  can record that unique-variant enumeration becomes best-effort.
- **D1 and D28.** The cells compile can resolve outside references
  before pasting (D1(b)) at no runtime cost, which the decision text
  guessed ("a core that compiles source text can implement (b)
  cheaply"). D28(c), freezing outside references in a copy, is the same
  seed mechanism as CPY-2 and is therefore also cheap, so the choice
  between D1(b) and D28(c) is purely an author-model question.
- **NAME-2 versus ADR 0012.** The principles should say that a live
  index reads "every item it could name" for the purpose of cycle
  detection; that is the cost of keeping NAME-7's guarantee at every
  count.

## 6. Suggested order

Tier 1 first, smallest reversible step first:

1. **Done (ADR 0021).** Refuse attributes a planner never reads
   (`copy`, `fixLocation`, `draggable`, `disabled`, and `hide` or `fixed`
   on a type whose planner ignores them) with a diagnostic on the
   element. Stops the silent wrong answers in §3.1 and §3.3; `styleNumber`
   and the other attributes a renderer reads stay accepted.
2. **Done.** Literal `<number>` as `Source::Literal` (§3.4), classed by
   ADR 0018's walk like every other literal.
3. The inherited-attribute primitive, starting with `fixed` from
   containers, then `fixLocation`, `disabled`, `styleNumber`, `hide`
   (§3.3); the `location` mark on props.
4. Inherited attributes planned in the referent's scope (§3.2 small
   fix), then the alias-based inheritance that removes `base`,
   `shared_state` and `Given`.
5. Own children appended on a container extend; presentational
   children skipped by planners; the `referent` column, and labels and
   display settings read through it (§3.5, §3.6).
6. `implicit_prop` on inputs (§3.7); the D26 conversion table (§3.8);
   commas in the bridge (§3.9).
7. `copy` as paste-at-compile with seeds (§3.1), after D1 is decided.
8. Dynamic indices as `Choose` (§3.10); credit as a record once D16 is
   decided (§3.11).
9. Principle ids on specs and the parity report by principle (§4).

## Appendix: the probes

Each was loaded through `cells_core::testing::dast` (classing and
pruning off) at `ace73af`; requests went through `Document::request`
unless noted.

| Rule | Document | Result |
|---|---|---|
| CPY-1 | `<point name="P">(1,2)</point><point name="Q" copy="$P"/>` | no diagnostic; `Q` = (0, 0) |
| REF-6 | `A{n=1, P x="$n"}`, `T{n=2, Q extend="$A.P" y="5", R extend="$A.P"}` | `Q.x` = 2, `R.x` = 1 |
| REF-3 | `<repeatForSequence name="r" …><point name="P" x="$v" y="0"/></…><point name="Q" extend="$r[2].P" y="5"/>` | no diagnostic; `Q` = (0, 5) |
| CTX-5 | `<graph fixed><point name="P">(1,2)</point></graph>`, and `<group fixed>` | drag lands, `P.x` = 9 |
| INT-1 | `<number name="n">3</number><mathInput bindValueTo="$n"/>`, type 5 | dropped; `n` is a fixed cell; an unchecked write is dropped too |
| REF-4 | `<p name="p">a<text name="t">x</text></p><p name="pe" extend="$p">b</p>` | `pe` renders `ax` |
| CTX-11 | `<point name="P">(1,2)<label>A</label></point><point extend="$P"/>` | `<label> constraint` error; both points boxed |
| REF-1a | `<mathInput name="mi"/><p>$mi</p>` | the paragraph holds a `mathInput` |
| REF-5 | `<math extend="$n"/>`, `<text extend="$n"/>`, `<mathInput extend="$m"/>` | `cells-extend-type-mismatch` for each |
| NAME-2 | `<numberInput name="i" value="2"/>… $r[$i].n` | `cells-dynamic-index` |
| NAME-1 | two sections each with `n`, then `<p>$n</p>` outside | `doenet-w0105` as an error; the `$n` is an `_error` element |
| NAME-1 | two sibling `<number name="x">` | `cells-duplicate-name`; the elements are boxed |
| REF-2, REF-3 | `<point name="P">(1,2)</point><point name="Q" extend="$P" y="7"/>`, drag Q | `Q.x` writes `P.x`; `Q.y` stays Q's |
| NAME-3 | `S{h}`, `S2 extend="$S"`, `<p>$h $S2.h</p>` | both resolve, no ambiguity |
| INT-1 | `<number name="m">$ni</number><mathInput bindValueTo="$m"/>` | writes through to `ni` |
