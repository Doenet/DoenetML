---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graphs: improve the visual hierarchy of `grid="medium"`, `grid="dense"`, and defined-step grids such as `grid="1 1"`.

Medium and dense grids now use the axis major-tick spacing, while dense grids additionally render minor grid lines. Defined-step grids continue to use their authored x/y spacing. The renderer creates and synchronizes each grid through a single path, so switching among grid modes or changing the effective axis tick spacing updates the displayed grid correctly.

Grid lines use fixed light- and dark-theme color tokens at full opacity to provide approximately 3:1 contrast against the graph canvas. Axes, tick marks, and axis labels use separate tokens at just over 4.5:1 contrast. Dense grids retain minor axis tick marks when ticks are enabled. These fall within the WCAG 2.1 AA specifications.

Additionally, this change adds Cypress regression coverage that verifies the browser's resolved rendered colors and contrast ratios for medium, dense, and defined-step grids in light and dark themes.
