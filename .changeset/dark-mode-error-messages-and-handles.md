---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Dark mode: keep viewer, editor, and iframe error states and graph UI legible.

Error banners, renderer-load failures, and editor footer menus now use theme-aware colors, graph drag handles now follow live dark-mode changes, and smart labels use dark-mode-aware colors on JSXGraph canvases. This also adds dark-mode accessibility coverage for disabled check-work buttons.
