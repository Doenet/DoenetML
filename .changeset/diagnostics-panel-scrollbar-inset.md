---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: remove the small gap between the diagnostics/help panel's scrollbar and the editor's trailing edge.

The inline padding that insets the panel text was applied to the panel's non-scrolling wrapper, so it pushed the scrolling element — and with it the scrollbar — in from the editor's edge. The padding now lives on the panel content instead, leaving the scrollbar flush against the resizer while the text keeps the same inset.
