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
  `.dark` selectors, description surfaces, hint/solution/feedback reveal
  buttons, and portaled popovers were unified onto `[data-theme]`. The `darkMode`
  prop now defaults to `"system"` (previously `"light"`), so an embedded
  `DoenetViewer`/`DoenetEditor` follows the user's OS/browser theme preference
  unless the host pins a theme.
- Style definitions now derive a dark-mode color (and color word) from an
  author's light-mode color instead of mirroring it. Graphic/marker/line colors
  are lightened until they clear WCAG AA against the dark canvas where possible
  at their rendered opacity. A
  `textColor`/`backgroundColor` is adapted by inverting each color's lightness
  independently (so e.g. white-on-black becomes black-on-white). Because each
  color is derived from itself alone, the result is independent of the order in
  which the colors were authored and of whether they were split across
  parent/child style blocks, and it preserves the author's figure/ground
  relationship without "fixing" an intentionally low-contrast pairing. When an
  otherwise-accessible light-mode text color (or text/background pair) happens
  to invert to an inaccessible dark-mode value, an accessibility diagnostic is
  emitted (with a suggested `textColorDarkMode`/`backgroundColorDarkMode` value,
  targeting the attribute the diagnostic is anchored to, that restores
  sufficient contrast).
  Author-supplied contributors to the rendered contrast (including backgrounds,
  opacity, and `*ColorDarkMode` values) that fail AA likewise emit a diagnostic,
  mirroring the existing light-mode check.
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
- The editor's diagnostic hover tooltip (including the accessibility-contrast
  warnings) used CodeMirror's light default surface, so its text rendered
  white-on-white in dark mode; it now uses an elevated dark surface with
  recolored, AA-legible heading/code accents.
- The PreFigure renderer (`<graph renderer="prefigure">`) is now dark-mode
  aware: the generated diagram XML depends on the document theme, so line,
  marker, and fill colors use their derived dark-mode values, and the axes/ticks
  (which PreFigure draws black by default, invisible on the dark canvas) get a
  light stroke matching the JSXGraph axes. Tick labels are MathJax
  `currentColor` and already follow `--canvasText`.
- Added dark-mode accessibility (cypress-axe) coverage across renderer
  categories, plus computed-style regression tests for the caret, focus outline,
  and fraction bar.

Closes #966 (complete dark mode), #396, #397. Contributes dark-mode contrast
coverage toward #1324.
