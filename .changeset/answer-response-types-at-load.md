---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `<answer>`'s responses are typed from the DoenetML when the document loads.

- **Each response has its input's type, or its component's tag** (an empty text for a component with no value, such as a `<line>`, as it is recorded), decided before anything is entered, and entries may differ: with a `<mathInput>` and a `<textInput>`, `<point extend="$ans.currentResponses[2]"/>` (or `$ans.currentResponse2`) is `doenet-e0065` as soon as the document loads, also in a case not shown yet, where before it was checked only once shown; and `<math extend="$g"/>` of a `<group>` holding `$ans.currentResponses[1]` is that math, where it was `doenet-e0067`. An answer whose responses share one type is that type: `<point extend="$ans"/>` of `<answer type="text">` is `doenet-e0065` at load.
- **A response a `<conditionalContent>` holds** follows the every-branch rule: a response that is a `<math>` in one case and a `<text>` in another is an error at load, `doenet-e0082`, shown in place of the `<conditionalContent>`. Before, the response changed type with the case shown. When every case holds responses of the same types in the same order, each is typed by its place; when the cases hold different numbers of responses, or there is no `<else>` (then no case may be shown, holding none), the answer's responses are typed only when they all share one type.
- **`submittedResponses` has the types the DoenetML gives,** and no type is saved with them. A type is saved only for an answer whose responses' types aren't known until the document runs, such as one with a response that may be missing (a reference to a `<choiceInput>` with nothing selected, or a `<number isResponse>` made from an input), a property whose entries are made into points or vectors (`$c.center`), responses of different types beside a list whose length can change or beside responses a `<select>` or `<repeat>` makes in an award (or a reference copies), or an answer made with `copy` that writes responses of its own.
- **An `extend` of an `<answer>` can't change what it grades:** it shares its source's responses and credit, so an input, an `<award>`, a `<considerAsResponses>` or text written inside it is `doenet-e0084`, and a grading attribute on it (`weight`, `type`, `matchPartial`, `symbolicEquality`, …) is `doenet-e0083`, at load. A `<label>` and appearance attributes (`showCorrectness`, `hide`, …) are allowed. Before, an extend given an input shared its submitted responses with its source. To make an answer that grades differently, use `copy`.
