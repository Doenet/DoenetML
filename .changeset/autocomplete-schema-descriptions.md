---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Show schema descriptions in autocomplete. Component-type, attribute, and property completions now display the same component summaries and attribute/property descriptions used by the context-sensitive help panel. Bare `$name` ref completions show `(<type>, line N)` as detail and the referent's component summary as documentation, making it easy to disambiguate names that shadow each other. Alias-aware: a `<row>` inside `<matrix>` pulls its docs from the `matrixRow` aliased entry, mirroring the help panel.
