# References, `extend` and `copy`

This is the central document. It covers how a name finds its referent, what a bare reference,
an `extend` and a `copy` each mean, and what happens when they are nested.

Paths: `T/` is `packages/doenetml-worker-javascript/src/test/`, `W/` is
`packages/doenetml-worker-javascript/src/`, and `RS/` is
`packages/doenetml-worker-rust/lib-doenetml-core/src/dast/ref_resolve/`. Tiers are defined in the
[README](README.md).

## The three forms in one picture

| Form | What it is | State | References inside the source |
|---|---|---|---|
| `$x` | x itself, shown again | shared with x | keep the meaning they have in x |
| `<T extend="$x" …/>` | x itself, with the changes written on it | shared with x | keep the meaning they have in x |
| `<T copy="$x" …/>` | x's DoenetML pasted here, with the reader's current state | its own, starting from x's | looked up again where the copy lands |

Everything below refines this table.

---

## 1. Name resolution

### NAME-1: nearest match wins; a tie is an error, not a guess (Tier 1)
`$x` means the `x` in the nearest enclosing scope that contains one. If that scope contains two,
the reference is ambiguous: it reports `doenet-w0105` "Multiple referents" and shows nothing.

```xml
<section><number name="n">10</number><p>$n</p></section>   <!-- 10 -->
<section><number name="n">20</number></section>
<p>$n</p>                                                  <!-- ambiguous -->
```

Sub-rules. All three are Tier 2: they rarely matter, but they keep the rule total.
- A reference can always name its own ancestor, even where the name is ambiguous elsewhere.
  For example, `$p.creditAchieved` inside `<problem name="p">` works with a second `p` in the
  section (`RS/resolve.test.rs` `resolve_to_parent_in_ambiguous_case`).
- An ancestor's name beats a descendant with the same name
  (`parent_name_supersedes_unique_descendant`).
- Children of `repeat`, `repeatForSequence`, `option`, `case` and `else` are invisible from
  outside. They are reached only through the container: `$r[2].x`, `$opt.x`, `$cc.x`
  (`elements_with_children_invisible_to_their_grandparents`, `RS/resolve.rs:64`).
  - **[probe]** This covers both forms of `<conditionalContent>`. A plain `$x` from outside
    reports "No referent found". `$cc.x` follows the active case, and is empty when no case
    is active.
  - For repeats and options the privacy is needed, because they make several instances of a
    name. A `conditionalContent` shows at most one case at a time, so it is the one place where
    the privacy is a choice rather than a necessity (D22).

Evidence:
- `packages/docs-nextra/content/concepts/references.mdx` ("Resolving to the nearest match",
  "When a reference is ambiguous");
- `T/copying/extend_references.test.ts:2908` "references to parent";
- `T/diagnostics/diagnosticCodes.test.ts` (w0104, w0105).

Code: Rust resolver, `RS/resolve.rs:170` and `search_parents` at `:462`.

### NAME-2: paths walk down through names, copies and indices (Tier 1)
- `$a.b` is the `b` inside `a`.
- `$a[2]` is the second item that `a` produces.
- `$a[2].b[3]` chains the two.
- Whatever part of the path does not match a name is read as a property.

