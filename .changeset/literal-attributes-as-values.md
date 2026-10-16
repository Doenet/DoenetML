---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Documents load faster and use less memory when their attributes are written out as plain values, such as `hide`, `displayDigits="3"`, `simplify` or `xMin="-4"`. Each such attribute used to be built as a small component of its own; it is now kept as the value the author wrote. What documents compute and display is unchanged, including a reader's changes to such an attribute (a toggled `hide`, a rescaled graph), which are still saved and restored.
