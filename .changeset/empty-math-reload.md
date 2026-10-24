---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A document with an empty `<math>` whose value was set through an input, such as `<math name="m"/><mathInput bindValueTo="$m"/>`, now loads again from its saved state. Previously, reloading after a value was typed into the input stopped the document from loading.

The same fix covers three related cases:

- A `<matrix>` given only `numRows` and `numColumns`, whose entries were set through a `<matrixInput>` or `<mathInput>`, also stopped the document from loading after a reload.
- A `<rectangle>` with no vertices specified, after it was moved, also stopped the document from loading after a reload.
- A `<cobwebPolyline>` whose vertices were moved lost them after a reload: every vertex past the initial point went back to `(0,0)`.

Closes #2236.
