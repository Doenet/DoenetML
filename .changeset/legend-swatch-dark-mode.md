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
light-mode one. Each legend entry now carries both colors and the swatch is
painted with the one the current theme calls for, alongside the box and the
labels, which already were.
