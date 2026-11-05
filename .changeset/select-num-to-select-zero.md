---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<select>`, `<selectFromSequence>` or `<selectPrimeNumbers>` with `numToSelect="0"` written as a literal value no longer stops the document from loading with "Maximum call stack size exceeded". It now selects nothing, as it already did when `numToSelect` referenced a value of 0, and it adds no variants of its own to the document. A `<select numToSelect="0">` whose options have different numbers of variants already loaded, but it switched off unique variants for the whole document. It no longer does, so such a document can now have a different number of variants, and a given variant index can show different selections than before.
