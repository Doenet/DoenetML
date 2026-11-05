---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<tabular>`'s column widths now take effect when the page is converted to PreTeXt for printing, keeping the proportions the table has on screen. Before, PreTeXt ignored them for cells of plain text, and widths adding up to more than 100% stopped the conversion.
