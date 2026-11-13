# @doenet/v06-to-v07

## 0.8.0

### Patch Changes

- d656d04: More reference cycles are reported when the document loads, as a circular-dependency error (`doenet-e0005`) at each reference on the cycle, while the rest of the document renders. They are found in every case of a `<conditionalContent>` and every option of a `<select>`, whether shown or not, so the same errors are there before and after a reader changes the case, and in every variant. Before, each of these stopped the document, when it loaded or when the case holding it was shown, or was reported only once it was reached:

    - a property made from what is written in the tag: `<number name="n">$n.value</number>`, `<text name="t">$t.value</text>`, `<p name="q">$q.text</p>`;
    - an input's starting value: `<mathInput name="mi" prefill="$mi.value"/>`, and its `bindValueTo`, a `<choiceInput>`'s `preselectChoice` and a `<slider>`'s `initialValue`;
    - an attribute of a `<sequence>`, a `<selectFromSequence>`, a `<select>`, a `<repeat>`, a `<conditionalContent>` or a sampler that reads what it makes: `<sequence name="a" from="1" length="$a[1]"/>`, `<selectFromSequence name="a" from="1" to="10" exclude="$a[1]"/>`, a `<case>`'s `condition`, an `<option>`'s `selectWeight`;
    - an index read by the component it picks from: `<number name="i">$l[$i]</number>`, and an index into a `<mathList>` or a `<numberList>` in it (`<mathList name="l">1 $l[1]</mathList>`);
    - a name every case of a `<conditionalContent>` or every option of a one-pick `<select>` declares. In a `<select>`, the variant that picked the option on the cycle used to fail to load. Such a name written inside one of the cases or options names what that case or option declares, as it is there only while that one is shown, so the cases reading each other's names (`<math name="x">$cc.y</math>` in one case, `<math name="y">$cc.x</math>` in another) are not a cycle;
    - a tag whose content is its children, such as a `<p>`, a `<section>`, a `<div>` or a `<li>`, holding a reference to itself (`<p name="q">a $q</p>`), now in a case not shown too;
    - a tag written with `copy` or `copyWithState` of what it is in (`<group name="g"><math copy="$g"/></group>`), as the `extend` form already was.

    A `<section>` whose `<title>` holds a reference to the section (`<title>T $S</title>`) now shows its default title ("Section 1"), as a title holding any error found at load does, where it used to show the title without the reference.

    A `<math>`, a `<text>` or a `<boolean>` holding an index that reads it (`<math name="i">$m[$i]</math>`) used to load, where shown, with the error at the reference in the index only, that reference shown blank (a `<boolean>` holding only it, false) and a warning that the index did not work out to a number (`doenet-w0163`). The tag is now that error, with the error at both references, and no warning.

    An index into a math written with `extend`, in it (`<math name="m2" extend="$m">$m2[1]</math>`), is now that error, where the document used to fail to load with an internal error.

    Not every property and attribute is covered. A cycle through one that is not (`<math name="m" simplify="$m=1">`), through a function (`$$f($n)`), through an index into a `<repeat>` in its own template, through a reference in a point's or an input's `<label>`, or through both a `<mathInput>`'s `prefill`, `prefillLatex` or `bindValueTo` (a `<matrixInput>`'s `prefill` or `bindValueTo`, a `<choiceInput>`'s `preselectChoice`) and an index into a `<mathList>` or a `<numberList>`, is still reported, or stops the document, when it is reached. An input starting from an index into a list that holds it (`<mathList name="l">1 $mi</mathList><mathInput name="mi" prefill="$l[1]"/>`) is valid, and stays so.

    The v0.6-to-v0.7 converter leaves the `<copy>` tags of a document holding a reference cycle found at load as they are (`copy/could-not-load-document`), so it now does so for these cycles too, including one in a case not shown (`<p name="q">a $q</p>`), whose `<copy>` tags it used to convert. The rest of such a document is converted, as before.

    Closes #2473.

