---
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

VS Code extension: Keep the preview window's scroll position when the source is refreshed.

Previously, every refresh of the preview (saving the document, pressing Force
Refresh, or switching editors) rebuilt the rendered activity and reset the
preview's scroll position to the top. The preview now records its scroll
position when new source arrives and re-applies it while the viewer re-renders,
clamped to the content height (so a shorter document lands at its bottom rather
than jumping to the top). Restoration stops as soon as the user scrolls or
interacts with the preview, or after a few seconds.
