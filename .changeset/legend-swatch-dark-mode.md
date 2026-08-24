---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A legend's swatches now follow the document's theme.

Every swatch was painted with the light-mode color of the object it stands for,
whatever the theme, so in dark mode a legend could disagree with the objects it
describes: a curve drawn in its dark-mode color beside a swatch drawn in its
light-mode one. A swatch is now painted with the color the current theme calls
for, and is repainted when the theme is switched, alongside the box and the
labels, which already were.
