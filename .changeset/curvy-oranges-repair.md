---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add initial PreFigure rendering support for `<curve>` elements.

 It adds conversion for function, parameterized, and bezier curves, and includes support for piecewise and interpolated function definitions (including piecewise children that are interpolated). It also adds diagnostics for unsupported curve definitions.
