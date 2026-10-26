---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<select>`, `<selectFromSequence>` or `<selectPrimeNumbers>` with `numToSelect="0"` written as a literal value no longer stops the document from loading with "Maximum call stack size exceeded". It now selects nothing, as it already did when `numToSelect` referenced a value of 0, and it adds no variants of its own to the document.
