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
  outside. They are reached only through the container: `$r[2].x`, `$opt.x`
  (`elements_with_children_invisible_to_their_grandparents`).

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
negative index, or one past the end names nothing.

Evidence:
- `T/copying/extend_references.test.ts`: `:2401` "extending repetitively" (`$g12.Pa` four levels
  down), `:6408` "recursive extends", `:5773` "dot and array notation, recurse to subnames of
  composite replacements".
- `T/tagSpecific/repeatForSequence.test.ts:156`: nested repeats, `$a[2][1][3]` and
  `$a[2].b[3].c`.
- `T/copying/value_references.test.ts`: `:286` "an index into a list resolves itself and
  re-resolves as the index changes", and `:333`, rounding 2.6→3, 1.5→2, 4.4→4, −1 → nothing.

Code: `RS/resolve.rs:310-330` (`unresolvedPath`); `W/core/dependencies/refResolutionDependencies.ts`
finishes the path after composites expand.

Limits:
- **Deep property chains** (`$l.points[1].coords`, `$l.points[1].xs[1]`) are not supported
  today. About 20 assertions are commented out with `XXX: restore` at
  `T/copying/extend_references.test.ts:4703`. Whether they are a guarantee is an open question
  ([decisions.md](decisions.md), D19).
- **An index into a composite of references** (`$g[1]` with `<group name="g">$x</group>`) can
  panic the resolver (#1942).

### NAME-3: names inside a copy or a repeat iteration are private (Tier 1)
A copy brings its content's names into existence only beneath the copy's own name. A bare `$h`
written next to `<section copy="$S" name="S2"/>` still means `S.h`, and makes nothing
ambiguous. Reach the copy's `h` as `$S2.h`.

- **[probe]** A bare `$h` next to one or two copies or extends of `S` resolves to `S.h` with no
  warning. Typing into `S2.h` does not change it.
- **Evidence:** the Rust test `add_nodes_does_not_make_previous_resolution_ambiguous`
  (`RS/build_resolver.test.rs:89`), and the docs example "References in a copy's attributes".
- **Gap:** no JavaScript test pins this. It is the reason a copy can sit beside its source at
  all, so it deserves one.

### NAME-4: references in the attributes written on a `copy`, `extend` or `<module>` resolve outside it (Tier 1)
`<section copy="$orig" hide="$h"/>` finds the `h` beside the copy, not one inside the copied
content. Use `$copyName.h` to reach inside.

- **Docs:** `concepts/references.mdx` "References in a copy's attributes".
- **Tests:**
  - `T/copying/extend_references.test.ts:7631-7833`, seven tests: copy and extend, section,
    group, module, list, a copy inside a repeat, a copy of a copy;
  - `T/tagSpecific/module.test.ts:1606-1912`, eight tests: repeats, nested modules, an index
    `$xmin[$i]`, a copy of a module copy.
- **Code:** `W/utils/dast/convertToCopy.ts:204-215` and `W/components/ModuleAttributes.js:178-183`
  (#2039, #2038).
- **Why:** without it, `xmin="$xmin"` on a module copy would refer to itself.

### NAME-5: everything else resolves from where it sits in the tree (Tier 2)
- An ordinary element's attribute sees that element's own descendants. In
  `<p hide="$h"><boolean name="h"/></p>`, `$h` is the inner `h` (**[probe]**).
- A child written inside a `copy` or `extend` sits inside the copy. It sees the copied content
  first (**[probe]**: `$h` in a child added to `<section copy="$S">` gives the copied `h`).

NAME-4 and NAME-5 together give three different starting points for a reference written in or
on a copy tag. That is an inconsistency ([decisions.md](decisions.md), D6).

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
- An extend stops being bare-equivalent as soon as it has a name, an attribute, children or a
  different type.
- A name alone already changes the click identity (REF-9).

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

Exceptions: composites (REF-7) and the `<label>` of a point, which replaces rather than appends.
The general rule for a child kind that can appear only once is unstated (gap).

### REF-5: a different tag converts, and stays linked (Tier 1)
`<T extend="$x"/>` with T different from x's type behaves like `<T>$x</T>`.

| Example | Result |
|---|---|
| `<number extend="$m"/>` | a number |
| `<math extend="$t"/>` | parses the text |
| `<point extend="$v"/>` of a vector | a draggable point, and dragging it moves `v` (**[probe]**) |

Evidence:
- `T/copying/extend_references.test.ts`:
  - `:3200` "extend wraps to match specified type";
  - `:6366` "correctly wrap replacement changes when verifying to force component type";
  - `:6495`, an invalid component type.

Code: `W/utils/copy.js:192` `verifyReplacementsMatchSpecifiedType`. The wrap branch is at
`:398-470`.

Inconsistency: across a type change, a list extend takes the source's same-named attributes
(`hide`, `fixed`, display settings, #2231), but a scalar extend does not (D19).

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

### REF-7: an extend of a composite shows the same content (Tier 2)
`<repeat extend="$r"/>`, `<select extend="$s"/>` and similar show exactly what the source shows.
- **Ignored, with a warning:** attributes that would change that content (`for`, `to`,
  `numToSelect`) give `doenet-w0168`, and children written inside give `doenet-w0169` (#2213).
- **Still applied:** shared attributes (`hide`, `asList`, display settings).
- **Exceptions:** `<group>` and `<module>`, which do add children and apply `rendered` and
  module attributes.

Evidence:
- `T/diagnostics/warningsInfos.test.ts:1144-1406`;
- `T/copying/extend_references.test.ts:3153`, `:3177`;
- `T/tagSpecific/module.test.ts:1441`;
- `T/tagSpecific/group.test.ts:202`.

Known bugs, open: #2215, #2216, #2217, #2218, #2219, #2211. See D4 for the rule they should
follow.

### REF-8: named descendants are reachable through an extend's name (Tier 1)
- `$e.t` reaches the extend's own counterpart of the source's `t`, which is linked to it.
- An *unnamed* reference opens no name scope. `$sec1.t` does not resolve when `sec1` holds a
  bare `$p` (`T/copying/extend_references.test.ts:6549`).

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

Inconsistency: a copy of an *authored value list* (`<mathList>$mi 2</mathList>`) also freezes
its entries, though the list does have DoenetML to paste. The same list inside a copied `<p>`
does follow `mi` (**[probe]**). See D3.

### CPY-6: references to names outside the copied part are looked up again where the copy lands (current behavior; decision D1)
The copy is pasted DoenetML, so a `$n` inside it that pointed to something *outside* the copied
part is resolved again from the copy's new location. A nearer `n` there captures it. Two
equally near `n`s make it ambiguous. An `extend` at the same spot keeps the source's `n`
(REF-6).

**[probe]**, confirmed again while writing this document:
```xml
<section name="A"><number name="n">1</number><group name="g"><p name="p">$n</p></group></section>
<section name="T"><number name="n">2</number>
  <group copy="$A.g" name="gc"/>     <!-- gc.p = 2: captured by T.n -->
  <group extend="$A.g" name="ge"/>   <!-- ge.p = 1 -->
</section>
<section name="U"><group copy="$A.g" name="gu"/></section>   <!-- gu.p empty: "Multiple referents" -->
```

Only one test pins this: `T/copying/extend_references.test.ts:7807` "attribute inherited by a
copy of a copy resolves where that copy is written". A related silent failure:
`copy="$r[2].p"` of repeat content showing `$i` renders `＿` with no warning, while the
`extend` form works (**[probe]**). This is the most important open decision in this area. See
D1.

---

## 4. Nesting: the rules compose

The forms combine by applying the rules above at each step, in order:
- **An extend step** keeps the bindings it was given.
- **A copy step** pastes the DoenetML its referent stands for, with every attribute written
  along the way, and looks names up again where it lands.

**[probe]** A six-step chain, where each section has its own `n` set to the value shown:

| Step | Written in | Its `n` | Form | `p` shows | Why |
|---|---|---|---|---|---|
| `g` (in A) | A | 1 | original | 1 | |
| `b` | S1 | 2 | `extend="$A.g"` | 1 | extend keeps A's binding |
| `c` | S2 | 3 | `extend="$S1.b"` | 1 | still A's binding |
| `d` | S3 | 4 | `copy="$S2.c"` | 4 | a copy of an extend chain pastes `g`'s DoenetML at S3 |
| `e` | S4 | 5 | `copy="$S3.d"` | 5 | pasted again at S4 |
| `f` | S5 | none | `copy="$S4.e"` | ＿ (ambiguous) | no nearer `n`, and several are visible |
| `h` | S6 | 6 | `extend="$S4.e"` | 5 | an extend of a copy keeps that copy's binding |

The same holds for attributes inherited through copies:
- **[probe]** A `<graph copy="$A.G" xMin="$n">` written in T (n=−3) gives −3.
- An extend of it written in U (n=−5) gives −3.
- A copy of it written in U gives −5.
- Test: `extend_references.test.ts:7807`.

Coverage of nesting is thin. These cases have no tests:
- three-level chains are tested for `modifyIndirectly`, labels, groups and modules, but not for
  live references at depth 3;
- capture inside copied *content*: only the attribute form is tested;
- copies of repeat-iteration content;
- privacy of names inside a copy (NAME-3);
- modules nested three deep.

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
| `listcomponentvaluelists.test.ts:562` and the `c.h` = −1 assertion | Locks in D3 |
| `module.test.ts:1474`, `:1505` (module attributes named `constructor`, `toString`, `link`) | Robustness against prototype maps and `_copy` attribute collisions |
| `utils/copy.test.ts` (whole file) | Unit test of an internal fallback. Keep one integration test of "a reference to a point in its own label shows its value" |
| `warningsInfos.test.ts` w0168/w0169 exemptions for `_copy`'s own attributes | Artifacts of the `_copy` encoding |
| `module.test.ts:1857` "attribute written on the module's own definition is ambiguous" | An accidental outcome of NAME-4 (D6) |
| `circularReferences.test.ts:27-67` `rejects.toThrow` | Pins "the document fails to load" as the failure mode (D14) |
| `extend_references.test.ts:7807` | Tier 1 only if D1 keeps re-binding |

## 6. The critical tests for this area

A new core should pass these before anything else in this area:
- `T/copying/extend_parity.test.ts` (REF-1)
- `T/copying/attribute_values.test.ts:33`, `:72` (REF-3)
- `T/copying/extend_references.test.ts`:
  - `:3200` (REF-5);
  - `:3266-4609`, the added-children tests (REF-4);
  - `:2401`, `:6408` (REF-6, NAME-2);
  - `:7631-7833` (NAME-4).
- `T/copying/unlinked copy.test.ts`:
  - `:285`, `:981`, `:1056`, `:1118` (CPY-1, CPY-3);
  - `:2112-2312` (CPY-2);
  - `:1689` (CPY-5);
  - `:2406`, `:2504` (CPY-4, REF-3a).
- `T/copying/copy_of_extend.test.ts` (CPY-4), minus the Tier 3 items above
- `T/copying/unlinked_copy_reload.test.ts:20` (CPY-2 through reload)
- `T/copying/external_references.test.ts` (NAME-6)
- `T/tagSpecific/module.test.ts:68`, `:539`, `:1606-1912` (modules)
- `RS/resolve.test.rs`, `RS/build_resolver.test.rs` (NAME-1, NAME-3)
