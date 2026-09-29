---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Graph a function taken from a `<curve>`'s `fs` without crashing the document.

A function from a curve, such as `$c.f1`, `$c.fs` or `<function extend="$c.f1" />`, took down the whole document when it was in a `<graph>`, and reading its `minima` or `maxima` threw. The same happened with `<equilibriumCurve>`. Its `domain` is now the curve's parameter interval, as for any other function of one input, so it graphs and reading its `minima` or `maxima` no longer throws.

Closes #2075.
