---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<text>`, `<number>`, `<math>`, `<m>`, `<md>` or `<label>` in a graph with `renderer="prefigure"`, without an `anchor` attribute, whose position was changed (for example, by dragging a point bound to its `anchor` in another graph) now stays at that position when the document reloads from saved state. Previously, after a reload, it was drawn at the origin.

Closes #2190.
