---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `diagnosticsSummaryCallback` in `DoenetEditor` to fire once per diagnostics update, including when the counts are unchanged. Previously the effect was keyed off a memoized counts object, so a viewer re-run that produced the same counts would silently skip the callback. Inline callbacks are now tracked through a ref so they don't refire the effect on every parent render, and `initialDiagnostics` defaults to a stable reference so unrelated parent re-renders don't refire downstream memos and effects.
