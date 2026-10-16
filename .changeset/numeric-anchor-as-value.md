---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graphs with many labels, maths, numbers or texts placed by an `anchor` written as numbers, such as `anchor="(2,3)"`, load faster and use far less memory. Such an anchor used to be built as a point holding a list of two maths; it is now kept as the coordinates the author wrote. Dragging the anchored item, and saving and restoring where it was dragged, work as before.
