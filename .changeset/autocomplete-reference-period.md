---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: open autocomplete on `.` only when the period continues a reference like `$name.prop`, not when it ends a sentence.

The `.` was treated as a completion trigger unconditionally, both when deciding whether to request completions and when deciding whether to reopen a closed popup. Both places now require the text before the dot to end in a `$`-rooted reference path, so a period closing a sentence leaves the popup shut. Every base the language server resolves members from still opens it: `$P.`, `$P.coords.`, `$(P).`, `$rep[1].`, and `$P.(`.
