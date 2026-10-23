---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Slider: send values from the slider's current `from`, `step`, and items.

A slider turned its handle position into a value using the `from`, `step`, and items it had when it first appeared. If those changed later, moving the slider sent a value from the old range, so the slider seemed stuck or jumped to the wrong value. It now uses the current settings.
