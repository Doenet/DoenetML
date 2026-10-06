---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A point or vector taken on its own from a `<collect>`, `<sort>`, `<shuffle>`, `<pointList>` or `<vectorList>`, such as `<point extend="$c[1]"/>`, is now fixed when it is placed in a fixed graph, and has `fixLocation` when the point or vector it comes from has it, so the graph no longer offers a drag that does nothing. A point or vector taken from a `<sort fixed>` or `<shuffle fixed>` is now fixed, and dragging it no longer moves the point it was sorted from. A copy, made with `extend`, of a point or other component fixed by its graph or group is now also shown as fixed; dragging or changing it already did nothing.
