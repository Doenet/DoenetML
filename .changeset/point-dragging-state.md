---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add a `dragging` property to `<point>`: it is true while the point is being dragged and false otherwise, so an author can show something only during a drag, such as `<lineSegment hide="not $P.dragging" …/>` for guide lines to the axes.

The property turns on with the first movement of a drag and turns off when the point is released (or when a click ends a drag that never moved far enough to count). A point moved with the keyboard counts as dragging until the move is committed. The value is not saved with the reader's work, so a reload in the middle of a drag does not come back with the point stuck in the dragging state.
