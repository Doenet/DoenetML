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

## D3. A copy of an authored value list freezes its entries

**Today.** `<mathList copy="$ml"/>` of `<mathList name="ml">$mi 2</mathList>` does not follow `mi`.
The same list inside a copied `<p>` does follow it (**[probe]**). Its named entries also cannot be
reached through the copy.

Cause: `serializeUnlinkedAsValues` (`W/components/abstract/AuthoredValueList.js:91`).

**Recommendation.** Paste the list like any other component, per CPY-1. Keep "a copy of a list
*entry*, or of a prop, holds a value" (CPY-5).

**Tests that change:**
- `T/tagSpecific/listcomponentvaluelists.test.ts:562`, `:578`, possibly `:591`;
- `T/copying/list_extend_attributes.test.ts:140`.

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

**Today.** Yes for every non-composite, for lists and for collect. **No** for `select` and
`conditionalContent`. `select.test.ts:2493` says it "encodes undesired behavior (see issue #246)",
and `conditionalcontent.test.ts:1213` is the same case.

**Recommendation.** "A reference to a hidden component is hidden, unless the reference sets `hide`
itself", for every component.

**Tests that change:**
- `select.test.ts:2493`, `:2545`, `:2636`, `:2727`;
- `conditionalcontent.test.ts:1213`;
- check `repeat.test.ts:1459` and `sequence.test.ts:1210`.

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
- `extend` of a select, conditionalContent or case;
- names present in only some branches;
- type-varying names;
- positional references into options (`$s[2][1]`), which D27 generalizes;
- a non-literal `numToSelect`.

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

**Recommendation.** One default: a numeric property carries the five display settings, and every
property carries `modifyIndirectly`. Declare an exception only where a property needs more, such
as list entries carrying `fixed`, `hide`, `styleNumber`, `draggable` and `renderMode`. This is
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

## D23. What `fixed` means, and whether `modifyIndirectly` stays

**Today** (CTX-1, INT-6):
- **`fixed`** refuses every change pushed into the component. It still follows its children and
  attributes.
- **`modifyIndirectly="false"`** refuses only changes passed back from things that depend on the
  component, and still allows the reader's direct drag (`initialChange`,
  `W/core/EssentialValueWriter.ts:846-860`).
- **`draggable="false"`** refuses only the direct drag.

Problems for authors:
- "Fixed" suggests a constant value. Authors may expect `<math fixed>$n+1</math>` not to follow
  `n`.
- The difference between `fixed` and `modifyIndirectly="false"` is one no author is likely to
  want. `modifyIndirectly` is already left out of the schema and the docs. Twelve test files use
  it, and it has plumbing in `Math.js`, `Matrix.js`, `MathBaseOperator.js`, `repeatList.js` and
  `referenceSlotDefinitions.js`, plus `propagateToProps`.

**Recommendation.**
- **Retire `modifyIndirectly` as an author attribute.** If no published document uses it,
  remove it. If some do, keep accepting it, but treat `false` as `fixed`, with an info
  diagnostic.
- **Document `fixed` by what it refuses:** "A fixed component shows what its own definition
  gives, and nothing can change it from outside — not the reader, not an input bound to it, not
  an action". Keep the name, since many documents use it.
- Keep `draggable="false"`. It answers a different author question ("can the reader grab
  this?").
- Keep `fixLocation` as "`fixed`, for position only".

**Tests that change:** those using `modifyIndirectly="false"` with a direct drag that is
expected to succeed. Tests where it only blocks a dependent's write keep passing under
"treat as fixed".

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
