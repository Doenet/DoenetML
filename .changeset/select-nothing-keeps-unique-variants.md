---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<select>`, `<selectFromSequence>` or `<selectPrimeNumbers>` that selects nothing, because its `numToSelect` is a literal `0` or a negative literal, now adds a single variant instead of switching off unique variants for the whole document. Before, a negative `numToSelect` always did so, and `0` did so when the range was empty (such as `from="5" to="1"`), when the options or range could not be counted (such as an option with `selectWeight`, or a `from` that references another value), when the options used `selectForVariants`, or when `withReplacement` referenced another value. The document then fell back to 100 random variants, so another `<select>` in it no longer went through its options in turn. Such a document can now have a different number of variants, and a given variant index can show different selections than before. A `<select>` whose options use `selectForVariants` still shows its error.
