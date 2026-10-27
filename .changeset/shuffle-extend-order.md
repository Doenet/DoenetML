---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<shuffle>` made with `extend`, as in `<shuffle extend="$sh"/>`, now holds the order of the shuffle it extends in its `componentOrder` state variable, which is the order it shows. Before, it held an order drawn from a seed of its own, which no variant records, so that order also changed when a saved page was loaded again. What the shuffle shows is unchanged.
