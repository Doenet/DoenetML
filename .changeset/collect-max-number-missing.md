---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`$c.maxNumber` of a `<collect>` with no `maxNumber` (no limit) is now missing, shown as `＿`, where it showed `NaN`. A `<number extend="$c.maxNumber"/>` is a missing number, and `$c.maxNumber = 3` is false.

Closes #2416.
