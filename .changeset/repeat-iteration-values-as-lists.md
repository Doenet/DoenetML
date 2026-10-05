---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The `indexName` of a `<repeat>` or `<repeatForSequence>`, and the `valueName` of a `<repeatForSequence>`, no longer make a component in every iteration, nor a `<setup>` to hold it, when every use of the name in the template reads its value, such as `$i` in `<number>$i^2</number>`, in `$l[$i]`, in an attribute or in the text of a paragraph. The repeat holds those values or indices once, and each iteration reads its own; such a name the template never uses costs nothing. Documents with many repeat iterations, such as dot plots, create fewer components, and the ones with the most iterations load faster. What the iterations show and compute is unchanged, including as `from`, `step` or the length change, in an iteration a shorter repeat withholds and shows again, and in an answer submitted in an iteration. The `valueName` of a `<repeat>`, a name used another way, such as `<integer extend="$i"/>`, and a name reached from outside the repeat, such as `$r[2].i`, are still a component of each iteration, as before.
