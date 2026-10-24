---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Some `<repeatForSequence>` components whose `exclude` refers to another component, such as a `<mathInput>`, no longer stop the document from loading with an error about an infinite loop.

A letters `<repeatForSequence>` whose `from` changes between lowercase and uppercase now updates its values when they are read from outside it, such as `$r[1].v`.
