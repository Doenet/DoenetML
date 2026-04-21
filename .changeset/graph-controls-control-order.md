---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Improve graph controls ordering across control types. Controls now follow descendant order by default (instead of rendering grouped by type), and graphical controls support a new `controlOrder` attribute to request an earlier or later position in the controls list. `controlOrder` uses 1-indexed slot semantics: for each slot n, the renderer fills it with the lowest available order in [1..n], then uses unordered (order=0) controls to fill gaps, then falls back to higher orders. A value of `0` is unordered and may be reordered to fill early gaps.