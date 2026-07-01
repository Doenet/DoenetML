---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph: add `fillStyle` style attribute for patterned fills on closed shapes.

Closed shapes in graphs (`polygon`, `circle`, `angle`, `regionBetweenCurves`, and `regionBetweenCurveXAxis`) now accept a `fillStyle` override attribute (or `<styleDefinition fillStyle="...">`) with the following values:

- `solid` (default — existing behavior unchanged)
- `horizontal` — horizontal line pattern
- `vertical` — vertical line pattern
- `diagonal` — diagonal lines (/)
- `backDiagonal` — back-diagonal lines (\\)
- `dots` — dots pattern
- `diamonds` — filled diamonds pattern

The patterns are drawn from the BANA (Braille Authority of North America) Texture Palette for Tiger Embossers, intended for tactile graphics.

Both the JSXGraph interactive renderer supports all patterns. Filled circles and polygons also include the pattern wording in their text style descriptions (such as `styleDescription` and `fillStyleDescription`).

Closes #1386.
