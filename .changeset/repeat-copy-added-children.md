---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Children written inside a `copy=` of a `<repeat>` or `<repeatForSequence>`, such as `<repeatForSequence copy="$r"><text>x</text></repeatForSequence>`, no longer stop the document from loading. They are added to each iteration after the copied template, as children written inside a `copy=` of a `<group>` or `<p>` are added to the copy.

Closes #2176.
