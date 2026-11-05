---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: a boolean input's label now lines up with the text in neighboring table cells.

The checkbox had a 4px bottom margin that hung below the line of text. A table cell centers its content vertically, so a cell holding a boolean input sat 2px higher than a cell holding plain text. The margin is gone, so a line or table row holding a boolean input is now 4px shorter, unless something taller on it, such as an answer's check-work button, sets its height. Boolean inputs on consecutive lines, such as one per list item, now have their checkboxes touching instead of 4px apart.
