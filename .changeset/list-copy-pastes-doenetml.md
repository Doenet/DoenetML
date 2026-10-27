---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `copy` of a `<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<intervalList>`, `<tupleList>`, `<pointList>` or `<vectorList>` is now that list's DoenetML pasted, as a `copy` of any other component is. A reference written in the list stays live in the copy: `<mathList copy="$l"/>` of `<mathList name="l">$mi 2</mathList>` now follows `mi`, where before it held the values `l` had when the copy was made. The children the list names can also be reached through the copy (`$c.h`).

This changes what such a copy shows once a value it references changes. A copy made after the reader has changed the list still starts from the list's current values, and keeps them through a reload.

References in the attributes written on a copy of a list, such as `hide="$h"`, resolve where the copy is written, not to a child of the same name inside the copy, as they already did for a copy of any other component.