An index is read live and rounded like an integer: `$l[$i]` follows `i`. An index of 0, a
negative index, or one past the end names nothing. Since #2410 (B17), an index below 1 on
something that exists gives `doenet-w0104` quoting the whole reference, literal or dynamic. Past
the end is silent while the length can change (#1499). An index that cannot apply, such as
`$n.value[1]`, gives `doenet-w0100` and names nothing. Not yet: entries of a list component
(B18, #2413) and function references (B19, #2419).

Evidence:
- `T/copying/extend_references.test.ts`: `:2401` "extending repetitively" (`$g12.Pa` four levels
  down), `:6408` "recursive extends", `:5773` "dot and array notation, recurse to subnames of
  composite replacements".
- `T/tagSpecific/repeatForSequence.test.ts:156`: nested repeats, `$a[2].b[3].c` and the
  positional `$a[2][1][3]`. Under D27 the positional form becomes `$a[2][3]`.
- `T/copying/value_references.test.ts`: `:286` "an index into a list resolves itself and
  re-resolves as the index changes", and `:333`, rounding 2.6→3, 1.5→2, 4.4→4, −1 → nothing.

Code: `RS/resolve.rs:310-330` (`unresolvedPath`); `W/core/dependencies/refResolutionDependencies.ts`
finishes the path after composites expand.

What an index may select is itself open. Today it can be an entry, an iteration, a pick, or a
child of a group, iteration or picked option. D27 proposes instances only.

Limits:
- **Deep property chains** (`$l.points[1].coords`, `$l.points[1].xs[1]`) are not supported
  today. About 20 assertions are commented out with `XXX: restore` at
  `T/copying/extend_references.test.ts:4703`. Whether they are a guarantee is an open question
  ([decisions.md](decisions.md), D19).
- **An index into a composite of references** (`$g[1]` with `<group name="g">$x</group>`) can
  panic the resolver (#1942). Under D27, indexing a group's children is an error, so this form
  would give a diagnostic instead.

### NAME-3: names inside a copy or a repeat iteration are private (Tier 1)
A copy brings its content's names into existence only beneath the copy's own name. A bare `$h`
written next to `<section copy="$S" name="S2"/>` still means `S.h`, and makes nothing
ambiguous. Reach the copy's `h` as `$S2.h`.

- **[probe]** A bare `$h` next to one or two copies or extends of `S` resolves to `S.h` with no
  warning. Typing into `S2.h` does not change it.
- **Evidence:** the Rust test `add_nodes_does_not_make_previous_resolution_ambiguous`
  (`RS/build_resolver.test.rs:89`), and the docs example "References in a copy's attributes".
- **JavaScript test:** `T/copying/unlinked copy.test.ts` "names inside a copy are reached only
  through the copy's own name (NAME-3)", added by #2367. It checks that:
  - `$R.h` of an unnamed `<p copy>` inside `<section name="R">` names nothing;
  - `$R2.P2.h` and `$Q2.h` (a copy of a copy) resolve;
  - a bare `$h` beside the copies stays the original's.
- **Lists.** #2367 also brings copies of lists into line with this rule:
  - the source list's name no longer leaks into the copy (`$c.l` and `$c2.c1` name nothing);
  - `$c2.h` works for a copy of a copy;
  - `$c.h` works when written before the copy.

### NAME-4: a reference resolves where it is written, among what is written (Tier 1; D6, done by #2401)
A reference's first name resolves only to components written in the DoenetML. Content a copy,
extend, repeat iteration or external document makes is reached only through the name of the
component that made it. This holds wherever the reference is, with no rule specific to copies:
- **beside a copy:** a bare `$h` next to `<section copy="$S" name="S2"/>` means `S.h` (NAME-3);
- **in an attribute on a copy, extend or `<module copy>`:** the attribute resolves as any
  attribute does. It sees the children written inside the tag, but not the copied content. In
  `<section copy="$orig" hide="$h"><boolean name="h">true</boolean></section>`, `$h` is the inner
  `h`. `xmin="$xmin"` on `<module copy="$m">` resolves outside the copy, because the copied
  `<moduleAttributes>` are not written there;
- **in a child added inside a copy:** it does not see the copied content. `$h` resolves as it
  would beside the copy, and `$S2.h` reaches the copied `h`.

Before #2401, attributes on a copy resolved from the copy's parent, skipping even the children
written inside the tag, and a child added inside a copy saw the copied content first.

**An attribute on a module's own definition** sees what is written inside the module.
`<module name="g" xmin="$a">` with a `<number name="a">` inside it finds that `a`. When the attribute
names the module's own attribute (`xmin="$xmin"`), it would depend on itself, and gives error
`doenet-e0055`. The module attribute keeps its own value, and the rest of the document renders.
Two forms are still a circular dependency that stops the document (D14): a self-reference
through another component (`xmin="$p"` with `<number name="p">$xmin</number>` inside), and
`xmin="$m4.xmin"` on `<module copy="$g" name="m4">`.

- **Docs:** `concepts/references.mdx` "References in a copy's attributes".
- **Tests:**
  - `T/copying/extend_references.test.ts`, "a reference resolves where it is written, among what
    is written" (#2401), and "references in a copy's attributes resolve where the copy is
    written";
  - `T/tagSpecific/module.test.ts`, "sees what is written inside the module", "refers to the
    module's own attribute", and the NAME-4 tests before them;
  - Rust: `copied_content_is_found_only_through_the_copy` (`RS/build_resolver.test.rs`).
- **Code:** the resolver records names that reach copied content (`copied_names`) and skips them
  in `search_parents`, so they are reached only by a path step through the copy's name.
  `ModuleAttributes.js` gives a module attribute's reference the `<moduleAttributes>` as its
  origin.

### NAME-5: an attribute resolves as if it were written in a child of its component (Tier 2)
The search order is NAME-1's nearest scope, from a child and from an attribute alike:
1. the component's written descendants;
2. the component's own name, ahead of a same-named sibling;
3. outward.

In `<p hide="$h"><boolean name="h"/></p>`, `$h` is the inner `h`. In
`<point name="P" styleNumber="$P.x">(2, <number name="P">3</number>)</point>`, `$P` is the inner
number. Tested on ordinary elements and on copies by #2401.

### NAME-6: external content is sealed (Tier 1)
- Names inside content loaded with `copy="doenet:…"` are invisible to the document, and the
  document's names are invisible to it.
- You reach in by naming each document's root in turn: `$s.s1.s2.p3`. Each path part crosses
  at most one document boundary.

This is the one place where "pasted DoenetML" deliberately does not hold, and that is
principled: shared content is a sealed scope.

Evidence: `T/copying/external_references.test.ts`:
- `:97`, three source documents;
- `:159`, fails without the parent name;
- `:221`, local names supersede external ones;
- `:272`, external content cannot see local names;
- `:324`, `:364`, `:409`, extend and copy of external content.

### NAME-7: cycles terminate and are reported (Tier 1; how they are reported is Tier 3)
These are reported as circular dependencies, and loading never hangs:
- a component that extends itself or its ancestor;
- a self-referential attribute;
- mutually recursive texts.

Today there are two failure modes ([decisions.md](decisions.md), D14):
- Composite cycles report a diagnostic, and the rest of the document loads.
- State-variable cycles throw. The whole document fails to load, and
  `<p name="p" copy="$p"/>` reports an internal `<_copy>` (**[probe]**).

A copy of a component that references itself loads too (#2412, closing #2405, B15):
`<section copy="$S"/>` of `<section name="S"><p>[$S]</p></section>` reports `doenet-e0005` and
renders, and a copy of a point whose label holds `$P` shows its own coordinates.

**Known violation (B21, #2418):** a replacement loop that is not caught as a cycle still stops
the document after 100 passes, with an internal error that names no component.

Tests: `T/diagnostics/circularReferences.test.ts:27-67` (asserts `rejects.toThrow`), `:115-175`,
`:755`. A reference to a point inside its own label is allowed and means "my value" (#1384).

---

## 2. Bare references and `extend`

### REF-1: `$x` is shorthand for the unadorned `extend` (Tier 1 for the meaning, Tier 2 for exact parity)
`$x` means `<T extend="$x"/>`, where T is the referent's own tag. Write the `extend` out only to
change the type, or to add a name, attributes or children.

The two forms are built the same way, so they behave the same in every container. That
includes `fixed` containers, `<math>…+1</math>` and `<text>…!</text>`, and holds before and after
the source is hidden.

Evidence:
- `T/copying/extend_parity.test.ts:52` "are made and shown the same way": 7 references ×
  4 containers;
- #2233.

Code: `packages/doenetml-worker-rust/lib-doenetml-core/src/dast/ref_expand.rs:43-91` turns bare
into extend. `W/utils/dast/valueReferences.ts:780` `unadornedExtendType` plans both the same way.

Exceptions:
- An extend of a `case`, `else` or `option` is an error, bare `$c` included (D32, REF-7). Such a
  part means something only inside the tag that chooses it.
- An extend stops being bare-equivalent as soon as it has a name, an attribute, children or a
  different type.
- A name alone already changes the click identity (REF-9).

### REF-1a: a bare reference to an input is the input's value (Tier 1)
`$mi` is the math the reader entered, not a second input. `<mathInput extend="$mi"/>` gives a
second input tied to the first. So for these components, a bare reference and the unadorned
extend differ.

**[probe]** `<p>$mi $ti $bi $s</p>` (a mathInput, a textInput, a booleanInput and a slider)
holds four value references. `<p><mathInput extend="$mi"/></p>` holds a `mathInput`.

The mechanism is `variableForImplicitProp` on the referent's class
(`W/components/abstract/Copy.js:493-595`). An implicit prop is used unless `createComponentOfType`
names the referent's own type, which the written-out extend does.
- **Classes that read as a different type:** every input (`Input.js`, `MathInput`, `TextInput`,
  `BooleanInput`, `ChoiceInput`, `Slider`, `MatrixInput`, `FractionInput`, `CodeEditor`,
  `SubsetOfRealsInput`, `OrbitalDiagramInput`), `Answer` (`submittedResponses`), `Award`
  (`awarded`) and `Choice` (`submitted`).
- **Classes where it is only an optimization:** `Math`, `Text`, `Number`, `Boolean` and `Label`
  read their own `value`, which gives the same type.

Evidence: `T/copying/extend_references.test.ts:6040` "implicitProp from an input", `:6172`
"references of composites ignore implicitProp", and `:6209` (`$repeat[1]` gives an input, while
`$repeat[1].mi` gives a math).

The input case is a long-standing author idiom. The answer, award and choice cases are less
obvious, and none is documented as a rule (D21).

Tier 3: that both forms are built as a `_ref` value reference is an implementation choice
(the `_ref` assertions in `extend_parity.test.ts` and `extend_references.test.ts`).

### REF-2: a reference is linked in both directions (Tier 1)
`$x` and `<T extend="$x"/>` show x's current state. Typing into, dragging or `updateValue` on
the reference changes x.

Evidence:
- `T/copying/unlinked copy.test.ts:285` "copy no link, base test": `updateValue` on an extend
  doubles the source.
- `T/copying/extend_references.test.ts`:
  - `:3320` "add children with extend": dragging `g1a.P1` moves `P1`;
  - `:511` "extend props of extend still updatable".
- Per-component "all updatable with copies" tests, e.g. `T/tagSpecific/circle.test.ts:5099`.
- **[probe]** `<point name="pv" extend="$v"/>` of a vector: dragging `pv` changes `v`.

Code: shadowing in `W/core/StateVariableDefinitionFactory.ts:496-800`. Writes go to the shadow
source through `W/core/EssentialValueWriter.ts`.

### REF-3: an attribute written on an extend replaces the source's; the rest are inherited (Tier 1)
- The extend's `name` is never inherited.
- Along a chain of extends, each link's own attribute wins.

**[probe]**
```xml
<math name="m" hide="$h" displayDigits="2">1.2345</math>
<math name="e"  extend="$m" displayDigits="4"/>   <!-- 1.235, hides with h -->
<math name="e2" extend="$m" hide="false"/>        <!-- shown even when h is true -->
```

Evidence:
- `T/copying/attribute_values.test.ts:33` "an attribute written on an extend beats the one it
  would take from the referent";
- `:72` "along a chain of extends … each link's own attribute wins";
- `T/copying/extend_references.test.ts:86` "extend overwrites properties".
- The same pattern is tested ad hoc in about 15 tag files:
  - `angle.test.ts:1381`, `graph.test.ts:2148`, `line.test.ts:5630`;
  - `circle.test.ts:5469`, `boolean.test.ts:1604`, `hint.test.ts:103`, `label.test.ts:1401`;
  - `functionTag.test.ts:645` and four more in that file;
  - `math.test.ts:2759`, `:3140`.

Code: `W/components/abstract/Copy.js:1697-1745`. Extends also use per-variable
`dontRecurseToShadowsIfHaveAttribute` lists.

- **REF-3a, alternative pairs (Tier 2).** When an attribute has an alternative spelling
  (`displayDigits`/`displayDecimals`, `variable`/`variables`, `derivVariable(s)`), writing either
  one on a reference replaces both of the source's.
  - Tests: `T/copying/unlinked copy.test.ts:2504`, which covers extend, copy, a copy of a prop and
    a copy of a list entry.
  - Implemented twice: `replacesOnReference` for copies and hand-written dependency lists for
    extends (#2241). One rule should have one mechanism.

### REF-4: children written inside an extend are appended after the source's (Tier 1 for ordinary components)
`<p name="pe" extend="$p">b</p>` of `<p name="p">a<text name="t">x</text></p>` shows "axb".
`$pe.t` resolves (**[probe]**).

Evidence: `T/copying/extend_references.test.ts`:
- `:3320` "add children with extend";
- `:3470`, `:3614`, `:3763` (groups, including several levels);
- `:4335` "recreated replacements include added children";
- `:4482` (with a prop and an index);
- `:3266` and `:6876` (children still appear when the referent is invalid).

Code: `W/components/abstract/Copy.js:1747-1758`, `addChildrenFromComposite` (`:4448`).

Exception: composites (REF-7).

### REF-4a: of a child a component uses only one of, the last one written wins (Tier 1)
A component uses only one `<label>`, `<title>` or `<shortDescription>`. When more than one is
written, the last one is used. REF-4 appends added children after the source's, so a `<label>`
or `<title>` written inside an `extend` or `copy` replaces the source's. That is not an
exception to REF-4; it is the same rule an author meets when writing two labels directly.

**[probe]** These were checked by writing two labels directly, and by adding one in an
`extend` and in a `copy`:

| What | Components | Two written | Added in `extend` or `copy` |
|---|---|---|---|
| `<label>` | `point`, `vector`, `line`, `lineSegment`, `ray`, `circle`, `polygon`, `polyline`, `curve`, `function`, `piecewiseFunction`, `mathInput`, `textInput`, `booleanInput`, `choiceInput`, `slider`, `matrixInput`, `fractionInput`, `updateValue`, `callAction`, `triggerSet`, `answer` | the second | the added one |
| `<title>` | `section`, `hint` | the second | the added one |
| `<title>` | `<table>` | **the first** | **the source's** |
| `<caption>` | `<figure>` | **the first** | **the source's** |
| `<shortDescription>` | `graph`, `image` | the second | the added one |

Code:
- `<label>`: one shared definition in `W/utils/label.ts:454`, which takes the last label child.
  The renderer's `labelChildInd` (`:239`) also uses the last.
- `<title>`: `SectioningComponent.js:509`, `Hint.js:109` and `Chart.js:1022` take the last.
- `<shortDescription>`: `Input.js:949` and `Video.js:169` take the last.
- The two exceptions: `Table.js:140`, `:165` and `Figure.js:155`, `:181` take index `[0]`. So
  does `Document.js:199`, though a document is not extended. On a table or figure, an `extend`
  cannot change the title or caption at all. This looks like an accident, and D25 proposes
  making them follow the rule.

`<legend>` is different on purpose: it takes one `<label>` per item.

No test pins the "last one wins" rule, for any component, either written directly or through an
`extend`. The only related test is a point's label being overridden on an extend
(`extend_references.test.ts:86`). This rule should be one schema-driven sweep over every
component with a single-child group ([testing-principles.md](testing-principles.md) §2.3).

### REF-5: a different tag is allowed only between related types; any other pair is an error (Tier 2)
`<T extend="$x"/>` with T different from x's type asks for a T that behaves like x. That has a
meaning only for related types:
- math, number, text and boolean, among each other;
- point, vector and coords;
- an input from its value type, and a value type from an input;
- a list from the matching scalar or list (#2231).

For these pairs the result is x's value as a T. It is linked both ways where the conversion can
be run backward: **[probe]** `<point extend="$v"/>` of a vector is draggable, and dragging it
moves `v`.

Any other pair should be a load-time error on the extend, such as "cannot extend a `<section>`
as a `<math>`" (D26).

Evidence for the related pairs:
- `T/copying/extend_references.test.ts:3200` "extend wraps to match specified type" (math,
  number and coords from a mathInput and a point), and `:6366`;
- `T/copying/list_extend_attributes.test.ts` (#2231).

**Current behavior for unrelated pairs does not need to be reproduced.** Today an unrelated pair
gives a default T, sometimes with a confusing "Invalid children" warning and sometimes with no
warning at all. For example, `<boolean extend="$m"/>` of a math is silently `false`. A
container tag (`<p extend="$m"/>`) just holds the referent. A new core should give the error
instead, and no test should pin today's results. The one existing test of an invalid pair,
`extend_references.test.ts:6495`, should change to expect the error.

Inconsistency within the related pairs: across a type change, a list extend takes the source's
same-named attributes (`hide`, `fixed`, display settings, #2231), but a scalar extend does not
(D19).

### REF-6: an extend keeps the source's bindings, however deep (Tier 1)
An extend is the same component. Every reference inside the extended subtree means what it
means in the source, through any number of chained extends. This includes references to names
outside the subtree.

**[probe]**
```xml
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="T"><number name="n">2</number><group extend="$A.g" name="ge"/></section>
```
`T.ge.p` is 1, even though `T` has its own `n`.

Evidence:
- `T/copying/extend_references.test.ts`: `:2401` (four levels), `:6408` (three levels), `:2908`,
  and `:3153`/`:3177` "extend repeat";
- `T/copying/external_references.test.ts:409`.

Code: `expandShadowingComposite` (`W/core/CompositeExpander.ts:426`) copies the source's
replacements without resolving them again. When a linked shadow does have to re-resolve and
fails, it falls back to the source's binding (#1805,
`W/core/dependencies/refResolutionDependencies.ts:278`).

### REF-7: an extend is the same component again; it cannot change what a tag makes (Tier 1; D32, done by #2409)
An `extend` shares its source's content and state. It can have its own name and can look
different, but it cannot change what the component makes or what its state can hold. Trying to
is an error located on the extend, which shows the error in place of its content. The rest of
the document renders.

- **Allowed on any extend:** a bare extend (the same as `$x`, REF-1), a name, and attributes that
  only change appearance (`hide`, `styleNumber`, display settings, `asList`, `disabled`,
  `fixed`). A `<group>` or `<module>` extend can also be given children, which are appended.
- **Errors** (Tier 2, the list authors are not given):
  - on a tag whose content is made rather than written, an attribute its class declares beyond
    those an extend applies, `doenet-e0056` (on a `pretzel`, only `mode`), and children written
    inside, `doenet-e0057`. The tags are `repeat`, `repeatForSequence`, the `select…` and
    `sample…` tags, `shuffle`, `conditionalContent`, `collect`, `sort`, `sortIndices`,
    `sequence`, `intersection`, `substitute`, `split`, `lorem`, `idx` and `pretzel`;
  - on a `<module>`, a module attribute declared in its `<moduleAttributes>`, `doenet-e0060`;
  - on a `<choiceInput>`, choices written inside, `doenet-e0058`, and `shuffleOrder`,
    `doenet-e0059`;
  - any extend of `case`, `else` or `option`, `doenet-e0061`, including a bare `$c` (REF-1's one
    exception). `<case copy="$c"/>` still works.
- **The message** names the tag, what it makes, why an extend can't change it, and what to write
  instead, citing the reference: "A `<repeat>` makes its content from `for`. An `extend` shows
  the same content as `$r2`, so it can't change `for`. To show the content of `$r2` again, remove
  `for`. To make a new `<repeat>` with a different `for`, use `copy`."
- **Still warnings:** `doenet-w0168` and `doenet-w0169` remain for composites and lists outside
  the list above, and for an attribute a module does not declare, such as `displayDigits` on a
  `<module extend>`, which is ignored. Under the Tier 1 rule an appearance attribute should take
  effect there instead.
- **A reference to an errored extend** (`$e`, `<repeat copy="$e"/>`) shows the error again and
  reports it again at its own location.

Evidence: `T/copying/extend_cannot_change_content.test.ts` (91 tests, #2409): bare, named and
appearance-only extends of 18 tags, display settings taking effect, a named extend reaching
inside, one error test per banned attribute and kind of child, `module`, `choiceInput`,
`case`/`else`/`option`, an extended `group` holding a repeat.

Code: `extendChangesContentErrors` and `attributesAnExtendApplies` in
`W/components/abstract/Copy.js`. The parser's `conditionalContent` and `repeat` sugar skips an
element written with `extend`, which fixed B12.

Known bugs, open: #2219 (`styleNumber` on an extend of `<intersection>` may not take effect);
#2217, #2218, #2211, and the copy halves of #2215 and #2216 (D4, B5).

### REF-8: an extend's descendants are reached through the extend's own name, and an unnamed reference creates no names (Tier 1)
- **Through a name.** With `<p name="e" extend="$p"/>`, `$e.t` reaches e's own counterpart of
  p's `t`, which is linked to it.
- **Without a name.** A reference with no name of its own adds no names to the document, as a
  reference never does. That stays true when the path goes through an ancestor, so the
  ancestor's name does not help:

  ```xml
  <p name="p"><text name="t">hi</text></p>
  <section name="sec1">$p</section>
  <section name="sec2"><group name="g">$p</group></section>
  ```

  | Reference | Result |
  |---|---|
  | `$sec1.p`, `$sec1.t` | do not resolve: the bare `$p` brings neither p's name nor t's into `sec1` |
  | `$sec2.g.p`, `$sec2.g.t` | do not resolve, for the same reason |

  Evidence: `T/copying/extend_references.test.ts:6549` "reference inside composite adds to index
  resolution but not names". That test also asserts that `$sec2.g[1].t` reaches `t` by its
  position in the group. That part changes under D27, which proposes that an index never selects
  a child of a group.

To reach into a reference, name it: `<p extend="$p" name="e"/>`, then `$e.t`.

**List extends (fixed by #2393).** `$e.h` reaches e's counterpart of `h` for
`<mathList name="e" extend="$l"/>`, as `$E.h` does for `<p name="E" extend="$P"/>`. Before #2393 a
linked list extend had no children of its own to name (defect B10, #2376). This holds for every
authored list, an extend of an extend (`$e2.h`), a reference written before the extend, and a
list inside an extended component (`$E.l.h`, `$Pe.Q.h`). `$e.l` still names nothing (NAME-3).
Evidence: `T/tagSpecific/listcomponentvaluelists.test.ts:753`, `:843`, `:934`, `:995`, `:1040`.

Other tests: `:1626`, `:1837`, `:6408`, `:5773`.

### REF-9: an extend shares state, not identity (Tier 2)
A bare `$P` stands for P as a click target. A *named* extend or copy is a component of its own:
- a trigger on `$P` fires only for clicks on P;
- a trigger on `$Q`, where Q extends P, fires only for clicks on Q;
- a click on a copy fires neither.

Evidence:
- `T/tagSpecific/clickTarget.test.ts:165` "a bare reference to a click target is a click target,
  but an extension is not";
- **[probe]** for points.

Gap: no test of a named extend of a point as its own target.

### REF-10: an extend re-derives from the source's definition; an extend of a property takes the computed value (Tier 2)
- `<math extend="$m" simplify="none"/>` of `<math simplify>x+x</math>` gives `x+x`. The extend
  re-reads m's children with its own `simplify`.
- `<math extend="$m.value" simplify="none"/>` gives `2x` (`T/tagSpecific/math.test.ts:2759`).
- `splitSymbols` likewise re-parses (`:3140`).

This is defensible: an extend means "same definition, my attributes", and a property means
"that value". The cost is that it pins exactly which state is shared: the unnormalized children,
not the visible value. A rewrite has to decide which inputs an extend shares. The rule worth
keeping is "attributes that control how the content is read apply to the extend's reading of
the same content".

---

## 3. `copy`

### CPY-1: `copy` behaves as the source's DoenetML pasted in place (Tier 1)
`<T copy="$x" …/>` behaves as if x's DoenetML were pasted at that spot:
- attributes written on the copy override x's, as in REF-3;
- children written inside it are appended, as in REF-4;
- the link to x itself is cut, so later changes to x do not reach the copy, and the copy's
  changes do not reach x.

Evidence:
- `T/copying/unlinked copy.test.ts:285` "copy no link, base test";
- `T/copying/context_attributes.test.ts:441` "an unlinked copy is its source pasted: it keeps the
  source's attributes, not where the source sits";
- `T/copying/list_extend_attributes.test.ts` (#2231);
- PRs #559, #2240, #2259.

Code: `W/components/abstract/Copy.js:1564-1576` (`copyAll`, `copyPrimaryEssentialIfShadow`,
`copyEssentialStateIfShadow`, `copyVariants`) and `BaseComponent.serialize`
(`W/components/abstract/BaseComponent.js:1453-1840`).

What the copy does *not* take from x:
- **x's surroundings.** A point fixed only by its graph is not fixed when copied elsewhere
  (`context_attributes.test.ts:525`, `:563`).
- **`labelIsName`.** It is deliberately not pasted (`Copy.js:1566`), an exception noted in D19.

### CPY-2: a copy starts from the source's current reader state, and keeps that snapshot (Tier 1)
A copy made after the reader has interacted with x starts where x is now, not from x's prefill.
- **[probe]** `mi` was typed to 5 and `P` dragged to (7,8). A `<conditionalContent>` then
  revealed `<mathInput copy="$mi"/>` and `<point copy="$P"/>`. They show 5 and (7,8).
- A copy made at load stays at the prefill after `mi` changes.
- Through a reload, the copy keeps the snapshot it was made with (#2234).

This is how authors freeze a reader's work, and it is why `copy` is "pasted DoenetML *plus the
current state*", not pure paste.

Evidence:
- `T/copying/unlinked copy.test.ts:2112-2312` "create snapshot of group/repeat with
  conditionalContent/callAction";
- `T/copying/unlinked_copy_reload.test.ts:20-514`.

Which state is carried is inconsistent. A reader's write to a literal `hide` is carried; one to
`fixed` is not. See D2.

Cost: the reload half is expensive in the current core.
- Every unlinked copy is remade at save time and compared (`W/utils/copySnapshot.js`,
  `snapshotStillMade`).
- That runs inside `ProcessQueue.runExclusive`.
- It uses positional `stateId`s with type checks.

A core that records the copy's own state when it is made gets the same author-visible result
for free. Keep the behavior and drop the mechanism.

### CPY-8: a copy keeps its source's random choices, however deeply nested; a child added to a copy draws its own (Tier 1)
Random choices are part of the state a copy carries (CPY-2), so a copy of anything holding a
`<select>`, `<selectFromSequence>`, `<shuffle>` or sampler shows the same values as its source.
That holds at any depth inside the copied content. A child written inside the copy is new
content: it draws its own value, which is fixed for a given variant, and never repeats one of
the source's.

Evidence:
- `T/copying/group_copy_variants.test.ts` (#2344), over variants 1–5:
  - a `<group copy>` keeps random values nested in divs and inner groups, including in a hidden
    group, a `<shuffle>` and a `<select>` with unique variants;
  - a random child added to a `<group copy>` gets its own value, the same for a given variant,
    and keeps it through a reload. A copy of that copy keeps it too;
  - an unlinked copy of a repeat keeps the random values in its template, and they are kept when
    the page is loaded again with the variant it generated;
- `T/tagSpecific/select.test.ts:432` (copies do not resample);
- `selectfromsequence.test.ts:567`;
- `shuffle.test.ts:47`.

Code: `copyVariants` in `W/components/abstract/Copy.js`. It gives each serialized component its
`generatedVariantInfo` as its desired variant.

**Fixed: #2342, by #2344.** A `<group copy>` used to break this rule in two ways:
- it drew a new value for a random component nested in a `<div>` and an inner group, because
  the group was serialized before its inner content had been expanded;
- a random child added to it repeated the source's first draw (`429 966` became `429 966 429`).

#2344 keeps the variant of each child of an unexpanded group, and gives a group copy with added
random children a seed of its own. **[probe]** on main, for variants 1–3: the nested value matches
its source, and an added child draws its own (`323 109` becomes `323 109 722`).

**Open: a copy that changes what is chosen (#2389, defect B11).** CPY-8 says a copy keeps its
source's random choices, and D4 says the attributes written on a copy override. They conflict
when the copy changes what is chosen, as `<select copy="$x" numToSelect="4"/>` of a two-pick
select does. The copy cannot keep two picks and make four. Today (**[probe]**):
- `<select>` makes the whole document fail to load;
- `<selectFromSequence>` shows nothing, with error `doenet-e0037`;
- `<sampleRandomNumbers copy numSamples="4">` makes four new samples.

Proposed in D33: a copy always keeps its source's choices. Writing on it an attribute that decides
what is chosen, or adding options, is an error. A change that reaches nested content, known only
at run time, gives a warning, and the carried choices win. Content that should choose again is
written with a second form, "written again here", which carries no state and no choices (name
open). That replaces an earlier proposal that a copy changing what is chosen chooses again, which
made the result depend on the value written.

### CPY-3: references inside a copy stay live; ones that pointed into the source now point into the copy (Tier 1)
```xml
<group name="g"><mathInput name="mi" prefill="1"/><p name="p">$mi</p></group>
<group copy="$g" name="gc"/>
```
Typing 7 into `gc.mi` changes `gc.p` to 7 and leaves `g.p` at 1 (**[probe]**). A reference to
something outside the copied part, such as `$n`, keeps following it.

Evidence:
- `T/copying/unlinked copy.test.ts`:
  - `:1056` "internal copy to source alias is linked";
  - `:981`;
  - `:1118` "copy no link containing external copies use absolute source" (#559).
- `T/copying/value_references.test.ts:843`.

Code: `remapRefResolutions` (`W/utils/componentIndices.ts:413-503`).

A reference into the source that goes **through the source's own name** keeps pointing at the
original. In a copy of `<p name="P"><math name="h"/>$P.h</p>`, `$P.h` still names P's `h`, because
`P` is not the copy's name. Only references by inner names, such as `$h`, move to the copy. Since
#2367 the same holds for lists: `$l.h` written inside `<mathList name="l">` refers to the original
`l` in a copy.

**Changed by #2397 (D1).** The rule goes by referent, not spelling: `$P.h` and `$l.h` name
something inside the copied part, so they now name the copy's counterpart. So does
`$P.sectionNumber` written inside a copied section `P`.

### CPY-4: a copy of a reference pastes what the reference points to (Tier 2)
`copy="$r"`, where `r` is `<T extend="$m" …/>`, pastes m's DoenetML with r's own attributes on
top. This is the "exception" from the recent PRs (#2259). It is principled: `r` has no
DoenetML of its own beyond its attributes.

Evidence:
- `T/copying/copy_of_extend.test.ts` (whole file): a point at `($a, 0)` copied through an
  extend follows `a` and writes `a`;
- `T/copying/unlinked copy.test.ts:2406` "a copy of a reference is what the reference is linked
  to, pasted", and `:1864-2000`;
- `T/copying/list_extend_attributes.test.ts:184`, `:226`;
- `T/copying/unlinked copy.test.ts:2477` (repeat).

How it is implemented:
- `copy="$r"` resolves to r's replacement, a shadow that has no attributes of its own.
- `serializeShadowedAttributes` walks back to `m` to paste them
  (`W/components/abstract/BaseComponent.js:2286`). That part is principled.
- The shadow's main value is then frozen (`copyPrimaryEssentialIfShadow`) unless one of these
  holds:
  - (a) the class lists the attribute that defines its value, in `attributesDefiningPrimaryValue`.
    Only `xs` on point and vector are listed (`Point.js:58`, `Vector.js:55`);
  - (b) the shadow serializes children. **[probe]**: a copy of an extend of
    `<math>$n+1</math>` follows `n`.
- So whether a copy of an extend stays live depends on where its class keeps its definition.
  Other classes that moved their definition into expression attributes (#2258, #2263: line
  `equation`, curve `parMin`/`parMax`) are untested.

D5 proposes doing the paste generically. One known violation remains: attributes written on a
copy of an extend do not reach the copy's descendants. See the TODO with a commented-out
assertion at `T/copying/unlinked copy.test.ts:1967-2002` (`g3.B` `styleNumber`).

### CPY-5: a copy of a property or a list entry holds a value (Tier 1)
`copy="$P.x"` has no DoenetML to paste, so it holds the value it had when the copy was made. It
also keeps the display settings it showed. Attributes written on the copy still apply.

Evidence:
- `T/copying/unlinked copy.test.ts:1689` "copy no-link of a copy prop", and `:1757`;
- `T/copying/attribute_values.test.ts:187`, `:227`, `:608`;
- `T/copying/context_attributes.test.ts:525`.

Code: `replacementFromProp`, `W/components/abstract/Copy.js:1457-1545`.

A copy of an *authored value list* used to freeze its entries too, though the list has DoenetML
to paste. Since #2367 it is pasted like any other component (D3).

### CPY-6: references to names outside the copied part keep their referents (Tier 1; D1, done by #2397)

A reference in copied content whose referent is outside the copied part keeps that referent. It
is not looked up again where the copy is written. An `extend` already does this (REF-6), so the
two agree. Author statement: a copy is the source's DoenetML pasted here, with its names still
meaning what they meant in the source.

**Before #2397** the copy was pasted DoenetML, so a `$n` inside it that pointed to something
*outside* the copied part was resolved again from the copy's new location. A nearer `n` there
captured it. Two equally near `n`s made it ambiguous. An `extend` at the same spot keeps the source's `n`
(REF-6).

The example, with what it showed before #2397:
```xml
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="T"><number name="n">2</number>
  <group copy="$A.g" name="gc"/>     <!-- gc.p = 2: captured by T.n -->
  <group extend="$A.g" name="ge"/>   <!-- ge.p = 1 -->
</section>
<section name="U"><group copy="$A.g" name="gu"/></section>   <!-- gu.p empty: "Multiple referents" -->
```

Now `gc.p` and `gu.p` show 1, with no warning, and `copy="$r[2].p"` of repeat content showing
`$i` shows the iteration's value (B4).

Evidence: `T/copying/copy_keeps_referents.test.ts` (#2397): capture, ambiguity, chains at depths
1–3, references through the copied root's own name, repeat content, an attribute of a copied
reference, attributes a copy of a list entry or property takes from its source, and a reload.

#2400 (closing #2398, B14) extends this to a copy of an `extend`, and to a copy of part of one:
an outside referent is kept as a referent, not looked up again by name.

**Known violation (B20, #2414):** `type` on a copy of a `<sort>` is ignored.

### CPY-7: to start from another component's current value, copy its value, not the component (Tier 1)
A copy is independent of the component it copied, but **not of what that component refers
to**. It pastes the component's definition, and references in that definition stay live
(CPY-3). An author who wants "a new component that starts at x's value and then changes on
its own" must copy the value: `copy="$x.value"`. A value has no definition to paste (CPY-5).

This comes up most with module attributes that set an initial value:

```xml
<module name="m">
  <moduleAttributes><number name="x0">5</number></moduleAttributes>
  <number name="x" copy="$x0"/>          <!-- intended: starts at x0, then changes on its own -->
  <graph><point name="P">($x, 0)</point></graph>
</module>
<module copy="$m" x0="$initial"/>
```

A module attribute supplied as `x0="$initial"` behaves like `<number name="x0">$initial</number>`.
So `copy="$x0"` pastes a live `$initial` into `x`. **[probe]** Dragging `P` gives:

| `initial` is | `x` defined by | Result of the drag |
|---|---|---|
| `<number>3</number>` | `copy="$x0"` | P moves, **and the caller's `initial` becomes 9** |
| `<number><number>1</number>+<number>2</number></number>` | `copy="$x0"` | P does not move: the pasted `1+2` has two changeable parts and cannot be inverted |
| `<number>$a+$b</number>` | `copy="$x0"` | P does not move, for the same reason |
| `<number>$a+1</number>` | `copy="$x0"` | P moves, **and the caller's `a` becomes 8** |
| any of these | `copy="$x0.value"` | P moves; `initial` and `a` are untouched |
| omitted (the default `5`), or a literal `x0="3"` | `copy="$x0"` | P moves; nothing outside changes |

So the same module works when tested with a literal, and fails or reaches outside itself once
a caller passes a reference. Copying the value avoids every one of these failures.

How to say it to authors:

> `copy` copies a definition. To start a new value from where something is now, copy its
> value: `copy="$x.value"`.

This belongs on the `<module>` and `<moduleAttributes>` reference pages, next to the existing
advice to use `copy` so that each instance is independent. No test pins any row of the table
above. D28 asks whether the model can make the natural spelling work.

---

## 4. Nesting: the rules compose

When references are chained, each link follows its own rule:
- **an `extend`** keeps the meaning its source's references already have (REF-6);
- **a `copy`** pastes the source's DoenetML, and keeps what its names meant there too (CPY-6,
  #2397).

The example below chains extends and copies of one group. The group holds a paragraph that
shows `$n`, and every section except F has its own number named `n`.

```xml
<section name="A">
  <number name="n">1</number>
  <group name="g"><p name="p">n is $n</p></group>
</section>

<section name="B"><number name="n">2</number> <group name="gB" extend="$A.g"/></section>
<section name="C"><number name="n">3</number> <group name="gC" extend="$B.gB"/></section>
<section name="D"><number name="n">4</number> <group name="gD" copy="$C.gC"/></section>
<section name="E"><number name="n">5</number> <group name="gE" copy="$D.gD"/></section>
<section name="F">                            <group name="gF" copy="$E.gE"/></section>
<section name="G"><number name="n">6</number> <group name="gG" extend="$E.gE"/></section>
```

Each group's paragraph shows (**[probe]** on main at `a53fbb9`, after #2400):

| Paragraph | Shows | Why |
|---|---|---|
| `A.g.p` | n is 1 | the original; its `$n` is A's `n` |
| `B.gB.p` | n is 1 | `gB` extends `g`, so its `$n` still means A's `n`, though B has its own `n` |
| `C.gC.p` | n is 1 | an extend of an extend: still A's `n` |
| `D.gD.p` | n is 1 | `gD` copies `gC`, which stands for `g` (CPY-4). Its `$n` keeps A's `n` (D1). Before #2397 it found D's `n` (4), and between #2397 and #2400 C's (3), where the extend `gC` is written (B14) |
| `E.gE.p` | n is 1 | a copy of a copy keeps what `$n` meant in `gD`. Before #2397, 5 |
| `F.gF.p` | n is 1 | the same. Before #2397 it was empty: from F, which has no `n`, the `n`s in A to E and G were equally near |
| `G.gG.p` | n is 1 | `gG` extends the copy `gE`, so it keeps what `$n` means in `gE`. Before #2397, 5 |

The same holds for a reference in an attribute written on a copy (NAME-4):

```xml
<section name="T">
  <number name="m">-3</number>
  <graph name="G1"/>
  <graph name="G2" copy="$G1" xMin="$m"/>     <!-- xMin -3: T's m -->
</section>
<section name="U">
  <number name="m">-5</number>
  <graph name="G3" extend="$T.G2"/>            <!-- xMin -3: keeps G2's meaning of $m -->
  <graph name="G4" copy="$T.G2"/>              <!-- xMin -3: keeps G2's meaning of $m (-5 before #2397) -->
</section>
```

**[probe]** confirms the three values. The test is `extend_references.test.ts:7759`, updated by
#2397.

Coverage of nesting is thin. `copy_keeps_referents.test.ts` (#2397, #2400) now covers copy
chains at depths 1–3, capture inside copied content, a copy of repeat-iteration content
(`copy="$r[2].p"`), chains that mix extends and copies such as the one above, and copies of
direct extends of content-making tags. These cases still have no tests:
- live references at depth 3 through extends;
- modules nested three deep.

Privacy of names inside a copy (NAME-3) is tested since #2367.

See [testing-principles.md](testing-principles.md) §4 for a sweep that runs every component
through extend and copy at depths 1–3.

---

## 5. Tests that pin incidental behavior (Tier 3)

| Test | Why it is incidental |
|---|---|
| `_ref` versus full-component assertions in `extend_parity.test.ts` and `extend_references.test.ts` (#2233) | Which internal kind a reference becomes. Keep the "same text, same `fixed`" half |
| `copy_of_extend.test.ts:150-280`, the #2199 repros (`essentialVarName` for vector `tail2`, ray `direction2`) | Load-without-crashing checks of an internal naming quirk. Keep "a copy of an extend of a ray loads" |
| `copy_of_extend.test.ts` `bothWays` toggle (expression attributes on and off) | Proves two internal representations agree. Keep the expected values; drop the toggle |
| `unlinked_copy_reload.test.ts:84` "holds nothing when no copy's source changed" | A saved-state size optimization |
| `unlinked_copy_reload.test.ts:229-421` (`stateId` type matching across cases) | Follows from positional `stateId`s |
| `module.test.ts:1474`, `:1505` (module attributes named `constructor`, `toString`, `link`) | Robustness against prototype maps and `_copy` attribute collisions |
| `utils/copy.test.ts` (whole file) | Unit test of an internal fallback. Keep one integration test of "a reference to a point in its own label shows its value" |
| `warningsInfos.test.ts` w0168/w0169 exemptions for `_copy`'s own attributes | Artifacts of the `_copy` encoding |
| `circularReferences.test.ts:27-67` `rejects.toThrow` | Pins "the document fails to load" as the failure mode (D14) |

## 6. The critical tests for this area

A new core should pass these before anything else in this area:
- `T/copying/extend_parity.test.ts` (REF-1)
- `T/copying/attribute_values.test.ts:33`, `:72` (REF-3)
- `T/copying/extend_references.test.ts`:
  - `:3200` (REF-5);
  - `:3266-4609`, the added-children tests (REF-4);
  - `:2401`, `:6408` (REF-6, NAME-2);
  - `:7583-7790` (NAME-4).
- `T/copying/unlinked copy.test.ts`:
  - `:285`, `:981`, `:1056`, `:1118` (CPY-1, CPY-3);
  - `:2112-2312` (CPY-2);
  - `:1689` (CPY-5);
  - `:2406`, `:2504` (CPY-4, REF-3a).
- `T/copying/copy_of_extend.test.ts` (CPY-4), minus the Tier 3 items above
- `T/copying/unlinked_copy_reload.test.ts:20` (CPY-2 through reload)
- `T/copying/external_references.test.ts` (NAME-6)
- `T/tagSpecific/module.test.ts:68`, `:539`, `:1715-1930` (modules)
- `RS/resolve.test.rs`, `RS/build_resolver.test.rs` (NAME-1, NAME-3)
