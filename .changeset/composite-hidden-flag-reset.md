---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A paragraph holding a conditional content no longer stops the document when the content switches from a case with a string between its components to one without, such as from a case with `<text>dog</text> mouse <text>cat</text>` to an else with two texts.
