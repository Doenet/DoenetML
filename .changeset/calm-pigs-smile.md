---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix `sort` and `shuffle` sugar handling when type information is missing or invalid, and improve diagnostics for mixed string/component children.

- Fall back to `math` (with warning diagnostics) when `type` is invalid.
- When `type` is omitted, do not apply sugar; instead, if a string child exists, emit warnings telling authors to specify a `type` attribute.
- Ignore string children in mixed-content cases with explicit warning diagnostics.
- Add test coverage for the fallback and diagnostics behavior.
