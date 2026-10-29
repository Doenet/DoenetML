# Decisions: inconsistencies and proposed rules

Each entry below is a place where current behavior does not follow a clean principle. Each gives:
- the behavior, with a concrete document;
- the options;
- a recommendation;
- the tests that would change.

Entries are in priority order, judged by how much each one affects (a) what authors can be told
and (b) how much special-case code a new core would need to reproduce it.

The first section lists defects that need no decision. Paths: `T/` is
`packages/doenetml-worker-javascript/src/test/` and `W/` is
`packages/doenetml-worker-javascript/src/`.

---

## Defects found during the survey (no principle question)

| # | Defect | Probe | Where |
|---|---|---|---|
| B1 | `<math extend="$m" fixed="false"/>` of a fixed `m` lets a bound input change `m` (also for `<number>` and `<text>`). For points and inputs the same write is refused. | `m` becomes 5. Confirmed twice | The check "a shadow source is fixed" exists only on the `setEssentialValue` path (`W/core/EssentialValueWriter.ts:1200-1222`). A literal child is written through `setDependency`, which does not re-check |
| B2 | A write to `$Q.fixed`, where Q extends a point inside `<graph fixed>`, unfixes the source, which can then be dragged (#2197, open) | reproduces | `W/utils/contextAttribute.js:206-258` forwards the write |
| B3 | One-input math operators report `canBeModified` from the wrong variable. `<sign>$n</sign>` claims it can be changed, but a bound input snaps back | yes | `W/components/abstract/MathBaseOperatorOneInput.js:94-97` reads `mathOperator` rather than `inverseMathOperator` |
| B4 | `copy="$r[2].p"` of repeat content that shows `$i`, or a copy landing in a repeat whose `valueName` matches an outside name, shows `＿` **with no warning**. The `extend` form works | yes | `resolvesIntoOwnAncestry` (`W/core/dependencies/refResolutionDependencies.ts:320`). An unlinked copy has no shadows chain to fall back on |
| B5 | Attributes on a copy or extend of a composite are mishandled: `condition` on a copy of a conditionalContent is ignored (#2217), `valueName` on a copy of a repeat misreads (#2211), and `maxNumber` on an extend of a collect blanks it (#2215) | #2217 confirmed | `W/components/abstract/Copy.js` |
| B6 | An index into a composite of references (`$g[1]` with `<group name="g">$x</group>`) can panic the resolver (#1942). Under D27 this form becomes an error, but the panic should be fixed meanwhile | — | `ref_expand.rs` |
| B7 | `doNotExpandAsShadowed` is read in four places but set by no component | — | `W/core/CompositeExpander.ts:338`, `CompositeReplacementUpdater.ts:125`, `:1650`, `ComponentLifecycle.ts:177` |
| B8 | **Fixed by #2344.** A `<group copy>` drew new random values for nested content, and a random child added to it repeated the source's first draw (#2342). Both broke CPY-8 | fixed on main, variants 1–3 | `copyVariants` in `W/components/abstract/Copy.js`; the group was serialized before its inner content expanded |
| B9 | A reference that reaches a list copy through a repeat index or a `<conditionalContent>` case renders empty, where the `<p>` form works: `$r[1].d.h` from outside a repeat (also after a reload, for iterations made at load), and `$cc.d.h` after the case switches (#2371). It breaks NAME-2 | reported in the issue | `RefResolutionDependency` waits for a list copy's `_copy` only when the path's first resolved node is the list copy itself (`W/core/dependencies/refResolutionDependencies.ts`) |
| B10 | `$e.h` names nothing for a list extend `<mathList name="e" extend="$l"/>`, while `$E.h` resolves for `<p name="E" extend="$P"/>`. It breaks REF-8. Predates #2367 | reported in #2367's review | a linked list extend has no children of its own |
| B11 | A `copy` of a `<select>` with a different `numToSelect` makes the whole document fail to load ("Number of indices specified for select must match number to select"). The same on a `<selectFromSequence>` shows nothing, with that error | `<select copy="$x" numToSelect="4"/>` of a 2-pick select | the copy is given its source's picks (CPY-8), which no longer fit (D32) |
| B12 | Warnings on an extend of a tag that makes its own content are inconsistent. A child written inside `<shuffle extend>` is ignored with no warning. A bare `<conditionalContent extend="$x"/>` warns that its children are ignored, though none are written | yes | `W/components/abstract/Copy.js:4364-4446` (D32 makes both an error) |

B1 and B2 both break the Tier 1 promise of CTX-1, "a fixed component cannot be changed by any
interaction". They should be fixed on main whatever happens to the rewrite.

---

## D1. Should a copy re-bind names outside the copied part where it lands? (affects the author model)

**Today.** A copy is pasted DoenetML, so a `$n` inside it that pointed *outside* the copied part
is resolved again where the copy lands. A nearer `n` there captures it, and two equally near `n`s
make it ambiguous. An `extend` keeps the source's binding.

```xml
<section name="A"><number name="n">1</number><group name="g"><p>$n</p></group></section>
<section name="T"><number name="n">2</number><group copy="$A.g"/></section>  <!-- 2 -->
<section name="U"><group copy="$A.g"/></section>                            <!-- ambiguous: empty -->
```

**Options.**
- **(a) Paste, as today.** It matches "copy = paste" literally, and is the cheapest to implement
  in a core that expands source text. Its costs:
  - an innocent-looking copy can break or silently change meaning because of names that happen
    to exist near where it lands;
  - copy and extend disagree on the same subtree;
  - B4 has no good answer: pasted, `$i` should not resolve at all.
- **(b) Lexical for outside references.**
  - A reference whose referent was *inside* the copied part points to the copy's counterpart, as
    today.
  - A reference whose referent was *outside* keeps that referent.
  - Copy and extend then agree on outside references, the ambiguity failures disappear, B4
    resolves to the iteration's value, and the #1805 fallback becomes unnecessary for copies.
  - The author statement becomes "a copy is the source's DoenetML pasted here, with its names
    still meaning what they meant in the source".

**Recommendation: (b).** Authors copy a problem to reuse it, not to have it re-interpreted by
whatever is nearby. A core that compiles source text can implement (b) cheaply by resolving
references *before* pasting, which is what the Rust resolver already does for the source.

**Tests that change.**
- `T/copying/extend_references.test.ts:7807` "attribute inherited by a copy of a copy resolves
  where that copy is written". That test was added recently and on purpose, so this decision
  should be taken explicitly.
- Copy-of-module re-binding, which is untested.

**Tests to add.** Both outcomes: capture, ambiguity, and repeat-iteration content.

## D2. Which of the source's current state does a copy carry?

**Today.** A copy starts from the source's current reader state (CPY-2). How much of that state
depends on how it is stored:

| Reader's write on the source | Carried into a copy made later? | Test |
|---|---|---|
| a literal `hide` or `expand` | yes, also through a reload | `unlinked_copy_reload.test.ts:469`, `attribute_values.test.ts:690`, `:820` |
| `fixed` or `fixLocation` | **no** ("the write is not written DoenetML") | `context_attributes.test.ts:594` |
| a number written as text in a repeat iteration (`xMin`) | **no** | `attribute_values.test.ts:690` |

The two stated rationales contradict each other.

**Recommendation.** "A copy is the source's DoenetML pasted, starting from all of the source's
current reader state." That means everything the reader changed, attributes included. This is the
snapshot idiom authors already use, and it is one rule with no per-storage cases. It changes
`context_attributes.test.ts:594` and the `xMin` half of `attribute_values.test.ts:690`.

The alternative, "a copy is only the written DoenetML, and no reader state is carried", would
remove the snapshot idiom (CPY-2). That is Tier 1, so do not take it.

## D3. A copy of an authored value list is its DoenetML pasted (done, #2367)

**Before #2367**, `<mathList copy="$ml"/>` of `<mathList name="ml">$mi 2</mathList>` held the
values the list had when the copy was made (`serializeUnlinkedAsValues`). It did not follow `mi`,
and its named entries could not be reached through it. The same list inside a copied `<p>` did
follow `mi`.

**Now** a copy of any authored list (`mathList`, `numberList`, `textList`, `booleanList`,
`intervalList`, `tupleList`, `pointList`, `vectorList`) is its DoenetML pasted, as for any other
component (CPY-1):
- references in the list stay live (CPY-3);
- named children are reached through the copy (`$c.h`, NAME-3);
- a copy made after the reader changed the list starts from its current values, and keeps them
  through a reload (CPY-2).

The value-copy path is removed.

**A copy of an extend of a list** pastes what the extend points to (CPY-4), not the linked
`_copy` inside the extend (`pasteWhatListExtends`):
- an extend of a whole component (a list, a `<repeat>`, a math) is pasted as that component's
  DoenetML, so it follows that component's references without being linked to it;
- an extend of a property holds its values (CPY-5).

**Left as is, noted in #2367:**
- `<mathList copy="$r"/>` written directly on a `<repeat>` stays linked to the repeat, through
  the repeat's groups.
- Two lists that copy each other, or a list that extends itself, fail to load with a
  circular-dependency error (D14).
- References into a list copy through a repeat index or a case render empty (B9, #2371).
- A list `extend` does not reach its children by name (B10).

## D4. Children and attributes on an `extend` or `copy` of a composite

**Today:**
- Children inside an extend of a repeat, select or sequence are dropped with w0169.
- Group and module append them.
- A copy of a repeat adds them to *every iteration* (#2212).
- Non-composites append them.
- Attributes on a copy are applied for `to` on a repeat, but not for `condition` on a
  conditionalContent (B5).

**Recommendation.**
- **An extend of a composite:** it shows the source's content, and both content attributes and
  children are ignored with a warning (REF-7, as today). Group and module stay as they are,
  because their "content" is their children.
- **A copy of a composite:** the source's DoenetML is pasted, and the copy's attributes override
  it. Children written inside are appended after the whole composite, not to each iteration.
  Adding to each iteration surprises authors, and a repeat's template is not a list of children.

If per-iteration addition is wanted, it deserves its own syntax.

**Tests that change:** `T/tagSpecific/repeat.test.ts:623`, `repeatForSequence.test.ts:1491`,
`:1523`.

## D5. Do a "copy of an extend" generically

**Today.** A copy of an extend pastes the referent's DoenetML (CPY-4) through
`serializeShadowedAttributes` plus `copyPrimaryEssentialIfShadow`. Whether the copy stays live
then depends on where the class keeps its definition:
- in its children: live;
- in an attribute listed in `attributesDefiningPrimaryValue` (only point and vector `xs`): live;
- anywhere else: frozen.

Attributes written on a copy of an extend do not reach the copy's descendants (the TODO at
`T/copying/unlinked copy.test.ts:1967-2002`).

**Recommendation.** Resolve `copy="$r"` to the DoenetML of r's source, with r's written
attributes merged on top, and paste that. Freeze a value only when there is no DoenetML (props
and entries). This removes the per-class list and the `essentialVarName` keying bugs (#2199). It
also brings the line and curve classes that #2258 and #2263 moved into expression attributes into
line.

**Tests.** `copy_of_extend.test.ts` keeps passing. The commented-out `styleNumber` assertion can
then be restored.

## D6. Where does a reference written in or on a copy tag resolve?

**Today:**

| Written | Resolves from |
|---|---|
| an attribute on `copy`, `extend` or `<module copy>` | the element's parent, skipping the copied content (#2039) |
| a child added inside the copy | inside the copy, so it sees the copied content |
| an attribute on an ordinary element | the element itself, so it sees its own descendants |
| an attribute on a module's *own definition* | the module's parent, giving an "ambiguous" warning (`module.test.ts:1857`) |

**Recommendation.** Keep the ordinary-element rule. For copy tags, use one rule:
- "attributes written on a copy tag see outside the copy";
- "children added inside it see the copied content".

Both follow from where the text sits relative to the copied content: attributes are about the
copy as a whole, while added children sit inside it. Give the module-definition case a dedicated
diagnostic ("an attribute of a module cannot refer to its own `moduleAttributes`") instead of
"Multiple referents".

**Tests:** `module.test.ts:1857` changes its message only.

## D7. `fixed` through linked references

**Today:**
- A linked reference with its own `fixed="false"` reports `fixed=false`, but every write is
  refused at its fixed source (`baseComponentProperties.test.ts:370`).
- B1 and B2 above.
- The writer checks `fixed` and `fixLocation` through two different walks over shadow sources
  (`EssentialValueWriter.ts:822-845` versus `:1195-1210`).

**Recommendation.** One rule, checked at one place:

> A write to a stored value is refused if the component that owns that value, or any component
> it is linked through, is fixed.

On a *linked* reference, `fixed` can only add fixing: its effective value is its own value OR its
source's effective value. A reader's write to a reference's `fixed` stays on the reference.

**Tests that change:**
- `context_attributes.test.ts:152` (`d` becomes true);
- `baseComponentProperties.test.ts:370`;
- `point.test.ts:6433`;
- `context_attributes.test.ts:268`, which no longer forwards the write.

## D8. What `disabled` protects

**Today.**
- An extend of an input disabled by its `<section disabled>` is enabled, and typing into it
  changes the disabled input (**[probe]**). An extend of a point fixed by its graph is fixed.
- `disabled` is accepted everywhere but read by about 20 classes, so `<point disabled>` still
  drags.
- A `fixed` input looks enabled and silently snaps back.

**Options.**
- **(a)** Give `disabled` the `fixed` context rule (CTX-7): a reference to a disabled input is
  disabled.
- **(b)** Declare `disabled` a widget-only flag that protects no values.

**Recommendation.**
- **(a).** Authors who disable a section expect its inputs to be unusable everywhere.
- Remove `disabled` from the schema of classes that ignore it, as #1170 did for
  subsetOfRealsInput. Alternatively, define it on graphical objects as "the reader cannot
  interact".
- Render inputs as disabled when they are `disabled || fixed`.

**Tests:** `baseComponentProperties.test.ts:1000` changes. Add tests for the extend case.

## D9. Is a reference to a hidden component hidden?

**Today** the answer depends on what is hidden, and how it is referenced (**[probe]**, and #2265):

| Hidden source | Bare `$x` elsewhere | `<T extend="$x"/>` elsewhere |
|---|---|---|
| a plain component: `<text hide>`, `<number hide>`, `<point hide>`, … | hidden | hidden |
| a list: `<mathList hide>`, `<sequence hide>`, `<sort hide>` | **shown** | hidden |
| `<collect hide>` | hidden | hidden |
| `<group hide>`, `<repeat hide>` | **shown** | — |
| `<select hide>`, `<conditionalContent hide>` | **shown** | — |

For lists the split is deliberate. `hideIsOwn` (`W/components/abstract/ValueListComponent.js:389`)
treats a list's `hide` as hiding only the list where it is written. That mirrors how a hidden
composite's replacements were never hidden by the composite's `hide`. It supports an old idiom:
define a hidden `<select>`, `<sequence>` or list, and show it elsewhere with `$s`. Today
`<setup>` serves that purpose. Two tests say the select case "encodes undesired behavior (see
issue #246)", at `select.test.ts:2493` and `conditionalcontent.test.ts:1213`.

`collect` is now the only list special-cased here. A bare `$c` of `<collect hide>` used to be
hidden only because the collect pushed its `hide` into every entry. D29 rule 1 removed that in
#2368, which kept this row with a flag of its own (`listHiddenWithReferences`). Either option below
removes the flag: under (a) every hidden list hides its references, and under (b) none does.

**Options.**
- **(a) A reference to a hidden component is hidden, unless the reference sets `hide` itself.**
  This matches REF-1's "`$x` is x itself". Documents that hide a definition and show it
  elsewhere must move the definition into `<setup>`. Give a migration warning first: "`$s`
  refers to a hidden `<select>`; it will be hidden too — move the select into `<setup>`".
- **(b) `hide` hides a component only where it is written; references are shown unless they set
  `hide` themselves.** This is what lists and composites do today. It would reverse the rule for
  plain components, including the recent `drawn_value_references.test.ts:183` ("hidden with
  it").

**Recommendation: (a).** One rule, and the one that follows from "a reference is the thing
itself". `<setup>` is the stated way to define without showing. The cost is the migration
above. Both options are simpler than today's split.

**Tests that change under (a):**
- `select.test.ts:2493`, `:2545`, `:2636`, `:2727`;
- `conditionalcontent.test.ts:1213`;
- the bare-reference-to-a-hidden-list tests in `listcomponents.test.ts` (about `:275`);
- `repeat.test.ts:1459`, `sequence.test.ts:1210`, and the group tests that reference a hidden
  group;
- any tests that rely on `collect`'s `hide` reaching its entries' `.hide`.

Whether hidden *entries* inside a list are drawn is a separate question, D29.

## D10. One way to show a missing value

**Today** (VAL-5) a missing reference shows as `[]`, `[NaN]`, `＿`, `NaN`, `""` or `[＿, ＿]`,
depending on the parent and on the spelling.

**Recommendation.** "A missing reference is the empty value of the type it presents as. A drawn
one draws nothing. Operators and comparisons treat it as blank, and blank never equals blank."

Keep the answer semantics (Tier 1). Accept changes to the display assertions:
- `drawn_value_references.test.ts:234`;
- `extend_references.test.ts:4790-4830`, `:7507-7616`;
- `expressionAttributes.test.ts:400`.

## D11. When is a reference its value, and when is it the referent?

**Today.** Hard-coded lists decide (VAL-3):
- only number, math, text and boolean values become value references;
- graph, inputs and slider keep copies;
- points always copy.

`<collect>` finds `$n` in a `<p>` but not inside a `<math>`.

**Recommendation.** One stated rule: "a reference is its value where its parent reads or draws a
value, and the referent itself where its parent takes components". Under that rule `<collect>`
never finds references, only the components they stand for, once each. Changes:
`value_references.test.ts:987`, `drawn_value_references.test.ts:262`, `:293`.

## D12. Iteration state belongs to iteration k

**Today** (COMP-7) reader state stays with an iteration's position, except when `exclude` changes
or component sources change identity. In those cases everything is rebuilt and the reader's work
is lost.

**Recommendation.** Make "reader state belongs to iteration k" the rule. No test pins the loss.
The cells core gives this for free, and it deletes most of `Repeat.js:440-686` and the exclude
rebuild.

## D13. Accept ADR 0009's branch interface for choices?

This goes together with D22, which asks how names inside a `conditionalContent` should work
at all.

**Proposed rule:** "A name is visible outside a `select` or `conditionalContent` only if every
branch declares it, with the same type."

It bans, in order of how often documents use them:
- `extend` of a select, conditionalContent or case. ADR 0009 gives no reason for these three in
  particular. D32 replaces this item with a principle that covers every tag that makes its own
  content;
- names present in only some branches;
- type-varying names;
- positional references into options (`$s[2][1]`), which D27 generalizes.

ADR 0009 also bans a non-literal `numToSelect`. That is **not accepted**: a reference there is read
once, when the choice is made, and is part of DoenetML. The cells core should eventually support
it, and main's tests of it stay binding (COMP-8).

**Recommendation.** Accept the rule. It is easy to state, and the alternative is visibly broken
output: `<math>$cc.x+1</math>` becomes `h i + 1` when a branch switches type.

Before the cut-over, add **warnings on main** for the banned forms so that existing documents can
migrate. Mark the affected tests "changed" (listed in
[composites-and-lists.md](composites-and-lists.md) §6). PR #2281 already has rewritten versions.

Positional double indexing into *repeats* (`$a[2][1][3]`) exposes the same hidden grouping. D27
proposes removing child indexing everywhere, not only for choices.

## D14. Cycles are always a located diagnostic, and the rest of the document still renders

**Today:**
- Composite cycles give a diagnostic, and the document loads.
- State-variable cycles throw. The document fails to load, and the message can name an internal
  `<_copy>`.
- Since #2148, `<number name="i">$l[$i]</number>` stops the document. It used to give `NaN` with
  a diagnostic.

**Recommendation.** Every cycle is an error on the authored component, and the rest renders.
This is also the direction of ADRs 0013 and 0014.

**Tests that change:** the `rejects.toThrow` assertions in
`T/diagnostics/circularReferences.test.ts:27-67`, `:722`, `:755`, and
`value_references.test.ts:596`.

## D15. Make inversion uniform, and say when it fails

**Problems found** (**[probe]** for each):
- The projection operators behave differently from each other (INT-5).
- One request that writes one source twice keeps the *first* value for a dragged point
  `($a,$a)` but the *last* for a typed math `($a,$a)`.
- Text and boolean barely invert: `<text>Hello $t</text>` and `not $b` snap back.
- `<number>` accepts "x" as NaN, while `<integer>` refuses 2.6.
- Failed inverses, including writes dropped by a boolean expression attribute, are silent.

**Recommendations:**
1. Every idempotent operator projects, then writes the projected value (ADR 0003).
2. When one request writes one source twice, the later write wins (ADR 0006). Today no test pins
   either choice.
3. State "math and number invert through `+ − × ÷` by constants; text and boolean invert only
   through identity". Optionally add `not` and constant affixes later.
4. `<number>` refuses a non-numeric request.
5. Add a load-time info diagnostic, "this `bindValueTo` target cannot be changed", wherever a
   binding is statically one-way.

## D16. Is credit a record of the submission, or derived?

**Today.** It is a record (ANS-1), and gradebooks rely on that. Cells-core ADR 0017 says the
answer regrades.

**Recommendation.** Keep credit as a record of the submission. Derive only "just submitted" by
comparing a stored hash of what the credit depended on with the live one. That also fixes the
stale "just submitted" in #2325.

## D17. Variant stability under edits

**Today.** With unique variants, which is the default, inserting any random component re-maps
every variant (VAR-3).

**Recommendation.** Seed each random component from (variant index, its stable name path), and
make exact unique enumeration best-effort. That keeps VAR-1 and VAR-2, and makes adding a
question to a problem set safe.

The exact tables in `T/variants/uniqueVariants.test.ts` become Tier 3. Keep the property tests:
"same index, same draws" and "N variants are distinct when N ≤ the number of combinations".

## D18. Saved state across edits, and withheld content

**Today:**
- The core keys state so that it survives an edit, but the viewer discards it on any `cid`
  change.
- Restored derived values are trusted.
- #2149 says withheld content "behaves as deleted", while #2318 keeps it.

**Recommendations:**
- State officially that "hidden or withheld content keeps the reader's work" (SAVE-4), and retire
  the #2149 wording.
- Save only true sources and recompute the rest.
- Adopting ADR 0017's safe-edit carry-over is a product decision. Until it is made, treat the
  "survives an edit" keying tests as Tier 3.

## D19. Smaller rules to settle

- **`labelIsName` on a copy.** Today it is dropped, and the copy shows the source's name. Keep
  this as a named exception, "a copy shows the label its source showed", rather than pasting it.
  It is the less surprising outcome.
- **A type-changing extend of a scalar.** Lists take the source's same-named attributes and
  scalars do not (REF-5). Choose "a type-changing extend takes the source's attributes that its
  own class declares" for both.
- **Display settings through arithmetic.** These are open from #2127. Keep "a sole child passes
  its formatting up" (VAL-4) unless authors ask for more.
- **Deep property chains** (`$l.points[1].coords`). Either commit to supporting them, and restore
  the 20 commented-out assertions, or document "one property after an index" as the limit.
- **`asList` defaults.** State "groups are not lists". Decide whether a conditionalContent
  whose active case yields several items is a list.
- **`draggable`.** Move the check into the writer next to `fixLocation`. The behavior is
  unchanged.

## D20. Make what a property carries data-driven

**Today** three per-variable mechanisms, in about 40 files, decide which attributes `$x.prop`
carries.

**Recommendation.** One default: a numeric property carries the five display settings. Declare an
exception only where a property needs more, such as list entries carrying `fixed`, `hide`,
`styleNumber`, `draggable` and `renderMode`. Keep `hide` on that list: an entry carrying its
source's `hide` is what makes `$l[1].hide` true for a hidden source (#2265, D29). (#2339 already removed the third mechanism,
`propagateToProps`, which only `modifyIndirectly` used.) This is
mostly internal, but it makes VAL-1 true by construction.

## D21. Which components does a bare reference read as a value?

**Today.** A bare `$x` to most components puts x itself there again (REF-1). For classes with a
`variableForImplicitProp` it gives a value instead (REF-1a):

| Referent | `$x` gives |
|---|---|
| every input | its value: `$mi` is a math, `$ti` a text |
| `<answer>` | its submitted responses |
| `<award>` | whether it was awarded |
| `<choice>` | whether it was submitted |

A name on the reference, or an explicit type equal to the referent's own (`<mathInput extend="$mi"/>`),
gives the component instead. A reference to something that *contains* an input
(`$repeat[1]`, `$group`) copies the input.

**Recommendation.**
- Keep the input rule as a Tier 1 author guarantee, and state it in the docs: "a reference to an
  input is the value the reader entered; use `extend` with the input's tag for a second input".
- Decide whether answer, award and choice are worth keeping as special cases. Each could instead
  require the explicit property (`$ans.submittedResponses`). Keeping them is cheap if they are
  declared in one table, but each is one more thing an author must learn.
- Either way, make it a declared, schema-visible property of the class ("a bare reference reads
  `value`"), so that docs and a new core read the same list.

## D22. How should names inside a `conditionalContent` work?

**Today.** Names inside both forms of `<conditionalContent>` are private (**[probe]**):
- a plain `$x` from outside reports "No referent found";
- `$cc.x` reaches the `x` in the active case, and is empty when no case is active;
- a name declared in only some cases, or with different types in different cases, is
  accepted. With a math `x` in one case and a text `x` in another, `<math>$cc.x+1</math>`
  becomes `h i + 1` when the case switches.

Privacy is necessary for a repeat, which makes several instances of a name, and for a copy,
which sits beside its source. A `conditionalContent` shows at most one case at a time, so for
it privacy is a choice.

**Options.**
- **(a) Keep it private, as today.** Authors must always write `$cc.x`. Add a load-time
  diagnostic when cases disagree about a name.
- **(b) The branch interface of ADR 0009.** Keep `$cc.x` as the only way in, and allow it only
  for a name that every case declares, with the same type. Names in only some cases are private
  to their case. This is D13's rule, and PR #2281 already implements it.
- **(c) Make the names visible, like a `<group>`'s.**
  - A plain `$x` from outside finds the `x` in whichever case is active.
  - Every case must declare it with the same type, or it is a load-time error.
  - When no case is active, `$x` is missing, like an index past the end (VAL-5).
  - Two cases of one `conditionalContent` declaring `x` do not make `$x` ambiguous, because only
    one of them can exist at a time.

**Discussion.**
- Option (c) is the easiest to teach. Authors already think of a conditionalContent as
  "this or that content shown here", and it then behaves like a group whose contents change.
- It also treats the single-case form, `<conditionalContent condition="…">`, as what it looks
  like: a group that is sometimes absent.
- Its costs:
  - names inside cases join the enclosing scope, so a case's `x` can collide with an `x` beside
    the conditionalContent, giving an ambiguity that is reported;
  - the resolver must treat sibling cases as mutually exclusive rather than ambiguous.
- `<select>` with one pick could follow the same rule. With several picks it makes several
  instances, so it stays private, like a repeat.

**Recommendation.** Choose between (b) and (c) together with D13. Lean towards (c) with (b)'s
same-type rule: one interface, reachable both as `$x` and as `$cc.x`. Whichever is chosen,
warn on main now for names that cases disagree about, so that documents can migrate.

**Tests that change under (c):**
- the tests that assert `$x` from outside does not resolve;
- the `conditionalcontent.test.ts` and `select.test.ts` tests listed under D13.

## D23. What `fixed` means

**Today** (CTX-1, INT-6):
- **`fixed`** refuses every change pushed into the component. It still follows its children and
  attributes.
- **`draggable="false"`** refuses only the reader's direct drag.

"Fixed" suggests a constant value. Authors may expect `<math fixed>$n+1</math>` not to follow
`n`.

**Recommendation.**
- **Document `fixed` by what it refuses:** "A fixed component shows what its own definition
  gives, and nothing can change it from outside — not the reader, not an input bound to it, not
  an action". Keep the name, since many documents use it.
- Keep `draggable="false"`. It answers a different author question: "can the reader grab this?".
- Keep `fixLocation` as "`fixed`, for position only".

**Done: `modifyIndirectly` is removed (#2339, closing #2336).** It refused only changes passed
back from things that depend on a component, while still allowing the reader's direct drag. No
author was likely to want that distinction from `fixed`.
- The parser now drops the attribute from any element, with deprecation warning `doenet-w0177`.
  The warning says to put `fixed` on the components that use the value, or `disabled` on an
  input.
- `$P.modifyIndirectly` is now a reference to a property that does not exist.
- The core plumbing went with it: the refusal in `EssentialValueWriter.ts`, the `canBeModified`
  dependencies, and `propagateToProps`.
- Its tests were ported to `fixed` on the consumer.

## D24. How to present repeating, choosing and grouping to authors

**Today.** The docs and these principles group `group`, `repeat`, `select`, `conditionalContent`,
`collect`, `module` and others as "composites" that disappear and are replaced by their content.
That is how the current core is built, but it is not a distinction authors need. To an author:
- a `<repeat>` shows its content once per item;
- a `<select>` shows what it picked;
- a `<conditionalContent>` shows the active case;
- a `<group>` just holds content together.

**Recommendation.** Teach each tag by what it shows, and drop "composite" from author-facing
text. Three rules then cover what the category was used to explain:
1. "Content a tag produces appears where the tag is written, and any parent reads it as if you
   had written it there." This is true for every tag, so it needs no category name.
2. "Several items that a tag repeats, picks or gathers are shown as a list, separated by
   commas. A `<group>` is not a list unless you say `asList`."
3. The naming rules, which depend on the tag: repeat iterations are private; a choice per D22.

What remains genuinely composite-specific, such as an `extend` of a repeat ignoring `for` (REF-7)
or children on a copy of a repeat (D4), should be stated on the tag's own reference page.

## D25. A table's title and a figure's caption take the first child, not the last

**Today.** Wherever a component uses one `<label>`, `<title>` or `<shortDescription>`, the last
one written wins (REF-4a). That holds for 22 label-taking components, for sections, hints and
charts, and for `shortDescription`. So a label or title written inside an `extend` or `copy`
replaces the source's.

`<table>` (`Table.js:140`, `:165`) and `<figure>` (`Figure.js:155`, `:181`) instead take the
**first** title or caption. As a result, `<table extend="$t"><title>New</title></table>` keeps
the old title (**[probe]**). `Document.js:199` also takes the first.

**Recommendation.** Make all three take the last child, so that one rule covers every
single-use child. No test pins the current behavior. Add a sweep: for every component with a
single-use child group, writing two of them uses the second, and adding one in an `extend` or
`copy` replaces the source's.

## D26. Which type changes may an `extend` make?

**Agreed direction:** related types are allowed, and any other pair is an error.

**Today** (REF-5) an unrelated pair gives a default component of the written type. It comes
sometimes with an "Invalid children" warning that confuses authors, and sometimes silently: for
example `<boolean extend="$m"/>` of a math is `false`. None of these is "a T that behaves like
x", which is what the syntax suggests. This behavior does not need to be reproduced.

**Rule.**
- Declare the allowed conversions in one table, the way adapters are declared:
  - math, number, text and boolean among each other;
  - point, vector and coords;
  - an input from its value type, and a value type from an input;
  - a list from the matching scalar or list (#2231).
- Report any other pair as a load-time error on the extend, such as "cannot extend a
  `<section>` as a `<math>`". Do not render it.
- Container tags (`<p extend="$m"/>`) are not an allowed pair. Authors write `<p>$m</p>`.

A new core then needs only the table.

**Tests.** `extend_references.test.ts:6495` "handle extending or copying with invalid component
type" changes to expect the error. The related-pair tests keep passing. Add a test that each
allowed pair works, and one that an unrelated pair gives the error.

## D27. What may an index select?

**Today** an index can select several different things, and which one depends on what the
current core makes a composite (**[probe]**):

| Written | Means today |
|---|---|
| `$l[2]` on a list, `$P.xs[2]` on an array prop | the second entry |
| `$r[2]` on a repeat | the second iteration |
| `$r[2][2]` on a repeat whose template has two children | the second child of iteration 2 |
| `$s[1]` on a select | the first pick |
| `$s[1][2]` on a select | the second child of the first pick's option |
| `$g[2]` on a `<group>` | its second child |
| `$sec[2]` on a `<section>`, `$p[2]` on a `<p>` | nothing ("Could not find prop sec[2]") |
| `$o[1]` on a named `<option>` | nothing, though `$s[1][1]` reaches into an option |
| `$r[1][2]` on `<repeat name="r"><repeat>…</repeat></repeat>` | nothing; `$r[1][1][2]` is needed, because `[1][1]` steps over the iteration's wrapper to the inner repeat |

For the select from the question,
`<select name="s"><option><text>a</text><number>1</number></option><option><text>b</text><number>2</number></option></select>`:

| | `numToSelect="1"` | `numToSelect="2"` |
|---|---|---|
| `$s[1]` | the picked option's content, e.g. `b2` | the first pick, e.g. `a1` |
| `$s[2]` | nothing | the second pick, e.g. `b2` |
| `$s[1][1]` | the picked option's text, e.g. `b` | the first pick's text, e.g. `a` |
| `$s[1][2]` | the picked option's number, e.g. `2` | the first pick's number, e.g. `1` |

Adding `numToSelect` does not change what an index means; it only makes more picks exist. The
diagnostics for a missing index are confusing. They name internal types and props:
- "Could not find prop s[2] on a component of type text";
- "… on a component of type _repeatValueList".

**Why it is unsatisfying.** Indexing by child position works on a group, a repeat iteration and
a picked option. Those are exactly the tags the current core makes composites. It does not work
on a section, a `<p>` or a named option. Authors cannot predict this without the composite
concept (D24). Positional child indices are also fragile: adding a child to an option or a
template shifts every index after it.

The docs for `<select>` (`reference/select.mdx:104-108`) currently recommend either style:
- reach a child of a picked option by index;
- or name the child, "the same names for that particular child over the range of all possible
  options", and write `$s[1].num`.

**Proposed rule.** An index selects among the *instances* a tag produces. It never selects among
a container's children:
- entries of a list or an array prop;
- iterations of a repeat;
- picks of a select (and of `selectFromSequence`, `shuffle`, `sort`, `collect`).

To reach inside an instance, name what is inside: `$r[2].x`, `$s[1].x`. Consequences:
1. **No child indexing on group, option, section or `<p>`.** `$g[2]` and `$s[1][2]` become
   errors, with a diagnostic that says to name the child.
2. **Names across the options of a select follow the same rule as across the cases of a
   conditionalContent** (D22). A name reached as `$s[1].x` must be declared in every option,
   with the same type. That is the docs' existing advice, made a rule, and matches ADR 0009.
3. **An instance whose whole content is one indexable thing passes the next index through to
   it.** Only one meaning is left for `[2]` after an iteration, so nested repeats become
   unambiguous: in `<repeat name="r"><repeat>…</repeat></repeat>`, `$r[1][2]` is iteration 2 of
   the inner repeat in iteration 1 of the outer. The same holds for an option holding one list,
   and for an option holding one component, as `$f[1].formula` in `select.mdx` already does.
4. **Diagnostics name what the author wrote** ("`$s[2]`: the select made only 1 pick"), never an
   internal type.

**Alternative.** Make positional indexing uniform the other way, so that every container takes
child indices (`$sec[2]`). This is harder to define: text and whitespace children would need
to be counted. It is also fragile under edits, and it would make (3) ambiguous again.

**Tests and docs that change under the proposal:**
- `repeatForSequence.test.ts:156` (`$a[2][1][3]` becomes `$a[2][3]`);
- the positional option tests (`select.test.ts:2897`, `conditionalcontent.test.ts:1306`), already
  rewritten in PR #2281;
- `extend_references.test.ts:6549`'s `$sec2.g[1].t`;
- `repeat.test.ts` / `repeatForSequence.test.ts` tests that index children of an iteration;
- `compositeCommas.test.tsx:318`;
- the select docs examples: the dice example `$roll[1][1]` and `$groupSelect[2][2]` in
  `reference/select.mdx`, plus `option.mdx`, `vectorList.mdx` and `tupleList.mdx`.

The list examples keep working, since entries are instances. Before any cut-over, add a warning
on main for child indexing, so that documents can migrate.

## D28. Can "start from a passed-in value" work without `.value`?

**Today** (CPY-7) `<number name="x" copy="$x0"/>` inside a module pastes x0's definition. When
a caller passes `x0="$initial"`, that definition contains a live `$initial`. The copy then
either cannot be dragged, or writes back to the caller's variables. The fix,
`copy="$x0.value"`, works, but is not obvious.

**Options.**
- **(a) Document the idiom.** Teach CPY-7 on the module and copy pages. Add an info diagnostic
  when a drag or typed value on a copy is refused because the pasted definition cannot be
  inverted, or lands on a component outside the copy. Cheapest. Changes no behavior.
- **(b) Treat module attributes as values.** A module attribute receives the value of what the
  caller passes, as `$initial.value` would. A copy of it then starts from that value.
  - **Cost:** module attributes become a special case. An author who wants the module to
    *follow* `initial` live has to reference it some other way.
  - This could be confusing, as noted in review.
- **(c) A copy freezes references to things outside the copied part.** References inside the
  copied part stay live, and point to the copy's own parts, as today. References to anything
  outside become the value they had when the copy was made.
  - The copy is then truly independent, and the module case works without `.value`.
  - It reverses #559, "a copy keeps following an outside `$n`"
    (`T/copying/unlinked copy.test.ts:1118`), which is currently Tier 1.
  - It is the opposite of D1's lexical option, which keeps outside references live.
- **(d) A dedicated way to say "initial value".** For example, `<number name="x"
  start="$x0"/>`, analogous to an input's `prefill`, which already means "start here, then
  change on your own".
  - It is explicit, and needs no change to `copy`.
  - It would have to be added to every value component, and authors must learn a new
    attribute.

**Recommendation.** Do (a) now. Decide between (c) and (d) together with D1, since both are
about what a copy does with references to things outside it. (b) solves only the module case,
and adds a special case that users of modules would have to know about.

## D29. Hidden entries in lists

**Status: done for `hide` (#2368, closing #2265), on top of D3 (#2367).** Rules 1–6 below hold for
every list, and so does the container model for a list's own `hide`. `listEntryHide.test.ts` is
the sweep: 19 list forms, each with its first entry's source hidden. Still open:
- `styleNumber` and display settings under the container model: #2374;
- a hidden list's entries in a `<choice>`'s text and an `<li>`'s lead: #2375, decided below;
- writes through `$l[k].hide`, a follow-up under VAL-9.

**Before #2368** a list entry whose source is written with `hide` was handled by three different rules
(#2265, survey at `34393fb`; **[probe]** confirms the main cases). Each list below was written
with its first entry's source hidden:

| Family | Lists | Hidden entry drawn? | `$l[1].hide` | `$l[1].hidden` | `$l[1]` placed elsewhere |
|---|---|---|---|---|---|
| A | `mathList`, `numberList`, `textList`, `booleanList`, `intervalList`, `tupleList` | **shown**, and included in text (`1, 2`) | false | false | shown |
| B | `pointList`, `vectorList` | sent to the viewer marked hidden, so invisible in the graph | **false** | true | **shown** |
| C | `sort`, `shuffle`, `collect`, `group asList` | left out of what is drawn, and out of text (`2`) | true | true | hidden |

Only family C matches a plain hidden component.

Family A also ignores `hide` on content nested inside it:
`<numberList><sort><number hide>1</number><number>2</number></sort></numberList>` shows the 1, and
so does the same with a `<group>`. That `<sort>` or `<group asList>` inside a `<p>` hides it. A
`<sort>`, `<collect>` or `extend` of a mathList with a hidden child shows the child too.

Family A's behavior is deliberate and pinned. Four tests are named "…ignore child hide":
- `mathlist.test.ts:1133`;
- `numberlist.test.ts:694`;
- `textlist.test.ts:560`;
- `booleanlist.test.ts:519`.

Family B contradicts itself: `$pl[1].hidden` is true, yet `$pl[1]` placed in another graph is
drawn. `listcomponentpointlists.test.ts:729` pins that a reference to the list is not hidden by an
entry's own `hide`.

`<collect hide>` is an exception within family C. It pushes its own `hide` into each entry:
`$c[1].hide` reads true for a visible source, and `$c[1]` placed elsewhere is hidden
(**[probe]**). `<sort hide>` does not: `$s[1].hide` is false, `$s[1].hidden` is true, and `$s[1]`
placed elsewhere is shown.

**Rule** (family C's, refined in planning the fix for #2265):
1. **An entry carries its source's own `hide`.** `$l[k].hide` is the source's attribute, and false
   for generated entries such as a sequence's (VAL-9, D20). A list's own `hide` does not become
   its entries' `hide`. That includes `<collect hide>`.
2. **`$l[k].hidden` is true when the entry's `hide` is true, or when the list is hidden.**
3. **A hidden entry is not drawn.** So it is not in the displayed text of what holds it, such as
   a `<p>`.
   - It still counts for indices: `$l[k]` keeps its meaning.
   - It also counts wherever the list is read as a value: `<math>$l</math>` and
     `<text>$l</text>` include it. That is VAL-10 applied to lists, since every value position
     ignores `hide`. It is also COMP-2's "`hide` affects display, never the values a list holds".
4. **A reference follows the entry's own `hide`, not `.hidden`.**
   - A reference to an entry (`$l[k]`) is hidden when the entry's `.hide` is true, that is, when
     its source has a `hide` of its own, unless the reference sets `hide` itself.
   - It is not hidden merely because the list is hidden (`.hidden` true, `.hide` false), just as
     `$n` of a number inside a hidden section is shown (CTX-8).
   - A reference to the whole list (`$l` placed elsewhere) keeps an entry hidden when that
     entry's source is hidden, as `<sort>` does today. Whether `$l` of a *hidden list* is hidden
     is D9, a separate question.
5. **What is drawn leaves a hidden entry out; properties are values and include it.**
   - What is drawn, including the text of a `<p>` that holds the list, leaves the entry out
     (rule 3).
   - The list's properties include it: `$l.text`, `$l.maths`, `$l.numbers`, the number of
     entries, and indices. A list's `.text` is read entry by entry, so `$l.text[k]` is
     `$l[k].text`. A property has no `hide` (VAL-1): `$n.text` of a hidden `<number>` is `5`.
   - Leaving hidden entries out of `$l.text` would either shift `$l.text[k]` away from
     `$l[k].text`, or make a property hidden. So `$l.text` is unchanged (#2368).
6. **A copy hides the same entries as its source**, because a copy is the source's DoenetML
   pasted (CPY-1). This needs no rule of its own. It follows from D3 (#2367).

That makes `hide` on an entry mean what it means on any component, and makes every list one
family.

**Decided: a list's own attributes act on its entries as a container's do, for every list.**
This is the model rule 1 already chose for `hide`. A list's attributes fill in for its entries,
and never override or clear what an entry's source sets:
- **`hide`.** `hide` on a list hides the list. It never sets, or clears, an entry's `hide`.
  - So `hide="false"` on a `<collect>` no longer reveals entries whose sources are hidden. That
    matches `<sort hide="false">`, and `hide="false"` inside a hidden container (CTX-5).
  - #2368 removed the reveal. `collect.test.ts` "collect does not ignore hide" became "collect
    does not ignore hide, and its own hide does not reveal what it collects". It also shows the
    repeat of extends with `hide="false"` that does reveal (D31).
- **`styleNumber`, and display settings such as `displayDigits`.** The entry's source's own
  setting wins. The list's applies to entries whose source sets none, which is CTX-5's "nearest
  wins": the source's own attribute is nearer.
  - **Not done yet (#2374).** Collect and sort still let the list's `styleNumber` override each
    source's (`LIST_SETTING_OF_PRESENTATION`). Authored lists and `<pointList>` still ignore a
    child's `styleNumber`.
  - For the common case, `<collect styleNumber="2">` of points that set no style, the result
    does not change. Tests where a source with its own `styleNumber` is restyled by the list
    change.
  - For an authored `<mathList styleNumber="2"><math styleNumber="3">`, the entry is style 3.
- Authors who want a list to override its entries opt in explicitly: D31.

**Decided: what a parent that ignores its own hiding counts is what would be drawn (#2375).**
A few parents read their children while ignoring whether they themselves are hidden:
- a `<choice>`'s text;
- the child an `<li>` leads with (`childRendersSomething`);
- a `<chart>`'s series.

They read each child's `hiddenIgnoreParent`. The rule for them is:

> A child counts exactly when it would be drawn if the parent were shown. Everything between the
> child and the parent counts toward that, including a list whose entry it is, and the
> composites the list came from.

So an entry's `hiddenIgnoreParent` is its source's own `hide` OR the list's `hiddenIgnoreParent`,
the same way a composite's replacements include the composite's. This does not touch D29 rule
1: `$l[k].hide` stays the source's own attribute. `hiddenIgnoreParent` is not `hide`, and for
every other component it already includes what stands between the component and its parent.

Before the fix (**[probe]**, `<choice>`'s text, compared with what a `<p>` draws for the same
content):

| Choice | Text today | Drawn in a `<p>` | After the fix |
|---|---|---|---|
| `<textList hide>q</textList> r` | `q r` | nothing | ` r` |
| `<group hide><text>q</text></group> r` | ` r` | nothing | ` r` (unchanged) |
| `<group hide><textList>q</textList></group> r` | `q r` | nothing | ` r` |
| `$c r`, `c` a `<collect hide>` | `q r` | nothing | ` r` |
| `$tl r`, `tl` a `<textList hide>` | `q r` | shown | `q r` (unchanged) |
| `$g r`, `g` a `<group hide>` | `q r` | shown | `q r` (unchanged) |
| `<textList><text hide>q</text></textList> r` | ` r` | the entry is not drawn | ` r` (unchanged) |

The two bare references stay as they are because today's D9 shows them. If D9 changes, they follow
it automatically under this rule. The `<collect>` row needs the same treatment as its drawing:
#2368's `listHiddenWithReferences` hides `$c`, so its entries must not count either.

A test for #2375 can assert the rule directly: for each row, the choice's text equals the text of
a `<p>` holding the same content.

**Scope: `styleNumber` as well as `hide`.** Family A also drops a child's `styleNumber`
(**[probe]**: `$ml[1].styleNumber` is 1 for a `<math styleNumber="2">` source). So does a
`<pointList>` (#2265's follow-up). Display settings such as `displayDigits` do carry through.
- **Recommendation:** rule 1 covers both. An entry carries its source's own `hide` and
  `styleNumber`, the two presentation attributes D20 already lists for entries.
- `hide` is done (#2368). `styleNumber` follows in #2374: the source's own `styleNumber` wins, and
  the list's fills in.

**Out of scope: writes through `$l[k].hide`.** `<booleanInput bindValueTo="$l[k].hide"/>` does
nothing in any family, while `$n.hide` is writable (**[probe]**). VAL-9 notes it as a follow-up.

**Tests changed in #2368:**
- the four "…within …Lists, ignore child hide" tests, renamed "…a hidden child keeps its value but
  is not shown";
- `listcomponentpointlists.test.ts` "an authored point that is not draggable is drawn so, and one
  that is hidden is not drawn", replacing the test that showed the hidden point through `$pl`;
- `listcomponentcollections.test.ts`: `$ct.hide` is now the list's own, and the reveal cases;
- `collect.test.ts` "collect does not ignore hide".

## D30. Should identity that leaves the core be stable across a reload?

**Today** a component's index is not stable (SAVE-5), but it still leaks into the identity
handed to the outside, in three places:
- **`componentIdx` on recorded events.** Most components' events name their object only as
  `{ componentIdx, componentType }`, such as a point's drag event
  (`W/components/Point.js:1440`).
- **`rootName` on an answer's submission event** (`W/components/Answer.js:2829`).
  - `rootName` is the component's shortest unique path from the document root, such as `ans` or
    `sec.ans`.
  - A component with no such path has `"_id_" + componentIdx` instead
    (`W/core/ComponentBuilder.ts:712`). That includes an unnamed answer, and an answer inside
    an unnamed copy.
  - The event also carries `answerNumber`, which counts answers in document order.
- **DOM ids.** The viewer builds them from the same `rootName`, so unnamed components get
  `_id_<index>`.

**What doenet.org does with them** (DoenetApps, checked at `8954212`):
- **Only submissions are recorded.** The assignment viewer records only `submitted` events, and
  ignores the rest (`apps/app/src/paths/AssignmentViewer.tsx:459-471`).
- **They are keyed by `rootName`.** Each submission is stored with `answerId = object.rootName`
  (`:842`). Responses are counted grouped by `answerId` and the problem's position
  (`apps/api/src/query/assign.ts:1304`), and the instructor's response drawer fetches by
  `answerId`.
- **Nothing else is used.** `answerNumber` is stored but never used, and nothing in DoenetApps
  reads `componentIdx`.
- **Edits are not a risk.** Once content is assigned, its source and DoenetML version cannot
  change (`apps/api/src/query/activity.ts:450`). Only a reload with the reader's work can shift
  an id.

**The live problem is #2365.** An unnamed answer written directly in the document keeps its
`_id_<n>` across a reload, because written components are numbered by their position in the
source. One made by a copy, repeat or select at load is numbered in creation order, and can
shift: `_id_27` became `_id_29` (**[probe]**, #2349's document with answers added). On
doenet.org, that answer's submissions are then split between two ids.

**Principle (Tier 2):**

> Whatever the core hands to the outside to name a component is the same on every load of the
> same document with the same saved state. It comes from the name path or the `stateId`, never
> from the allocation index.

**Recommendation.**
- For a component without a root name, report a key that does not depend on allocation order,
  most simply its `stateId`, which saved state already uses. Do this in `rootName` itself, so
  that DoenetApps needs no change, at least for answers.
- Account for existing data: ids already recorded as `_id_<n>` stay as they are, so the change
  causes a one-time split for any answer whose id changes (see #2365).
- Keep `componentIdx` in event payloads for debugging, documented as unstable. No host reads it.
- Keep root names that use child indices (`g:1`) in mind when deciding D27. Components reached
  only through such an index would lose their root name and fall back.
- The fix belongs in what events report, not in the core's creation order. #2349 closed that
  route as not planned.

## D31. An explicit way to set attributes on many components at once (deferred until authors ask)

**Today** a list's, collect's or group's attributes act as a container's (CTX-5, D29): they fill
in what a component does not set, and never override it. So there is no single attribute that
takes a set of points and changes their `styleNumber`, `displayDigits` or `hide`.

**What already works.** Write a reference for each one. Attributes written on a reference
replace its source's (REF-3):

```xml
<collect name="c" componentType="point" from="$g"/>
<graph>
  <repeat for="$c" valueName="P">
    <point extend="$P" styleNumber="2" hide="false"/>
  </repeat>
</graph>
```

**[probe]** Every collected point is style 2, including one whose source sets `styleNumber="3"`,
and the point whose source is written with `hide` is shown. A repeat over a `<pointList>` does
the same.

**If authors ask for something shorter**, add one opt-in mechanism, defined as an abbreviation
of the form above, rather than per-attribute exceptions. For example, a child element of any
list or collection:

```xml
<collect componentType="point" from="$g">
  <entryAttributes styleNumber="2" displayDigits="3"/>
</collect>
```

The meaning would be: each entry behaves as `<T extend="$entry" styleNumber="2" displayDigits="3"/>`
would.
- **It inherits REF-3 and REF-3a.** It needs no new principle: writing either of an alternative
  pair replaces both on the source.
- **It inherits the reference rules for context attributes.** `fixed="false"` cannot unfix a
  fixed source (D7), and `hide="false"` shows an entry whose source is hidden, as on an extend.
- **It works on every list in the same way:** `collect`, `sort`, `shuffle`, the authored value
  lists, `pointList`.
- **It is checked against the entries' type.** An attribute the entry type does not have is an
  error, as on an extend.
- **It does not apply to `<group>`.** A group's children are written in place, so the author can
  set them directly. An override from outside would contradict "a component's own attribute
  wins".

Rejected shapes:
- **Per-attribute list attributes** (`entryStyleNumber`, `entryDisplayDigits`, …). They multiply
  with every attribute.
- **Letting a list's own attributes override,** as collect and sort did. That makes the same
  attribute mean different things on different lists.
- **Prefixed attribute names** such as `entry:styleNumber`. A colon is an XML namespace
  separator.

**Until then:** document the repeat-of-extends form as the way to restyle a set of components, on
the `<collect>` and list reference pages.

## D32. Tags that make their own content cannot be extended (proposed Tier 1)

**Today** ADR 0009 bans `extend` of `<select>`, `<conditionalContent>` and `<case>`, with no stated
reason for those three. In the current core an `extend` of *any* tag that makes its own content
does nothing that `$x` does not (**[probe]**, current main):

| Tag | Bare `extend` | `extend` with an attribute or child | `copy` with the same change |
|---|---|---|---|
| `select` | same picks | `numToSelect` ignored, with warning w0168 | **the document fails to load** (B11) |
| `selectFromSequence` | same | ignored, w0168 | **empty**, with an error (B11) |
| `sampleRandomNumbers` | same | `numSamples` ignored, w0168 | four new samples |
| `shuffle` | same order | child ignored, **no warning** (B12) | reshuffled, with a warning |
| `sort`, `collect`, `sequence` | same | ignored, w0168/w0169 | applied |
| `repeat` | same | `for` and the child ignored | applied (`7z, 8z, 9z`) |
| `conditionalContent` | same, with a **spurious** w0169 (B12) | ignored | `condition` ignored (B5, #2217) |
| `case`, `option` | invalid outside their parent | invalid | invalid |
| `group`, `module` | same | the child is added, `rendered` applies | the child is added |

**Why.** An `extend` is the same component, with your changes (REF-2, REF-3). For a tag that makes
its own content, the content *is* the component: the iterations of a repeat, the picks of a
select, the items a collect gathers. Such an extend is one of two things:
- **written with nothing added**, it shows the same content, which `$x` already does;
- **written with changes,** such as `<repeat extend="$r" for="7 8 9">` or
  `<select extend="$s" numToSelect="4">`, it needs different content. That cannot be the same
  component: it would be new iterations, or new picks. So it is a new tag. Today the change is
  silently dropped, with only a warning.

**Proposed principle (Tier 1):**

> A tag that makes its own content, by repeating it, choosing it or gathering it, cannot be
> extended. To show the same content again, reference it: `$x`. To make a new instance, `copy` it
> or write the tag again. The parts of a choosing tag (`<case>`, `<else>`, `<option>`) cannot be
> extended either: a branch means something only inside the tag that chooses it.

It covers these tags:
- **repeating:** `repeat`, `repeatForSequence`;
- **choosing:** `select`, `selectFromSequence`, `selectPrimeNumbers`, `selectRandomNumbers`, the
  `sample…` tags, `shuffle`, `conditionalContent`;
- **gathering:** `collect`, `sort`;
- **generating:** `sequence`;
- **parts of a choosing tag:** `case`, `else`, `option`.

It does not cover `group` and `module`. They do not make their content; they hold what is
written in them. Their extends add children and apply attributes (REF-4, COMP-13).

**What it means in practice:**
- **`$x` stays.** A bare reference to any of these tags shows its content, as now (REF-1). Only an
  `extend` written out is an error. That includes a named one: `$x` already reaches the content
  (`$r[2].y`), so a name adds nothing.
- **A list type stays allowed** when the tags are related types (D26). `<numberList
  extend="$seq">` is a list made from the sequence's values, not an extend of the sequence.
- **`copy` stays allowed,** as the way to make a new instance (CPY-1). D4 already says the
  attributes written on a copy override. For a choosing tag, CPY-8 says a copy keeps its source's
  random choices. A copy that changes what is chosen, such as `numToSelect`, cannot keep them.
  Proposed: it makes its own choices, fixed for a given variant, as `<sampleRandomNumbers copy>`
  already does. That also fixes B11.
- **The error says what to write:** "A `<repeat>` makes its own content, so it cannot be
  extended. Use `$r` to show the same content, or `copy` to make a new repeat."

**Recommendation: adopt it.**
- It replaces ADR 0009's list of three with a rule an author can be told.
- It removes the special handling that decides which attributes an extend of these tags ignores
  (w0168, w0169, `extendIgnoresAttributesAndChildren`). With it go B12 and REF-7's list of
  exceptions.
- Before the cut-over, turn w0168 and w0169 on these tags into a deprecation warning that says
  the extend will become an error, so documents can migrate.

**Tests that change:**
- `T/diagnostics/warningsInfos.test.ts:1144-1406`: the w0168 and w0169 tests on these tags become
  error tests;
- `T/copying/extend_references.test.ts:3153` "extend repeat" and `:3177` "extend
  repeatForSequence";
- the extend-of-select and extend-of-conditionalContent tests listed under D13 and in
  `composites-and-lists.md` §6;
- `T/tagSpecific/repeatIterationValues.test.ts:234`, its extend case;
- tests that extend a `sort`, `collect`, `shuffle` or `sequence`, for example in
  `listcomponentcollections.test.ts`.

Each of these should be rewritten to use `$x` where it checks that the content is shown again.
