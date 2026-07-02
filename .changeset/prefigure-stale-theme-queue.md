---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: prevent stale queued theme updates from overriding the current theme after reinitializing with Ctrl+S.

This fixes prefigure graphs and other theme-sensitive rendering after switching between light and dark mode without a full page reload.
