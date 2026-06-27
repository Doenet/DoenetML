---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: fix boxed and collapsible section heading colors in dark mode.

Boxed and collapsible section titles now use accessible dark-mode defaults instead of reusing the light-mode gray/green heading backgrounds. Authored light-mode heading colors now derive accessible dark-mode heading colors automatically, and authors can still override those values explicitly with `completedColorDarkMode`, `inProgressColorDarkMode`, and `notStartedColorDarkMode`.
