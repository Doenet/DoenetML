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

Element/tag-name suggestions are also now filtered consistently by the typed prefix however the menu was reached: previously, opening the menu on `<` and then typing fuzzy-matched every tag *containing* the typed text, while opening it on a typed prefix and deleting back kept showing the narrower prefix list. The menu now always shows tags that *start with* the current prefix.

Closes #1328.
