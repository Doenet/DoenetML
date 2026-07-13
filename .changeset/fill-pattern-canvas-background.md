---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give patterned fills a translucent background instead of a fully transparent one.

A closed shape with a non-solid `fillStyle` (horizontal, vertical, diagonal, backdiagonal, dots, diamonds) now renders as two layers: a background the color of the graph canvas at `fillOpacity`, and the pattern itself in `fillColor` at `fillPatternOpacity`. Previously the area behind the pattern was fully transparent. A `solid` fill is unchanged — `fillColor` at `fillOpacity`.
