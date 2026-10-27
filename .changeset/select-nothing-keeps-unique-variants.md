---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<select>`, `<selectFromSequence>` or `<selectPrimeNumbers>` that selects nothing, because its `numToSelect` is a literal `0` or a negative literal, no longer switches off unique variants for the whole document. Before, it did so when its range was empty (such as `from="5" to="1"`, or a range whose values are all excluded), when its options or range could not be counted (such as an option holding `<selectFromSequence from="$n">`, an option with `selectWeight`, or a `from` that references another value) or when its `withReplacement` referenced another value, and for any negative `numToSelect`. It still selected nothing and showed no error, but the document fell back to 100 random variants, so another `<select>` in the document no longer went through its options in turn. It now adds a single variant, so such a document can have a different number of variants, and a given variant index can show different selections than before. The same holds for a `<select>` of nothing whose options use `selectForVariants`; it still shows the error that a variant name appears in more options than the number to select.
