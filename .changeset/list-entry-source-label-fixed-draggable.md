---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A point or vector taken from a `<collect>`, `<sort>`, `<shuffle>`, `<pointList>` or `<vectorList>` on its own, such as `$c[1]` in a graph or `<point extend="$c[1]"/>`, now has the label of the point or vector it comes from, is fixed when that one is fixed, and cannot be dragged when that one cannot (including a vector's `headDraggable` and `tailDraggable`). Its own label or attributes, when given, are used instead.
