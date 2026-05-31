---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Flow inputs and their labels inline with the surrounding text.

Inputs (`<mathInput>`, `<textInput>`, `<booleanInput>`, `<matrixInput>`, an inline `<choiceInput>`, and `<answer>`) now lay their label and input out as ordinary inline content. A label long enough to wrap breaks across lines with the input following its end, instead of the input sitting beside the label's first line where it could read as though it belonged in the middle of the label text. Text before and after an input in the same paragraph also wraps together with it. A single tall label, such as one containing tall math, still aligns with the input as before.
