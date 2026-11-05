---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A paragraph's `text` now follows a conditional content inside it when the content switches from a case with a string between its components to one without. For example, it switches from `<text>dog</text> mouse <text>cat</text>` to an else holding two texts. A reference such as `$p.text` used to keep showing the case's text.
