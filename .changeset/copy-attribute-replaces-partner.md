---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `variable` or `derivVariable` written on a copy now replaces the source's `variables` or `derivVariables`, as it already did on an extend: `<function copy="$f" variable="t"/>` of a function of x and y is a function of t.

A `<module>` copy that writes `displayDigits` or `displayDecimals` no longer discards the other as written on its source: on a module they are two independent attributes.
