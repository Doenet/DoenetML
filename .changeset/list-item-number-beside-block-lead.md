---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Draw a list item's number beside the top of a leading `<graph>`, `<image>`, `<video>`, `<figure>` or `<tabular>` instead of at its bottom.

An `<ol>`/`<ul>` list item leading with one of these had its number drawn after all of the item's content — for a graph, at the *bottom* of the graph, some 250px below where a reader looks for it. The browser draws a list item's number on the item's first line of text, and the box these components render offers none of its own, so the browser fell back to putting the number last. Such an item now gets an empty first line at the top of its content for the number to sit on, taking no space of its own; the number lands exactly where the number of an item beginning with ordinary text lands. Wrapping does not matter: a `<graph>` inside a `<div>`, a `<sideBySide>` panel, or a `<figure>` is lined up the same way as one written directly in the item.

Only items whose leading content has no first line of its own are affected, so an item that begins with text keeps the browser's own placement. That distinction is the point: a `<matrixInput>` puts its label on the matrix's last row and an item leading with inline math has a taller first line than a plain one, and in both the number belongs on that line rather than at the top of the item.

A `<figure>` leading a list item also passes the item's top-margin suppression on to the content it holds, as the other container components do, so the number and the figure's content start on the same row. A `<caption>` is skipped when a container looks for the content the number lines up with, since it is drawn below that content whatever its position among the children.

These items now line up exactly as the corresponding `<problem>`/`<task>`/`<part>` items in a `<problems>` do, which draw their own numbers and have always top-aligned them for block content.

Closes #1673.
