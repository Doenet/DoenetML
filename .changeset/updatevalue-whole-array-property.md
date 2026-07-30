---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`<updateValue>` can now set a property that holds a whole list of coordinates, such as a vector's `tail`, `head`, or `displacement`.

Targeting one of these did nothing before: `<updateValue target="$v.tail" newValue="(7,8)" />` left the vector where it was, and the only way through was to update `tail.x` and `tail.y` separately from a `<triggerSet>`. The new value's components are now spread across the property's entries, so a single `<updateValue>` moves the tail, head, or displacement.

Setting a property this way makes the same change as dragging a point that extends it — `<point extend="$v.tail" />` — rather than the same change as dragging the vector's own tail handle, which additionally holds the head in place.

The same applies to other one-dimensional coordinate properties, including a `<point>`'s `xs` and a `<circle>`'s `center`. Properties holding a list of points, such as a `<polygon>`'s `vertices`, are unchanged.

Closes #1529.