- 1b8a891: **Breaking:** an index never selects a child of a container (D27 revised). A `<group>`, a pick, a case or an iteration whose whole content is **one component** stands for that component and passes the index on to it, and the component decides what the index means. Any other group names nothing after an index: the reference is a blank (`＿`) with the warning `doenet-w0188`, which says how many components the group holds and how to name the child instead (`$g.b`, or "give it a name"). Before, an index selected the child. The deprecation warning `doenet-w0179` it gave in unreleased builds is retired.

    - **One component takes the index.** With `<group name="g"><math>(1,2,3)</math></group>`, `$g[2]` is `2`; with `<group name="g">$nl</group>`, `$g[2]` is entry 2 of `nl`; with `<option><point>(7,8)</point></option>`, `$s[1][1]` is `7`; with `<group name="g">$r</group>`, `$g[2]` is iteration 2 of `r`; with `<group name="g">$cc</group>`, `$g[1]` is the case `cc` shows, and so it is for a group holding `$g`. A component with nothing to index gives a warning: `doenet-w0100` for a `<number>` holding one number or for text, `doenet-w0180` for a `<p>`. A further index goes on into what the first one reached: with `<group name="g">$ml</group>` of a `<mathList>` of tuples, `$g[2][1]` is the first entry of the second tuple. A write through the index changes the entry (`<mathInput bindValueTo="$g[2]"/>`). Blank text and a `<setup>` don't count; any other text does, so `<group>Value: $nl</group>` holds two.
    - **Several components name nothing**, in every form a group takes: a `<group>` the author wrote, an extend or a `copy` of one, and one reached through `<collect>` or by name (`$g[2]`, `$a.g[2]`, `$c[1][2]`); what a `<select>` picked (`$s[1][2]`), what a `<conditionalContent>` shows (`$cc[1][2]`), an iteration of a `<repeat>` or `<repeatForSequence>` (`$r[1][2]`), and an extend of an iteration; and an index that is not a literal (`$g[$i]`) or one past the end (`$g[5]`).

    These are unchanged: an index still selects the entries of a list, the iterations of a repeat, the picks of a select and the items of a `<shuffle>`, `<sort>` or `<collect>`. When an iteration or a pick holds only one list or repeat, an index after it still passes to that (`$r[1][2]`), and also when it holds only a reference to one (`<option>$l</option>`). An unnamed component in an iteration keeps the id it had (`r:1:2`).

    Ids change in one case: the iterations of a repeat that is a group's whole content can now take their id from the group (`g:1` rather than `r:1`, and `e:1` rather than `e.r:1` for an extend `e` of that group), since `$g[1]` names them too; this id is also the `rootName` that an answer's `submitted` event reports.

    Also fixed:

    - An index after a group is never passed to several of its items as a property. A group holding two components names nothing after an index, and one holding one passes the index to it, so `$g[2]` of `<group><math>(4,5,6)</math></group>` is `5` by that rule, and of `<group><math>(4,5,6)</math><number>9</number></group>` names nothing. Fixes #2166.
    - An index into a group whose child is a reference not yet expanded (`$g[1]<group name="g">$x</group>`) no longer stops the document from loading; the index passes to what `$x` names. Closes #1942.
    - `$st[2]` of a `<setup>` is a blank, where it showed nothing.
    - The v0.6 to v0.7 converter writes a `<copy componentIndex="1">` into a `<group>` holding one component as the bare reference `$g`, which stands for that component (`$g[1]` would index into it). v0.6 counted `componentIndex` with the composites in the group expanded, but kept a nested group, or a copy of one, as one component, so a group holding one nested group counts as holding one, and a group holding a `<sequence>`, a `<map>` or a copy of a sequence does not. Any other `componentIndex` into a `<group>` is left as it was, with the diagnostic `copy/unresolved-referent`, as `$g[2]` would name nothing or something of another type. A `componentIndex` into a `<select>` or a list is converted as before (`$s[1]`, `$q[2]`).
    - A component named in the arguments of a function reference that names nothing (`$$f(<math name="m">x</math>)` with no `f`) is made, as if written in a `<setup>` at the reference's place (D40): `$m` is `x`, where it was a blank. A name the same as another in the same scope is ambiguous (`doenet-w0105`), as one written in a `<setup>` is. The arguments are still not shown. Closes #2489.

    An index past the dimensions of a value, or into a value with no entries, names nothing with the warning `doenet-w0100` in more places (#2478):

    - an index into an entry of a `<numberList>`, `<textList>` or `<booleanList>`, and into the pick of a `<selectFromSequence>`, `<selectPrimeNumbers>`, `<selectRandomNumbers>` or a sampler (`$nl[2][1]`, `$s[1][1]`), where it named nothing silently, as `$n[1]` of a `<number>` does;
    - an extra index on an entry of an array property named directly (`$line.point1[2][1]`, `$f.maximumLocations[1][1]`), where the extra index was dropped, as `$line.points[1][2][1]` does (a property that stands for an array's first entry still takes an index among the entries, so `$ode.numericalSolution[2]` is the second solution, as before; so does that first entry named directly, so `$P.x1[2]` is `x2`, as before);
    - an extra index on an array property of a list entry (`$pl[2].xs[1][1]`), where it gave `doenet-w0180`.

    A write through any of these is refused. Also, `$pl[2].value[$i]` of a `<pointList>` is the same as `$pl[2].value[1]` when `i` is 1, where it named nothing, and `<group extend="$r[1]"/>` of an iteration that does not exist when the document loads follows the iteration when it appears, as after a reload, where an index after it named nothing.

    Closes #2517. Closes #2478.

- 2669d80: A reference that depends on itself through what is written is now reported when the document loads, and the rest of the document renders. `<text name="t">$t</text>`, `<math name="z" extend="$z"/>`, two maths that read each other (`<math name="z1">$z2</math><math name="z2">$z1</math>`), and a math that indexes itself (`<math name="m">(1, $m[2])</math>`) each give a circular-dependency error (`doenet-e0005`) at every reference on the cycle, and are shown as that error. Before, the document failed to load, or, for the math that indexes itself, failed with an internal error.

    The cycle is found over every case of a `<conditionalContent>`, every option of a `<select>` and every repeat template, whether shown or not, so the error is there from the start. A reference or copy elsewhere of a component that holds the cycle (`$x`, `<math extend="$x"/>` or `<p copy="$q"/>` of `<p name="q"><math name="x">$x+1</math></p>`, or `<module extend="$m"/>` of a module holding one) can report the error again, without a code, as for any error a reference copies (#2449): when the document loads, or, for a name declared in a case or option, once that case is shown or that option picked. Two `<conditionalContent>`s whose cases extend each other now give an error at both extends when the document loads, where they used to report one only after the case became true (and, with an `<else>`, an internal error too).

    `<group extend="$cc.x"/>` (or `<group extend="$x"/>`) of a name that every case of a `<conditionalContent>` declares now follows the case, and `<group extend="$r[2]"/>` of an iteration of a `<repeat>` follows the repeat when its number of iterations changes. They used to report a circular dependency where there was none (for the case, at its first change; for the repeat, once the iteration was withheld), and then stay empty.

    A tag extending something in an iteration of a `<repeat>` that is withheld after the document loads (`<math extend="$r[2].m"/>`, `<number extend="$r[2].io[1]"/>`) now gives the same info (`doenet-i0054`) as when the iteration is not there at load. Before, it gave no info, or kept an info about a value it no longer showed.

    A tag whose error was decided at load, such as `<math extend="$g"/>` inside the `<group name="g">` it extends when the group holds two components, or `<math extend="$r"/>` in the template of the `<repeat>` named `r`, no longer also reports a circular dependency (`doenet-e0005`) once it is made.

    The v0.6-to-v0.7 converter still treats a document with a reference cycle as one it cannot load, and leaves its `<copy>` tags as they are, as it did when the cycle stopped the load.

    Closes #2439, #2453 and #2430.

- 6f5107c: Keep every entry when converting a copy of a whole array prop. `<copy prop="vertices" source="poly" />`
  now becomes `$poly.vertices`, or `<pointList extend="$poly.vertices" />` when the copy has other
  attributes, instead of a single `<point>`. A `<map>` whose sources are only references now
  iterates over them directly (`<repeat for="$c.iterateValues">`). References with attributes to a
  map's alias or index, such as `$(x{displayDigits="5"})`, now convert when the type of the values
  is known: from a single list or array prop, or from a `<sequence>`. The copy made for a macro with
  attributes inside an attribute value, such as `x="$(a{link='false'})"`, now goes inside the
  enclosing `<module>` or `<repeat>`, where it can see the same names.
- 51cbfff: Convert more v0.6 documents:
    - A `<copy>` of a component that itself holds a `<copy>`, or of a named `<copy>`, converts instead of being left as a `<copy>`.
    - A `<copy>` inside the component it copies, such as `$p.x{displayDecimals="2"}` in `p`'s own label, converts.
    - The prop of a `<copy>` or `<collect>` is spelled as v0.7 spells it: v0.6 matched `prop="numericalsolution"` to `numericalSolution`.
    - A `<copy>` of a component inside an unselected `<option>` or a `<case>` whose condition is false converts, when only one component has that name.
    - A `<copy>` of a prop with no single type, such as an `<answer>`'s `submittedResponse`, becomes a bare reference like `$a.submittedResponse` when it has no other attributes.
    - A `<collect>` of a prop with no fixed type, such as a `<choiceInput>`'s `selectedValue` or `values`, takes its type from the list it is written in. Before, `selectedValue` became a `<mathList>` and `values` stopped the conversion. A `<collect>` of a prop that does not exist is now reported instead of stopping the conversion.
    - A `<ref>` with both `uri` and `target` keeps its link to the other document. The `target` is dropped with a diagnostic.
    - `doenet:activityId=<id>` and `doenet:doenetId=<id>` in a `<ref>` or `<copy uri>` become `doenet:<id>`, the only form v0.7 reads. A `cid` is dropped. A `pageId` or a legacy id is left with a diagnostic.
    - A new `fetchExternalDoenetML` option loads the documents a `<copy uri>` names. The converted element then takes the type of that document's root element, and references into the loaded content convert.
    - A GeoGebra `<embed>` is commented out, with a TODO to rebuild it as a DoenetML widget.
- 947b866: Convert more v0.6 `<copy>` and `<map>` forms:
    - `propIndex` and `componentIndex` on a `<copy>` become indices in the reference, e.g. `$poly.vertices[2][1]` and `$s[2]`.
    - `$(a{assignNames='b'})` inside an attribute value names its copy `b`.
    - A `<map>` with several `<sources>` becomes nested repeats. With `behavior="parallel"` or `assignNames` it is left with a diagnostic.
    - An inner `<map>` whose sources refer to the outer map's alias converts.
    - A map's alias is typed when all its values share one type, including written components.
    - A `<sequence>` next to other sources is no longer dropped.
    - A `<map>` placed before a module's `<setup>` no longer breaks the module's attributes.
    - A `<sources>`'s `alias` and `indexAlias`, and a `<sequence>`'s `type`, are recognized however they are capitalized.

## 0.7.27

### Patch Changes

- e49a50d: A half-typed function call no longer stops the document building.

    ```xml
    $$g($$f(<math>3</math>)
    ```

    That is what `$$g($$f(<math>3</math>), 2)` looks like partway through being typed, and the editor
    parses on every keystroke — so what the reader saw was not a message about the missing
    parenthesis but a blank page. The only `)` in it belongs to the inner call, and the outer
    reference was committing to being a call on the strength of it. It now declines and
    leaves its text alone, as every other unfinished shape here does. A very long run of
    brackets or parentheses in one span of prose used to fail to parse for an unrelated
    reason, and no longer does either.

    Formatting a document no longer changes what it means.

    ```xml
    <p>$(x)hi</p>
    <p>$(x)[1]</p>
    ```

    Both came back rewritten: the first as `$xhi`, a reference to a component nobody named,
    and the second as `$x[1]`, a reference _with an index_ where the author had written a
    reference followed by the text `[1]`. `$(…)` ends a reference's path, so the parentheses
    are now kept wherever dropping them would let what follows be read as part of the
    reference — and still dropped where it could not be, so `$(x).5` and `$(x) hi` come back
    as `$x.5` and `$x hi`.

    A bad index no longer quietly stops a function reference being called.

    ```xml
    <p>$$F[$(x)[<math>3</math>]](3)</p>
    ```

    The inner brackets cannot be read as an index, which was reported. What was not reported
    is that the `(3)` had stopped being a call and was rendering as text. The call is built
    now, and the index still says what is wrong with it.

    A diagnostic about markup written between index brackets is reported once, however deeply
    nested — it used to double with each level — and no longer names components that are not
    yours. An element in brackets that turns out to be in error drew a second warning about
    invalid `<_copy>` children beside the real message; that warning is gone, and the real
    one stayed.

    Converting a v0.6 document now keeps `$(b/c).d` as a reference followed by the text `.d`.
    v0.6 read it that way — a prop access went inside the parentheses, as `$(b/c.d)` — and the
    conversion was turning it into a property access the author never wrote.

- 2813fcc: Keep the parentheses on a reference when a letter, digit or underscore follows it and
  would otherwise be read as part of the name. Printing DoenetML no longer turns `$(x)_0`
  into `$x_0`, which meant something different.
- 2813fcc: Convert `assignNames` on the composites that were previously left behind — `<select>`,
  `<selectFromSequence>`, `<conditionalContent>`, `<sort>`, `<lorem>` and the sampling
  components — by turning each assigned name into the index that v0.7 uses to reach the same
  replacement. References inside attribute values, macro indices and function-macro
  arguments are rewritten too, an index the author already wrote is kept, and a hyphenated
  name survives as `$(a-b)`. Two composites assigning one name no longer end up with the
  same `name`, and a name assigned in two different v0.6 namespaces now sends each reference
  to the one it was reaching into.

    Also upgrade the deprecated attributes that had no handling (`sourcesAreResponses`,
    `sourcesAreFunctionSymbols`, `tname`, `updateValue`'s `prop`, `nVariants`, a graph's
    `xlabel`/`ylabel`, and others), turn a parameterized `<copy uri="doenet:...">` into a
    `<module copy="doenet:...">`, and replace a list's `maths`/`math2` props with indices. The
    v0.6-only tags (`<copy>`, `<map>`, `<template>`, `<sources>` and the rest) are now
    recognized however they were capitalized.

    Fixes several ways conversion could quietly lose or corrupt content: a module's `<setup>`
    kept only its `<customAttribute>` children, an `<image description="...">` lost the
    alternative text screen readers need, an external copy's assigned name was dropped,
    `<image source="a/b.png">` had its slashes turned into dots, `<copy source="../f">` became
    `source="...f"`, a nested function macro was left in v0.6 syntax, a `<copy>` left in place
    lost the `prop` that said what it copied, and a `<copy>` of something the document could
    not build was renamed to `<_error>`, which is not an element anyone can write. A reference
    written with dot notation is left alone, since v0.6 reached props that way and nothing
    else.

    A document whose `<copy>` tags cannot be resolved now converts instead of failing
    outright, and problems that need an author's attention are reported with a rule name so
    they can be grouped.

## 0.7.26

## 0.7.25

## 0.7.24

## 0.7.23

## 0.7.22

## 0.7.21

## 0.7.20

## 0.7.19

## 0.7.18

### Patch Changes

- ace8b55: Reword the one-sentence component summaries surfaced by the editor's context-sensitive help and the schema.
    - ~234 per-component summaries (the `static componentDocs.summary` on each component class) were reconciled against the prior reference-docs wording. The worker class is now the single source of truth; the alphabetical and by-type reference indexes are generated from it.
    - Style is uniform across all 245 components: starts with a capital letter; no trailing period.
    - A handful of substantive corrections, most notably `<pretzel>` (which previously described itself as "a figure for visualizing logical compositions of subsets of the reals" — entirely wrong; now describes its actual response-matching behavior) and `<attractToConstraint>` (which had mirrored `<attractTo>`'s description instead of its own).
    - The autocomplete-popup hover text, the in-editor help panel, and any other surface that reads `componentDocs.summary` will all show the new wording.

- 63a0079: Schema cleanup and reference docs additions.
    - Hide non-functional or PreTeXt-compat-only components from the generated schema (and therefore from autocomplete and the auto-generated reference docs): `<markers>` (slider helper currently broken — tracked in #1164), `<topic>` (PreTeXt-compat alias), `<dataFrame>` and `<summaryStatistics>` (experimental, no source mechanism yet).
    - Refresh wording of two `<annotation>` attribute descriptions (`speech`, `sonify`) to match how Prefigure's screen-reader features actually surface to learners.
    - Add 22 new author-facing reference pages covering previously-undocumented components (annotation, annotations, cascade, cascadeMessage, cellBlock, clampFunction, codeEditor, column, displayDoenetML, extractMathOperator, feedbackDefinition, givenAnswer, latex, lcm, note, periodicSet, pluralize, solveEquations, tagc, tage, variantControl, wrapFunctionPeriodic), plus cross-link additions on existing `<option>`, `<select>`, `<feedback>`, `<award>`, `<tag>` pages. Every component now in the generated schema is documented (`check:docs-coverage` reports `0 unresolved` with an empty allow-list).

- fb3ebdf: Fix `<latex>` crashing when one of its children lacks a `latex` state variable. Constructs like `<latex><text>foo</text></latex>`, `<latex>$mathInput.latex</latex>` (where `<mathInput>` does not expose a `.latex` prop), or any reference whose resolved component lacks `latex` previously raised "Unknown state variable latex of `<idx>`" from the worker, which leaked the internal state-variable name to the rendered viewer. The `<latex>` value-dependency now marks `text`/`latex` as optional on its children, matching `<m>`/`<me>`/`<md>`, so children without `latex` fall back to their `text` value.
- f16dd18: `<subsetOfRealsInput>` improvements:
    - Propagate the input's `variable` through `extend`. Previously, `<subsetOfReals extend="$input" displayMode="inequalities" />` ignored the input's variable and rendered with the `<subsetOfReals>` default `x`. The `subsetValue` shadowing instructions now include the `variable` attribute, matching the pattern `<mathInput>` uses for its number-display attributes.
    - Hide attributes that the renderer currently ignores from the generated schema (`xMin`, `xMax`, `width`, `height`, `dx`, `xlabel`) via `excludeFromSchema: true` so they no longer appear in autocomplete or auto-generated docs. The attributes remain on the class — this is a documentation/schema cleanup, not a behavior change for documents that already set them.
    - Add the long-missing reference page at `packages/docs-nextra/pages/reference/subsetOfRealsInput.mdx`, with a regression test exercising the variable-shadowing fix and an updated alphabetical-index entry.

## 0.7.17

## 0.7.16

## 0.7.15

## 0.7.14

## 0.7.13

## 0.7.12
