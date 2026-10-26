---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A random child added to a copy, such as the `<selectFromSequence>` in `<p copy="$a"><selectFromSequence/></p>`, now keeps its value when a component holding the copy, such as a `<section>`, `<group>` or `<div>`, is copied with `copy`, including when the copy is inside a `<repeat>` or `<repeatForSequence>` there. It used to choose a new value in the container's copy, while the values copied from the copy's source were kept. For the same reason, a `<pretzel copy>` with added problems inside a copied container now keeps its problem order and the random choices in the added problems.

The added child also keeps its value when a page is loaded again with the variant it generated. Before, it could take the value of the next random component on the page, and a `<pretzel copy>` with added problems could change its problem order.

The variant a page generates now includes the variants of children added to copies. A variant saved for such a page before this change can give its added children different values when loaded again. On a page that copies a container holding such a copy, the same variant index can now give the added child and the random components after it in the container different values than before.

Closes #2345.
