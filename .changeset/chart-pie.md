---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<chart type="pie">`.

```xml
<chart type="pie" categories="North South East West">
  <shortDescription>Population by region</shortDescription>
  41 63 18 78
</chart>
```

One slice per value, each one that value's share of the total. The slices run clockwise from twelve o'clock in the order the values are given, rather than sorted by size, so a pie beside a bar chart of the same data reads as the same data. `categories` names them.

The shares are taken against the largest value rather than against the sum, which is the only way the ratios survive data at the top of the double range: a sum saturates there, and two values of `1e308` drawn as shares of a saturated total came out as a 200-degree slice beside a 160-degree one. Ordinary data is unaffected: the ratios are the same in exact arithmetic, and the angles agree to within the last of the twelve digits one is written to.

A pie is the one chart with no axes, so it reads neither `xMin`/`xMax` nor `yMin`/`yMax`, and `$chart.xMin` and the other three report nothing for one. An `<xLabel>` or `<yLabel>` has no axis to name either: it is not drawn, and the chart says so rather than dropping the text in silence — put it in a `<title>` instead. A pie is also the one chart that colors *within* a series: its slices are what a reader tells apart, so each takes the next `styleNumber` in turn. The run starts at the drawn series' own number, so `<series styleNumber="4">` draws a pie's first slice in the style a bar chart of that same markup draws its bars in, and the slices after it continue from there.

The slice names go in the legend, and around the rim at each slice's middle when `legend="false"` leaves no legend to hold them — so they are always somewhere. `displayValues` prints each value beyond the rim, beside its slice's name where that is there too, which keeps a pie's text off its marks the way every other type already keeps it off theirs: a value inside a slice is unreadable against a dark fill, and against a patterned one there is no single color that would read.

Four things a pie can be asked to draw and cannot, each reported on its own because the fix for each is different: a value that is not a finite number, a negative value (a slice is a share of a total, and a pie has no baseline for one to hang from), values that total zero, and more than one `<series>` — a pie draws the first and says so. A value left out is left out of the total as well, so the remaining slices are shares of what was actually charted. A value of zero is a share of nothing and gets no slice, but keeps its place in the run of colors.

Every slice carries its name and value as an annotation, so a pie is navigable by screen reader like every other chart.

Closes #1879.
