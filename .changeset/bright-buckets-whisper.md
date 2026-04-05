---
"@doenet/doenetml": patch
"@doenet/doenetml-iframe": patch
"@doenet/standalone": patch
---

Improve DoenetML editor autocomplete for references.

The editor now suggests in-scope names after `$`, offers descendant names and
properties after `.` on references, and handles completion reopening more
reliably while typing, deleting, and accepting completions.