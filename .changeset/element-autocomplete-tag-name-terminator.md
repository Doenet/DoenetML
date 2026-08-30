---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: keep offering element names when the character after the cursor cannot be part of a tag name.

Typing `<` opened the element menu, and typing the first letter of the tag name emptied it, whenever the character immediately following the cursor was one that ends a tag name, such as `}`, `{`, `)`, `]`, `$`, `&`, `%`, or `\`. The menu now stays open and filters by what has been typed, as it does when nothing follows the cursor.

The case that surfaces this is a tag typed inside a brace group of typeset math, such as an input in the bounds of an integral: because the editor closes brackets as you type, `<me>\int_{` is already `<me>\int_{|}` by the time you type `<`, so every tag written there hit this.

The context-help panel follows the same correction: while you type such a tag name it now describes the element being named, rather than listing the elements allowed inside it.

Closes #1767.
