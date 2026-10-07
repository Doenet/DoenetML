---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`fixLocation` now keeps only a component's location from changing: where it is drawn in a graph, a point's coordinates, a line's equation. A `<math>` with `fixLocation`, or inside a `<graph fixLocation>`, can now have its value changed, for example through `<mathInput bindValueTo="$m"/>`; only its anchor stays put. The same holds for a `<math>` holding a reference to a text or number with `fixLocation`. A math holding a point's coordinates by name, as in `<point>(($P.x+$Q.x)/2, ($P.y+$Q.y)/2)</point>`, now leaves a drag to `Q` when `P` has `fixLocation`, as `($P+$Q)/2` already did, instead of not moving at all.
