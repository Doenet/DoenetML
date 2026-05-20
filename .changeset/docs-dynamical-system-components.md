---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add reference documentation pages for `<cobwebPolyline>`, `<eigenDecomposition>`, `<equilibriumCurve>`, `<equilibriumLine>`, `<equilibriumPoint>`, and `<rightHandSide>`. Editor context-sensitive help now links to a reference page for these components instead of treating them as undocumented (six `docsSlug` entries in the generated schema flipped from `null` to the new slugs).
