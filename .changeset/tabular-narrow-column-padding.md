---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Tabular cells in narrow columns now shrink their side padding so their content stays between the column rules.

A cell's side padding is 15% of the width of the columns it covers, at most the usual 10px, and follows the table's width as it changes. A table with many narrow columns, such as a row of single letters under `<col endBorder="minor" />` settings, now shows each letter centered between its rules instead of spilling past the right one. Columns of an ordinary width keep the full padding.
