---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<function>`, `<derivative>`, `<clampFunction>` or `<wrapFunctionPeriodic>` whose `numInputs` is larger than its function child's number of inputs no longer stops the document from loading. The inputs the child doesn't have get default variable names that differ from the child's. For example, `<function numInputs="2">$f</function>` with `<function name="f">x^2</function>` has variables `x` and `y`.

Closes #2382.
