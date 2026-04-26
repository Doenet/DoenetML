---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix `sort` and `shuffle` sugar handling when type information is missing or invalid, and improve diagnostics for mixed string/component children.

- Default sugar-created replacements to `math` when `type` is omitted.
- Fall back to `math` (with warning diagnostics) when `type` is invalid.
- Ignore non-component string children in mixed-content cases with explicit warning diagnostics.
- Add test coverage for the fallback and diagnostics behavior.
