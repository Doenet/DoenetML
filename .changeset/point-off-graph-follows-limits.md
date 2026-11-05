---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A point on a graph is now redrawn when the graph's limits change, so it shows as a point once the new limits include it and as an off-graph indicator at the new edge once they don't. Before, when the limits were changed other than by panning or zooming (for example, from a math input), a point could keep the drawing it had for the old limits, such as an indicator pinned at the old edge after the limits grew to include it. This could happen whether or not the point's coordinates changed at the same time.
