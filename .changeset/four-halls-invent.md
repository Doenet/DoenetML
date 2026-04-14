---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add Phase 1 PreFigure point sliders with graph- and point-level control.

When using `<graph renderer="prefigure" addSliders>`, draggable points can now render coordinate sliders below the graph. Authors can control slider behavior per point with a new `<point addSliders="none|both|xOnly|yOnly">` attribute (default `both`). Slider labels follow point display rounding settings, including padded zero formatting, and constrained points snap to valid values on release.
