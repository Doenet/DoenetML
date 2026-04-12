---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix PreFigure annotation refs that target functions in graphs. An annotation like `<annotation ref="$f" />` now resolves when `f` is a `<function>` rendered via an adapted `<curve>`, while preserving existing behavior and warnings for invalid or out-of-graph refs.