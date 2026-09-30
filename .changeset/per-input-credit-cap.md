---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

With `colorInputsSeparately`, an input answered by an award whose `credit` is above 1 is now colored as fully correct. The answer already capped that award's credit at 1, but the input's own credit was computed against the uncapped value, so a correct input showed as only partly correct.

A `<choice>` whose `credit` is outside 0 to 1 is now capped the same way. Selecting a `<choice credit="2">` used to give the answer a credit of 2; it now gives 1. In a `selectMultiple` choice input, such a choice now counts as one of the correct choices, where before it was treated as incorrect.
