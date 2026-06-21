---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph: rename the `xscale` and `yscale` properties to `xScale` and `yScale`.

The casing now matches the other graph limit properties (`xMin`, `xMax`, `yMin`, `yMax`). Because DoenetML resolves property references case-insensitively, existing documents that use `xscale`/`yscale` (e.g. `$g.xscale`) continue to work unchanged—the canonical name reported by the schema and autocomplete is now `xScale`/`yScale`. (The unrelated `xscale`/`yscale` attributes of `<function>`, which set interpolation scales, are unaffected.)
