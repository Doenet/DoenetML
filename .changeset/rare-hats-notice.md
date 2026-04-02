---
"@doenet/doenetml": patch
"@doenet/doenetml-iframe": patch
"@doenet/standalone": patch
---

Add graph attributes to control axis tick visibility.

Graphs now support `displayXAxisTicks` and `displayYAxisTicks`. Tick labels inherit from the corresponding tick visibility setting unless `displayXAxisTickLabels` or `displayYAxisTickLabels` is explicitly specified.
