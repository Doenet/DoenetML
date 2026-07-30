---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph: draw the grid in the prefigure renderer.

`grid` was silently ignored when a `<graph>` rendered with `renderer="prefigure"`. It now draws, using PreFigure's own `<grid>` element:

- `grid` (or `grid="medium"`) lets PreFigure pick the spacing from the axis limits, so the grid follows the graph's bounds.
- `grid="dense"` subdivides that spacing to add the finer lines.
- `grid="dx dy"` places lines on multiples of `dx` and `dy`, as the doenet renderer does.

The grid is drawn behind the axes and the graph's contents, and takes a dimmer stroke in dark mode.

Closes #1242.
