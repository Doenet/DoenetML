---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>` or `<repeatForSequence>` inside an item of a `<shuffle>`, as in `<shuffle><p><repeat for="1 2"><selectFromSequence/></repeat></p><p>x</p></shuffle>`, now keeps its random values when a saved page is loaded again. Before, its iterations chose new values, though the shuffle kept its order.
