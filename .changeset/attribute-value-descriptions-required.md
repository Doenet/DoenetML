---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Every enumerated attribute value now ships with a description that flows into editor autocomplete and the context-help panel. The `ValidValueEntry` type requires `description`, and bare-string `validValues` entries are no longer accepted. Pure boolean primitives no longer render an "Allowed values" row in the help panel (autocomplete for `true`/`false` is unchanged).
