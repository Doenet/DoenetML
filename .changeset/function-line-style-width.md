---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graphing: add `lineStyle` and `lineWidth` attributes to `<function>`.

When a function is graphed, it now accepts the same per-component line style overrides as the equivalent wrapped `<curve>`. The generated schema also recognizes these attributes in editor diagnostics.

Closes #1356.
