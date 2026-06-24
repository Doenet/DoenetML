---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Fix autocomplete when typing a tag immediately before another tag.

When typing an element name directly in front of an existing tag (e.g.
`<nu|<text>` or `<text><nu|</text>`), error recovery parsed the half-typed tag as a complete element, so the editor suggested a bogus close-tag completion (`/nu>`) and the completion menu would not open. The cursor is now recognized as still typing the open tag name, so element-name completions are offered and the menu opens — including when `<` is typed just before another tag. In unclosed containers, the normal parent close-tag option is preserved and inserts a complete close tag even when completion is invoked before typing `<`.

Closes #1328.
