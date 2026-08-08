---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `<ol>`/`<ul>` list markers misaligning with a labeled `<choiceInput>` first child.

A plain `<li>` never published the list-item first-child alignment signal that `<answer>` and `<choiceInput>` already know how to consume — the mechanism that keeps `<problem>`/`<task>`/`<part>` numbering top-aligned with their content. So a real `<ol><li>` whose first child was a labeled `<choiceInput>` got none of that, and its `<legend>` (which gets special layout treatment in a real list item — the browser aligns the `<li>`'s native marker with the content *after* the legend instead of with the legend itself) pushed the marker down onto the first choice row instead of the question label.

`<li>` now publishes the same alignment signal `<problem>`-style sections do, and a `<choiceInput>` that leads a list item renders its label in an equivalent `<div>` instead of a `<legend>` — with the same `aria-labelledby` association, so the accessible name is unchanged. The `<div>` is used only inside a real `<li>`, the one place a native marker is at stake; the label stays a native `<legend>` everywhere else, including in a `<problem asList>` section outside a list, which draws its own number and never had the quirk. The fix reaches the `<choiceInput>` through an `<answer>` and through wrapping layout components: a `<div>`, `<blockQuote>`, `<stack>`, or a `<sideBySide>` panel.

Publishing the signal from a plain `<li>` also suppresses the top margin of any block first child (`<p>`, `<pre>`, `<blockQuote>`, `<graph>`, `<image>`, `<video>`, `<spreadsheet>`, `<tabular>`, `<div>`, `<stack>`), matching how a section rendered as a list item has always behaved. Visually this removes the extra blank space above such a list item; the marker moves up with the content it was already aligned with, rather than becoming misaligned.

Known limitation: a `hide`den first child still wins the lead of its list item, so `<li><p hide/><answer><choiceInput/></answer></li>` is not covered. This is pre-existing and shared with `<task>`/`<problem>`.
