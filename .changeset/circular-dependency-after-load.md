---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A circular dependency that a reader's action creates in a document that loaded fine, such as a `<conditionalContent>` switching on content that refers to itself, is now reported in place of the document. The document used to keep running until it ran out of memory and stopped responding.
