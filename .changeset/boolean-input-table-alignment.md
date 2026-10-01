---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: a boolean input's label now lines up with the text in neighboring table cells.

The checkbox had a 4px bottom margin that hung below the line of text. A table cell centers its content vertically, so a cell holding a boolean input sat 2px higher than a cell holding plain text. The margin is gone. In a paragraph, a line holding a boolean input no longer gets 4px of extra space below it.
