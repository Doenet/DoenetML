---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Added style palettes: named, coordinated sets of style definitions selectable with the new `<stylePalette>` component. The six standard styles are now the `default` palette, joined by eight more — the colorblind-friendly `okabeIto` (Okabe-Ito), `tolBright`, `tolMuted`, and `tolHighContrast` (Paul Tol), and `ibm` (IBM Design Library); a pure-luminance `grayscale` for readers who distinguish styles by lightness alone; and `categorical` (ten maximally varied hues) and `grumpyNarwhal` (six saturated hues that go neon in dark mode) for documents that need many obviously different styles. Every palette is WCAG-checked in light and dark mode, varies marker shapes and line widths alongside colors, and carries curated style-description color words.

A palette selection scopes to its containing section and resets that subtree's base styles; `<styleDefinition>` overrides still apply on top, and style numbers beyond the palette's size cycle through the palette. Every palette has at least four styles, and the documentation now advises reserving style numbers 1-4 for the most important distinctions. Style number 1 always renders text in the ordinary document text color, so selecting a palette never recolors prose that specifies no style number. Palette names autocomplete in the editor, and the context-help panel resolves styles against the active palette.
