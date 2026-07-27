---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: click-to-navigate now requires Cmd+click (macOS) / Ctrl+click (Windows/Linux), like go-to-definition, so plain clicks interact with the document without moving the editor.

- Preview → editor (both the VS Code preview panel and `DoenetEditor`): navigation to an element's source fires only with the modifier held, including clicks on graph boards, margins, and individual graph elements (Cmd/Ctrl+Enter is the keyboard equivalent on a focused graph element). The element's normal click behavior still fires alongside navigation.
- `DoenetEditor` editor → preview: the debounced follow-the-cursor scroll is replaced by Cmd/Ctrl+click on a spot in the source, which scrolls the preview to the element rendered from that offset. Typing and plain cursor moves never scroll the preview.
- VS Code editor → preview is unchanged (cursor moves still scroll the preview, debounced): the VS Code extension API does not expose mouse modifiers for editor clicks.
- For host apps driving `DoenetViewer` directly: `onSourcePositionClick` now fires only for modified clicks, so a host no longer has to filter plain ones out itself. `scrollToSourceOffset` is unchanged for hosts that drive it from a moving cursor, but a host that drives it from a discrete gesture should set it back to `null` between requests, so that repeating the same offset scrolls again.

Since touch devices have no modifier key, click-to-navigate is unavailable on touch.
