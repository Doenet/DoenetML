---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add a `<fractionInput>` component.

`<fractionInput>` renders a numerator input box above a denominator input box, separated by a fraction bar; each box accepts a math value like a `<mathInput>`. It exposes `numerator`, `denominator`, and `value` (the numerator divided by the denominator) properties, supports `prefillNumerator`/`prefillDenominator` attributes, links two-way to a math child or `bindValueTo` target, and works as the input inside an `<answer>` (with check-work integration).

This also clarifies the `value`/`immediateValue` help-text descriptions for the math inputs (`mathInput`, `matrixInput`, `fractionInput`): `value` is described simply as the input's value, and `immediateValue` as the value reflecting the user's in-progress edits.

Closes #1342.
