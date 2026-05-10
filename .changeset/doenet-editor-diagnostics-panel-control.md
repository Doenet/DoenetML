---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add programmatic control of the `<DoenetEditor>` diagnostics/responses panel:

- New `initialOpenTab` prop opens the panel on the given tab when the editor mounts. Valid IDs: `"errors" | "warnings" | "info" | "accessibility" | "responses"`.
- `<DoenetEditor>` now accepts a `ref` exposing a `DoenetEditorHandle` with `openDiagnosticsTab(tabId)` and `closeDiagnosticsPanel()` for runtime control.
- The iframe wrapper (`@doenet/doenetml-iframe`) supports the same prop and ref handle, with calls made before the iframe finishes loading queued and replayed on ready.
