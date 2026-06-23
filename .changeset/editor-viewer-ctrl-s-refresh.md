---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Ctrl/Cmd+S now refreshes the rendered viewer when focus is anywhere in the editor-viewer, including the rendered document (previously the shortcut only fired when focus was in the code editor panel).

The shortcut follows the platform convention used by the code editor — Cmd+S on macOS, Ctrl+S elsewhere — and ignores AltGr/Alt combinations so AltGr+S still inserts a character.
