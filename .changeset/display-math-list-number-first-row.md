---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: put a list item's number beside the first row of a displayed equation that leads it.

A list item whose content opens with a displayed equation of several rows — an `<md>`, an `<mdn>`, or an `<me>` that is nothing but an `array` or `aligned` — showed its number beside the equation's middle row. This held for an `<li>` in an `<ol>` or `<ul>`, and for a `<part>`, a `<task>`, or a `<problem>` or `<exercise>` in a list of them. The number now sits beside the first row, as it sits beside the first line of a paragraph. The equation itself is drawn exactly where it was.
