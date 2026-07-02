---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

fix: convert remaining hardcoded light-mode colors in renderers to dark-mode-aware CSS variables

Fixes all remaining DoenetML renderer elements that displayed poorly or fell below WCAG AA contrast in dark mode after PR #1381. Replaces hardcoded colors with new theme variables (`--errorText`, `--indicatorHoverBlue`, `--buttonHoverBlue`, `--doenetTagColor`) and dark-mode values for the existing `--lightBlue/Green/Red/Orange` hover variables.
