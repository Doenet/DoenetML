---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An unlinked copy of a `<repeat>` whose template holds a nested `<repeat for>`, as in `<repeat copy="$r"/>` for `<repeat name="r" for="1 2"><repeat for="a b"><selectFromSequence/></repeat></repeat>`, now keeps the random values in the nested repeat. Before, in each iteration of the copy, the nested repeat's values were shifted by one iteration: its second iteration showed the value of the source's first, and its first iteration showed a new value.

For a page with such a copy, the same variant index now gives the copy's nested random components different values than before: the source's values.

Closes #2358.
