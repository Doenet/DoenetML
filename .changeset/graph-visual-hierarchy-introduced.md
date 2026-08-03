---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Graphs: introduce a visual hierarchy for grid lines, axes, and labels.

Graph rendering no longer paints all graph elements with `--canvasText`.
Grid lines now use `--graphGrid`, while axes and tick labels use
`--graphAxes`; graph navigation controls continue to use `--canvasText`.

This improves visual distinction between graph structure and primary
content in both light and dark themes while preserving readability and
accessibility.

Added Cypress regression coverage to verify the hierarchy remains applied
to axes, tick labels, grid lines, and navigation controls in both themes.