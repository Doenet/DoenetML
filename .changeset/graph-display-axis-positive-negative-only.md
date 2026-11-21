---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph: add `positiveOnly` and `negativeOnly` options to `displayXAxis` and `displayYAxis`.

`displayXAxis` and `displayYAxis` on `<graph>` now accept four values — `full`, `none`, `positiveOnly`, and `negativeOnly` — so an axis can be drawn as only its positive or only its negative half. The attributes changed from boolean to text; the legacy boolean values still work (`true` maps to `full`, `false` maps to `none`), including when the attribute is bound to a `<booleanInput>` (e.g. `displayXAxis="$b"`). A negative-only axis is defined toward the negative direction so its arrow head is drawn on the negative side (staying inside the graph border), and its tick labels keep the correct (negative) sign. The generated schema recognizes the new values in editor diagnostics and autocomplete.

Closes #355.
