---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<chart type="histogram">`, the last of the six chart types.

```xml
<chart type="histogram" bins="-4 -3 -2 -1 0 1 2 3 4">
  <shortDescription>200 draws from a standard normal distribution</shortDescription>
  <yLabel>count</yLabel>
  $z
</chart>
```

One bar per bin, adjacent with no gap, over a numeric axis of cut points. Like `type="box"`, the `<series>` holds **raw observations**; where a box plot summarizes them into five numbers on their own scale, a histogram **counts** them, so it is the one type whose bars are measured in something the data does not contain — each bar is as tall as the number of observations that fall in its bin. The bars are adjacent because a histogram's positions are neighboring stretches of one continuous scale, where a bar chart's are separate things.

The binning happens in the worker rather than in the drawing, which is the whole reason PreFigure's own `<histogram>` is not used: `$chart.binCounts` is one number per bar and `$chart.binEdges` the cut points in order, so a document can state the intervals, put the counts in a table, or ask about them in an `<answer>` beside the picture. The counting is shared with `<binCounts>`, extracted so that a table of counts and a histogram of the same column cannot disagree on the page, and `closed` is read the same way there and here: `left` by default, so a bin runs `[a, b)`, with each outermost cut point belonging to its own bin either way, so an observation sitting exactly on the first or the last of them is counted. (An observation *beyond* the outermost cut points belongs to no bin; that is what the message below is for.)

`bins` takes either shape. One number is a number of equal-width bins and is used exactly — five bins are five bins, and `binCounts` reports five numbers. The one exception is a sample whose whole range is too narrow to divide, where the interpolated cut points would repeat: a column of two adjacent doubles asked for five bins gets the one bin those numbers support. Two or more are the cut points themselves, the same list `<binCounts>` takes. Written neither way, the cut points are chosen from the data: Sturges' rule sets a target number of bins, and the width is the span divided by that target, rounded *up* onto the 1, 2, 5 ladder, starting at a multiple of itself. Rounding up keeps the count at or below the target — ten values spanning 7 get four bins of 2 where Sturges asked for five — and both roundings are what make the cut points numbers a reader recognizes and a document can state. The horizontal axis is then labeled at those cut points, every k-th one where there are many bins, rather than at a step of its own.

A histogram draws one series, and says so where there are more: two samples counted into the same bars would have to be stacked or drawn through each other, and neither is a reading a histogram can be given without being told which was meant. Compare two samples as box plots, or by counting them with `<binCounts>` and drawing grouped bars — both are now recipes in the "Charting a Simulation" guide.

Each bar carries the stretch it covers and its count as an annotation, so a histogram is navigable by screen reader like every other chart, and the count is named in words for the same reason a box plot's five numbers are: three bare numbers in a row say nothing about which of them is measured up which axis. A bin nothing fell in is still drawn and still annotated — an empty bin is part of the shape of a distribution.

Seven things are reported rather than passed over in silence:

- an observation that is not a finite number, which falls in no bin;
- a series past the first, which is not drawn;
- a `bins` of one number that is not a whole number of bins from 1 to 1000, naming the value it was given;
- cut points that do not climb, or that are not all finite — a bar with no far end is not one a picture can hold, which is where this parts company with `<binCounts>`;
- an observation outside an author's own cut points, which is information rather than a warning: bins an author wrote may deliberately leave data out, and bins the chart chose always cover the data;
- `categories`, which a histogram has no positions for — its bars are named by the cut points they run between;
- `barWidth`, which a histogram has no gap to widen into.

The reference page now has a section per chart type, each saying what a series holds for it, and every attribute section says which types it affects. Closes #1881, #1882 and #437 — the six chart types that issue set out are now all shipped.
