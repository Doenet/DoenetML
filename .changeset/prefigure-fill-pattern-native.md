---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

PreFigure renderer: use native `fill-pattern` attribute for patterned `fillStyle` values.

The `@doenet/prefigure` package now vendors `prefig-0.6.7-py3-none-any.whl`, which added native `fill-pattern` support. The PreFigure renderer now uses the `fill-pattern` attribute for patterned `fillStyle` values (`horizontal`, `vertical`, `diagonal`, `backDiagonal`, `dots`, `diamonds`) instead of falling back to a solid fill with a warning. Pattern opacity is controlled by `fillPatternOpacity` (mapped to `fill-opacity` on the patterned element).
