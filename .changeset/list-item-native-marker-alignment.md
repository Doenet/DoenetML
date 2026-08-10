---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `<ol>`/`<ul>` list markers misaligning with a labeled `<choiceInput>` first child.

An `<ol><li>` whose first child was a labeled `<choiceInput>` (on its own or inside an `<answer>`) drew its "1." beside the first choice instead of beside the question label. The label was rendered in a `<legend>`, which a browser treats specially inside a list item: it aligns the item's marker with the content *after* the legend. A block `<choiceInput>` now renders its label in an equivalent `<div>` instead — same accessible name, same position on the line — so the marker stays on the label's row wherever the input is nested (see the accompanying entry, which finishes this off for wrappers such as `<li><p>` that pass no list-item signal along).

A list item's first child also gets the spacing a section's first child has always had: its top margin is suppressed. That is invisible in most lists, where the margin already collapsed into the 16px spacing around it. Where it shows is a list that mixes item shapes — an item of plain text followed by an item starting with a block (`<p>`, `<pre>`, `<blockQuote>`, `<graph>`, `<image>`, `<video>`, `<spreadsheet>`, `<tabular>`) no longer leaves a blank line between the two, matching the spacing two plain-text items already had. Likewise, a `<sideBySide>` leading a list item now top-aligns its panels the way it does inside a `<problem>`/`<task>` rather than stretching them.
