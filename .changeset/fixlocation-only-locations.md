---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`fixLocation` now keeps only a component's location from changing: where it is drawn in a graph, a point's coordinates, a line's equation. A `<math>` with `fixLocation`, or inside a `<graph fixLocation>`, can now have its value changed, for example through `<mathInput bindValueTo="$m"/>`; only its anchor stays put. The same holds for a `<math>` holding a reference to a text or number with `fixLocation`. A point with `fixLocation` whose coordinate is a `<math>` of its own, as in `<point fixLocation>(<math name="a">1</math>, 2)</point>`, still cannot be dragged, but it moves when `a` is changed, as it does when anything else its coordinates depend on changes.
