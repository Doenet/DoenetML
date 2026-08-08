---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `<ol>`/`<ul>` list markers misaligning with a labeled `<choiceInput>` first child.

A plain `<li>` never published the list-item first-child alignment signal that `<answer>` and `<choiceInput>` already know how to consume — the mechanism that keeps `<problem>`/`<task>`/`<part>` numbering top-aligned with their content. So a real `<ol><li>` whose first child was a labeled `<choiceInput>` got none of that, and its `<legend>` (which gets special layout treatment in a real list item — the browser aligns the `<li>`'s native marker with the content *after* the legend instead of with the legend itself) pushed the marker down onto the first choice row instead of the question label.

`<li>` now publishes the same alignment signal `<problem>`-style sections do, and a `<choiceInput>` that leads a list item renders its label in an equivalent `<div>` instead of a `<legend>` — same `aria-labelledby` association, so the accessible name is unchanged, and the same inline padding a browser gives a `<legend>`, so the label text does not move either. The `<div>` is used only inside a real `<li>`, the one place a native marker is at stake; the label stays a native `<legend>` everywhere else, including in a `<problem asList>` section outside a list, which draws its own number and never had the quirk. The fix reaches the `<choiceInput>` through an `<answer>` and through wrapping layout components: a `<div>`, `<blockQuote>`, `<stack>`, or a `<sideBySide>` panel.

Publishing the signal from a plain `<li>` also makes a list item's block first child behave the way a section's has always behaved: its top margin is suppressed (`<p>`, `<pre>`, `<blockQuote>`, `<graph>`, `<image>`, `<video>`, `<spreadsheet>`, `<tabular>`, `<div>`, `<stack>`), and a leading `<sideBySide>` aligns its panels the way it does in a section instead of stretching them. In most lists the margin change is invisible, because that top margin already collapsed out through the `<li>`. Where it shows is a list that mixes item shapes: an item whose content is plain text no longer leaves a blank line above the item after it when that item starts with a block, matching the spacing two plain-text items already had.

Known limitation: a `hide`den first child still wins the lead of its list item, so `<li><p hide/><answer><choiceInput/></answer></li>` still renders its marker beside the first choice. This is pre-existing, shared with `<task>`/`<problem>`, and left as is deliberately — reading a child's `hidden` at this point risks a circular dependency in the sectioning code, so the workaround is to put the hidden content somewhere other than the front of the list item.
