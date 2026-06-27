---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix light-mode WCAG AA contrast for built-in style presets 1, 3, and 6.

Preset line/marker colors for styles 1 (blue), 3 (orange), and 6 (gray) sat
below the WCAG AA graphic threshold (3:1) in light mode when composited at
their 0.7 opacity over the white canvas. The colors are darkened (hue and
saturation preserved) to just clear 3:1:

- Style 1: `#648FFF` → `#1f5dff` (2.11 → 3.08)
- Style 3: `#F19143` → `#a6510c` (1.82 → 3.11)
- Style 6: `gray`    → `#636363` (2.43 → 3.12)

Dark-mode variants (`*ColorDarkMode`) are unchanged — those were already
fixed in the dark-mode PR. `fillColor` for each preset is updated to match
the new line/marker color for visual consistency.

The updated light-mode blue (`#1f5dff`) and orange (`#a6510c`) are also
registered with the style-color-word resolver so editor/LSP help continues
to describe presets 1 and 3 as blue and orange rather than purple/brown.

The preset palette accessibility test (`presetPaletteAccessibility.test.ts`)
is extended to assert WCAG AA compliance in light mode too (mirroring the
existing dark-mode guard), closing the test gap identified in #1364.

Closes #1364.
