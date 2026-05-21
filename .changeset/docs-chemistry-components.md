---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add reference documentation pages for the chemistry components `<electronConfiguration>`, `<ion>`, `<ionicCompound>`, and `<orbitalDiagram>`. Editor context-sensitive help now links to these new pages instead of treating them as undocumented (four `docsSlug` entries in the generated schema flipped from `null` to the new slugs).
