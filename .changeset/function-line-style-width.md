---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: add `lineStyle` and `lineWidth` attributes to `<function>`.

Functions now accept the same per-component line style overrides as curves when graphed, and the generated schema recognizes those attributes in editor diagnostics.

Closes #1356.
