# B4 design: coordinates and expressions over references without attribute components

Design for #2252, step B4 of stream B (#2129) of #2125. Status: shape and order settled 2026-10-09; steps 1 to 3 built. Measured on `main` at b27371d73 (#2255). Paths are under `packages/doenetml-worker-javascript/src/` unless they start with `packages/`.

## Summary

- **The cost is in the wrappers, not the references.** A point written `<point>($i, 2$i)</point>` holds its coordinates in `xs`: a `mathList` attribute component with one `<math>` per coordinate, each holding the coordinate's text and its value references (`_ref`). On repeat-150, one such `xs` costs 124 dependencies. The `mathList` accounts for 32 of them, the two `<math>`s for 80, and the two `_ref`s for 12.
- **Coordinates first, then boolean and math expressions.** #2252 proposed starting with a `boolean` or `math` attribute that is one expression over references (`hide="not $b"`, `equation="x=$a"`). Measured, those are at most 4% of a fixture's dependencies. A point's `xs` is 15.5% on repeat-150 and 6.2% on measures-of-spread.
- **No components at all.** The owner holds the attribute: its text, parsed once, and one *reference slot* per reference in it.
  - A reference slot is a set of state variables on the owner that resolve one reference and read its value. They are the definitions `ValueRef` uses for its own reference, moved into one function that both call.
  - The owner computes the attribute's values from its slots with the value functions F6 already uses (`utils/repeatTemplate.js`), so nothing is written twice: not reference resolution, not parsing.

## Measured

Each figure is the share of the fixture's dependencies at load (the census measure) held by attribute components with references and the components under them.

