---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `copy` of one point or vector of a `<pointList>`, `<vectorList>`, `<collect>`, `<sort>` or `<shuffle>`, such as `<point copy="$pl[1]"/>`, now starts at that entry's coordinates (and a vector at its tail) instead of at the origin. It also has the label of the point or vector it comes from, and a vector keeps its `headDraggable` and `tailDraggable`. As with any `copy`, it then moves independently of the list.
