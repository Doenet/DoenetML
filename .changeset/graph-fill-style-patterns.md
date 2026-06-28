---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/prefigure": patch
---

Graph: add `fillStyle` style attribute for patterned fills on closed shapes.

Closed shapes in graphs (polygon, circle, region, angle) now accept a `fillStyle` override attribute (or `<styleDefinition fillStyle="...">`) with the following values:

- `solid` (default — existing behavior unchanged)
- `horizontal` — horizontal line pattern
- `vertical` — vertical line pattern
- `diagonal` — diagonal lines (/)
- `backDiagonal` — back-diagonal lines (\\)
- `crosshatch` — horizontal + vertical grid
- `diagonalCrosshatch` — diagonal X-pattern

Both the JSXGraph interactive renderer and the PreFigure static diagram renderer support all patterns. The hatch lines use the shape's fill color.

Filled circles and polygons also include the hatch wording in their text style descriptions (such as `styleDescription` and `fillStyleDescription`).

Closes #1386.
