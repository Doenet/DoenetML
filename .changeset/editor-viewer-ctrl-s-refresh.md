---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Ctrl/Cmd+S now refreshes pending source edits when focus is anywhere in the editor-viewer, including the rendered document, without triggering the viewer's Reset behavior when no code changes are pending.

The shortcut follows the platform convention used by the code editor — Cmd+S on macOS, Ctrl+S elsewhere — and ignores AltGr/Alt combinations so AltGr+S still inserts a character.
