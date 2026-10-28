---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A point on a graph is now redrawn when the graph's limits change, so it shows as a point once the new limits include it and as an off-graph indicator at the new edge once they don't. Before, a point could keep the indicator, pinned at the old edge, after the limits grew to include it: when the limits were changed (by panning, zooming, or a change to their values) without the point's coordinates changing, and sometimes even when the limits and the point's coordinates changed together.
