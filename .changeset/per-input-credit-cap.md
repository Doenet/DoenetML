---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

With `colorInputsSeparately`, an input answered by an award whose `credit` is above 1 is now colored as fully correct. The answer already capped that award's credit at 1, but the input's own credit was computed against the uncapped value, so a correct input showed as only partly correct.
