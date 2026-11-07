---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reader never sees an error appear while they work (DIAG-7). Errors are decided when the document loads, from the DoenetML alone, so an error reported after load is a bug. It is now reported as a warning, and its component shows a blank, `＿`, rather than an error box. Errors reported at load are unchanged, as is an error reported at load and again when the content holding it is made.
