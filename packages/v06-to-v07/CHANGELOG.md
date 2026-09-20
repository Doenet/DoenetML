# @doenet/v06-to-v07

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