| fixture | `point.xs` | boolean expressions (`hide`, `condition`) | math expressions (`equation`, `parMax`) | other |
|---|--:|--:|--:|---|
| repeat-150 | 15.5% (150 points, 28% of components) | — | — | |
| measures-of-spread | 6.2% (84 points, 11% of components) | 3.8% | 0.5% | `indexOf.target`, `searchSorted.target` 2.0% (#2253) |
| unit-circle-labeling | 0.7% | 2.0% | 0.4% | `point.coords` 7.1%, `triggerWhen` 4.7%: a `_copy` inside (#2253) |
| hardware-assignment-2 | — | 0.3% | — | |
| dot plots | — | — | — | `indexOf.target`, `searchSorted.target` 6.5–6.9% (#2253) |
| discrete-sir | — | — | 0.4% (one `_ref` in a `<math>`, B2's descoped second stage) | `polyline.vertices` 2.0% (#2253) |

How the cost of a `point.xs` divides:

| fixture | points | `mathList` deps | `<math>` deps | `_ref` deps |
|---|--:|--:|--:|--:|
| repeat-150 (`($i, 2$i)`) | 150 | 4,800 | 12,000 (300) | 1,800 (300) |
| measures-of-spread (`($a-$b, 2.5)`, …) | 84 | 1,792 | 4,480 (168) | 504 (126) |

The coordinates of the points inside a repeat that F6 makes a list (#2163, #2255) already have no components. These points are in repeats F6 does not take (repeat-150's template is a `<p>`) or outside repeats.

## Reference slots

`ValueRef` (`components/abstract/ValueRef.js`) resolves its reference through a chain of state variables, each reading one dependency type the core already has:

1. `refResolutionIndexDependencies` and `refResolutionIndexDependencyValues`: the components written between the brackets of the path (`$i` of `$l[$i]`) and their values.
2. `extendIdx`, `unresolvedPath`, `originalPath`: the path resolved against composites (`refResolution` dependency), re-resolved when an index changes.
3. `referentInfo`: the component and the variable read on it, its companions and whether it is a location (`referent` dependency).
4. `value`: that variable, through a `stateVariable` dependency `referentInfo` determines. Its inverse writes there.

The rest of `ValueRef` is presentation: being drawn, adapters, response marks, `hidden`, display settings.

A **reference slot** is that chain as a function, `referenceSlotDefinitions`, which takes:
- the names to give the state variables (`ValueRef`'s own, or a prefix per slot, `__xs_ref0_value`);
- where the slot's `refResolution` is (`component.refResolution` for a `ValueRef`, the attribute's slot `k` for an owner);
- the fixed referent and the adapter plan, which only a `ValueRef` has;
- the empty value of the type the reference is read as.

The `refResolution` and `refResolutionIndexDependencies` dependencies take the slot from their definition, reading `component.refResolution` when none is given. That is where they read the path, and where a shadowing copy finds the origin it resolves from.

An owner's slots are state variables on the owner, added to its definitions when it is built (`ComponentBuilder`), and, like its other variables, materialized when first read. There is precedent for references held in an attribute without components: `attributeRefResolutions` resolves those of a `createReferences` attribute (`triggerWith`).

## Parsing and evaluating

The abstraction is `utils/valueFunctions/` (`math.js`, `number.js`, `boolean.js`, `text.js`, `mathOperators.js`), which F6 extracted from the components so that `<math>` and a repeat list call the same functions:
- **Parse once.** `mathCodePre` picks the prefix of the codes (`math0`, `math1`, …) that stand for the references, and `mathExpressionWithCodes` parses the text, with the codes in place of the references, into one expression, with the parse settings.
- **Evaluate by substitution.** `mathValueFromCodes` substitutes each reference's value for its code, then the value is normalized (`simplify`, `expand`). A change of a reference re-substitutes; nothing is re-parsed. Nothing is compiled: a `<math>` never is. Only a `<function>`'s numeric functions are, and B4 does not touch them.
- **Invert.** `mathInverseAnalysis`, once, decides which codes and which pieces of text take a write. `invertMathValue`, per write, returns the writes to the codes, or the new text of a coordinate that takes a value by changing its own text (`($a, 0)` dragged to `(2, 5)` changes `0` to `5`).

`analyzeRepeatTemplate` (`utils/repeatTemplate.js`) composes these into a tree of nodes: nested `<math>`s and `<number>`s, `<abs>`, `<round>`, `<evaluate>`, and a point's coordinates. B4 uses the same analysis, with each code reading a slot where F6's reads an entry of a list.

Two things differ from F6:
- **Parse settings are read, not assumed.** F6 parses a template with the defaults, since a template with parse settings does not qualify. An attribute's `<math>` falls back to its parent's `functionSymbols`, `referencesAreFunctionSymbols`, `splitSymbols` and `parseScientificNotation` (`Math.js:205–238`, `fallBackToParentStateVariable`), and that parent is the owner, whose ancestors can set them. So the owner's analysis of the attribute is a state variable that depends on them: parsed once, and again only if a setting changes.
- **A reference read as a function symbol** (`referencesAreFunctionSymbols`, `mathChildrenFunctionSymbols`) keeps the attribute component, as F6 keeps the composite.

Parsing once across owners is possible: on repeat-150, 150 points parse the same `2 math0`. A cache keyed by the text and the settings would parse it once. That needs a parsed expression to be safe to share (substitution returns a new expression, which suggests it is); to be checked, and measured, before it is done.

## Model of an owner-held attribute

- **The attribute** is `{ type: "expression", componentType, template, slots }`: the serialized coordinates (the `<math>`s sugar made) with each `_ref` replaced by a code (`repeatTemplateConstant`), and the `refResolution` and plan of each `_ref`. An unlinked copy takes it, as it takes a literal attribute (`copyOfExpressionAttribute`, beside `copyOfLiteralAttribute`), and resolves its references from where the copy is; a linked copy reads the source's.
- **What readers read.** A point reads `xs.numComponents` and `xs.math1…n` (`Point.js:583`, `:728`), a vector the same. The `attributeComponent` dependency maps those to the owner's `__xs_numComponents` and `__xs_math1…n`, as it maps a literal to `literalAttributeWrites`.
- **Writes.** A drag writes `math k`. The inverse is `invertRepeatTemplate`: to the slots, whose `value` writes the referent, or to the owner's essential copy of a coordinate's text, as `_repeatPointList` keeps `entryWrites`. What takes a write follows F6's settled rules.
- **Which attributes qualify:** `xs` of a `<point>` or `<vector>` whose coordinates are each a `<math>` of text and `_ref`s, with no attributes and no reference read as a function symbol. Nested `<math>`s and `<number>`s, which the template functions could evaluate, keep the attribute component as built (steps 2–3). A reference whose index is itself a reference (`$l[$i]`) keeps the attribute component in the first version, since the index is a component the slot would have to hold. Anything else keeps the component too: a `_copy` inside, a sampler, a named component.

## Steps

1. **Reference slots, behavior unchanged.** Done. `ValueRef`'s chain, its `canBeModified` included, is `referenceSlotDefinitions` (`components/abstract/referenceSlotDefinitions.js`); `ValueRef` calls it with its own names. The two dependencies take a slot (`refResolutionAt`, `utils/referenceSlot.ts`).
2. **A `point.xs` held by its point.** Done, for every qualifying point, not only one; see below.
3. **The rest of `xs`:** a `<vector>`'s, and a point made after the resolver was given the document (the points of a polygon's `vertices`, a label's `anchor`). Done; see below.
4. **Boolean and math expressions** (`hide`, `condition`, `equation`), with a boolean node in `utils/repeatTemplate.js`, which F6's step 4b needs too.

**Step 2, as built.**
- **The pass** (`utils/dast/expressionAttributes.ts`) runs after the literal attributes. It replaces the `xs` of a `<point>` whose `mathList` and `<math>`s have no attributes, and whose `<math>`s hold only text and `_ref`s read as a math or number, with no component in their path and a path that starts with a name. A slot keeps its `_ref`'s `refResolution` and read plan, and resolves from the point (`nodesInResolvedPath[0]`).
- **The point's variables** (`utils/expressionAttribute.js`, added by `ComponentBuilder` before its state variables are initialized): a slot per reference, `__xs_analysis`, `__xs_writes` (the text written to a coordinate, essential), `__xs_numComponents` and the array `__xs_maths` (`__xs_math1`, …). The `attributeComponent` dependency reads `xs.numComponents` and `xs.math k` from those (`expressionAttributeVariable`, `utils/expressionAttributeNames.ts`).
- **Parse settings.** An `xs` `<math>` falls back to the `mathList`'s settings, which falls back to the point's, and a point has none, so the coordinates are parsed with the defaults, as the analysis parses them. An attribute whose owner has parse settings (step 4) needs them read.
- **Copies and repeats.**
  - Renumbering a copy renumbers each slot's resolution (`remapRefResolutions`, `substituteComponentIdx`).
  - A repeat points a slot at the iteration's value or index, or its entry, as it points a reference (`remapRefResolutionForIteration`).
  - An unlinked copy takes the attribute with the text written to it (`copyOfExpressionAttribute`), which a copy snapshot holds and restores (`copySnapshot.js`).
  - A linked copy reads the source's, through the `attributeComponent` dependency.
- **One change to the core.** Setting an essential value also sets it on each shadow; a shadow that does not have the variable, as a linked copy has none of its source's `__xs_writes`, is now skipped.
- **A point made after the resolver was given the document,** by sugar for an attribute (each point of a polygon's `vertices="($a,1) ($b,2)"`, a label's `anchor`), has no node in the resolver, so a slot cannot resolve from it (step 2 kept its components). From step 3, each of its slots resolves from where its reference was written, the `_ref`'s own index, a node the resolver was given, as the reference did. A copy of the point, which the resolver is given with the rest of what is copied, resolves its slots from the copy: renumbering an expression attribute makes the copy its origin (`remapRefResolutions`). The pass tells the two apart by the owner's index, below the number of nodes the resolver was given (`normalized_root.nodes.length`) or not.
- **A `<vector>`'s `xs`** is held as a point's (step 3): it is read through the same `numComponents` and `math k`.
- **Measured,** branch against `main`'s sources (steps 1 to 3):

  | fixture | components | dependencies | state variables resolved | load ms |
  |---|--:|--:|--:|--:|
  | repeat-150 | 2,706 → 1,956 | 120,341 → 105,941 | 53,194 → 47,644 | 3,420 → 3,086 |
  | measures-of-spread | 3,535 → 3,325 | 108,560 → 105,872 | 50,433 → 49,397 | 3,941 → 3,755 |
  | unit-circle-labeling | 732 → 725 | 20,468 → 20,378 | 9,920 → 9,887 | 950 → 910 |

  One `xs` of repeat-150 now costs about 28 dependencies, against 124. Measures-of-spread holds only 42 of its 84 points, the 42 that read `$mean` and `$std`, which save 64 dependencies each. The other 42 read `$min` or `$max`, and a reference to a `<min>` or `<max>` is read as that component (`presentedComponentType` `max`), not as a math or number, so they keep their components. The other fixtures are unchanged: their points are in repeats made lists or have no references.
- **Still held as components:** a reference with a component between the brackets of its path (`$l[$i]`), a coordinate with attributes or a named or other component in it, and a reference read as other than a math or number.

## Alternatives considered

- **One light component per attribute,** holding the `_ref`s as children. That removes the `mathList` and the `<math>`s, 90% of the cost, but leaves a component and the `_ref`s, and is a second way of holding an attribute beside the literals.
- **Each owner resolving its references itself.** That duplicates `ValueRef`'s resolution in every owner. Reference slots are this without the duplication.
- **Keep the `mathList`, drop the `<math>`s.** That keeps the 32 dependencies of the `mathList`, and makes `mathList` carry a template, which no author's `mathList` has.

## Decided

- **2026-10-09:** coordinates first, then expressions; no components, through reference slots shared with `ValueRef`.
- **2026-10-09:** a state saved before the change need not reload what it held in the attribute components, on the 0.8 development line or anywhere.
