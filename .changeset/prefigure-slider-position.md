---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add `sliderPosition` support for PreFigure point sliders. Authors can now place sliders on the `left`, `right`, `top`, or `bottom` of the graph, with `left` as the default. Side placements responsively fall back to `top` or `bottom` on narrow layouts, and keyboard focus now lands on the graph itself before the sliders so PreFigure annotations remain accessible.