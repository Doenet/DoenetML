---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Dark mode: keep viewer and iframe error states, graph handles, and JSXGraph labels legible.

Error banners and renderer-load failures now use theme-aware colors, graph drag handles keep their dark-mode colors and layering on first render, and smart labels plus disabled check-work controls stay readable on dark canvases.
