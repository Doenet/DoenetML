---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`simplifyOnCompare="numbers"` no longer evaluates functions of numbers. With `symbolicEquality`, an answer of `2` now accepts `4/2` and `1+1` but not `sec(pi/3)`, and an answer of `1/2` accepts `0.5` but not `sin(pi/6)`, as `numbersPreserveOrder` already did. Before, `numbers` evaluated functions such as `sin`, `sec` and `sqrt` of numbers as `full` does, so a question asking for an exact value accepted the expression it asked the student to evaluate. A document that relied on `numbers` to accept such an expression, or to match an answer such as `sqrt(2)` against a decimal like `1.414` with `allowedErrorInNumbers`, needs `simplifyOnCompare="full"`.

Closes #2601.
