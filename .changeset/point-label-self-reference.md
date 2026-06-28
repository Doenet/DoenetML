---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix self-referential references in recognized rendering contexts (for example `<label>$a</label>` inside component `a`) so they render a meaningful value instead of a circular dependency error.

When a component references itself without an explicit prop inside a recognized rendering context, DoenetML now falls back to the component's public `value` state variable rather than showing an error. For `<point>`, that means using its public coordinates value. This applies in contexts such as `<label>`, `<text>`, `<math>`, `<m>`, `<md>`, `<boolean>`, `<number>`, and the corresponding list variants. The existing circular-dependency error is preserved outside those contexts.

Closes #1333.
