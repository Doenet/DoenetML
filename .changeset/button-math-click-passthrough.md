---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Clicking the math in a button's label now activates the button. Previously, when a button's label contained math (e.g. a `<callAction>` with a `<label>` holding an `<m>`), MathJax intercepted clicks on the math and the button did nothing.
