---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>` or `<repeatForSequence>` inside an item of a `<shuffle>`, as in `<shuffle><p><repeat for="1 2"><selectFromSequence/></repeat></p><p>x</p></shuffle>`, now keeps its random values when a saved page is loaded again. Before, its iterations chose new values, though the shuffle kept its order.

A `<shuffle>` with more than one item holding random values, as in `<shuffle><p><selectFromSequence/></p><p><selectFromSequence/></p></shuffle>`, now keeps each item's values when a saved page is loaded again and in a copy of a component holding the shuffle, such as `<section copy>`. Before, the items' values were moved between the items by the shuffle's order, though the order itself was kept. The variant a page generates now lists the shuffle's items' random values in the order the items are written rather than the order they are shown, so a variant saved before this change can still give the items each other's values when loaded again.
