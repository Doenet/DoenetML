---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Graphing: a `<rectangle>` that binds one of its sizes to the other, such as `<rectangle name="R" width="4" height="$R.width" />`, can now be dragged and resized.

Previously such a rectangle could not be moved off the axis its bound size referenced, and dragging a corner resized it in unpredictable ways rather than following the pointer.

Setting a rectangle's width or height drives that size attribute's inverse. When the attribute refers back to the rectangle's own other dimension, that request came around again and re-derived the corners from the rectangle's pre-update center, overriding whatever the drag was doing to its position. A rectangle now leaves an unchanged width or height alone, so translating it — which changes neither size — triggers no write-back at all; and it establishes its width and height before its position, so a drag wins over the stale position that a write-back derives.

A rectangle bound this way now translates freely, and dragging a corner resizes it about the opposite corner while keeping it square. Rectangles without a self-referential size are unaffected.
