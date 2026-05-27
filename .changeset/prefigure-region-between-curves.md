---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add PreFigure rendering support for `<regionBetweenCurves>`. The region is emitted as a PreFigure `<area-between-curves>` element with `<definition>` elements registering each child function in the PreFigure namespace; previously the component rendered blank under the PreFigure renderer.

Only formula-typed child functions and unflipped axes are supported in this initial pass. `flipFunctions="true"` and non-formula function children (interpolated, bezier, piecewise) emit a warning and are skipped.

Closes #1203.
