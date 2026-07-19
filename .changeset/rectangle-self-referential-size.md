---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Graphing: a `<rectangle>` that binds one of its sizes to the other, such as `<rectangle name="R" width="4" height="$R.width" />`, can now be dragged and resized.

Previously, dragging such a rectangle could leave it pinned along one axis, and dragging a corner resized it in unpredictable ways rather than following the pointer. It now translates freely, and dragging a corner resizes it while keeping it square. This applies whether the rectangle is anchored on a center, on a specified vertex, or on neither.

Rectangles without a self-referential size are unaffected.
