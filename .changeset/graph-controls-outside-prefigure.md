---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Make graph point controls renderer-agnostic by moving controls UI/logic out of the Prefigure renderer into `GraphControls`.

Controls now appear consistently regardless of graph renderer selection, while preserving `addControls` graph/point mode behavior (`all`, `slidersOnly`, `inputsOnly`, `none`; and `both`, `xOnly`, `yOnly`, `none`).

This also removes duplicated controls code from `prefigure.tsx` and keeps Prefigure focused on prefigure runtime/render concerns.