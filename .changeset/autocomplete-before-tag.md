---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Fix autocomplete when typing a tag immediately before another tag.

When typing an element name directly in front of an existing tag (e.g.
`<nu|<text>` or `<text><nu|</text>`), error recovery parsed the half-typed tag as a complete element, so the editor suggested a bogus close-tag completion (`/nu>`) and the completion menu would not open. The cursor is now recognized as still typing the open tag name, so element-name completions are offered and the menu opens — whether reached by typing or by invoking completion explicitly (Ctrl+Space) at that position, and including when `<` is typed just before another tag. In unclosed containers, the normal parent close-tag option is preserved and inserts a complete close tag even when completion is invoked before typing `<`.

Element/tag-name suggestions now match the typed text as a substring and rank prefix matches first, so you don't have to remember how a tag name begins — typing `<num` offers `number` and `numberList` first, then `isNumber` and other tags containing `num`. The suggestions are also consistent however the menu is reached (typing, Ctrl+Space, or deleting back to a shorter prefix), where previously the visible set depended on what was cached when the menu first opened.

Invoking completion in the body of an unclosed element (e.g. `<text><math>|</text>`) now offers that element's child components alongside its closing tag, and accepting the closing tag inserts it at the cursor instead of overwriting the end of the opening tag.

Closes #1328.
