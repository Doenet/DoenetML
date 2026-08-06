---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: open autocomplete on `.` only when the period continues a reference like `$name.prop`, not when it ends a sentence.

The `.` was treated as a completion trigger unconditionally, both when deciding whether to request completions and when deciding whether to reopen a closed popup. Both places now require the period to continue an unfinished reference path, so a period closing a sentence leaves the popup shut while `$P.`, `$P.coords.`, `$rep[1].` and `$(P.` still offer properties. A `(` typed after such a period is no longer a trigger either — the reference syntax has no `$P.(coords)` form.
