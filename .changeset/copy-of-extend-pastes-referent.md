---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `copy` of an `extend` of a point or vector whose coordinates are written with references, such as `<point copy="$Q"/>` where `<point name="Q" extend="$P"/>` and `<point name="P">($a, 0)</point>`, now behaves as the DoenetML of `P` pasted in its place: it follows `$a`, and dragging it changes `a`. It used to hold the coordinates `P` had when it was copied. A `copy` of an `extend` of a vector or a ray, of an entry of a `<sort>` of vectors, or of a `<repeat>` of vectors or rays, no longer fails to load.
