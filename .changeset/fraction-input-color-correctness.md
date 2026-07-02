---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<fractionInput>` now colors its numerator and denominator input box borders by submitted correctness inside an `<answer>`, matching the correctness feedback already shown by `<mathInput>` and `<textInput>`.

When correctness coloring is enabled, the fraction as a whole also exposes its validation state in accessible text without implying that the numerator and denominator are graded separately.

Closes #1388.
