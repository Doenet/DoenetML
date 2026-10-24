---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Some `<repeatForSequence>` components whose `exclude` refers to another component, such as a `<mathInput>`, no longer stop the document from loading with an error about an infinite loop.
