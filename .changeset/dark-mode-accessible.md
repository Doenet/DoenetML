---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Dark mode: make it actually work and meet WCAG AA.

- The viewer/editor now own the theme: the `darkMode` prop accepts
  `"light" | "dark" | "system"` (system tracks `prefers-color-scheme` live) and
  the resolved theme is written to a `data-theme` attribute on the viewer/editor
  root, so the canvas/text/JSXGraph-axis CSS variables actually switch. Stray
  `.dark` selectors and portaled popovers (variant select, description,
  hint/solution/feedback reveal buttons) were unified onto `[data-theme]`.
- Style definitions now derive an accessible dark-mode color (and color word)
  from an author's light-mode color instead of mirroring it: the derived
  `*ColorDarkMode` preserves hue and is lightened until it clears WCAG AA against
  the dark canvas. Author-supplied dark-mode colors that fail AA now emit an
  accessibility diagnostic, mirroring the existing light-mode check.
- The six built-in style presets had their dark-mode colors recomputed to meet
  WCAG AA.
- Fixed renderer pieces that went invisible (or low-contrast) on the dark
  canvas: math notation lines (fraction bars / square-root vincula in
  `<mathInput>`), the `<mathInput>` insertion caret (#397), the JSXGraph
  keyboard-focus outline (#396), editable `<curve>` through/control-point
  handles, draggable polygon/polyline vertex highlights, the
  `<summaryStatistics>` table border, the `<orbitalDiagram>` and
  `<subsetOfRealsInput>` number-line graphics, the on-canvas (unchecked)
  graph-control toggle buttons, and the inline `<choiceInput>` dropdown (control
  and the portaled menu, which is given an elevated dark surface) — all now
  track the theme via `--canvasText` / `--canvas` (or doc-level dark mode for
  the portaled menu).
- Added dark-mode accessibility (cypress-axe) coverage across renderer
  categories, plus computed-style regression tests for the caret, focus outline,
  and fraction bar.

Closes #966 (complete dark mode), #396, #397. Contributes dark-mode contrast
coverage toward #1324.
