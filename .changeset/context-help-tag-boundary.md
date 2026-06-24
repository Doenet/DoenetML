---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Fix context-sensitive help when the cursor sits on a tag boundary.

When the cursor is immediately before a tag (e.g. `|<text/>`, including after whitespace or indentation), the help panel now reports the surrounding context — the parent element, or the document top level — instead of claiming the cursor is inside the element and suggesting its children. When the cursor is inside a self-closing tag's `/>` (e.g. `<text/|>`), the panel now shows element-level help rather than the element's children.

Closes #1327.
