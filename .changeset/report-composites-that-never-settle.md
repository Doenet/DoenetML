---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

When components that make other components, such as a copy, a `<collect>` or a `<conditionalContent>`, keep remaking their content because of a cycle Doenet does not otherwise detect, the document no longer stops loading with "Seem to have an infinite loop while calculating replacement changes". The components involved are reported as a circular dependency at their positions and stop being updated, and the rest of the document loads and keeps responding. If none can be singled out, the error still stops loading (or, once the document has loaded, the change that set off the loop), but it now names the components involved and their lines.

Closes #2418.
