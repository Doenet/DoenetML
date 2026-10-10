---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Dragging a point in space whose coordinates are written with a reference and numbers, such as `<point>($a, 2, 3)</point>`, again moves every coordinate. Its `z` had stayed where it was.
