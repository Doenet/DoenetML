---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` with nothing written on it but the reference (`<math extend="$m"/>`) is now made the same way as the bare reference `$m`, so the two behave the same wherever they are written; an `extend` that changes the type, adds a name, another attribute or a child, or reads an entry of a list (`$c[1]`), is unchanged.
