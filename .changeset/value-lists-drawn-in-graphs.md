---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Each value of a `<numberList>`, `<mathList>`, `<textList>` or `<intervalList>` drawn in a `<graph>` is now drawn where the component it comes from is anchored, as `x` is at `(4,5)` in `<mathList><math anchor="(4,5)">x</math></mathList>`, with that component's `positionFromAnchor` and `layer`, and dragging it moves that component, unless the component or the list is fixed, its location is fixed, or it is not `draggable`. The values were all drawn at the origin, and dragging one moved nothing. This holds for a value from a reference to a component, such as `$m`, and from a list inside the list. A property of one value, such as `$l[1].anchor`, `$l[1].draggable` or `$l[1].fixed`, is that component's. A value written as text, such as the `3` of `<numberList><number anchor="(1,2)">5</number> 3</numberList>`, or a reference to a property, such as `$m.x`, is drawn at the origin and cannot be dragged. A `<collect>`, `<sort>` or `<shuffle>` of numbers, maths, texts, booleans or intervals in a graph now keeps its values in one component, as it does outside a graph, drawn and dragged in the same way.
