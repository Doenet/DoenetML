---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/prefigure": patch
---

Graph: revise closed-shape `fillStyle` patterns and add `fillPatternOpacity`.

Closed shapes in graphs (`polygon`, `circle`, `angle`, `regionBetweenCurves`, and `regionBetweenCurveXAxis`) now support patterned fills via `fillStyle` and separate pattern opacity via `fillPatternOpacity`.

Available `fillStyle` values are:

- `solid` (default — existing behavior unchanged)
- `horizontal` — horizontal line pattern
- `vertical` — vertical line pattern
- `diagonal` — diagonal lines (/)
- `backDiagonal` — back-diagonal lines (\\)
- `dots` — dots pattern
- `diamonds` — filled diamonds pattern

The `dots` and `diamonds` patterns are drawn from the BANA (Braille Authority of North America) Texture Palette for Tiger Embossers, intended for tactile graphics. Pattern fills now use `fillPatternOpacity` (default `1`) instead of the solid-fill `fillOpacity` default (`0.3`).

The previous `crosshatch` and `diagonalCrosshatch` values are replaced by `dots` and `diamonds`, respectively.

The JSXGraph interactive renderer supports all patterns. Filled circles and polygons also include the pattern wording in their text style descriptions (such as `styleDescription` and `fillStyleDescription`).

`@doenet/prefigure` no longer injects SVG hatch definitions. Until native PreFigure pattern support lands, non-solid `fillStyle` values there warn and fall back to solid fills.

Closes #1386.
