---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Dark mode: theme the virtual keyboard.

With `darkMode="dark"` the virtual keyboard now renders in dark mode in the viewer, editor, and iframe wrappers: the tray, key faces, special keys, focus-ring offset, and tab indicator all switch to dark-surface colors. The tray receives `data-theme` directly on its `#virtual-keyboard-tray` element so the theme is applied even though the tray portals to `document.body` outside the viewer's `data-theme` wrapper. When multiple documents share the singleton tray, it now follows the active document's resolved theme instead of whichever one mounted last. All dark-mode keyboard colors meet WCAG AA contrast.

Closes #1367.
