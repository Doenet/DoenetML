---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<spreadsheet>` can set the width of its columns, written the same way as in a `<tabular>`: `<col width="…">` components, one per column, or a `width` attribute on a `<column>`. Each width is a percentage of the width of the spreadsheet, so a column left empty for students to type into no longer has to be drawn narrow. Percentage widths carry over when the page is converted to PreTeXt, so a printed spreadsheet keeps its proportions.
