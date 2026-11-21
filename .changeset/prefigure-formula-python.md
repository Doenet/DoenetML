---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Draw functions, curves, and `<regionBetweenCurves>` whose formulas use `pi`, absolute value, or inverse trig functions in a graph with the PreFigure renderer, which includes printed documents. These were left out of the graph, with no warning. Formulas using inverse hyperbolic functions, `arcsec`, `arccsc`, `arccot` (or `asec`, `acsc`, `acot`), `sech`, `csch`, `coth`, or factorial, which were dropped the same way, are drawn too. A formula that still cannot be drawn, such as one using `sign` or an undefined parameter, now gives a warning naming what PreFigure cannot evaluate.
