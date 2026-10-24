---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A single click in a graph on overlapping objects that are listed in the same `triggerWhenObjectsClicked` (a label on top of a rectangle, say) now runs the action once, where it used to run it once for each object. The same holds for `triggerWhenObjectsFocused`. Separate actions on overlapping objects still each run.
