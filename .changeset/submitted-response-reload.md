---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A document that compares an answer's submitted response in an expression, such as `<feedback condition="$ans.submittedResponse = z">`, now loads again after a response has been submitted and saved. Previously, reloading the saved state stopped the document from loading. Submitted math responses, and responses of types that hold a math value such as points, are now math values again after a reload wherever they are read.
