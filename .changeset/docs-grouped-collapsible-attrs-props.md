---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Docs: group attributes and properties on component reference pages into collapsible sections — a curated "Highlighted" group (open by default), functional groups (e.g. number display, labels), an "Other" group, and a "Common to all components" group that surfaces the previously hidden `BaseComponent` attributes. Adds a filter box, a Reveal/Collapse-all toggle, and links from each listed attribute/property to its worked example (including examples on other pages of a multi-page reference).

Drives the grouping with optional, docs-only `groupName`/`highlighted` metadata on attribute definitions and public state variables, threaded into the generated schema.
