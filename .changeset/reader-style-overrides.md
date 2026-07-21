---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Added a `styleOverrides` prop to `<DoenetViewer>` and `<DoenetEditor>` that lets a host application pass reader (end-user) style overrides — per-styleNumber remappings of colors and other style settings, e.g. colors a color-blind reader can better distinguish. Overrides win over everything authored in the document (`<styleDefinition>` and `<stylePalette>` alike), update live when the prop changes, never produce author-facing diagnostics, and keep text style descriptions truthful by re-deriving color words (with dark-mode colors derived from the reader's light-mode colors when not supplied). A reader can also switch the whole document to one of the built-in style palettes by name (e.g. `grayscale` for readers who distinguish styles by lightness alone): the reader's palette replaces all authored styling, style numbers beyond its size wrap around onto it, and per-styleNumber overrides apply on top. The format is exported as the `ReaderStyleOverrides` type.
