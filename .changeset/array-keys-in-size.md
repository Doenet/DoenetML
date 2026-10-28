---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix missing entries in a `<bestFitLine>`'s `data` and a `<function>`'s `domain`:

- A `<bestFitLine>` with a single data point now has both of its coordinates in `data`; the second was missing.
- A `<function>` given more inputs than its function child (with `numInputs` or `variables`) now gives each extra input the unrestricted domain `(-∞, ∞)` instead of an undefined one, shown as `＿`. A `<derivative>` with more `variables` than its function now keeps the function's domain: for `<function domain="(0,1)">x^2</function>`, the derivative with `variables="x y"` is now undefined at `(5,3)` rather than `10`.
- A `<function>` whose child is a `<piecewiseFunction>` with symbolic piece bounds now has domain `(-∞, ∞)` instead of `＿`. Placing such a function in a `<graph>` or a `<curve>` no longer stops the document from loading.

Closes #2266.
