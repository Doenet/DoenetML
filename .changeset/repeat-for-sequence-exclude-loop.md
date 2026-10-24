---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeatForSequence>` whose `exclude` refers to an input, with inputs in its template, now loads. It used to stop the document with an error about an infinite loop.
