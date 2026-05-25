---
"@doenet/doenetml-iframe": patch
---

Defer `iframeReady` in the iframe-editor/iframe-viewer modules until the standalone bundle has actually defined the render function the parent will subsequently invoke (`window.renderDoenetEditorToContainer` / `window.renderDoenetViewerToContainer`).

Previously `iframeReady` was sent at module top-level, immediately after `Comlink.expose` and before the separately-loaded ~32 MB standalone bundle had a chance to evaluate. The parent's `iframeReady` listener immediately Comlink-calls `renderEditorWithFunctionProps` (or `renderViewerWithFunctionProps`), which in turn calls the `window.render…ToContainer` function; on a slow boot that threw because the bundle wasn't loaded yet, and the wrapper catches Comlink rejections silently (`.catch(logComlinkError(...))`), so the editor/viewer silently never mounted. Gating `iframeReady` on the postcondition the parent will rely on closes the race.

The existing `DOMContentLoaded` handler that polled for ~1 s — and whose Editor variant had a Viewer/Editor function-name typo — is replaced by an async IIFE that polls for up to 60 s. The longer window covers slow CI boots of the second iframe document in the wrapper's srcDoc-rebuild path, and matches the test budget in `DoenetEditor.srcDocRebuildReplay.cy.tsx`. If the function never appears within that window the iframe sends the same `{error: "Invalid DoenetML version or DoenetML package not found"}` message it would have before.
