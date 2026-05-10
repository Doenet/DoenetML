---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Exclude properties derived from `excludeFromSchema` attributes. When an attribute is marked `excludeFromSchema: true` and creates a companion state variable via `createStateVariable`, that state variable is now also excluded from the schema. This stops `collaborateGroups`, `modifyIndirectly`, and `permid` from leaking into autocomplete and context-help despite their backing attributes already being hidden. Tracked in #1089.
