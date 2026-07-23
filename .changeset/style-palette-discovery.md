---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Added a way for host applications to look up the available style palettes, so they can present readers a palette picker with swatches. `@doenet/doenetml` exports `getStylePalettes()` and `getStylePalette(name)`, returning each palette's name, description, and per-style resolved colors (light and dark), line/marker settings, and color words. The standalone bundle exposes the same functions as `window.getDoenetStylePalettes` / `window.getDoenetStylePalette` for pages that load it from a CDN. In `@doenet/doenetml-iframe`, `<DoenetViewer>` and `<DoenetEditor>` accept an `onStylePalettes` callback that reports the palettes of the standalone bundle actually booted in the iframe (`null` when that version is too old to provide them).
