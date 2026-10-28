---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<math>`, `<number>`, `<text>`, `<label>`, `<image>`, input, or button that was dragged in a graph without an `anchor` attribute now keeps its position correctly after the document reloads from saved state. Previously, after a reload, its anchor was not a math, so a move that changed only one coordinate sent the other back to 0.

A dragged `<polygon>` or `<polyline>` (including a `<triangle>`) now also reloads the positions its vertices were dragged to as maths, where it previously reloaded them as bare numbers.

Closes #2190.
