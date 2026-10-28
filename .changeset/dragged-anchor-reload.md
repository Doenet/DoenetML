---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<math>`, `<number>`, `<text>`, `<label>`, `<image>`, input, or button that was dragged in a graph without an `anchor` attribute no longer loses a coordinate when it is moved again after the document reloads from saved state. Previously, after a reload, its anchor was not a math, so a move that changed only one coordinate sent the other back to 0.

Closes #2190.
