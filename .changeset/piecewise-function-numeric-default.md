---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Evaluating a `<piecewiseFunction>`, as in `$$f(50)` or `<evaluate function="$f" input="50"/>`, now gives its value instead of a blank (or `NaN` inside a `<number>`). A piecewise function now evaluates numerically by default, so the `symbolic="false"` workaround is no longer needed. An explicit `symbolic` attribute is still honored.
