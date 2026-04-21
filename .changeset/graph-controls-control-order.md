---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Improve graph controls ordering across control types. Controls now follow descendant order by default (instead of rendering grouped by type), and graphical controls support a new `controlOrder` attribute to request an earlier or later position in the controls list. `controlOrder` uses 1-indexed slot semantics: the renderer fills slots 1, 2, 3, ... with the lowest matching control order in each slot, uses `controlOrder=0` controls to fill gaps between positive orders, then places remaining higher orders at the end. A value of `0` (default) has no fixed position; such controls are grouped for gap-filling and do not preserve authored order relative to controls with positive `controlOrder` values.