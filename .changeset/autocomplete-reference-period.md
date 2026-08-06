---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: open autocomplete on `.` only when the period continues a reference like `$name.prop`, not when it ends a sentence.

The `.` was treated as a completion trigger unconditionally, both when deciding whether to request completions and when deciding whether to reopen a closed popup. Both places now require the text before the dot to end in a `$`-rooted reference path, so prose periods leave the popup shut while `$P.` and `$P.coords.` still offer properties.
