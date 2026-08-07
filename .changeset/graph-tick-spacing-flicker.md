---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graph: stop axis tick spacing from flickering between two values while a point is dragged.

The number of minor ticks was chosen from the major-tick interval, but JSXGraph derives that interval from the number of minor ticks — it keeps a minimum pixel gap between minor ticks, so a larger minor count pushes the interval up. At some board scales the two never agree, and because the choice was remade on every render, the axis kept alternating between the two answers for as long as renders kept arriving. `<graph aspectRatio="2" ymin="-6" ymax="6" size="large">` was one such scale: dragging a point flipped the y axis between ticks every 2 and ticks every 1.

The minor-tick count is now chosen by evaluating the candidates rather than iterating toward a fixed point that may not exist, so it settles; and it is recomputed only when something it depends on — the region the board shows, the canvas it is drawn in, or the axes themselves — actually changes, rather than on every render.
