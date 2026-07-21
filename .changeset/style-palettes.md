---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Added style palettes: named, coordinated sets of style definitions selectable with the new `<stylePalette>` component. The six standard styles are now the `default` palette, joined by the new `okabeito` (colorblind-friendly, based on the Okabe-Ito palette), `ocean`, and `sunset` palettes (eight styles each, WCAG-checked in light and dark mode, with varied marker shapes and line styles). A palette selection scopes to its containing section and resets that subtree's base styles; `<styleDefinition>` overrides still apply on top, and style numbers beyond the palette's size cycle through the palette. Palette names autocomplete in the editor, and the context-help panel resolves styles palette-aware.
