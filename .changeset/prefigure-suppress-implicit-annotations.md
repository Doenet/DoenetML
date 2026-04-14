---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Suppress implicit PreFigure accessibility annotations when authors do not provide an `<annotations>` block. We now emit an empty `<annotations>` container in generated PreFigure XML and only initialize `diagcess` when authored annotations are present, preventing unintended auto-generated annotation text from appearing.
