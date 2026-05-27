---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<mathInput>`: customize which identifiers are auto-formatted as built-in function names in the editor.

- `additionalFunctionNames` — extra names to auto-format (e.g., `"erf"`).
- `removedFunctionNames` — built-in names to stop auto-formatting (e.g., `"min"` so `kg/min` can be typed as a unit).

Defaults are unchanged. Both attributes accept whitespace-separated text lists, and entries appearing in `removedFunctionNames` are dropped from the effective list even if `additionalFunctionNames` re-adds them.

The editor's context-help panel surfaces the resolved effective list when the cursor is on either attribute, alongside the deltas authored on that input.
