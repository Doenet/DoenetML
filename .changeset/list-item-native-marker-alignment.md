---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `<ol>`/`<ul>` list markers misaligning with a `<choiceInput>` (or other block) first child.

A plain `<li>` never published the list-item first-child alignment signal that `<answer>` and `<choiceInput>` already know how to consume — the mechanism that keeps `<problem>`/`<task>`/`<part>` numbering top-aligned with their content. So a real `<ol><li>` whose first child was a labeled `<choiceInput>` got none of that: the fieldset kept its unsuppressed top margin, and its `<legend>` (which gets special layout treatment in a real list item — the browser aligns the `<li>`'s native marker with the content *after* the legend instead of with the legend itself) pushed the marker down onto the first choice row instead of the question label. `<li>` now publishes the same alignment signal `<problem>`-style sections do, and `<choiceInput>` swaps its `<legend>` for an equivalent `<div>` (with the same `aria-labelledby` association) only when that alignment signal traces back to a real `<li>` with a native marker — not when it traces back to a `<problem asList>` section (which draws its own number and never had a `<legend>` quirk to work around), leaving native `<legend>` semantics untouched everywhere else.
