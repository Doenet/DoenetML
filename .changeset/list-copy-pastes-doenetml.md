---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `copy` of a `<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<intervalList>`, `<tupleList>`, `<pointList>` or `<vectorList>` is now that list's DoenetML pasted, as a `copy` of any other component is. A reference written in the list stays live in the copy: `<mathList copy="$l"/>` of `<mathList name="l">$mi 2</mathList>` now follows `mi`, where before it held the values `l` had when the copy was made. The children the list names can also be reached through the copy (`$c.h`), wherever the reference is written and through a copy of a copy (`$c2.h` for `<mathList name="c2" copy="$c1"/>`), as for a copy of a `<p>`. The name of the list it copies is not a name inside the copy: `$c.l` names nothing, as it never did for a copy of a `<p>`. The same holds for an `extend` of a list (`$e.l`). So a reference written in the list by the list's own name, such as `$l.h` in `<mathList name="l">`, refers to `l` in the copy too, as `$P.h` does in a copy of a `<p name="P">`; before, it referred to the copy's own `h`.

A `copy` of an `extend` of a list (`<mathList copy="$e"/>` of `<mathList name="e" extend="$l"/>`) is likewise the DoenetML of `l` pasted, not linked to `l`, and a `copy` of an `extend` of a `<repeat>` pastes the repeat. A `copy` of an `extend` of a property (`<mathList name="ex" extend="$P.xs"/>`) still holds the values it had when the copy was made.

This changes what such a copy shows once a value it references changes. A copy made after the reader has changed the list still starts from the list's current values, and keeps them through a reload.

References in the attributes written on a copy of a list, such as `hide="$h"`, resolve where the copy is written, not to a child of the same name inside the copy, as they already did for a copy of any other component.
