---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `copy` of a `<select>`, `<selectFromSequence>`, `<selectPrimeNumbers>` or `<selectRandomNumbers>` that changes what is chosen now makes its own random choices, which are the same for a given variant. This covers a different `numToSelect`, as in `<select copy="$x" numToSelect="4"/>` of a two-pick select, a different range or other attribute that decides what is chosen, such as `to` on a `<selectFromSequence copy>`, and options added as children of a `<select copy>`. Before, the copy was given its source's choices, which no longer fit: a `<select>` or `<selectRandomNumbers>` stopped the whole document from loading, a `<selectFromSequence>` or `<selectPrimeNumbers>` showed nothing with an error, and a `<selectFromSequence copy>` over a shorter range showed values wrapped around from its source's. A copy that chooses from the same options in the same number still keeps its source's choices.

A `<select>` or `<selectRandomNumbers>` given choices that do not fit it, as from a variant saved before its document changed, now reports an error (`doenet-e0037`, `doenet-e0038` or `doenet-e0048`) and selects nothing, as the other `select…` tags do, rather than stopping the document from loading.

Closes #2389.
