---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<select>`, `<selectFromSequence>` or `<selectPrimeNumbers>` with a negative literal `numToSelect`, or with a literal `numToSelect="0"` over an empty range (such as `from="5" to="1"`, or a range whose values are all excluded), no longer switches off unique variants for the whole document. These select nothing and show no error, as before, but they used to make the document fall back to 100 random variants, so another `<select>` in the document no longer went through its options in turn. They now add a single variant, so such a document can have a different number of variants, and a given variant index can show different selections than before.
