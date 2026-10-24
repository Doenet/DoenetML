---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

What a reader enters in a case of a `<conditionalContent>` with more than one case (an `<else>` counts) is now kept when another case becomes active and comes back, and through a reload. It used to go back to its starting value; a `<conditionalContent>` with a single case already kept it. A copy of a `<conditionalContent>` that is made from a different case after a reload no longer takes what was saved of the other case's components, which could put a number into a `<textInput>`.
