---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix list values that set entries outside their own size or left entries undefined:

- A `<bestFitLine>`'s `data` now holds both coordinates of every point. With a single data point its second coordinate was missing.
- A `<function>` with a function child and more inputs than that child (set by its own `numInputs` or `variables`) now gives each input the child lacks the unrestricted domain. Its `domain` used to leave those entries undefined, shown as `＿`. A `<derivative>` with more `variables` than its function, which used to ignore the function's domain because of those undefined entries, now keeps it: for `<function domain="(0,1)">x^2</function>`, the derivative with `variables="x y"` is now undefined at `(5,3)` rather than `10`.
- A `<function>` whose function child has no numeric domain (a `<piecewiseFunction>` whose pieces have symbolic bounds) now has the unrestricted domain, as a function with no domain information does, rather than an undefined one shown as `＿`.
- A function's `globalMinimumLocation`, `globalMinimumValue` and the matching `globalMaximum`, `globalInfimum` and `globalSupremum` entries no longer refer to an entry of an empty list when there is no such extremum. What they display is unchanged.

Closes #2266.
