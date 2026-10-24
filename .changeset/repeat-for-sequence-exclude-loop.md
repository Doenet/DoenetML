---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeatForSequence>` whose `exclude` refers to a `<math>` or a `<mathInput>` now loads. Depending on its template, it used to stop the document with an error about an infinite loop.
