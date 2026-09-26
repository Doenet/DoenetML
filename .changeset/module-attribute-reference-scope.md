---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

References in a `<module>`'s attributes now resolve where the module is written, not inside the module.

Previously, `<module copy="$graphModule" xmin="$xmin" />` found the module's own `xmin` instead of the `xmin` next to it. The result was a circular-dependency error. A reference to any other name the module defines was captured the same way, and got the module's value in place of the author's.
