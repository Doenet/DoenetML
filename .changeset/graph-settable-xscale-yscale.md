---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph: make `xscale` and `yscale` settable.

The `xscale` and `yscale` properties of a `<graph>` were previously read-only derived values (`xMax − xMin` and `yMax − yMin`). They now have inverse definitions, so binding to or otherwise setting them adjusts the axis limits: the midpoint of the corresponding limits is held fixed while both ends move symmetrically so that the difference matches the requested scale (e.g. setting `xscale` updates `xMin` and `xMax` around their shared midpoint). Non-finite and non-positive values are rejected (a non-positive scale would make the minimum ≥ the maximum), and the underlying `xMin`/`xMax` (and `yMin`/`yMax`) inverse logic—including the `fixAxes` refusal—is reused.
