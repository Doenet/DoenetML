---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A legend is now redrawn in place instead of being rebuilt from scratch.

Every change to a `<graph>`'s legend — a label whose text depends on something
the student changes, a style, the graph being panned or zoomed, the position or
the box — used to delete every swatch and label and create them again. With
MathJax labels that meant a fresh typesetting pass each time, and the legend
visibly flashed and shifted.

The legend now keeps its objects and updates them: a label whose text changed is
given the new text, a swatch takes the new colors, and everything moves to the
new geometry. What still has to be built or thrown away is only what cannot be
carried over — an entry the legend gains or loses, an entry that changes what
kind of swatch it draws, a label that gains or loses latex or moves to a new
layer, the backing box as `boxed` is switched on or off, and everything at once
when the legend is hidden. Switching the box on no longer takes the swatches and
labels with it, which is the difference.

Closes #402.
