---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A named child of a list can now be reached through the name of an `extend` of the list, as it already could through an `extend` of a `<p>`. For `<mathList name="l"><math name="h">x</math> y</mathList>` and `<mathList name="e" extend="$l"/>`, `$e.h` is the extend's copy of `h`, which stays linked to `h` both ways; before, it named nothing. This holds for every authored list (`<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<intervalList>`, `<tupleList>`, `<pointList>`, `<vectorList>`), for an extend of an extend (`$e2.h`), and for a reference written before the extend. A list inside an extended component is reached the same way: `$E.l.h` for `<p name="E" extend="$P"/>` of a `<p name="P">` holding `l`, which also named nothing before. The name of the list itself is still not a name inside the extend (`$e.l` names nothing).
