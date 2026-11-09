---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<chart>` whose axis is labeled in small fractions gets the same labels whatever JavaScript engine runs it. The spacing between labels was computed from a power of ten that some engine versions round differently, so a bar chart of `0.0001` and `0.0002` was labeled every `0.00005` up to `0.00025` on one (Node 24) and every `0.0001` up to `0.0003` on another (Node 22). One side effect, on Node 24 and engines that round as it does: an axis spanning between about `5e23` and `5e24` can now be labeled one step coarser, as it already was on Node 22, so `yMin="0" yMax="2.5e24"` is labeled every `1e24` rather than every `5e23`. A few spans near `1e210` can likewise get a step one rung coarser, on every engine.
