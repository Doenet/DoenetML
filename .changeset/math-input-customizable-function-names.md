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
- `resetFunctionNames` — when set, replaces the entire list (defaults plus the other two attributes are ignored). Pass an empty value to disable auto-formatting entirely.

Defaults are unchanged. All three attributes accept whitespace-separated text lists. Without `resetFunctionNames`, entries appearing in `removedFunctionNames` are dropped from the effective list even if `additionalFunctionNames` re-adds them. Author-supplied names that MathQuill would reject are filtered out instead of crashing the editor; a `warning` diagnostic positioned on the offending attribute lists what was ignored and explains the naming rule.

The editor's context-help panel surfaces the resolved effective list when the cursor is on any of the three attributes, alongside the deltas (or the reset list) authored on that input. Attributes whose schema default is an empty array no longer render an empty `Default:` row.
