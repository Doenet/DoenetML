---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`diagnosticsSummaryCallback` on `DoenetEditor` and `setDiagnosticsCallback` on `DoenetViewer` now receive a second argument, `doenetML`, containing the source string the viewer was rendering when those diagnostics were produced. Consumers can use this to correlate diagnostics with the document version that triggered them rather than the (potentially newer) editor buffer. Existing single-argument consumers remain valid — passing a callback with fewer parameters than the declared signature is still allowed by TypeScript.
