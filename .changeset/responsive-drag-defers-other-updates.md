---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Keep a dragged object tracking the pointer on documents where moving it changes much of the page.

While a drag is in progress, every graph on screen redraws with each step: the dragged object, and everything on a visible graph that the move changed, such as a line through a dragged point or a second graph that follows the first. Everything else the move changed, such as readouts, a table of tallied values, or graphs out of view, follows once the drag pauses or ends. Previously each intermediate position redrew everything the move touched before the dragged object itself could appear, so on a document whose components depend on one another the object trailed the pointer by a noticeable fraction of a second.

Positions on a visible graph are computed on every step, not estimated, so constraints and snapping still apply as you drag. What waits is the redrawing of what is off the visible graphs, and the recomputation that redrawing drives. Everything on screen is complete on release, and what is out of view follows moments later, so nothing is left stale.

This applies to every dragged object in a graph, to sliders, and to dragging the points of a number line (`<subsetOfRealsInput>`). Typing is deliberately left alone: what an input shows, and the feedback beside it, still keep up with every keystroke.
