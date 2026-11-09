---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<chart>` whose axis is labeled in small fractions gets the same labels whatever JavaScript engine runs it. The spacing between labels was computed from a power of ten that some engine versions round differently, so a bar chart of `0.0001` and `0.0002` was labeled every `0.00005` up to `0.00025` on one (Node 24) and every `0.0001` up to `0.0003` on another (Node 22).
