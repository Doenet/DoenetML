---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix per-component `fillOpacity` (and `lineWidth`/`lineStyle` on `<parabola>`) having no effect.

A per-component `fillOpacity` on a filled `<circle>` was ignored — the fill stayed at the styleNumber's default opacity regardless of the attribute, so two circles with very different `fillOpacity` values rendered identically. `<circle>` and `<parabola>` borrow their state-variable definitions straight from `GraphicalComponent` (to skip `<curve>`'s parametric-curve variables), but the borrow ran with the wrong `this`, so their style-override categories (`["line", "fill"]` for circle, `["line"]` for parabola) resolved to an empty set and the overrides never reached `selectedStyle`. The borrow now preserves the leaf component as `this`, so `fillOpacity` on a circle and `lineWidth`/`lineStyle` on a parabola take effect.
