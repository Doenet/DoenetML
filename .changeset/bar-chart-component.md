---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<barChart>`, a chart of a list of values with named categories.

```xml
<barChart categories="North South East West" displayValues>
  <shortDescription>Population by region</shortDescription>
  <yLabel>people</yLabel>
  <number>41</number><number>63</number><number>18</number><number>78</number>
</barChart>
```

Bare numbers are read as bar heights, so `<barChart>41 63 18</barChart>` draws three bars without wrapping each in a `<number>`.

Categories are labels rather than values: the bars are evenly spaced whatever a category says, so `categories="1 5 6"` writes 1, 5, 6 under three equally spaced bars. They are read as text, so a number, a word, or a `<tally>`'s own `.categories` all name bars the same way — `<barChart categories="$counts.categories">$counts</barChart>` charts a tally with nothing else to write.

A value that is not a finite number gets no bar, and that is reported as a warning. Its place on the axis is kept, so the remaining bars stay under their own categories rather than shifting along.

The vertical axis scales itself: one tick above the tallest bar so it never touches the frame, and labeled values a whole number of steps from zero, which is the baseline the bars are measured from. `yMin` and `yMax` override it, and may each be set on their own. A value of zero keeps its slot and its category label, so a `<tally>` category nothing landed in does not drop out of the chart.

`size` and `width` and `aspectRatio` size a chart the way they size a `<graph>`, and `barWidth` is the fraction of its slot each bar fills. `barValues`, `categories`, `yMin`, `yMax`, `barWidth` and `aspectRatio` all read back off the chart, and the last four report **what it was drawn with** — the axis an automatic chart chose for itself, and the fallback used in place of a width or a ratio the chart could not honor.

Every bar carries its category and value as an annotation, so the chart is navigable by screen reader rather than merely present, and a `<shortDescription>` becomes the description of the figure as a whole. The chart renders through PreFigure, whose runtime is fetched the first time a page uses one; pages with no chart fetch nothing.

Closes #1833.
