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
| B4 | `copy="$r[2].p"` of repeat content that shows `$i`, or a copy landing in a repeat whose `valueName` matches an outside name, shows `＿` **with no warning**. The `extend` form works. **Fixed by #2397** (D1): it shows the iteration's value | yes | `resolvesIntoOwnAncestry` (`W/core/dependencies/refResolutionDependencies.ts:320`). An unlinked copy has no shadows chain to fall back on |
| B5 | Attributes on a copy or extend of a composite are mishandled: `condition` on a copy of a conditionalContent is ignored (#2217), `valueName` on a copy of a repeat misreads (#2211), and `maxNumber` on an extend of a collect blanks it (#2215) | #2217 confirmed | `W/components/abstract/Copy.js` |
| B6 | An index into a composite of references (`$g[1]` with `<group name="g">$x</group>`) can panic the resolver (#1942). Under D27 this form becomes an error, but the panic should be fixed meanwhile | — | `ref_expand.rs` |
| B7 | `doNotExpandAsShadowed` is read in four places but set by no component | — | `W/core/CompositeExpander.ts:338`, `CompositeReplacementUpdater.ts:125`, `:1650`, `ComponentLifecycle.ts:177` |
| B8 | **Fixed by #2344.** A `<group copy>` drew new random values for nested content, and a random child added to it repeated the source's first draw (#2342). Both broke CPY-8 | fixed on main, variants 1–3 | `copyVariants` in `W/components/abstract/Copy.js`; the group was serialized before its inner content expanded |
| B9 | **Partly fixed on main** (**[probe]** at `a90ac9b`, after #2393): `$r[1].d.h` and `$cc.d.h` in #2371's repeat and conditionalContent examples now resolve; its reload example is not rechecked. A reference that reaches a list copy through a repeat index or a `<conditionalContent>` case renders empty, where the `<p>` form works: `$r[1].d.h` from outside a repeat (also after a reload, for iterations made at load), and `$cc.d.h` after the case switches (#2371). It breaks NAME-2 | reported in the issue | `RefResolutionDependency` waits for a list copy's `_copy` only when the path's first resolved node is the list copy itself (`W/core/dependencies/refResolutionDependencies.ts`) |
| B10 | **Fixed by #2393** (closing #2376). `$e.h` named nothing for a list extend `<mathList name="e" extend="$l"/>`, while `$E.h` resolves for `<p name="E" extend="$P"/>`. It broke REF-8 | fixed on main | a linked list extend was made without its children; it now holds them when one of them holds a name (`childrenHoldAName`) |
| B11 | (#2389) A `copy` of a `<select>` with a different `numToSelect` makes the whole document fail to load ("Number of indices specified for select must match number to select"). The same on a `<selectFromSequence>` shows nothing, with that error | `<select copy="$x" numToSelect="4"/>` of a 2-pick select | the copy is given its source's picks (CPY-8), which no longer fit; `Select.js:363` throws where `<selectFromSequence>` reports `doenet-e0037`. D33 proposes the rule |
| B12 | **Fixed by #2409** (D32). Warnings on an extend of a tag that makes its own content were inconsistent: a child written inside `<shuffle extend>` was ignored with no warning, and a bare `<conditionalContent extend="$x"/>` warned that its children are ignored, though none were written (the parser's sugar gave it a `<case>`). Content changes are now errors, and the sugar skips an element written with `extend` | fixed on main | `extendChangesContentErrors` in `W/components/abstract/Copy.js`; the `conditionalContent` and `repeat` sugar |
| B13 | (#2395) Coordinates written as a child of a point `copy` or `extend` are ignored: `<point copy="$P">(3,4)</point>` and `<point extend="$P">(3,4)</point>` stay at P's coordinates, at load and after a drag, while `xs="3 4"` applies. The child is sugar for `xs`, so the two should agree (REF-3, REF-4a) | **[probe]** on main, at load and after a drag | not traced: the point-children sugar seems not to apply to children appended to a copy or extend |
| B14 | **Fixed by #2400** (closing #2398). A copy of an `extend` resolved references to outside names from where the extend is written, not from the source, breaking D1: `<group copy="$B.gB"/>` of `<group name="gB" extend="$A.g"/>` showed B's `n`. #2400 keeps an outside referent as a referent in every unlinked copy, and also fixed references between sibling replacements of an extend (`$g.x` in a copy of an extend of `g`) and `$me.a` through an extend of a `<module>` | fixed on main at `a53fbb9` | `remapCopiedRefResolution` (`W/utils/componentIndices.ts`), `createComponentIndicesForShadowedReplacements` |
| B15 | **Fixed by #2412** (closing #2405). A copy of a section whose content references the section (`<section copy="$S"/>` of `<section name="S"><p>hi [$S]</p></section>`) stopped the document with "infinite loop while calculating replacement changes": the copy remade its counterpart of `$S` on every pass. Now both report `doenet-e0005` and render; a copy of a point whose label holds `$P` shows its own coordinates. The guard that stopped the document is still there for any other such loop (B21, #2418) | fixed on main | `sourceContainsCopy` in `Copy.replacementForSource` |
| B16 | **Fixed by #2411** (closing #2406). A copy or extend of a `<collect>` inside an extended group showed nothing (`doenet-w0072`). The cause was not `from`, which kept its referent, but the type check: the copy, written as `<collect>`, got a `_collectList` and wrapped it in a new, empty `<collect>`. The same affected `<sort>` and `<shuffle>`, where a copy could show another order | fixed on main | `replacementIsOfType` in `verifyReplacementsMatchSpecifiedType` (`W/utils/copy.js`) |
| B17 | **Fixed by #2410** (closing #2407). An index that names nothing was reported inconsistently. Now an index below 1 on something that exists gives `doenet-w0104` quoting the whole reference, literal or dynamic; past the end is silent (#1499); an index that cannot apply (`$n.value[1]`) gives `doenet-w0100` and shows nothing, so `bindValueTo="$n.value[1]"` no longer binds to `n`. Left: entries of a list component (B18, #2413) and function references (B19, #2419) | fixed on main | the Rust resolver codes the failure (`ref_expand.rs`); `arrayEntryNamesFromPropIndex` |
| B18 | (#2413) An index on an entry of a list component is not reported like other indices: `$pl[2].coords[1]` shows the whole coordinates with no diagnostic (`$P.coords[1]` shows nothing, `doenet-w0100`); `$pl[1].xs[0]` gives info `doenet-i0018` (`$P.xs[0]`: `doenet-w0104`); `$l[1][0]` is silent. Breaks VAL-5 | reported in the issue | `W/utils/listEntryReference.ts` (#2157) |
| B19 | (#2419) A function reference that names nothing (`$$f(2)` with no `f`, or two) gives an uncoded "Ref resolution error" that doesn't quote the reference, and in a `<math>` shows nothing where `$f` shows `＿` | reported in the issue | the `FunctionRef` branch of `Expander::expand_refs` (`RS/ref_expand.rs`) |
| B20 | (#2414) `type` on a copy of a `<sort>` is ignored: `<sort copy="$s" type="text"/>` of `<sort name="s">10 3 1</sort>` sorts as numbers (`1, 3, 10`), while the same sort written with `type="text"` gives `1, 10, 3`. Breaks CPY-1 | reported in the issue | not traced; `LIST_FORM_COPY_ATTRIBUTES` in `W/utils/dast/listForms.ts` already counts `type` as changing what the list holds |
| B21 | (#2418) A replacement loop that is not caught as a cycle stops the document after 100 passes with an internal error that names no component. Breaks NAME-7 and D14. B15 was one such loop | reported in the issue; the guard is `replacementChangesFromCompositesToUpdate` | `W/core/EssentialValueWriter.ts` |

B1 and B2 both break the Tier 1 promise of CTX-1, "a fixed component cannot be changed by any
interaction". They should be fixed on main whatever happens to the rewrite.

---

## D1. Should a copy re-bind names outside the copied part where it lands? (affects the author model)

**Decided: (b), by referent. Done by #2397 (closing #2396) and #2400 (closing #2398, B14).** A reference in copied content keeps meaning
what it meant in the source:
- a referent inside the copied part becomes the copy's counterpart;
- a referent outside keeps that referent.

The rule goes by referent, not by how the reference is spelled. `$P.h` inside a copy of `P` has
its referent inside the copied part, so it names the copy's `h`. That reverses CPY-3's
"through the source's own name" case, and #2367's `$l.h` in a copy of a list. References in
attributes written on the copy tag itself resolve where the copy is written (NAME-4, D6). The
same rule covers D33's fresh form. #376 asks for the same for an `extend`.

Nothing decided since changes this. It removes one of the ways D33 found a copy's nested choices
can change without anything written on the copy saying so.

**What #2397 does and leaves:**
- `createNewComponentIndices` takes `keepReferents` (`W/utils/componentIndices.ts`), which
  `Copy.js` passes wherever an unlinked copy pastes its source, including the attributes a copy
  of a property or list entry takes from its source (`displayDigits="$dd"` on the list).
- A repeat's template, and other composites' content, still resolve where each instance lands.
  That is how `$i` finds each iteration's value. A template is not a copy.
- A copy pasted into a repeat iteration now names what its source named (`<indexOf copy="$io">`
  keeps `io`'s `target="$l"`, not the iteration's own `l`).
- **Fixed by #2400:** a copy of an `extend` resolved outside references from where the extend is
  written (B14). #2400 keeps an outside referent as a referent for every unlinked copy.
- **Left:** #376, the same rule for `extend`, is open. (B16, a copy or extend of a `<collect>`
  inside an extended group, was a type check, fixed by #2411.) The `_id_` and
  shadow-origin fallbacks in `refResolutionDependencies.ts` are still in place.

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

**Recommendation, now decided: (b).** Authors copy a problem to reuse it, not to have it re-interpreted by
whatever is nearby. A core that compiles source text can implement (b) cheaply by resolving
references *before* pasting, which is what the Rust resolver already does for the source.

**Tests that change.**
- `T/copying/extend_references.test.ts:7759` "attribute inherited by a copy of a copy resolves
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
- References into a list copy through a repeat index or a case render empty (B9, #2371). Partly
  fixed since (B9).
- A list `extend` does not reach its children by name (B10). Fixed by #2393.

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
  because their "content" is their children. D32 (done, #2409) makes a content change an error, while
  a bare, named or restyled extend stays allowed.
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

**Decided: a reference resolves where it is written, among what is written. Done by #2401**
(closing #2399). See NAME-4 and NAME-5. What #2401 leaves: a module attribute that refers to
itself through another component, or through a copy's name, is still a circular dependency that
stops the document (D14). `doenet-e0055` is reported at the `<moduleAttributes>`, not at the
attribute.

**Before #2401** (**[probe]**), a reference written in or on a `copy` or `extend` had its own
starting point:

| Written | Resolves from | Sees |
|---|---|---|
| an attribute on an ordinary element | the element | its written descendants, then outward |
| an attribute on `copy`, `extend` or `<module copy>` | the element's parent, skipping the copy (#2039) | **not** the children written inside the copy tag, nor the copied content |
| a child added inside a copy | inside the copy | the copied content first |
| an attribute on a module's own definition | the module's parent | "ambiguous" warning (`module.test.ts:1930`) |

Examples:
- `<section name="w" hide="$h"><boolean name="h">true</boolean></section>` is hidden: `$h` is its
  own child.
- `<section copy="$orig" hide="$h"><boolean name="h">true</boolean></section>`, with an outer
  `<boolean name="h">false</boolean>`, is shown: `$h` skips the child written inside the copy tag,
  and finds the outer `h`. An `extend` does the same.
- `$h` in a `<p>` added inside `<section copy="$S">` finds the copied `h` (NAME-5).

A name in an attribute that names the component itself resolves to that component ahead of a
sibling with the same name, but **not** ahead of a descendant with that name (**[probe]**):
- `<point name="Q" copy="$S" styleNumber="$Q.x"/>` beside another `<point name="Q">` uses its own
  `x`, and so does an ordinary `<point>`;
- `<point name="P" styleNumber="$P.x">(2, <number name="P">3</number>)</point>` has no style
  number: `$P` is the inner number, which has no `x`;
- `<point name="R" styleNumber="$R">(2, <number name="R">3</number>)</point>` has style number 3.

So today an attribute's search order is its component's descendants, then the component, then its
siblings. **A child's is the same** (**[probe]**): `<point name="P">(2, <number name="P">3</number>$P.x)</point>`
gives `(2, 3 ＿)`, and `<label>$A.x</label>` inside `<point name="A">(2, <number name="A">3</number>)</point>`
is empty. Both follow NAME-1's nearest scope. The component's contents are the nearest scope. The
component's own name belongs to its parent's scope, where it beats a same-named sibling, because a
reference can always name its own ancestor. So an attribute on an ordinary element already acts as
if written in a child.

**Principle (Tier 1, decided): a reference resolves where it is written, among what is written.**
- **The first name in a path resolves only to a component written in the DoenetML.** Content a
  copy, extend, repeat iteration or external document makes is never found by a bare name. It is
  reached through the name of the component that made it: `$c.h`, `$r[2].h`, `$s.s1`.
- **That holds wherever the reference is:** beside the copy, in an attribute on it, or in a child
  written inside it. A reference inside a copy or extend follows no special rule.
- **An attribute resolves as if it were written in a child of its component.** It sees the
  component's written descendants first, then the component's own name, ahead of its siblings,
  then outward (NAME-1's nearest scope, as for a child). An attribute on a copy or extend is no different from any other attribute:
  - it sees the children written inside the copy tag, because they are written;
  - it does not see the copied content, because that is not written there.
- **The existing privacy rules still apply** to written content. Children of `repeat`, `option`,
  `case` and `else` are reached only through their container (NAME-1, D22).
- **References inside the copied content** resolve where they were written, in the source. D1
  settles what they point to in the copy.

With D1, every reference resolves among the components written around it in the DoenetML. An
author who knows the resolution rules (nearest wins, a tie is ambiguous, paths walk down) can
tell where any reference lands by reading the DoenetML, with no rules specific to copies.

**What it changes:**
- **NAME-4** is restated as this rule (done). Its old purpose is kept: `xmin="$xmin"` on
  `<module copy="$m">` does not find the copied `<moduleAttributes>`' `xmin`, which is not written
  there. So it resolves outside the copy.
- **An attribute on a copy or extend sees the children written inside the tag.** In the second
  example above, `$h` becomes the inner `h`, and the section is hidden, as `w` is.
- **A child added inside a copy no longer sees the copied content.** `$h` in a `<p>` added inside
  `<section copy="$S" name="S2">` resolves outward, as it would beside the copy. To reach the
  copied `h`, write `$S2.h`. An unnamed copy's content can't be reached from a child added inside
  it: give the copy a name.
- **An attribute on a module's own definition** that names one of its own `<moduleAttributes>`
  refers to it, as `<p hide="$h"><boolean name="h"/></p>` does. `<module name="m" xmin="$xmin">`
  is then a cycle, reported as one (NAME-7, D14) instead of "Multiple referents". The diagnostic
  should say that the attribute refers to the module's own `xmin`.
- **Nothing changes for an attribute on an ordinary element.** It already acts as if written in a
  child: a same-named descendant first, then the component, ahead of its siblings. That order
  should be stated and tested, since no principle or test states it. Making the component beat its
  own descendants instead would need a new rule for references inside a component, both in
  children and in attributes. It is not proposed.

**Code:**
- The special origins for attributes on copies go: `W/utils/dast/convertToCopy.ts:195-229` and
  `W/components/ModuleAttributes.js:178-185` (#2039, #2038).
- The resolver must never index names in content a copy or extend adds for bare-name search,
  only for path steps through the copy's name. `add_nodes_does_not_make_previous_resolution_ambiguous`
  (`RS/build_resolver.test.rs:89`) already covers part of this.

**Tests that change:**
- `module.test.ts:1930` "attribute written on the module's own definition is ambiguous" becomes a
  cycle diagnostic;
- any test where a child added inside a copy finds copied content by a bare name (to find; NAME-5's
  **[probe]**);
- any test of an attribute on a copy or extend where the tag also has a written child with that
  name (none known).

The NAME-4 tests (`T/copying/extend_references.test.ts:7583-7790`, `T/tagSpecific/module.test.ts:1715-1930`)
should all still pass, since none of their copies has a written child with the referenced name.
That needs checking.

**Tests to add:**
- the search order from an attribute and from a child, on an ordinary element and on a copy: a
  same-named descendant, then the component, ahead of a same-named sibling;
- an attribute on a copy and on an extend that names a child written inside the tag;
- a child added inside a copy: a bare name, and the path through the copy's name;
- the module-definition cycle diagnostic.

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

**A property with no value.** #2416: `$c.maxNumber` of a `<collect>` with no `maxNumber`
shows `NaN`. The state variable is `null`, meaning "no limit", and a `<number>` made from it
shows `NaN`. Under VAL-5 and this recommendation it is missing, so it draws nothing, is `＿` in a
`<math>`, and is blank in comparisons. A property is never left out of the schema because it is
unset.

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
  particular. D32 replaces this item for select and conditionalContent: a bare, named or restyled
  extend stays allowed, and an extend that changes the content is an error. Extending a case
  stays banned;
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

**Open: does this apply to a copy?** #2415: `<collect copy="$G.cc"/>` of a `<conditionalContent>`
shows nothing and warns "No source found for collect", while `<text copy="$G.cc"/>` shows the
case's text. A copy written as another tag is wrapped in a new component of that tag
(`verifyReplacementsMatchSpecifiedType`), which for `<collect>` has no `from`. The same table
should decide copies:
- what a composite stands for is its content, so `<text copy="$cc"/>` of a case holding a text
  is a related pair;
- `<collect>` is not related to a text, so it is an error that names the mismatch, not a
  missing source.

**Tests.** `extend_references.test.ts:6495` "handle extending or copying with invalid component
type" changes to expect the error. The related-pair tests keep passing. Add a test that each
allowed pair works, and one that an unrelated pair gives the error.

## D27. What may an index select?

**Decided: an index never selects among a container's children.** It selects among the
instances a tag produces, as proposed below, with consequences 1–4. Nested repeats then take one
index per level: `$r[1][2]` is iteration 2 of the inner repeat in iteration 1 of the outer.

**Proposed with it: an index selects the entries of a value that has entries** (see "Values with
entries" at the end of this entry).

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

### Values with entries (proposed)

An index also selects among the entries of a value: the coordinates of a point, the entries of
a tuple or vector, the rows and entries of a matrix. These are not a container's children, so
the decision above does not touch them. They are what the value is made of.

**Today** (**[probe]** on main at `7c2bb1f`), each kind works a different way:

| Written | Shows |
|---|---|
| `$P[1]` of `<point>(3,4)</point>` | `3` (`variableForIndexAsProp = "xs"`) |
| `$v[1]` of `<vector>(5,6)</vector>` | `5` (`variableForIndexAsProp = "displacement"`) |
| `$c[1]` of `<coords>(1,2)</coords>` | `1` |
| `$mt[1]` of `<math>(8,9)</math>`, and `$x[1]` of `<mathInput prefill="(1,2)"/>` | `8`, `1` |
| `$mt.value[1]` | nothing, `doenet-w0100` |
| `$mv[1]` of a `<math>` holding `⟨8,9⟩` | `＿` |
| `$M[1]` and `$M[1][2]` of a `<matrix>`, or of a `<math>` holding a matrix | the whole matrix: the index is ignored |
| `$M[2][1]` | nothing |
| `$M.matrix[2][1]`, `$M.matrix[1]` | `3`; the first row as a 1×2 matrix |
| `$ms[1]` of `<math>5</math>` | `5`: a scalar indexed as itself |
| `$n[1]`, `$t[1]` of a `<number>`, a `<text>` | nothing, info `doenet-i0018` |
| `$mi[1]`, `$mi[2][1]` of a `<matrixInput>` | nothing, info `doenet-i0018`; `$mi.matrix[2][1]` works |
| `$ss[1]` of a `<spreadsheet>` | nothing, info `doenet-i0018`; `$ss.cells[1][2]` works |

**Recommendation.** An index on a component whose value has entries selects them, the same way
for every such component. The value decides, not the tag:
- **a point, vector or coords, or a math whose value is a tuple or vector:** `[i]` is entry i.
  The `⟨8,9⟩` case is a defect.
- **a math whose value is a matrix, including `<matrix>`:** `[i]` is row i, `[i][j]` is the
  entry. `$M[i]` is the same as `$M.matrix[i]` today.
- **an input** follows the type of its value: `<mathInput>` as `<math>`, `<matrixInput>` as
  `<matrix>`.
- **`$x.value[i]` is the same as `$x[i]`**, since the index applies to the value either way.
  Today it names nothing.
- **a scalar has no entries.** `$ms[1]` names nothing, as `$n[1]` and `$t[1]` already do, rather
  than showing the scalar. This is reported once, the same way for every type: `doenet-w0100`,
  "this value has no entries", not an info naming an internal prop.
- **out of range** follows NAME-2 and #2410: below 1, `doenet-w0104`; past the end, silent while
  the value can change size (#1499).
- **the pass-through rule (3)** applies: `$pl[2][1]` is the first coordinate of a point list's
  second entry, and `$r[1][2]` is coordinate 2 of iteration 1's one point. #2413's list-entry
  cases follow from it.

**A `<spreadsheet>` keeps `.cells`.** It is a component with several arrays (`cells`, and
whatever rows or columns it exposes), not a value with entries. `$ss[1]` should give a
diagnostic that says to write `$ss.cells[1][2]`, not an info naming an internal prop.

**Open:**
- **What a row of a matrix is.** Today `$M.matrix[1]` is a 1×n matrix. A tuple or a row vector
  would also be reasonable. Whichever is chosen, `$M[1]` and `$M.matrix[1]` agree.
- **A value whose shape changes.** `<math>$a</math>` can be a scalar at one moment and a tuple
  the next. `$m[2]` then names an entry or nothing as it changes. That is consistent with an
  index past the end, and needs no special rule.

**Tests to add:** each row of the table, under the rule. Also `.value[i]` equal to `[i]`, a
`<matrixInput>` and a `<mathInput>` holding a tuple and a matrix, `$ss[1]` giving its diagnostic,
and pass-through into a list of points.

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
  - It is the opposite of D1's decision (b), which keeps outside references live and pointing
    at their original referents.
- **(d) A dedicated way to say "initial value".** For example, `<number name="x"
  start="$x0"/>`, analogous to an input's `prefill`, which already means "start here, then
  change on your own".
  - It is explicit, and needs no change to `copy`.
  - It would have to be added to every value component, and authors must learn a new
    attribute.

**Recommendation.** Do (a) now. D1 is decided as (b), which keeps outside references live, so
(c) would now be a separate reversal of #559, not part of D1. (b) solves only the module case,
and adds a special case that users of modules would have to know about.

## D29. Hidden entries in lists

**Status: done for `hide` (#2368, closing #2265), on top of D3 (#2367).** Rules 1–6 below hold for
every list, and so does the container model for a list's own `hide`. `listEntryHide.test.ts` is
the sweep: 19 list forms, each with its first entry's source hidden. Still open:
- `styleNumber` and display settings under the container model: #2374;
- a `<sort>` or `<shuffle>` that stays a composite still draws an entry hidden only by a
  container: #2394 (below);
- writes through `$l[k].hide`, a follow-up under VAL-9.

A hidden list's entries in a `<choice>`'s text and an `<li>`'s lead are done too (#2388, closing
#2375; decided below).

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

**Decided, and done in #2388: what a parent that ignores its own hiding counts is what would be
drawn (#2375).**
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

#2388 implements this, and asserts it directly in `listEntryHide.test.ts`: for 22 contents, a
choice's text equals the text of a `<p>` holding the same content, and an `<li>` leads with a
component only when the `<p>` draws it. It also covers lists with no per-entry `hide` (a
`<sequence>`, the samplers, list operators such as `<cumulativeSum>`, and the list a repeat of
one value becomes), whose entries now take the list's hiding. A list's own
`hiddenIgnoreParent` follows `hideIsOwn`, as its `hidden` does, so `$tl` of a hidden list still
counts (D9 today).

**Decided and done: hidden content between an entry and its list (#2390, fixed by #2391).**
Before #2391, content hidden on its own and nested inside another list was still drawn. Examples:
`<textList><textList hide>q</textList> r</textList>` draws `q, r`, and so does a `<group hide>`,
`<collect hide>` or `<sequence hide>` inside a list, or a `<group hide>` inside a `<sort>`. That
broke rule 3.

#2390 asks how such an entry behaves through a reference. Is the hidden inner list or group like
the outer list's own `hide`, or like the entry's own?
- **Decided: like the list's own `hide`.** The inner list or group is a container of the
  entry's source, and a reference takes its source's own `hide`, not the hiding of the
  container it sits in (CTX-8, rule 4).
- So for the outer list `l`, `$l[1]` placed elsewhere is shown, `$l[1].hide` is the innermost
  source's own (`false`), and `$l[1].hidden` is `true`.
- It matches a plain component: `$n` of a `<number>` inside a `<group hide>` is shown.
- It holds whatever D9 decides, because D9 concerns a referent's own `hide`, not its
  container's.

#2391 implements this: an entry's `hidden` also counts each child's `hiddenIgnoreParent`, and a
`<sort>` or `<shuffle>` reads through a `<group>` child that sets nothing but `name` and `hide`, so
that it becomes a list form. `listEntryHide.test.ts` checks every example above, plus `$l[1]` and
`$l` placed elsewhere, `.hide`/`.hidden`, and the choice's text. A `copy=` or `extend=` of a list
holding a hidden inner list leaves that entry out too (rule 6).

**Known violation of rule 3, left by #2391 (#2394).** A `<sort>` or `<shuffle>` that stays a composite
still draws an entry hidden only by a container. **[probe]** at `a90ac9b`, each in a `<p>`, draws
`1, 2`:
- mixed entry types: `<sort><group hide><number>1</number></group><math>2</math></sort>`;
- another composite child:
  `<sort><repeatForSequence length="1" hide><number>1</number></repeatForSequence><number>2</number></sort>`;
- a group with another attribute:
  `<sort><group hide styleNumber="2"><number>1</number></group><number>2</number></sort>`.

The same `<group hide>` with only `hide` draws `2`. The `Sort` composite copies each source, so
the container's `hide` is lost. #2391 notes that a fix needs per-replacement hiding in
`BaseComponent`'s `hidden`. In the cells core, where a list form is the only form, the case does
not arise.

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

## D32. An extend cannot change what a tag makes

**Decided. Done by #2409** (closing #2404). REF-7 states the rule as it now stands, with the
error codes `doenet-e0056`–`e0061`. What #2409 adds or leaves:
- `sortIndices` is in scope too, and `collect`, `sort` and `shuffle` are recognized in their list
  forms;
- extending a `<case>` or `<else>` inside another `<conditionalContent>`, which used to work, is
  now an error. `copy` replaces it;
- `doenet-w0178` is retired;
- `w0168` and `w0169` stay for composites and lists outside the list, and for an attribute a
  module does not declare. That leaves `displayDigits` on a `<module extend>` ignored, where the
  Tier 1 rule says an appearance attribute takes effect;
- #2219, `styleNumber` on an extend of `<intersection>`, is still open.

**Today** an `extend` of a tag that makes its own content shows the same content, and changes
written on it are ignored, sometimes with a warning (w0168, w0169) and sometimes silently (B12).
ADR 0009 bans `extend` of `<select>`, `<conditionalContent>` and `<case>` outright, with no stated
reason for those three.

**[probe]** on main at `64954c6`, for `repeat`, `repeatForSequence`, `select`,
`selectFromSequence`, `shuffle`, `conditionalContent`, `collect`, `sort`, `sequence`,
`intersection`, `substitute` and `pretzel`:
- a bare `<T extend="$x"/>`, a named one, and one with `hide` all load and show the source's
  content;
- a named extend is reached through its name, as REF-8 says: `$e[2].y` through an extend of a
  repeat, `$e.y` through an extend of a select;
- a copy of a named extend loads and shows the same content.

What fails is an extend that would change the content, which is why #2400 had to revert
attempts to make it work. Examples:
- `<repeat extend="$r" for="7 8 9">`;
- `<select extend="$s" numToSelect="4">`;
- a child added inside `<shuffle extend>`, which is never shown but can be reached by name
  (#2366);
- `replacement` on an extend of `<substitute>`, which fails to load (#2216).

An earlier version of this entry proposed banning every `extend` of these tags. That broke
REF-1's equivalence of `$x` and a bare extend, and removed extends that only change appearance.
Neither was worth it: nobody has reported the failures above, while REF-1 is a shortcut authors
use all the time.

### Principle

**Tier 1, what authors are told (decided):**

> An `extend` is the same component again: it shares its source's content and state. It can
> have its own name, and it can look different, but it cannot change what the component makes
> or what its state can hold. Trying to is an error, and the error says why and what to write
> instead.

- `$x` is always the same as `<T extend="$x"/>` (REF-1), for every tag.
- A name, and any attribute that only changes how the content looks (`hide`, `styleNumber`,
  display settings such as `displayDigits`, `asList`, `disabled`, `fixed`), are allowed on any
  extend, with no list to learn. Authors expect them to work, so they must. On a tag that makes
  its own content they act as a container's attributes do on its content (CTX-5): they fill in
  what the content does not set itself.
- Authors are not given a list of banned forms. The error message carries the explanation, so it
  is part of the rule.

**Tier 2, what the implementation enforces:** the banned forms.
- **Attributes that decide the content,** on a tag that makes its own content:
  - repeating: `for`, `valueName`, `indexName` on `repeat`; `length`, `from`, `to`, `step` on
    `repeatForSequence`;
  - choosing at random: `numToSelect`, `withReplacement`, ranges, `exclude`, distribution
    parameters, `numSamples`; the per-class lists from #2392 (`attributesDeterminingChoices`);
  - choosing by condition: `condition` on `conditionalContent` and `case`;
  - gathering: `componentType`, `from`, `maxNumber` on `collect`; sort keys on `sort`;
  - generating: the sequence attributes on `sequence`;
  - computing: `match`, `replacement` and `type` on `substitute`; the inputs of `intersection`;
  - arranging: `mode` on `pretzel`;
  - a module attribute on an extend of a `<module>` (it decides the module's content, as `for`
    decides a repeat's).
- **Children written inside the extend,** when the tag's children are its content or its inputs.
  Only children the author actually wrote count. Before #2409, w0169 fired on every
  `<conditionalContent extend>`, even a bare one, because the parser's sugar gave it a `<case>`
  (#2404, comment). #2409 makes the sugar skip an element written with `extend`. The tags:
  the template of a repeat, the options of a select, the children of `shuffle`, `sort`,
  `conditionalContent`, `substitute` and `intersection`, the problems of a `pretzel`, and the
  choices of a `choiceInput`;
- **`shuffleOrder` on an extend of a `choiceInput`;**
  Children added to an extend of a `<group>` or `<module>` stay allowed: those tags hold what is
  written in them (REF-4, COMP-12, COMP-13).
- **The parts of a choosing tag** (`case`, `else`, `option`) cannot be extended at all. A branch
  means something only inside the tag that chooses it.

Which tags make their own content: those whose content is produced rather than written, that is,
the composites other than `group` and `module`, plus `pretzel`, whose arrangement is made by an
internal composite.

**Inputs whose children decide what can be selected.** An extend of an input shares its state,
and for an input `$x` is its value (REF-1a), so an extend is the only way to show the same input
twice. It stays allowed, bare, named or restyled. What it cannot do is change what the shared
state can hold:
- **choices added inside an extend of a `<choiceInput>`** are an error. **[probe]** on main at
  `64954c6`: `<choiceInput extend="$ci"><choice>c</choice></choiceInput>` lists `a`, `b` and an
  empty third choice. Selecting it sets the source's selected index to 3, a choice the source
  does not have, with value `null`. The source has nothing it could show;
- **`shuffleOrder` on an extend** is an error too. It would make a new random arrangement, and
  an extend shares its source's. Today it is ignored with no warning.

Other components whose children decide their state, such as an `<answer>` given more `<award>`s
inside an extend, follow the same rule. They are not surveyed yet.

**The error message is the rule's communication.** It must make an author think "of course".
Each one names the tag, what it makes, why an extend cannot change it, and what to write
instead. For example:

> A `<repeat>` makes its content from `for`. An `extend` shows the same content as `$r`, so it
> can't change `for`. To show `$r`'s content again, remove `for`. To make a new repeat with
> different values, use `copy`.

> Children written inside an `extend` of a `<select>` would be new options, but an extend shows
> the same choice as `$s`. To choose from more options, use `copy`.

Once D33 names the fresh form, the messages name it instead of `copy` where a new instance is
meant.

### What it changes

- **REF-1** stays as it is, with no exception.
- **REF-7** becomes a consequence of this principle: an extend of such a tag shows the same
  content, can be named and restyled, and cannot change the content.
- **w0168 and w0169** on these tags become errors directly, and so does w0178 on a pretzel. No
  deprecation step is needed: all three were added on `main` for 0.8 (#2213, #2341), and none is
  on the `0.7` branch. On 0.7 these forms were ignored with no warning, or failed. A 0.7 document
  meets the error only when it is moved to 0.8. Making the silent cases errors also fixes B12.
- **Appearance attributes on these extends must take effect.** #2219 (`styleNumber` on an extend
  of `<intersection>` is ignored) becomes a defect under this principle. Other tags were not
  checked.
- **#2216, #2215, the extend halves:** `replacement` on an extend of `<substitute>`, and `maxNumber`
  on an extend of `<collect>`, become errors rather than bugs to fix.
- **choiceInput:** choices added inside an extend, and `shuffleOrder` on one, become errors.
  The extend itself stays.
- **Pretzel:** `<pretzel extend="$p"/>` stays, sharing responses. Problems or a `mode` written on
  it become an error, replacing warning w0178.
- **Module attributes on an extend of a `<module>`** become an error that says to use `copy`.
  The extend itself stays allowed.
- **#2400** relies on this: it stops pairing references in a composite's template when an extend
  adds children, because those become an error.
- **ADR 0009's ban** on `extend` of `select`, `conditionalContent` and `case` is replaced by this
  principle for `select` and `conditionalContent`. For `case`, the ban stands, as a part of a
  choosing tag.

The extends a tag makes internally are not covered. A `<repeat>` inside an extended `<group>` is
shown again inside the extend (#2400). The principle is about what an author writes.

**Tests that change:**
- `T/diagnostics/warningsInfos.test.ts:1144-1406`: the w0168 and w0169 tests on these tags become
  error tests, except those for appearance attributes;
- the pretzel tests that check warning w0178 (`T/tagSpecific/pretzel.test.ts`);
- `T/tagSpecific/module.test.ts:1441`, a module attribute on an extend;
- extend tests that check that a content-changing attribute or child is ignored.

Tests that check that an extend shows the same content keep passing. Unlike the earlier proposal,
they need no rewriting to `$x`.

**Tests to add:**
- for each tag in scope: a bare, a named and an appearance-only extend show the content, with the
  appearance applied; a copy of a named extend;
- one error test for each banned attribute and for added children, checking the message;
- a `<choiceInput>` extend with an added choice, and with `shuffleOrder`, giving the error.

## D33. Two kinds of copy: written again here, or duplicated with its state (proposed Tier 1; names open)

**Today** a `copy` carries its source's reader state and random choices (CPY-2, CPY-8), and the
attributes written on it override the source's (CPY-1, D4). The two conflict when what is written
changes what is chosen: `<select copy="$x" numToSelect="4"/>` of a two-pick select cannot keep
two picks and make four (#2389, B11). #2392 makes such a copy choose again when it writes an
attribute that decides what is chosen with a different value. Two problems remain with any rule
of that kind.

**An author has to reason about values.** `<select copy="$s1" numToSelect="2"/>` would keep
`s1`'s picks, while `numToSelect="3"` would choose again. When `s1`'s `numToSelect` is computed,
the author cannot tell which one they wrote. Two variants were considered:
- **(A) keep the choices unless an attribute that decides them is written.** Hard to state: the
  author must know which attributes count. #2392 shows that it is hard to specify too. It needs a
  list per class, comparison with defaults, attributes that set the same parameter
  (`variance`/`standardDeviation`), and a rule that any reference counts as changed.
- **(B) keep the choices only if nothing at all is written.** Easy to state, but it removes the
  frozen copy (`<mathInput copy="$mi" disabled/>` keeps the reader's 5 today, **[probe]**). It
  either resets everything nested in a `<section copy boxed>`, or misses the case below. Its
  workaround, a plain copy then an extend that changes only appearance, is allowed under D32,
  but it is a second step authors have to know about.

**Changes reach nested content.** **[probe]** on main and on #2392's branch, variants 1–3:

```xml
<setup>
  <module name="m">
    <moduleAttributes><number name="k">2</number></moduleAttributes>
    <p name="p"><selectFromSequence from="1" to="100" numToSelect="$k"/></p>
  </module>
</setup>
<module name="m2" copy="$m" k="4"/>   <!-- shows nothing -->
<module name="m3" copy="$m"/>         <!-- the same two numbers as m -->
```

Neither (A) nor (B), checking only the tag the copy is written on, sees this. Today the same
happened when a reference inside a copy was looked up again where the copy landed. D1, done by
#2397, removes that case.

**Two intents behind `copy`.**
1. **Duplicate it, as it is now.** A review section repeating a problem with the reader's
   answers; a disabled copy of an input. The random choices must come along, because the reader's
   work only makes sense against the numbers they saw. This is CPY-2 and CPY-8.
2. **Write it again here.** A module defined in `<setup>` and used several times; a question
   repeated with new numbers. The author expects what would happen if the DoenetML were pasted by
   hand: no reader state, and random choices of its own. Two `<select>`s written by hand already
   choose independently, so this needs no new rule for randomness.

Authors who use a module from `<setup>` expect each use to have its own random values, even with
the same attributes. Today every `<module copy>` repeats the source's draws.

### Proposal

Let the form decide, never the attributes. Below, `NEW` is a placeholder for the name of the
second form (see "Names").

**The fresh form, `<T NEW="$x" …/>`: written again here.**
- It is the source's DoenetML pasted (CPY-1): attributes override, children are appended
  (D4), and names inside are private, reached through its name (NAME-3).
- It carries no reader state and no random choices. It starts as written content does.
- Its random components draw their own values, fixed for a given variant and kept through a
  reload, as any written content's are. Two uses differ, and each is stable. Under D17 each is
  seeded from its own position.
- References keep meaning what they meant in the source, as for a copy (D1): a referent inside
  the pasted part becomes its counterpart, and one outside is kept.
- `<module NEW="$m" k="4"/>`, with `m` in `<setup>`, becomes the documented module pattern.

**The duplicating form (today's `copy`): duplicated with its state.** It always keeps its source's
reader state and random choices (CPY-2, CPY-8), whatever is written on it.
- **Known before the document runs → error.** Writing on it an attribute that decides what a
  choosing tag chooses (`numToSelect`, `withReplacement`, a range, `exclude`, a sampler's
  `numSamples` or distribution) is an error, as is adding children that are options (an
  `<option>` inside a copy of a `<select>`). The check goes by attribute name, so
  `numToSelect="2"` and `numToSelect="3"` behave the same, computed or not. The error says to use
  the fresh form. This matches D32, which makes the same changes an error on an `extend`.
- **Known only at run time → warning.** When what is written reaches nested content, as `k`
  does above, the carried choices win and a
  warning says to use the fresh form. The mismatch may only appear after the reader interacts, so
  it cannot be an error. `<module copy="$m" k="2"/>` and `k="4"` then behave the same: the
  source's choices. `k` itself still takes the written value. Only the nested choice, which
  nothing written on the copy names, keeps the source's, so the result does not depend on the
  value of `k`.
- **Everything else is allowed** and keeps the rest of the state: appearance attributes (`hide`,
  `displayDigits`, `styleNumber`), `disabled`, `fixed`, and children added to a group or
  section (a random child added there draws its own value, as #2344 settled).
- **An attribute written on a copy or an extend takes precedence over carried state** (REF-3,
  CPY-1). That is why a choice attribute is an error rather than a silent keep: the copy cannot
  both honor the written attribute and keep the source's choices. **[probe]** on main, after the
  reader drags `P` to (7,8):
  - `<point copy="$P" x="3"/>` is at (3,8), and so is `<point extend="$P" x="3"/>`;
  - `<point copy="$P" xs="3 4"/>` is at (3,4);
  - `<mathInput copy="$mi" bindValueTo="7"/>` shows 7, though the reader typed 5 into `mi`;
  - `prefill` is not an exception: it applies only until the reader interacts, so
    `<mathInput copy="$mi" prefill="9"/>` showing the reader's 5 follows from what `prefill`
    means;
  - the same precedence should cover a reader's change to an attribute itself:
    `<p copy="$x" hide="false"/>` of something the reader hid is shown (D2).
- `<point copy="$P">(3,4)</point>` stays at (7,8) (**[probe]**), but not because of carried state:
  the coordinates child is ignored on any copy or extend, at load too (B13, #2395).
- Content attributes of tags that do not choose at random stay allowed: `for` on a copy of a
  repeat, `condition` on a copy of a conditionalContent (D4, B5). Carried reader state attaches by
  iteration and by case (D12, COMP-10).

**Both forms are needed for every tag**, including the choosing ones. A `<select>` has reader
state when its options hold inputs, so duplicating it with that state differs from writing it
again.

**For the author, one sentence each:**
- `extend`: the same component, with your changes;
- the duplicating form: a duplicate, as it is now;
- the fresh form: written again here.

### Names

Left open, for feedback. Two directions:
1. **Keep `copy` for the duplicating form, and name the fresh one** (`instance`, `use`,
   `template`, `new`). Existing documents keep their meaning. The migration is below.
2. **Give `copy` the fresh meaning, and name the duplicating form** by what it adds:
   `copyWithState`, or a name like `snapshot`.
   - The fresh form is then stated simply: "`copy` is the DoenetML pasted". The duplicating form
     is stated as an addition: "and also the reader's work and the random choices".
   - The module pattern uses plain `copy`, as authors write today.
   - `snapshot` suggests the result is frozen. It is not: inputs in it still change, and
     references inside it stay live (CPY-3).
   - Every existing `copy` of random content, or of content the reader changed, would change
     meaning. That needs a migration of its own: a version gate, or an automatic rename of
     existing `copy` attributes.

### Migration (direction 1)

- `<module copy>` with attributes keeps today's draws, except where an attribute changes a nested
  choice. Today that shows nothing (above), and after this it shows the source's choices with a
  warning.
- A hint on `<module copy>` of a module in `<setup>` points to the fresh form.
- Moving existing content to the fresh form changes its random values. doenet.org does not let
  the source or DoenetML version of assigned content change, so assigned work is not affected.

### What it changes

- **CPY-8** becomes absolute: a copy keeps its source's choices, with no exception for copies that
  change what is chosen. B11 is resolved by the error and the warning above.
- **#2392.** Its diagnostics, which stop a mismatch from failing the document, are needed in any
  case. Its resampling becomes the error (by attribute name) or the warning (at run time). Its
  per-class lists of attributes that decide choices (`attributesDeterminingChoices`) become what
  the error checks.
- **COMP-13.** The module pattern becomes the fresh form with attributes. A copy of a module with
  attributes stays allowed, as a duplicate.
- **Documents that promise a new choice from a copy:**
  - `reference/pretzel.mdx` says a copy with added problems, or a `mode` that does not allow the
    source's order, makes a new order. That moves to the fresh form.
  - **[probe]** `<choiceInput copy="$ci" shuffleOrder>` with an added `<choice>` shuffles again
    today. An added choice is an option, so it becomes the error above when the order is
    shuffled. Whether that applies when `shuffleOrder` is not known until run time is a detail
    to settle.
- **D32.** Its error message names the fresh form, not `copy`, as the way to make a new
  repeat or select.
- **D17** is the mechanism for the fresh form's randomness.
- **D18** no longer has to say which carried state "still fits" a changed copy.
- **D2** gains the rule that what is written on a copy takes precedence over carried state,
  including the reader's change to that same attribute.
- **D28.** The fresh form gives option (d)'s "start here, then change on your own" a natural
  place, though `copy="$x0.value"` is still needed for a single value.

### Open points

- The names (above).
- Whether a copy of a `choiceInput` with added choices is an error only when its order is
  shuffled.
- Whether several fresh uses of one module should ever share draws. If so, the author would ask
  for it explicitly, for example with a seed attribute.

**Tests that change** depend on the name. Under direction 1:
- #2392's `copy_changes_choices.test.ts`, if merged: its resampling cases become error and
  warning cases;
- copies of a select, pretzel or choiceInput with added options;
- `module.test.ts` cases that copy a module with attributes and expect independent values, if
  any. None are known.

New tests:
- each choosing tag: the fresh form draws its own values, distinct between two uses and stable
  through a reload;
- the error for each attribute that decides a choice, with literal and computed values;
- the run-time warning for the module case above.

## D34. A text's notation when it is read as math: `isLatex` and `format` (proposed Tier 2)

**Today** (#2408 and its comment; **[probe]** on main at `a53fbb9`). `tl` is
`<text isLatex>\frac{x+1}{2}</text>`, `tt` is `<text>x+1</text>`, and `mm` is `<math>y/3</math>`.

| Written | Shows |
|---|---|
| `<math format="text">$tl</math>` | `(x + 1)/2`: the text's `isLatex` wins |
| `<math format="latex">$t</math>`, `t` = `<text>\frac{x}{2}</text>` | `＿`: parsed as plain text (#2408) |
| `<math format="latex">1 + $t</math>` | `1 + ＿` |
| `<math>2$tt</math>` | `2 (x + 1)`: the text is parsed on its own, as one operand |
| `<math>$mm.latex</math>` | `y/3`: a `.latex` property is read as LaTeX with no `isLatex` |
| a write of `\sqrt{y}` through `<math>$tl</math>` | `tl` holds `\sqrt{y}`: written back in its own notation |

A `<text>` child of a `<math>` goes through the text's math adapter, `textToMath({ value, isLatex })`
(`W/utils/valueFunctions/text.js`), before the `<math>` sees it, so the `<math>`'s `format` is
never consulted. `<math format="latex">$tt</math>` with `tt` = `x+1` shows `x + 1` only because
`x+1` parses the same way in both notations.

**Proposed rule (Tier 2): a text whose notation is known keeps it. A text whose notation is not
known is read in the notation of the place that reads it.**
- **Known notation:**
  - `isLatex` written on the `<text>`, true or false;
  - a value that is LaTeX by where it comes from, such as a `.latex` property. Main already reads
    `$mm.latex` this way.

  The reader's `format` does not override it.
- **Unknown notation:** `isLatex` not written. The string is just characters, read as if
  written at that place (VAL-3). Inside `<math format="latex">`, that is LaTeX.
- **Defaults don't count.** "Written" means the author wrote the attribute, as for the reader's
  own display settings in VAL-4. `format` defaults to `"text"` and `isLatex` to `false`. If
  defaults counted, neither could ever give way.

**Why the source's notation wins, unlike display settings in VAL-4.** In VAL-4 a reader's own
setting overrides the referent's, but display settings only change how a value looks. Notation
decides the value itself. A write through the reference lands on the text (VAL-11) and must be
stored in the notation it is read in.
- If `format="text"` overrode `isLatex`, a write would store LaTeX in `tl` that the reader then
  parses as plain text, and the round trip would show `＿`.
- When the known notation wins, reading and writing always use the same notation.

**What follows:**
- **One text reference is one operand,** as today. In `<math format="latex">1 + $tt</math>`, the
  `1 + ` and `$tt` are each read as LaTeX, separately.
- **Every place that reads a text as math** follows the rule: `<number>`, `<point>`, math-typed
  attributes, `bindValueTo`. Only `<math>` has `format`, so it is the only place whose behavior
  changes. Elsewhere an unknown-notation text is read as plain text, as today.
- **A write through `<math format="latex">` into an unknown-notation text stores LaTeX
  characters.** The text does not declare `isLatex`, consistent with "just characters". But
  the stored string is now LaTeX:
  - another reader of the same text with plain-text notation then shows `＿`;
  - the text itself, drawn in a `<p>`, shows the LaTeX source.

  This only happens when one text is read in two notations and written through one of them,
  which is rare. An author who reads a text as LaTeX in several places should declare
  `isLatex`.
- **Text operators.** The motivating case in #2408 is a `<substitute type="text">` of
  `$fp.latex`, which has no `isLatex`. Under the rule, `<math format="latex">` reads it as LaTeX,
  which fixes it. Whether a text operator should keep its input's known notation is left open.
  Without that, `<math>` with the default format still reads such a substitute as plain text.

**Tests to add:**
- `format="latex"` with an unknown-notation text parses it as LaTeX, using a string that parses
  differently in the two notations (`\frac{x}{2}`);
- `isLatex` written as true, and as false, wins over either `format`;
- a `.latex` property is read as LaTeX under either `format`;
- a write round-trips in each case;
- `1 + $t` under `format="latex"` reads both parts as LaTeX.

No test pins the #2408 case today.

A candidate addition to VAL-3: "a reference to a text, read as math, is parsed in its known
notation, or else in the reader's".
