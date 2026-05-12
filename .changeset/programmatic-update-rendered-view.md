---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`DoenetEditorHandle` (the imperative ref handle on `<DoenetEditor>`) now exposes `updateRenderedView()`, the programmatic equivalent of clicking the editor's "Update" button. Consumers can call it before reading diagnostics to flush any pending edits from the editor buffer to the viewer, ensuring the next `diagnosticsSummaryCallback` reflects the current source rather than stale state. The method is a no-op when there is nothing to update (matching the visually-disabled button), and warns when invoked with `showViewer={false}`. The new method is plumbed through `@doenet/standalone`'s `renderDoenetEditorToContainer` handle and across the `@doenet/doenetml-iframe` ComLink boundary, including the same queue-and-replay treatment used for the existing `openDiagnosticsTab` / `closeDiagnosticsPanel` methods.
