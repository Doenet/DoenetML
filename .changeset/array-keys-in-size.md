---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix three list values that set entries outside their own size:

- A `<bestFitLine>`'s `data` now holds both coordinates of every point. With a single data point its second coordinate was missing.
- A `<function>` with a function child and its own `numInputs` or `variables` now has exactly one domain interval per input. It used to copy the child's whole domain, so it could have more intervals than inputs; an input the child lacks now gets the unrestricted domain.
- A function's `globalMinimumLocation`, `globalMinimumValue` and the matching `globalMaximum`, `globalInfimum` and `globalSupremum` entries no longer refer to an entry of an empty list when there is no such extremum. What they display is unchanged.

Closes #2266.
