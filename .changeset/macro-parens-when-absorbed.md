---
"@doenet/v06-to-v07": patch
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Keep the parentheses on a reference when a letter, digit or underscore follows it and
would otherwise be read as part of the name. Printing DoenetML no longer turns `$(x)_0`
into `$x_0`, which meant something different.
