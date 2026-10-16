---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An attribute given by one reference of its own type, such as `hide="$b"` for a boolean `b` or `xMin="$n"` for a number `n`, now creates one small component instead of two. What documents compute and display is unchanged, and a value written through such an attribute still lands on what it references.
