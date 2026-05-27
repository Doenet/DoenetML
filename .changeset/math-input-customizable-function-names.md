---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<mathInput>`: customize which identifiers MathQuill auto-formats as built-in functions.

- `additionalFunctionNames` — names to add to the built-in list (e.g., `"erf"`).
- `removedFunctionNames` — names to drop from the built-in list (e.g., `"min"` so `kg/min` can be typed as a unit).

Defaults are unchanged: existing `<mathInput>` elements still auto-format `sin`, `cos`, `min`, `max`, etc. as before. Both attributes accept whitespace-separated text lists; entries in `removedFunctionNames` win over `additionalFunctionNames` on conflict.

The editor's context-help panel surfaces the resolved effective list when the cursor is on either attribute, along with the deltas authored on that input — so authors can confirm their changes took effect without rerunning the doc.
