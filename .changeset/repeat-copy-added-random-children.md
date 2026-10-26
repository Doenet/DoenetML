---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A random component added to the template of an unlinked copy of a `<repeat>` or `<repeatForSequence>`, as in `<repeat copy="$r"><selectFromSequence/></repeat>`, now gets a value of its own in each iteration, which is the same for a given variant and is kept when the page is loaded again, as one added to a `<p copy>` or `<group copy>` does. Before, it drew from the same seed as the source's iteration, so it repeated the value copied into that iteration, as in `<repeat name="r" for="1 2"><selectFromSequence/></repeat>`.

For a page with such a copy, the same variant index now gives the added components different values than before.

Closes #2353.
