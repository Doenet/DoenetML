---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` or `copy` of a list (`<mathList extend="$ml"/>`) now takes the list's attributes it does not set itself, as an `extend` of any other component does: a hidden list's extend is hidden, it has the list's display settings, and it is fixed when the list is or where it sits is.
