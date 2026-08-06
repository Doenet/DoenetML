---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix illegible link and text contrast in an image's description panel, especially in dark mode.

The attribution links generated from `licenseCodes` (and from `authorName`/`imageName`) were plain anchors with no color of their own, so they fell through to the browser's `#0000EE` — 1.2:1 against the dark panel, and worse once visited. `<ref>` links used `--mainBlue`, which is identical in both themes and reached only 1.6:1. Links now use a new `--linkText` custom property that differs per theme.

The panel also painted surfaces of its own (`--revealButtonSurface` for `<details>`, a hardcoded `hsl(204 4% 16%)` for the popover) rather than the canvas. Style-definition contrast is checked statically against the canvas, so authored text colors could clear that check and still be unreadable inside the description. Both surfaces now use `--canvas`/`--canvasText`, which makes the existing guarantee hold there. Since the panel no longer has a fill to set it apart, it is outlined with a new `--panelBorder` custom property that meets WCAG's 3:1 non-text contrast against the canvas.
