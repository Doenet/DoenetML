---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: click-to-navigate now requires Cmd+click (macOS) / Ctrl+click (Windows/Linux), like go-to-definition, so plain clicks interact with the document without moving the editor.

- Preview → editor (both the VS Code preview panel and `DoenetEditor`): navigation to an element's source fires only with the modifier held, including clicks on graph boards, margins, and individual graph elements (Cmd/Ctrl+Enter is the keyboard equivalent on a focused graph element). The element's normal click behavior still fires alongside navigation.
- `DoenetEditor` editor → preview: the debounced follow-the-cursor scroll is replaced by Cmd/Ctrl+click on a spot in the source, which scrolls the preview to the element rendered from that offset. Typing and plain cursor moves never scroll the preview. `Cmd/Ctrl+Alt+P` does the same for the cursor's position, so the gesture is reachable without a mouse. The code editor otherwise reads that same modifier as "add another selection range", so mouse-driven multiple selections are turned off in it: the gesture leaves a single cursor where you clicked, and extra cursors now come from `Cmd/Ctrl+D` instead.
- VS Code editor → preview keeps following the cursor, as it does today, since the VS Code API exposes no mouse modifiers for editor clicks and so has no way to spell the web editor's Cmd/Ctrl+click gesture. Two additions: a `Scroll Doenet Preview to Cursor` command bound to `Ctrl+Alt+P` (`Cmd+Alt+P` on macOS), rebindable from the Keyboard Shortcuts UI and the same chord as the web editor — on macOS that chord otherwise toggles the find widget's Preserve Case, which the new binding takes over while the text of a Doenet file has focus; and a `doenet.preview.scrollPreviewWithEditor` setting (default on, like VS Code's own `markdown.preview.scrollPreviewWithEditor`) that turns the cursor-following off, leaving the command as the only thing that moves the preview.
- For host apps driving `DoenetViewer` directly: `onSourcePositionClick` now fires only for modified clicks, so a host no longer has to filter plain ones out itself. `scrollToSourceOffset` is unchanged for hosts that drive it from a moving cursor, but a host that drives it from a discrete gesture should set it back to `null` between requests, so that repeating the same offset scrolls again.

Since touch devices have no modifier key, click-to-navigate is unavailable on touch.
