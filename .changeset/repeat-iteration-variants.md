---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<shuffle>` now keeps the random values of its items when a saved page is loaded again and in a copy of a component holding the shuffle, such as `<section copy>`. Before, a `<repeat>` or `<repeatForSequence>` inside an item, as in `<shuffle><p><repeat for="1 2"><selectFromSequence/></repeat></p><p>x</p></shuffle>`, chose new values when a saved page was loaded again, and a shuffle with more than one item holding random values, as in `<shuffle><p><selectFromSequence/></p><p><selectFromSequence/></p></shuffle>`, gave its items each other's values, moved by the shuffle's order. A `<shuffle>` inside an item of another `<shuffle>` now also keeps its order when the page is loaded again. An unlinked copy of a shuffle, as in `<shuffle copy="$sh"/>`, now gives its items the values of the shuffle's items. The shuffle's order was kept in each case.

The variant a page generates now records the random values of a shuffle's items as the items are written rather than as they are shown, so a variant saved before this change can still give a shuffle's items new values, or each other's, when loaded again.
