---
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

VS Code extension: render math in dark mode.

The preview window passed a boolean `darkMode` to `DoenetViewer`, but the viewer expects the string `"dark"` or `"light"`. Because the renderers compare `darkMode === "dark"`, the boolean always fell through to light-mode colors, so math inside `<m>`/`<math>` was drawn in the light-mode text color (black) and was invisible against VS Code's dark themes. The preview now passes `darkMode={darkMode ? "dark" : "light"}`.
