---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: open autocomplete on `.` only when the period continues a reference like `$name.prop`, not when it ends a sentence, and close it once the reference ends.

The `.` was treated as a completion trigger unconditionally, both when deciding whether to request completions and when deciding whether to reopen a closed popup. Both places now require the period to continue an unfinished reference path, so a period closing a sentence leaves the popup shut while `$P.`, `$P.coords.`, `$rep[1].` and `$(P.` still offer properties.

A property list that is already open now closes as soon as the reference ends. Typing anything a path cannot contain — `$P.(`, `$P."`, `$P. ` — used to leave the members of `$P.` on screen, offering to complete them into text that is not a reference.
