---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: fix the code editor's text-selection highlight so highlighted (selected) text stays legible, especially in dark mode.

The selection highlight was rendering with CodeMirror's built-in light lavender (`#d7d4f0`) in every mode: the theme's own selection rule never took effect (CodeMirror's base theme targets the selection with a higher-specificity selector), and the editor was never told it was in dark mode, so it also fell back to CodeMirror's light-mode defaults. On the dark canvas the near-white and brightly-colored syntax tokens were then washed out under the pale highlight — and clicking away from the editor made it worse, reverting the blurred selection to the base light-gray default.

The dark-mode selection is now a dark navy (`#092c4d`) that keeps every syntax token — down to the dim comment gray — at WCAG AA contrast (≥ 4.5:1) while still reading as a selection, and light mode now correctly uses its intended neutral gray. The override matches CodeMirror's base-theme selector for both the focused and blurred states, and the theme now passes the real brightness to CodeMirror so its base defaults align.

Adds `@doenet/codemirror` Cypress component tests (`selectionAccessibility.cy.tsx`) that select highlighted code and assert the WCAG contrast between each rendered token color and the actual selection-background color, in light mode, dark mode, and after the editor is blurred. (`cy.checkA11y` can't be used for this: axe-core cannot resolve CodeMirror's separate selection layer / `::selection` pseudo-element and instead compares tokens against a phantom white background.)
