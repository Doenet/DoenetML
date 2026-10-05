---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>` or `<repeatForSequence>` no longer makes a component for its `valueName` and `indexName` in every iteration, nor the `<setup>` that held them. When every use of the name in the template reads its value, such as `$i` in `<number>$i^2</number>`, in `$l[$i]`, in an attribute or in the text of a paragraph, the repeat holds the values and indices once, and each iteration reads its own; a name the template never uses costs nothing. Documents with many repeat iterations, such as dot plots, create fewer components and load faster. What the iterations show and compute is unchanged, including as `from`, `step` or the length change, in an iteration a shorter repeat withholds and shows again, and in an answer submitted in an iteration. A name used another way, such as `<integer extend="$i"/>`, or named from outside the repeat, such as `$r[2].i`, is still a component of each iteration, as before.
