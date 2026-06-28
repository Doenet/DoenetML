---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix self-referential references in `<label>` and `<text>` contexts (e.g. `<label>$a</label>` inside component `a`) so they render a meaningful value instead of a circular dependency error.

When a component references itself without an explicit prop inside its own `<label>` or `<text>`, DoenetML now falls back to the component's public `latex` or `text` state variable (depending on context) rather than showing an error. The existing circular-dependency error is preserved for self-references outside label/text contexts.

Closes #1333.
