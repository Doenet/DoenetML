---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<mathInput>` now applies `removeStrings` to the initial value from `prefillLatex`, so `prefillLatex="\$10,000" removeStrings="$ ,"` displays `$10,000` with value `10000`.
