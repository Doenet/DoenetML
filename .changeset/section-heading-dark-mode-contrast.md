---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: fix boxed and collapsible section heading colors in dark mode.

Boxed and collapsible section titles now use accessible dark-mode defaults instead of reusing the light-mode gray/green heading backgrounds, and authors can override those colors with `completedColorDarkMode`, `inProgressColorDarkMode`, and `notStartedColorDarkMode`.
