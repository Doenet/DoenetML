---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

References in a copy's attributes now resolve as they would outside the copy.

Previously, `$h` in `<section copy="$S" hide="$h" name="S2" />` found the `h` inside the copied section, not the `h` where the copy is written. To reach a component inside the copy, reference it through the copy's name, as in `hide="$S2.h"`.
