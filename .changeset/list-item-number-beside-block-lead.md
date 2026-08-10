---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Draw a list item's number beside the top of a leading `<graph>`, `<image>`, `<video>`, `<figure>` or `<tabular>` instead of at its bottom.

An `<ol>`/`<ul>` list item leading with one of these had its number drawn after all of the item's content — for a graph, at the *bottom* of the graph, some 250px below where a reader looks for it. The browser draws a list item's number on the item's first line of text, and the box these components render offers none of its own, so the browser fell back to putting the number last. Such an item now gets an empty first line at the top of its content for the number to sit on, taking no space of its own; the number lands exactly where the number of an item beginning with ordinary text lands. A container around the block lines up the same way: a `<graph>` inside a `<div>`, a `<sideBySide>` panel, a `<blockQuote>`, a `<stack>`, a `<pre>` or a `<figure>` is placed as one written directly in the item. A `<table>` is the exception, and for the ordinary case wants to be: it draws a name of its own — *Table 1* — as the item's first line, and that name is the line the number belongs on. So a `<table suppressTableNameInTitle>` around one of these blocks, which leaves no such line, still has its number drawn at the bottom.

A leading `<spreadsheet>` had the same missing first line show up the other way round: rather than putting the number last, the browser reserved a blank line at the top of the item to hold it. The number was in the right place, but the spreadsheet started a line below it. That line is gone too — the spreadsheet starts beside its number, and the item is a line shorter.

Only items whose leading content has no first line of its own are affected, so an item that begins with text keeps the browser's own placement. That distinction is the point: a `<matrixInput>` puts its label on the matrix's last row and an item leading with inline math has a taller first line than a plain one, and in both the number belongs on that line rather than at the top of the item.

A `<figure>` leading a list item also passes the item's top-margin suppression on to the content it holds, as the other container components do, so the number and the figure's content start on the same row. A `<caption>` is skipped when a container looks for the content the number lines up with, since it is drawn below that content whatever its position among the children.

These items now line up exactly as the corresponding `<problem>`/`<task>`/`<part>` list items do, which draw their own numbers instead of asking the browser for one. For a leading `<figure>` that agreement is new on both sides: a `<problem>`, `<task>` or `<part>` beginning with a figure now draws its own number beside the top of the figure's content and suppresses the figure's top margin as well, where before it put the number on a baseline the figure had no text on.

Closes #1673.
