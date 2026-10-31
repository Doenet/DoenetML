---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A copy's references keep their referents. A reference inside content made by
`copy=` keeps meaning what it meant in the source instead of being looked up
again by name where the copy lands. A reference to a component outside the
copied content keeps that component, so a component of the same name near the
copy no longer captures it or makes it ambiguous. This also applies to an
attribute pasted by a copy of a copy, and to the `fixed` or `fixLocation` that a
copy of a list entry (`copy="$l[2]"`) takes from the list. A reference to a
component inside the copied content points at the copy's counterpart, including
one written through the copied component's own name
(`$P.h` inside `<p name="P">`, `$l.h` inside a list `l`). In a copy of repeat content, a reference
such as `$i` now shows its iteration's value instead of nothing.
