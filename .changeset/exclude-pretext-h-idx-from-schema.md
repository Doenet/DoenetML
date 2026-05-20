---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Exclude the PreTeXt-compatibility `<h>` and `<idx>` components from the schema.

The `<idx>` (back-of-the-book index entry) and `<h>` (index heading) elements were added for PreTeXt compatibility but have no DoenetML index infrastructure behind them and no tests. They now set `excludeFromSchema = true`, so they disappear from editor autocomplete and RelaxNG validation while remaining registered — content copied from PreTeXt that contains these tags continues to parse silently instead of erroring. Their `componentDocs.summary` strings have been corrected to describe what they actually are and flag the PreTeXt-compat status.
