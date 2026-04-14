---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix LSP schema validation and autocomplete for enum attributes that also support boolean aliases.

Attributes like `simplify`, `simplifyOnCompare`, `addSliders`, and `sort` now accept presence form and explicit `"true"`/`"false"` without warnings, while autocomplete continues to prioritize the author-facing enum values.
