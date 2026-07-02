---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

feat: add `collapsible` attribute to all sectioning components (default `false`).

Previously, `collapsible` was hardcoded to `false` in the base sectioning component and only `<aside>` and `<proof>` exposed it as a user-settable attribute (defaulting to `true`). All other sectioning components (`<section>`, `<example>`, `<theorem>`, etc.) could not be made collapsible by the author.

`collapsible` is now declared on the base `SectioningComponent` with a default of `false`, so every sectioning component inherits the attribute. `<aside>` and `<proof>` continue to default to `true` — no behavior change for existing documents.

Closes #1393.
