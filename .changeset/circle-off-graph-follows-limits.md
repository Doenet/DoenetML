---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A circle on a graph is now redrawn when the graph's limits change, so its off-graph indicator appears, disappears or moves to the new edge to match the new limits. Before, when the limits were changed other than by panning or zooming (for example, from a math input), a circle could keep the indicator it had for the old limits, such as an indicator pinned at the old edge after the limits grew to include the circle.

Also, on a graph with exactly one flipped axis, a circle that has gone off the top or bottom of the graph but still reaches into it no longer shows an off-graph indicator.
