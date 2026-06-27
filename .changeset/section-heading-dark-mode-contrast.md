---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: fix boxed and collapsible section heading colors in dark mode.

Boxed and collapsible section titles now use accessible dark-mode defaults instead of reusing the light-mode gray/green heading backgrounds. Authored concrete light-mode heading colors now derive accessible dark-mode heading colors automatically, while authored CSS-variable colors fall back to the accessible dark-mode defaults unless authors override them explicitly with `completedColorDarkMode`, `inProgressColorDarkMode`, and `notStartedColorDarkMode`. Accessibility diagnostics now also flag authored section heading colors that fall below WCAG AA contrast in either theme, including translucent colors after compositing.
