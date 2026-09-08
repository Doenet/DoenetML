---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<chart type="line">` and `<chart type="scatter">`, and a numeric horizontal axis for them.

```xml
<chart type="scatter">
  <xLabel>height</xLabel>
  <yLabel>weight</yLabel>
  <series x="1.5 1.6 1.7 1.8"><label>control</label>55 62 70 79</series>
  <series x="1.5 1.6 1.7 1.8"><label>treated</label>58 66 72 84</series>
</chart>
```

The two types go together because they need the same thing and nothing else does: a horizontal axis that carries numbers. A bar chart labels its axis with one tick mark per category, at 1, 2, 3 — a category is a label and the spacing between them means nothing. A scatter plot's `x` is a measurement, so the distance between two points is part of what the chart says.

`<series x="…">` gives a series its horizontal coordinates, read against the values position by position. A value with no `x` beside it cannot be placed and is reported rather than drawn, which is what a series given fewer coordinates than values produces. One series carrying an `x` settles the axis for every series in the chart, so a series that gives none alongside one that does has no coordinates for any of its values and is reported the same way — placing it at 1, 2, 3 instead would put it by position on an axis measured in something else.

`type="line"` reads either kind of axis. Without an `x` its points sit under `categories`, exactly where a bar chart's bars sit, so `<chart type="line" categories="Mon Tue Wed">12 19 15</chart>` needs no coordinates at all; with an `x` the axis carries numbers. That is what makes one type serve both a time series and a category-by-category comparison. A scatter falls back the same way when no series carries an `x` at all — its points take the same slots, and with nothing joining them the chart reads as a dot plot down the categories. Points are never re-ordered — a path that doubles back is drawn as one, because a path through time is a real chart and sorting it would quietly draw something else.

A line draws a marker at each point unless `markers="false"`. The default is not only about how a short series reads: a marker is an element, and an element is what an annotation can point at, so with markers off a screen reader can reach the line but not walk it point by point. `displayValues` prints each point's value above it on a line or scatter chart as it does above a bar, and does so whether or not the markers are drawn.

`xMin` and `xMax` bound the horizontal axis, mirroring `yMin`/`yMax`, and report what the chart was drawn with. They apply only where the axis carries numbers; a bar chart, and a line or scatter chart no series of which carries an `x`, ignore them and report nothing for them.

Neither axis of a line or scatter chart is anchored to zero. A point is not a length measured from a baseline, so there is nothing for the axis to be measured from — forcing zero into the axis of a scatter of adult heights would push every point into a corner. A bar chart still always includes zero, because its bars are measured from it.

Part of #437.
