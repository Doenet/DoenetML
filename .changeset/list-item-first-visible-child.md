---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

List items: fix a leading child that renders nothing breaking the layout of a `<part>` or `<task>`.

A list item aligns its hanging number against its first visible child. Children that render nothing — `<setup>`, `<variantControl>`, `<animateFromSequence>`, `<solveEquations>` and the like — were still eligible to be chosen, so the child that actually rendered first kept its top margin and never reported the alignment it needs. A `<part>` starting with a `<setup>` followed by a `<graph>` (or image, video, tabular, spreadsheet, or block `<choiceInput>`) put its number at the bottom of that content instead of the top.

Also, a section no longer hides its `<setup>` and `<variantControl>` along with its content. Hiding a `<setup>` hid everything defined inside it, which stripped hidden pieces out of the text of those definitions — so text defined in the `<setup>` of an unrevealed `<cascade>` step came back incomplete.
