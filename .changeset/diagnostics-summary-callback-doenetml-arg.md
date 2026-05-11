---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`diagnosticsSummaryCallback` on `DoenetEditor` now receives a second argument, `doenetML`, containing the source string the viewer was rendering when those diagnostics were produced. Consumers can use this to correlate diagnostics with the document version that triggered them rather than the (potentially newer) editor buffer. `setDiagnosticsCallback` on `DoenetViewer` is also widened to accept an optional `doenetML` source as its second argument; existing single-argument consumers remain valid.
