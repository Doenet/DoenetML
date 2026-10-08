---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An unlinked copy (`copy="$m"`) now keeps the value it was made with, and whether it was fixed, after the page is reloaded, even when its source has changed since; before, a reload made it again from its source as it was then. Saved state grows only for copies whose source has changed.
