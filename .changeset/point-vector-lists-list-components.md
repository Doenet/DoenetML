---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<pointList>` and `<vectorList>` now keep their points and vectors in one component, each drawn and dragged on its own as before, instead of making one `<point>` or `<vector>` component per item. Points and vectors written as text, such as `<pointList>(1,2) (3,4)</pointList>`, make no component at all. A `<point>` or `<vector>` written among the items, or a reference such as `$P`, is now drawn with its own label and style, and whether it is hidden or draggable, and an authored `<vector>` keeps its own tail. A constraint among the children of a `<pointList>`, such as `<constrainToGrid/>`, now constrains every point in the list. All the items of a list have the same number of coordinates, and an item with fewer now has 0 in the ones it lacks, where it used to be blank. A coordinate past the items' dimensions, such as `$pl.xs[3]` of points in the plane, reads a blank for each item, where it used to read nothing. A drag of an item written as text is saved with the list; a state saved before this change does not restore it.
