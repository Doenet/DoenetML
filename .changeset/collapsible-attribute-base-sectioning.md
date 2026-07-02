---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

feat: add `collapsible` and `startOpen` attributes to all sectioning components.

Previously, `collapsible` was hardcoded to `false` in the base sectioning component and only `<aside>` and `<proof>` exposed it as a user-settable attribute (defaulting to `true`). All other sectioning components (`<section>`, `<example>`, `<theorem>`, etc.) could not be made collapsible by the author.

`collapsible` is now declared on the base `SectioningComponent` with a default of `false`, so every sectioning component inherits the attribute. The shared `startOpen` attribute now also applies to every sectioning component: it defaults to `true` in the base class, while `<aside>` and `<proof>` continue to default to `collapsible="true"` plus `startOpen="false"` — no behavior change for existing documents.

Closes #1393.
