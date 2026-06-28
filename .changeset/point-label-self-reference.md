---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Point labels: fix self-references like `<label>$a</label>` so they render the point coordinates instead of a circular dependency error.

When a point label references its own point without an explicit prop, DoenetML now falls back to the point's public label/text state in label and text contexts while preserving the existing circular-dependency error outside those contexts.

Closes #1333.
