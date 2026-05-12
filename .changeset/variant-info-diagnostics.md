---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Surface variant-time validation messages as `info` diagnostics instead of writing them to the browser console. When a document can't compute unique variants (e.g. a `<select>` with `selectWeight` or `selectForVariants`, a `<selectFromSequence>` with non-integer `numToSelect`, or a `requestedVariantIndex` that isn't a finite integer), the explanation now appears in the editor's diagnostics panel and flows through `diagnosticsSummaryCallback` / `setDiagnosticsCallback` like any other info record, rather than being dropped into `console.log` where authors couldn't see it. The `<select>` component's messages also no longer claim to be from `selectFromSequence`.
