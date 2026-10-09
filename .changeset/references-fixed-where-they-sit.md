---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference is now fixed, or has `fixLocation`, the same way whatever its form (`$P`, `$m.value`, `$P.x`, `$l[1]` or `extend`): when it says so itself, or otherwise when its source is or where it sits is, including a `<group>`. A `fixed="false"` on its source or on where it sits no longer unfixes it; `fixed="false"` on the reference itself still does. An unlinked copy (`copy`) behaves as if its source's DoenetML were pasted there: it takes the `fixed` and `fixLocation` written on its source, or on what its source references, as its own, so one given by a reference (`fixed="$b"`) keeps following it, and is otherwise fixed only by where it sits. A copy of a list entry takes them as written on the list or, for a list of points or vectors, on the entry's source, and a copy of a prop such as `$P.x` takes neither. Other attributes a reference takes from its source, such as `hide="$h"`, likewise carry to a copy of the reference. A copy of an `extend` of a `<repeat>` now repeats its template, where before it was empty, and a copy of an `extend` of a `<repeatForSequence>` whose template has a component with an attribute no longer reports a circular dependency.
