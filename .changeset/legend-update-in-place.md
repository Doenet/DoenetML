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
new geometry. Objects are only created or removed when the legend gains or loses
an entry, an entry changes what kind of swatch it draws, or a label gains or
loses latex.

Closes #402.
