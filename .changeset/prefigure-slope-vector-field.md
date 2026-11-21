---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Draw `<slopeField>` and `<vectorField>` in a graph with the PreFigure renderer, which includes printed documents. They were left out of the graph with a warning that the renderer did not support them. Each is drawn as PreFigure's own slope or vector field, so an `<annotation>` can refer to it, on the lattice the interactive graph draws at its axis limits: `dx`, `dy`, `xoffset`, `yoffset` and `maxMarks` are honored, and lattice points outside the function's `domain` are left out. A vector field's longest arrow is `markLength` pixels long, or every arrow with `normalize`.

What PreFigure cannot draw is reported as a warning: a slope field's `markLength`, since PreFigure sizes slope marks from the lattice spacing; `normalize` on unequally scaled axes, where the arrows' lengths then vary with their direction; a dashed or dotted `lineStyle`; a function not given by a formula, which is not drawn; and a function such as `sqrt` or `log` that is undefined at a lattice point, or a vector field that divides by a function such as `sin(x)` where it is zero, either of which can keep PreFigure from drawing the field at all.

In both renderers, a field whose lattice cannot be walked now draws nothing instead of hanging the page: one whose `dx` or `dy` is so small, or whose `xoffset` or `yoffset` is so large, that its lattice points cannot be counted, and one with a very small `dx` or `dy` while no lattice line along the other axis is in view.
