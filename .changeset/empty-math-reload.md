---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A document with an empty `<math>` whose value was set through an input, such as `<math name="m"/><mathInput bindValueTo="$m"/>`, now loads again from its saved state. Previously, reloading after a value was typed into the input stopped the document from loading.
