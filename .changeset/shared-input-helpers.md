---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Adopt the shared input helpers across the non-math inputs.

`textInput`, `codeEditor`, `booleanInput`, and `choiceInput` now reuse the shared input helpers introduced alongside `fractionInput` instead of duplicating the logic: `booleanInput`/`choiceInput`/`textInput` use the shared `submitAnswer` external action, and `textInput`/`codeEditor` use the shared `valueChanged`/`immediateValueChanged` state-variable definitions. Their `value`/`immediateValue` help-text descriptions are also reworded to match the math inputs — `value` is described simply as the input's value, and `immediateValue` as the value reflecting the user's in-progress edits.
