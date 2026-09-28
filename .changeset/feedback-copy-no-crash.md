---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A copied `<feedback>` no longer stops the whole document from rendering. This happened to a `<feedback>` inside a `<shuffle>`, such as in shuffled problems that give feedback, and to one copied with `extend`. Such a copy now shows or hides according to its condition, and a copy of an award's feedback stays hidden while the award has none.
