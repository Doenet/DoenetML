---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

List items: fix a leading child that renders nothing breaking the layout of a `<part>` or `<task>`.

A list item aligns its hanging number against its first visible child. Children that render nothing — `<setup>`, `<variantControl>`, `<animateFromSequence>`, `<solveEquations>` and the like — were still eligible to be chosen, so the child that actually rendered first kept its top margin and never reported the alignment it needs. A `<part>` starting with a `<setup>` followed by a `<graph>` (or image, video, tabular, spreadsheet, or block `<choiceInput>`) put its number at the bottom of that content instead of the top.
