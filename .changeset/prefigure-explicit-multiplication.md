---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix PreFigure curve rendering for implicit-multiplication expressions. Functions like `(x-2)(x-5)` or `3x` now render correctly in the PreFigure renderer; previously these produced invalid formula strings that the PreFigure parser dropped silently.
