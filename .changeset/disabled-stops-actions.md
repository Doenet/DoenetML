---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A disabled `<updateValue>`, `<callAction>` or `<triggerSet>` no longer acts when it is triggered by `triggerWhen`, `triggerWith`, `triggerWhenObjectsClicked` or `triggerWhenObjectsFocused`; before, `disabled` only greyed out its button. A disabled `<triggerSet>` runs none of its children, and a disabled child inside a `<triggerSet>` is skipped while the others still run.
