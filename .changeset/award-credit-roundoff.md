---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An answer whose award credits add up to 1, such as six awards of `credit="1/6"`, now counts as correct when all of them are earned. Floating-point round-off used to leave the total just short of 1, so the check-work button showed an orange "100% correct" instead of a green "Correct".
