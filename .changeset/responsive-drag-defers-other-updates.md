---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Keep a dragged object tracking the pointer on documents where moving it changes much of the page.

While a drag is in progress, the dragged object's own position goes to the screen first, and everything else the move changed — other points, readouts, a table of tallied values — follows once the drag pauses or ends. Previously each intermediate position redrew everything the move touched before the dragged object itself could appear, so on a document whose components depend on one another the object trailed the pointer, by as much as a second.

The dragged object's own position is exact on every step — computed, not estimated, so constraints and snapping still apply as you drag. What waits is the redrawing of everything downstream, and the recomputation that redrawing drives: a value feeding something not being drawn yet is left until it is. A visible effect is that objects arranged by the dragged one — points stacked by rank, for instance — hold their old arrangement until the drag pauses, then settle together. The deferred work always completes on release, so nothing is left stale.

This applies to every dragged object in a graph, to sliders, and to typing in a math input, text input or code editor: anything on the page that shows what you are typing as you type now catches up when you pause rather than on every keystroke.
