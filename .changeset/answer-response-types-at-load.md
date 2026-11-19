---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `<answer>`'s responses are typed from the DoenetML when the document loads.

- **Each response has its input's type, or its component's tag** (an empty text for a component with no value, such as a `<line>`, as it is recorded), decided before anything is entered, and entries may differ: with a `<mathInput>` and a `<textInput>`, `<point extend="$ans.currentResponses[2]"/>` is `doenet-e0065` as soon as the document loads, also in a case not shown yet, where it was `doenet-e0067`. An answer whose responses share one type is that type: `<point extend="$ans"/>` of `<answer type="text">` is `doenet-e0065` at load.
- **A response a `<conditionalContent>` holds** follows the every-branch rule: cases holding responses of different types (a `<math>` and a `<text>`) are an error at load, `doenet-e0082`, shown in place of the `<conditionalContent>`. Before, the response changed type with the case shown. Without an `<else>`, no case may be shown, and then it holds no response, so the answer's responses are typed only when they all share one type.
- **`submittedResponses` has the types the DoenetML gives,** and no type is saved with them. A type is saved only for an answer whose responses' types aren't known until the document runs (one reading a list whose length can change, a property whose entries are made into points or vectors, such as `$c.center`, a response that may be missing, such as a reference to a `<choiceInput>` with nothing selected or a `<number isResponse>` made from an input, or an answer made with `extend` that writes responses of its own).
