---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Added style palettes: named, coordinated sets of style definitions selectable with the new `<stylePalette>` component. The six standard styles are now the `default` palette, joined by seven new palettes: the colorblind-friendly `okabeito` (Okabe-Ito), `tolbright`, `tolmuted`, and `tolhighcontrast` (Paul Tol), and `ibm` (IBM Design Library), a pure-luminance `grayscale` palette for readers who distinguish styles by lightness alone, and `categorical` (ten maximally varied hues, the widest spread, not CVD-engineered) — all WCAG-checked in light and dark mode, with varied marker shapes and line styles and curated style-description color words. Every palette has at least four styles, and the documentation now advises reserving style numbers 1-4 for the most important distinctions. Style number 1 always renders text in the ordinary document text color, so selecting a palette never recolors prose that specifies no style number. A palette selection scopes to its containing section and resets that subtree's base styles; `<styleDefinition>` overrides still apply on top, and style numbers beyond the palette's size cycle through the palette. Palette names autocomplete in the editor, and the context-help panel resolves styles palette-aware.
