---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Add `initialOpenTab` attribute to `<codeEditor>` to control which diagnostics/responses tab opens initially.

The new attribute accepts: `none` (panel closed), `first` (first available tab, default), `errors`, `warnings`, `info`, `accessibility`, `responses`, or `help`.
