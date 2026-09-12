---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Keep the parentheses on a reference when the text right after it would otherwise become
part of the reference. Printing DoenetML no longer turns `$(x)_0` into `$x_0`, which meant
something different.
