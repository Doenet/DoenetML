---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix the `<fractionInput>` fraction bar (vinculum) not rendering on high-DPI displays.

The bar was drawn as a `border-bottom` on an empty, zero-height table cell inside a `border-collapse: collapse` table. On high-DPI (e.g. Retina) screens the browser snaps that collapsed hairline to the device-pixel grid and rounds it away to nothing, so the vinculum disappeared in Chrome, Safari, and Brave on those displays. It is now painted as a solid 2px-high block (`background-color: currentColor`), which rasterizes reliably at any `devicePixelRatio`.
