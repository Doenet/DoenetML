---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give `<chart>` several series, a title and a legend.

```xml
<chart type="bar" categories="North South East West" layout="grouped">
  <title>Population by region</title>
  <shortDescription>Population by region, 2024 against 2025</shortDescription>
  <yLabel>people</yLabel>
  <series><label>2024</label>41 63 18 78</series>
  <series><label>2025</label>45 60 22 80</series>
</chart>
```

`<series>` is one group of the data. Every standard statistical plotting package describes a chart the same way — data, a mark, and encodings that map the data onto position and color — and this is that shape in markup: `type` is the mark, a `<series>` is the group the color encoding splits on, and its children are the values. That is what lets the chart types still to come take the data each of them needs: one value per category for a bar or a line, a column of observations for a box plot or a histogram.

A chart written with bare values and no `<series>` has one unnamed series holding them all, so a simple chart stays as simple as it was.

A series carries its own `<label>`, which names it in the legend, and its own `styleNumber`. Series take consecutive style numbers unless one names its own, so several groups come out in different colors without being asked to; `<chart styleNumber="3">` starts its series at 3, and a chart of one series is drawn in exactly the style the chart asked for.

`layout` says how the series share a category's slot. `grouped`, the default, stands them side by side and divides `barWidth` between them, so the bars can be compared across categories and across series alike; `stacked` puts them one above another so each slot shows its total, with negative values stacking downward from the baseline rather than through the positive ones.

A `<title>` child is drawn above the chart, inside the picture rather than beside it, so it survives being printed or exported — and it becomes the caption of a tactile rendering, which no text placed around the chart could do.

The legend is drawn as soon as a series has a label, keyed off the bars themselves so its swatches cannot disagree with the colors they name. `legend="false"` suppresses it, and `legendPosition` says where it goes: **outside the plot to the right by default**, in a margin widened to hold it, which is where ggplot2 and Vega-Lite put one and is the only placement that cannot cover the data — a legend three series deep occupies the top third of the plot's right-hand edge, which any chart with tall bars on the right will reach. `outsideBottom` spends height instead of width. The four inside corners — the same names `<legend>` already uses inside a `<graph>` — spend neither and may overlap, which is the author's choice to make. `$chart.showLegend` reports whether a legend is drawn rather than whether one was asked for, so it is false for a chart whose series carry no labels and for one whose named series have no value that could be drawn.

A screen reader now walks the chart series by series and then bar by bar within a series, instead of meeting every bar of every group as one flat list.

`$chart.values` is every value in the chart, series by series; `$chart.numSeries` says how many groups there are, and a named `<series>` reports its own `values` on its own.

Values written beside a `<series>` belong to no group and are not drawn, which is now reported rather than left to be inferred from a missing bar.

`hide` works on a `<series>` and on a chart's `<title>`, which it previously did not: a hidden series is left out of the chart entirely — out of the drawing, out of `values`, out of `numSeries` — the way a hidden `<point>` is left out of a `<graph>`, while still reporting its own values through its own name. Hiding a series does not recolor the ones after it.

A series the author did not label is announced to a screen reader as "series 2" rather than as a bare "2", which was indistinguishable from the categories and values announced on the levels either side of it. The phrase is localized, so it is not English generated in the worker.

A stacked chart whose segments total more than a double can hold is now drawn against the top of its frame, rather than coming back from PreFigure with the overflowing part of it missing, and `displayValues` labels are drawn over every bar rather than under the segment stacked above them.

The reference page is reorganized around this, and the sampling-simulation walkthroughs that were on it move to a new **Charting a Simulation** guide. `<chart>` also gains its first browser tests, covering the renderer hand-off, the build request, the framing, and screen-reader navigation of the series.

Part of #437.
