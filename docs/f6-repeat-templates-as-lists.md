# F6 design: a repeat whose template is one value becomes a list

Design for #2163, step F6 of stream F (#2157) of #2125. Status: decisions settled 2026-10-06; #2172 (F5) and #2177 (F4) merged the same day, and #2187 and #2189 since. Steps 1 to 5 are done, step 4 for number and math templates and step 5 for point templates (see [Phasing](#phasing)). Line numbers are on `main` at 682ff8f28 (#2171); the `Math.js` ones are from before step 2 moved that code out. Paths are under `packages/doenetml-worker-javascript/src/` unless they start with `packages/`.

## Summary

- **The template is analysed once, not per iteration.** Everything about a template except the values its references read is the same in every iteration: its strings, the codes they parse into, its attributes, which children can be modified, and the linear template a write is matched against. So the "pure functions" #2163 asks for split into two parts for each type:
  - `analyze`, run once per template;
  - `evaluate` / `invert`, run per index, which do little more than substitute values.

  The components call the same functions, so the logic is written once.
- **The list holds one array per template node.** A nested component, such as the dot plot's `<number fixed>` inside its `<point>`, is a node of its own whose array feeds its parent's codes.
- **Phasing.** Number, math, text and boolean templates need F4's document pass (#2177) but not F5. Point and vector templates need F5's `GraphicalValueList` (#2172), which already applies constraints per entry. The extraction from `Math.js`, `Number.js`, `Text.js` and `Boolean.js` touches no file either PR touches, and can start now.
- **What qualifies.** The heavy fixtures qualify: the dot plots, measures-of-spread and unit-circle-labeling. Real content qualifies less often: at most 5 of 98 distinct templates in the fall 2025 corpus, all of them through a `<repeat>` over a list (see the corrections below the table). Most templates that stay composites hold inputs or answer blanks.
- **Rule changes against #2163.**
  - A name on the single top-level component is allowed. It names the entry. The issue's own example, the dot plot's `<point name="P">`, needs this.
  - Templates that would need per-entry renderer attributes are left out. There are 2 such templates outside tests.
  - Random samplers in the template are left out at first.

## What qualifies: the survey

The script, its JSON outputs and a dump of every real template are in the session scratchpad. They are not committed, and can be regenerated on request.

Each template was classified against the rule in [Qualification](#qualification) below. The 106 real files are v0.6 documents from the fall 2025 corpus, where `<map>` plays the role of `<repeat>`.

| source | repeats | qualify | would need per-entry attributes | single math operator (`<abs>`, `<round>`, `<evaluate>`) | composite |
|---|--:|--:|--:|--:|--:|
| perf fixtures | 15 | 10 | 0 | 0 | 5 |
| docs code blocks | 27 | 8 | 1 | 0 | 18 |
| real, all | 303 | 90 | 1 | 25 | 178 (+9 unlinked points) |
| real, distinct templates | 98 | 14 | 1 | 6 | 72 (+5) |
| tests | 323 | 121 | 0 | 4 | 198 |

Notes on the table:
- **Corrected after step 2.** The survey script counted `$$f(…)` as a reference, but it is a nested `<evaluate>`, which is left out with the other math operators. It also treated a point's `x` and `y` attributes as its value, so it did not apply rule 5 to them, and it counted the value of a `<repeat>` as `$v`, which rule 4 did not allow until the decision of 2026-10-06 (below). Rechecked by hand, the real templates it counted as qualifying are:
  - out: the Riemann-sum templates that evaluate `$$p(…)` or `$$ldeltat(…)` (3 distinct, 44 maps); the math templates that read `$v.vertex1` of collected rectangles (3, 3 maps), since the `for` is not a list of values; the draggable points with `x='$i - 3'`, `x='$i - 2'` or `x='$j - 2'`, where `$i` and `$j` are the value of a `<sequence>` (3, 3 maps), by rule 5;
  - in, when the repeat's `for` is one list: the Riemann-sum `<math simplify="numbers">$v/$deltat</math>` over a list of terms (2 distinct, 32 maps) and the points `($equi, $equi)`, `($i, $v)` and `($v,0)` (3, 8 maps).

  That is all 14 distinct (math 8, point 6) and all 90 maps: 50 out, 40 in.

  The columns of the table are as the script gave them; the qualify counts of the other rows were not rechecked against these corrections.
- The qualify column counts a template with a random sampler inside as qualifying; the survey flagged those. The first version leaves samplers out ([Randomness](#randomness)). 4 of the docs' 8 have a sampler, so 4 docs templates qualify for the first version. The real and fixture templates counted as qualifying have none. The tests row was not split by samplers.
- 76 of the 90 maps the script counted are one cloned family of Riemann-sum documents. 44 of them evaluate `$$p(…)` or `$$ldeltat(…)` and are out (above).
- In real content, the script's qualifying types are math (8 distinct) and point (6); after the corrections, math (2) and point (3). In the fixtures they are point (4), number (4), math (1) and boolean (1). No template anywhere is an interval.
- 103 of the 122 layout or multi-component composites in real content hold an input or an answer.
- The single math operators would qualify only if the operators that subclass `<math>` are treated as math. That is a later extension.

Examples:
- `test/perf/fixtures.ts:134` and `test/perf/fixtures/measures-of-spread.doenet:51` (the repeat; the point is on the next line), the case that matters most:

  ```xml
  <point name="P" labelPosition="top">($values[$i], <number fixed>0.5 ($sortedPos[$i] - $first[$i])</number>)<constrainToGraph/><constrainToGrid dx="$dx" dy="0.5"/></point>
  ```
- `test/perf/fixtures/unit-circle-labeling.doenet:9`: `<point styleNumber="2" …>(cos($k/24*2pi), sin($k/24*2pi))</point>`
- `test/perf/fixtures/unit-circle-labeling.doenet:25`: `<boolean>$P=<point>$points[$ka]</point></boolean>`. This is a nested point inside a boolean.
- `packages/docs-nextra/content/guides/charting-a-simulation.mdx:201` (the repeat): `<number>0.9 * $h - 90 + $noise[$i]</number>`

## Qualification

The rule is applied to the document by a pass in the style of F4's `utils/dast/listForms.ts` (#2177), which runs after sugar and before the value-reference pass. A repeat that does not qualify is unchanged.

**A template qualifies when** all of the following hold:
1. It is one component of type `number`, `math`, `text`, `boolean`, `point` or `vector`, after sugar.
2. It may carry a `name`. See [References](#references).
3. Its content is strings plus references and nested unnamed components, and each nested component also qualifies under this rule.
4. Every reference reads one of:
   - a value outside the template, which is the same at every index;
   - `$i` or `$v` (a `<repeatForSequence>`'s value) directly;
   - `$l[$i]` or `$l[$v]`, an entry of a list at exactly the iteration index;
   - `$v` of a `<repeat>` whose `for` is one reference to a list (`for="$l"`), which is read as `$l[$i]` (decided 2026-10-06). The repeat already iterates over such a list entry by entry (`sourcesChildIndices`).

   #2171's planning already decides the entry case. Its check that "every reference plans as an entry" is the one to reuse.
5. No attribute or non-content child depends on `$i` or `$v`. Constraint children and attributes such as `labelPosition`, `styleNumber` or `dx="$dx"` become the list's own.

**A template stays a composite when any of the following hold:**
- Anything from #2163's list: an attribute that changes per iteration, an input, layout content, an answer, action or `updateValue`.
- A nested component is named.
- The template references itself, like `$P` or `$dragPoint.x` inside its own label.
- An index is computed: `$l[$i+1]` or `$l[$perm[$i]]`. This could be added later with per-key dynamic dependencies. No qualifying fixture needs it.
- The template reads the value of a `<repeat>` whose `for` is not one list. #2171 keeps that value as a component of each iteration, because it is a copy of an item, not a value.
- The template contains a math operator, including the `<evaluate>` that `$$f(…)` makes.
- The template contains a random sampler. See [Randomness](#randomness).
- The template contains a point in a sticky group, or a point with `link="false"`. The latter is a free point with state of its own, not an expression.
- The repeat is referenced in a way the pass cannot see statically, such as `<group extend="$Ps[2]">` followed by `$g.P`. This is the same guard #2171 uses for `$g.i`.

**Per-entry renderer attributes are left out.** These are templates like `<math anchor="($i,0)">`, or `<point styleNumber="$i"><label>$i</label>`. The survey finds 1 in the docs and 1 in real content, so they are not worth the per-entry machinery yet. F5's `listEntryChildRendererVariables` is where they would go.

## Model

The repeat is retyped to an internal list type, as F4 retypes `<collect>` to `_collectList`. There is one class per entry kind:
- `_repeatValueList` extends `ValueListComponent` for number, math, text and boolean templates.
- `_repeatGraphicalList` extends F5's `GraphicalValueList` for point and vector templates.

The template stays serialized as the list's definition, as `templateChildIndices` keeps it today. The repeat's attributes carry over: `from`, `to`, `step`, `length`, `for`, `valueName`, `indexName`, `asList` and `isResponse`.

### The template as a tree of nodes

Each template component is a node: the top component and each nested one. Point sugar makes a point's content into a `<mathList>` of maths or a `<coords>`, so the dot plot's point has the following nodes:

```
point P                         codes: xs ← [m1, m2]          constraints: list's own
├─ math m1   "codeA"            codeA ← values[k]
└─ math m2   "codeB"            codeB ← n[k]
   └─ number n (fixed) "0.5 (codeC - codeD)"   codeC ← sortedPos[k], codeD ← first[k]
```

For each node, the list has an array state variable of length N (`isArray`, `recursiveDependencyBoundary`, per-key dependencies). Key k depends on:
- for an index-reading code, key k of the referent list's values array;
- for a constant code, the referent's value;
- for a nested node, key k of that node's array.

The top node's array is the list's `listEntryValuesVariable`. The arrays are arrays of values, not of components, which is all F1 to F5 need: entries are presented to a parent and drawn through the existing hooks.

A dependency on key k of another list's array is the same edge a `_ref` for `$l[$i]` reads after #2171's `remapExtendIndices`, so no new kind of dependency is needed.

### The value functions

For each of `math` (with `coords` and `interval`), `number`, `text` and `boolean`, there are three functions.

```ts
// Once per template. Inputs: the string pieces, the kind of each code
// (math | number | text | boolean | point), the resolved attributes
// (parse, normalize and display settings, compare settings), and which
// codes can be modified.
analyze(content, attributes, modifiable) => Analysis
// Math: codePre, expressionWithCodes, codesAdjacentToStrings and the
//   determineCanBeModified results (template, inverseMaps,
//   constantChildIndices, mathChildrenMapped).
// Number: the parsed expression and children by code.
// Boolean: the logic tree.

// Per index: substitute and normalize. Returns value plus display state
// (math: value, valueForDisplay, latex, text, number).
evaluate(analysis, codeValues) => Display

// Per index: what to write. A write names a code with a desired value,
// a string piece with a new string, or "refuse". Number, text and
// boolean are trivial: one child or nothing.
invert(analysis, desired, currentCodeValues) => Writes
```

**As built** (step 2, `utils/valueFunctions/`). `analyze`, `evaluate` and `invert` are names for roles, not functions. The functions per type:

| role | math (`math.js`) | number (`number.js`) | text (`text.js`) | boolean (`boolean.js`) |
|---|---|---|---|---|
| analyze, once | `mathCodePre`, `mathExpressionWithCodes`, `mathCodesAdjacentToStrings`, `mathInverseAnalysis` | `buildParsedExpression` (in `booleanLogic.js`) | — | `buildParsedExpression` |
| evaluate, per index | `mathValueFromCodes`, then `normalizeMathExpression`, `mathValueForDisplay`, `mathDisplayString` | `numberValueFromCodes`, `numberFromString`, `numberValueForDisplay`, `numberDisplayString` | `textFromChildren` (in `text.ts`), `textToMath` | `booleanValueFromCodes` |
| invert, per index | `invertMathValue`, `mathStringsFromExpressionWithCodes` | `numberFromDesiredValue`, `numberFromDesiredText` | `textChildValuesFromDesired`, `textFromMath` | (one child or nothing; inline) |

`invertMathValue` is synchronous; `<math>`'s inverse definition awaits what it reads (`canBeModified`, the analysis, `preprocessMathInverseDefinition`) and calls it. `test/utils/valueFunctions.test.ts` uses the functions as the list will: parse once, then evaluate at several indices, and invert.

**Why `analyze` is the large part.**
- Math's `expressionWithCodes` and `determineCanBeModified` (as built, `mathInverseAnalysis`) depend only on the strings, the attributes and which codes can be modified. Today, every iteration of a qualifying template redoes them with identical inputs.
- Boolean's `buildParsedExpression` depends only on the strings and the child kinds.

So the list runs `analyze` once and runs `evaluate` N times. The per-index work is `substitute`, then `normalizeMathExpression`, `roundForDisplay` and `toLatex`/`toString`.

**Most of the code exists.** These are already pure or nearly so (agent survey, `Math.js` and `utils/`):
- `calculateExpressionWithCodes`, `calculateMathValue`, `calculateCodesAdjacentToStrings`, `determineCanBeModified` and `checkForLinearExpression` (module functions in `Math.js:1289-1785`; as built, their logic is `mathExpressionWithCodes`, `mathValueFromCodes`, `mathCodesAdjacentToStrings` and `mathInverseAnalysis`, and `checkForLinearExpression` moved with them);
- `createInputStringFromChildren`, `normalizeMathExpression`, `roundForDisplay` and `buildNumberDisplayParameters`;
- `numberFromString`, `buildParsedExpression` and `evaluateLogic`;
- `textFromChildren`.

Two pieces need real work:
- **Math's `invertMath` and `getExpressionPieces`** (`Math.js:1787-2041`). They are async and read `await stateValues.*` and the workspace. They become a synchronous `invert` over an `Analysis`, with the component's inverse definition as a thin caller that awaits its inputs first. `preprocessMathInverseDefinition`'s fill of unspecified vector components takes the current value as an argument. As built, `invertMathValue` (with `getExpressionPieces` as `mathExpressionPieces`) is the synchronous part; `preprocessMathInverseDefinition` is unchanged and `invertMath` still calls it with `stateValues` and the workspace.
- **The dependency-shaped inputs.**
  - `evaluateLogic` and `buildParsedExpression` take a `dependencyValues` bag of `{componentType, stateValues}` children and call `componentInfoObjects`. They take kinds directly instead. (Not in step 2: they keep their interfaces, and `booleanValueFromCodes` wraps `evaluateLogic`.)
  - `mathChildrenFunctionSymbols` compares reference identity (its definition in `Math.js`). It becomes an input to `analyze`, computed by the caller. As built, it is `mathExpressionWithCodes`'s `functionSymbolChildIndices`.

**One copy of each type's logic.** The list components of F1 to F3 re-implemented parts of these chains: `entryValueOfType`, `mathValueForDisplay`, `numberValueForDisplay`, `mathText` and `mathLatex` in `ValueListComponent.js:1253-1516`. They had small differences. For example, the list's `mathValueForDisplay` always used `simplify: "none"`, and its `mathText` and `mathLatex` ignored `displayBlanks`. As built (step 3), those copies are gone: the list's display state calls `mathValueForDisplay`, `numberValueForDisplay`, `mathDisplayString` and `numberDisplayString`, passing those differences as settings, so what a list shows is unchanged. `entryValueOfType` stays: it converts a value to an entry's type, which no value function does.

**Settings that come from outside the template are resolved once.** These are:
- the parse settings that fall back to the parent and source composite (`functionSymbols`, `splitSymbols`, `referencesAreFunctionSymbols`, `parseScientificNotation`; `Math.js:194-227`);
- the number-display settings inherited from a single child;
- the locale of a boolean's `text`.

They become list-own state variables read as the template component would have read them, with the repeat as the parent.

### Points and vectors

F5's `GraphicalValueList` already gives each point entry:
- its own renderer;
- a drag (`movePoint` with `listEntryIndex`, then `writeEntryFromAction`);
- constraints applied per entry, from the list's `constraints` children (`adjustEntryValues`, with graph limits found through `CONSTRAINED_ANCESTOR_TYPES`).

A point template therefore needs the following:
- **Its value per entry** is the `evaluate` of its coordinate nodes. A pure point function covers only the case with no constraints, no sticky group and no graph (agent survey, `Point.js:518-1246`). Constraints are not part of it: they are F5's `adjustEntryValues`, applied to the evaluated coordinates.
- **The template's constraint children and attributes** (`<constrainToGraph/>`, `<constrainToGrid dx="$dx"/>`, `labelPosition`) become the list's own. They are the same at every index, which is the qualification rule.
- **A drag on entry k** goes through F5's path. It unapplies the constraints as `Point`'s `constraintResults` inverse does, then calls each coordinate node's `invert` at k. The writes then land on the codes: key k of `values`, of `sortedPos`, and so on.

This is the part that waits for #2172. Its hooks (`entryValueAdjustmentDependencies`, `listEntryRendererDefaults`, `listValuesEntryPrefix`, the per-entry `draggable` and `fixed`) are what is under review.

### Writes

- **A write to entry k is the template's write at k.** `invert(analysis_node, desired, codes@k)` gives code writes. Each one goes:
  - to key k of the referent list (through the existing list-entry inverse);
  - to the referent itself, for a constant code;
  - or to the nested node's array, which inverts in turn.
- **A string-piece write** (`<point>($i, 0)</point>`, dragging y, which today edits the `0` in that iteration's `<math>`) is saved on the list as a per-entry `entryWrites` value. This follows F1's `{value, over}` scheme.
- **Writes outlive a shrink.** Today a repeat that shrinks withholds its last iterations, keeping their state, so a point dragged in iteration 3 is where it was dragged when the repeat grows back to 3 (pinned in `repeatTemplateLists.test.ts`). A list drops the writes past its end (`dropListEntryWritesFrom`, `EssentialValueWriter.ts`), so the repeat's list must keep them instead.
- **A write to a constant code changes every entry.** Today's composite does the same, because every iteration's child references the one referent. This is pinned in `repeatTemplateLists.test.ts`.
- **Modifiability per code can differ by entry**, for example in an authored `<numberList>` with some fixed entries. `analyze` depends on which codes can be modified, so it is memoised by that signature: usually one analysis, at most a few.
- **Refused writes.** `$i` is fixed. `$v` follows #2171: drags through a `<sequence>` entry solve for the other operand.

### References

- **`$Ps[k]`** indexes the list, as `$l[k]` does.
- **The top-level name.** `$Ps[k].P`, `$Ps[$i].P` and `$Ps[k].P.x` are rewritten by the qualification pass to `$Ps[k]`, `$Ps[$i]` and `$Ps[k].x`, dropping the template's own name. The pass sees every reference, as #2171's does. A path it cannot rewrite statically disqualifies the repeat.

  This replaces #2163's "named components inside the template keep the composite" for the top component only. Nothing on `main` gives a name to an entry, and nothing needs to.
- **`$Ps.x`** becomes a property read of a list: one list component, through `Copy.js` `arrayListReplacement` (`:4130`). Today it is one shadow per point (`replacementSourceIdentities`, `:284-419`).

  Making `$Ps.x` one list component when the repeat stays a composite is a separate item of #2157. It is not part of F6.
- **Rendering.** `asList` defaults to true, so the separators match. Each entry is drawn by its type's renderer (F1, F5).

### Randomness

Each repeat calls `setUpVariantSeedAndRng(useSubpartVariantRng: true)` (`utils/variants.ts:58-121`). That draws its seed from the parent's `subpartVariantRng`. Each iteration's `group` then draws from the repeat's stream, in creation order (`Group.js:396-406`).

**The list must make the same draw from its parent.** Otherwise every random component after the repeat in the document changes its value. This is a variant-stability requirement, and it gets a test that passes on `main`. Example: a qualifying repeat followed by a `<selectRandomNumbers>`, with the same variant before and after.

**Samplers inside a template are left out at first.** To keep their values, the list would draw one subpart seed per iteration, in order, and seed each entry's sampler from it. The survey's qualify counts include templates with a sampler inside. None of the real or fixture ones have one. 4 of the docs' 8 do, so 4 docs templates qualify for the first version.

### Saved state

Not a constraint. Version 0.8 cannot read state saved by 0.7, because the format changed, so there is nothing to migrate. Reader-made writes to a qualifying template (drags, string-piece edits) are saved on the list's own `stateId`, as `entryWrites`, like the other list components.

## Open list-entry issues

Several issues filed while reviewing F4 and F5 are gaps in what a list entry can do that a component can. Each would be a regression for a repeat that F6 converts, because today its iterations are components. F6 does not fix them. The qualification pass keeps the composite wherever a document would hit one, and each guard gets a test that fails with the guard disabled. Fixing an issue later lifts its guard.

| issue | what an entry lacks | guard in the qualification pass |
|---|---|---|
| #2181 | an entry as the target of `triggerWhenObjectsClicked`/`Focused`, `<label forObject>`, a PreFigure `annotation ref`, `<ref to>`, `<callAction target>` | an entry of the repeat (`$Ps[k]`, `$Ps[k].P`) named as any of these |
| #2185 | an entry referenced on its own does not take its source's `label`, `fixed` or `draggable` | fixed by #2187 for point and vector lists, which read them from each entry's source (`entryChildren`). An entry of the repeat's list has no source component, so step 5 gives it the template's values of these as the list's own, or guards an entry referenced on its own in a graph |
| #2191 | a point made from an entry ignores its graph's `fixed` and its source's `fixLocation` | step 5: an entry of the repeat referenced on its own in a graph, unless #2191 is fixed first |
| #2186 | a value-type entry drawn in a graph ignores its own `anchor`, `draggable` and `layer` | fixed by #2189, which places each entry at its source's anchor (`entryGraphSources`). An entry of the repeat's list has no source to take an anchor from, so a number, math, text or boolean template inside a `<graph>` keeps the composite |
| #2184 | a `copy=` of a point or vector entry is placed at the origin | a `copy=` of an entry of the repeat |
| #2176 | (a `copy=` of a repeat with written children fails to load) | an `extend`/`copy` of the repeat itself, at first |

Not relevant to F6: #2179 (a standalone `<vector>`), #2182 (an authored child's own `hide`; a template's `hide` is the list's own), #2183 (mixed dimensions; one template gives one dimension), #2174 (answers do not qualify), #2173 (a letters sequence; to check whether it is in `_repeatValues`, which F6 reads).

## Phasing

| step | needs | touches | can start |
|---|---|---|---|
| 1. Pinning tests on `main` | nothing | `tagSpecific/repeatTemplateLists.test.ts` | done |
| 2. Extract the value functions for math, number, text and boolean; the components call them | nothing | `Math.js`, `Number.js`, `Text.js`, `Boolean.js`, `utils/valueFunctions/` | done |
| 3. `ValueListComponent`'s copies call the functions | #2172, #2177 (merged) | `ValueListComponent.js` | done |
| 4. Qualification pass and `_repeatValueList` for number and math templates | #2177 (the listForms pass, the `valueReferences.ts` refactor) | `utils/dast/repeatLists.ts`, `utils/repeatTemplate.js`, `RepeatValueList.js` | done |
| 4b. Text and boolean templates | step 4 | the same | when evidence asks |
| 5. `_repeatPointList` for point templates | #2172 | `RepeatPointList.js`, `abstract/repeatList.js`, `GraphicalValueList.js` | done |
| 5b. Vector templates | step 5 | the same, on `VectorList` | when evidence asks |
| later | evidence | samplers, per-entry attributes, computed indices, the values of a `<repeat>` over anything but one list, the math operators (including `$$f(…)`) | — |

**Step 1, pinning tests.** These all pass on `main`. Each records today's behaviour for a qualifying template:
- the values and the rendered text;
- `$Ps[2].P`, `$Ps[$i]` and `$Ps.x`;
- a drag through `$ns[$i]` and a drag through a string piece;
- a write to a constant code;
- a random sibling after the repeat, unchanged by the variant;
- a saved state round trip within one version;
- a shrink and a regrow.

Step 4 alone reaches the number and math fixtures (the unit-circle boolean's nested `<point>` waits for step 5), the measures-of-spread sums, and the Riemann-sum templates that read `$v` of a `<repeat>` over a list. The Riemann-sum templates that evaluate `$$p(…)` or `$$ldeltat(…)` wait for the math operators. Step 5 reaches the dot plots and measures-of-spread, where the template content is 52% and 34% of resolved state variables (#2163). Each step pastes its census rows, per #2125.

**Step 4, as built.**
- **The pass** (`utils/dast/repeatLists.ts`) runs after the value-reference pass, which has decided whether the value and index are lists (`_repeatValues`, `_repeatIndices`). It retypes a qualifying repeat to `_repeatValueList` and keeps the template as its one serialized child (`repeatTemplate`). Each reference in the template that reads the same value at every index moves out to be a child of the list (`repeatTemplateConstant`), and the template keeps a placeholder for it. Each reference that reads entry k of a list is marked (`repeatEntry`); `$v` of a `<repeat>` over one list is pointed at that list. The template's own attributes become the list's, and its name is dropped from `$r[k].m`.
- **What qualifies, beyond [Qualification](#qualification):**
  - the template is a `<math>` or `<number>`, and a nested component is an unnamed `<math>`;
  - the attributes are, on the template, `simplify`, `expand`, `fixed` and the number display settings, and on a nested `<math>`, `simplify` and `expand`, each written as a literal;
  - a reference from elsewhere is `$r`, `$r[k]` or `$r[k].m` (or `$g.r[k].m`, naming the repeat through another; not `$r[k][j].m`, which names nothing in the composite), not an `extend` or `copy`, not named by a reference attribute (#2181), and does not reach the template's name another way, as through an outer repeat (`$a[2][1][3].m`);
  - the repeat is not in a `<graph>` (#2186), and neither it nor anything holding it is referenced, copied or extended from inside one (`$r`, `<group extend="$g"/>`), following copies of those copies;
  - a `<repeat>`'s `for` is one reference to a whole list (`$l`, not `$l.maths`).
- **The list** (`RepeatValueList.js`) counts its entries as the repeat counted its iterations. It analyses the template once (`templateAnalysis`, `utils/repeatTemplate.js`). Entry k depends on entry k of each list the template reads (by the list's `listEntryVariablePrefix`), on the constants, and on the list's `simplify` and `expand`, and is computed with the value functions. Its `entryValuesForDisplay` rounds, then simplifies and expands, as a `<math>`'s `valueForDisplay` does.
- **Writes.** A write to entry k is inverted through the template (`invertRepeatTemplate`) to the entries and constants it reads at k. A list it reads takes a write only when its `modifyIndirectly` is not false, as a reference to its entry (`ValueRef`) checks. The list reports its entries as taking a write (`entriesCanBeModified`) only when the template does, given what it reads (`templateCanBeModified`), as each iteration's component reported its `canBeModified`; so `<math>$r[2] + $c</math>` of `<math>$v</math>` writes `$c`. A `<math>` in the template takes no write under `fixLocation`, as each iteration's `<math>` took none. What decides whether a write is taken (each list's and constant's writability, `fixLocation`) is read only when a value is written, so the values do not depend on it, which may itself read them. Where the template takes the value by changing its own text, as `<math>($v, 0)</math>` takes `(2, 5)` by changing its `0`, or `<number>7</number>` takes `9`, or an empty `<math></math>` or `<number></number>` takes the value as its own text, the list keeps entry k's copy of that component's text (`entryWrites`, by node: the expression with codes, or the number's string), as the composite changed that iteration's text. It keeps the text of an entry past the end while the repeat is shorter (`listKeepsEntryWritesPastEnd`, which `EssentialValueWriter` reads before `dropListEntryWritesFrom`), as the composite kept a withheld iteration, and restores such a text from a saved state past the end too (`EssentialValueWriter.processNewStateVariableValues`), so a reload while the repeat is shorter keeps it for when it grows. A nested `<math>` that takes a value by changing its text has its text kept the same way, by its node.
- **The pass** indexes the document's references once, by what they read and by the names in their paths, so each repeat looks only at the references that can reach it: 33 ms for 400 repeats and 4000 references.
- **`<collect componentType="math">`** of a section holding a repeat of `<number>`s collected, from the composite, the `<math>` that sugar wraps around a number's content of more than one piece (`1 + 1` for `<number>$v+1</number>`). The list has no such component, so that collect is empty; `componentType="number"` collects the entries as before.
- **Renderer types.** The list adds only its entries' renderer (`math` or `number`) to `rendererTypesInDocument`, where the composite added those of every type a `<math>` could become (`point`, `vector`, `text`). What is drawn is the same.
- **Randomness.** The list draws its seed from its parent as the repeat did (`setUpVariantSeedAndRng`), and has no variant descendants, so its `generatedVariantInfo` has no subvariants.
- **Tests.** `tagSpecific/repeatValueLists.test.ts` loads each document with and without the pass (`setRepeatListsEnabled`) and compares what is shown, after writes and changes. The step 1 pinning tests pass unchanged.
- **Census.** `repeatForSequence $i^2 x4`: 23 components, 1059 dependencies, 461 state variables resolved, to 7, 277 and 126. `repeatForSequence literal x4`: 14, 665, 282 to 6, 256, 117. The heavy fixtures change less, since their points wait for step 5: unit-circle-labeling (one list) 3256 components and 59549 dependencies to 3109 and 59145; measures-of-spread (two lists) 8672 and 210140 to 8374 and 205982. Load times did not change beyond their noise.

**Step 5, as built.**
- **Shared code.** What a repeat made a list does whatever its entries are moved to `components/abstract/repeatList.js`, and `RepeatValueList` uses it:
  - counting the entries;
  - the template and its analysis;
  - the entries computed and inverted through the template;
  - the variant.
  
  `GraphicalValueList` exports the wrapper that gives each entry the list's dimensions and constraints (`graphicalEntryValuesDefinition`), so that a list whose entries come from elsewhere can use it.
- **The list** (`RepeatPointList.js`) is a `<pointList>` with no authored entries (`entryStructure` is one empty source per iteration).
  - Its entries are the template's points (`repeatTemplateEntriesDefinition` wrapped by `graphicalEntryValuesDefinition`), so its constraint children constrain each entry.
  - Its number of dimensions is the template's number of coordinates.
  - The template's renderer attributes (`labelPosition`, `draggable`, `showCoordsWhenDragging`, `layer`), `styleNumber`, `fixed` and marker style become the list's own, and every entry is drawn with them, as every iteration's point was drawn with the same ones.
- **The evaluator** (`utils/repeatTemplate.js`) gains a point node.
  - The point's coordinates, the maths sugar made in its `xs`, are its codes.
  - Its value is the vector of them, each simplified, as a point's `unconstrainedXs` simplifies them.
  - A write to it writes each coordinate on its own, and keeps one that does not take its value (a `<number fixed>`, `$i`), as a point's coordinates are written.
  - Each node records the entry codes it reads, itself or through nested nodes (`entryCodes`).
- **Coordinates read on their own.** The dot plots' y reads `$Ps.x`, through `sortIndices` and `indexOf`. A point's x does not depend on its y, because `constrainToGrid` and `constrainToGraph` constrain each coordinate independently (`independentComponentConstraints`). So each coordinate of the entries is an array of the list's own (`entryCoordinates1` to `3`, the entries' `x1` to `x3`).
  - Each is computed from that coordinate of the template alone (its `entryCodes`), and constrained coordinate by coordinate when every constraint allows it (`independentConstraints`); otherwise it is read from the whole entry.
  - A write to one (`$Ps[2].P.x` as a `bindValueTo`) goes through that coordinate of the template alone. The value written is constrained as a point constrains a write to one coordinate: on its own, or, when a constraint is not by coordinate (`<constrainTo>` a circle), with the entry's other coordinates, keeping only this one.
  - Without these arrays the dot plots are a circular dependency.
  - A coordinate the template's point does not have has no entries, so `$Ps.z` of points `(x, y)` shows nothing, as it showed for the composite (an authored `<pointList>` shows a blank for each point).
- **References to the whole list** (`$Ps` as a polygon's `vertices`) shadow the list's coordinate arrays, which a shadow, holding no template, cannot compute; without that a polygon's vertices are blanks. (The number of entries is already shadowed by `ValueListComponent`; a shadow computes `numIterates` from the attributes it copies.)
- **What qualifies, beyond step 4:**
  - the template is a `<point>` whose content is its coordinates;
  - a coordinate, or a `<math>` template, may nest a `<number>` (the dot plot's `<number fixed>`), not only a `<math>`;
  - its attributes are those above, as literals;
  - its children are constraints that read the same values in every iteration, and become the list's;
  - it may be in a `<graph>`;
  - a reference from elsewhere may read a property of all the points (`$Ps.x`, `.y`, `.z`) or of one (`$Ps[2].P.x`, rewritten to `$Ps[2].x`).
  - A `<label>`, a coordinate given as an attribute (`x="$v"`), or an attribute that reads the index keeps the composite.
- **Tests.** `tagSpecific/repeatPointLists.test.ts` compares each document with and without the pass:
  - what is shown and drawn;
  - drags through a list entry, the index, a literal and a value outside;
  - the dot plot's point with a nested fixed number and constraints;
  - a shrink and regrow;
  - the template's attributes as drawn;
  - `<constrainTo>` the list;
  - a polygon whose `vertices` are the list, moved, grown and shrunk;
  - a coordinate that reads the entries' other coordinate (`$Ps.x`), which is circular without the coordinate arrays;
  - constraints not by coordinate (`<constrainTo>` a circle), with `$Ps.x` read and one coordinate written;
  - a coordinate the points do not have (`$Ps.z` of points `(x, y)`);
  - the guards.
  
  The step 1 pinning tests pass unchanged. Tests of a composite's own mechanics keep their repeats composites: renderer deferral in `utils/deferredRendererUpdates.test.ts`, and `allChildrenOrdered` in `collect.test.ts`. So how renderer updates are deferred during a drag of a list's entry is not yet tested.
- **Census and load.** These load the same documents, which show and draw the same; the load times are the range over two runs each.

  | fixture | components | dependencies | state variables resolved | load |
  |---|--:|--:|--:|--:|
  | dot-plot-2 | 2418 → 336 | 55913 → 11078 | 25442 → 3942 | 4.2–7.3 s → 0.7–1.4 s |
  | drag-dot-plot-50 | 1112 → 117 | 27190 → 4893 | 12348 → 1710 | 1.7–2.5 s → 0.4–1.0 s |
  | unit-circle-labeling | 3256 → 1231 | 59549 → 28364 | 28072 → 13423 | 6.9–7.7 s → 3.0–3.4 s |
  | measures-of-spread | 8672 → 4195 | 210140 → 116554 | 98826 → 53792 | 19.8–22.3 s → 9.1–13.4 s |

  A drag of one point of drag-dot-plot-50 (`perf-bench`'s `Ps[1].P`, which `test/perf/drag-timing.ts` and `drag-bench.test.ts` now resolve to the list's first entry) takes a median 25–34 ms per move, against 66–71 ms with the pass off.

## Decisions to settle

1. **A name on the template's component.** In `<repeatForSequence name="Ps"><point name="P">…</point></repeatForSequence>`, an author can write `$Ps[2].P` today: iteration 2 is a group that contains a point named `P`. A list has no iteration groups and no component named `P`, so the name needs a meaning. There are two options:
   - **(a) A name disqualifies the template.** This is #2163's current wording, "named components inside the template keep the composite". The dot plots and measures-of-spread name their point, so they would not convert.
   - **(b) The name refers to the entry.** After an index, the qualification pass drops it: `$Ps[2].P` becomes `$Ps[2]`, and `$Ps[2].P.x` becomes `$Ps[2].x`. A reference the pass cannot rewrite, such as `$P` inside its own template, keeps the composite. Authors see no difference, because `$Ps[2]` and `$Ps[2].P` already show the same point today.

   **Decided 2026-10-06: (b).** In the fixtures, the name `P` is never referenced; the only references into `Ps` are `$Ps.x`.
2. **Per-entry renderer attributes and samplers stay out** of the first version.
3. **A write to a value outside the template changes that value, so every entry moves.** **Decided 2026-10-06.** In `<point>($i, $c)</point>`, dragging any entry vertically writes `c`, as a reference does everywhere else in DoenetML. The list keeps no per-entry override for such a write. A pinning test on `main` checks that today's composite does the same.
4. **Single math operators (`<abs>`, `<round>`, `<evaluate>`) stay out until step 4 has landed.** They would add 6 distinct real templates, but each operator needs its own `analyze`.
