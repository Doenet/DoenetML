---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Improve the editor's context-sensitive help and make Ctrl+Space work between tags.

- Component help now leads with the component name and its one-line summary on a single line, and the `<tag>` name is a link to the component's reference page (the footer link stays too).
- Reference help for `$name` and `$name.property` now explains what a reference is and links to a new References page, rather than showing the referenced component's summary and page. The help is identical wherever the cursor sits in a `$a.b` chain — the whole reference is treated as one unit.
- When the cursor is in an element's body or in empty top-level space, the panel now suggests components to try instead of going blank, and points to Ctrl+Space for the full list.
- Pressing Ctrl+Space between tags (or in empty top-level space) now opens the element-completion menu and inserts the leading `<` for you; previously you had to type `<` first.
- Adds a References page to the documentation covering `$name`, `$name.property`, and referencing repeat iterations.
