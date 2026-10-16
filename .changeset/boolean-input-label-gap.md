---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Viewer: clicking the space between a boolean input's label and its checkbox now toggles the checkbox.

The space between them used to be margin on both sides, so a click there landed on neither and did nothing. The label now carries that space as padding, so its clickable area runs right up to the checkbox. The visible spacing is unchanged. An end label that follows a check-work button or description keeps its old spacing.
