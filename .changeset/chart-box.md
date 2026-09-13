---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<chart type="box">`.

```xml
<chart type="box">
  <shortDescription>Scores by section</shortDescription>
  <yLabel>score</yLabel>
  <series><label>9am</label>52 61 63 68 70 71 75 78 84 91</series>
  <series><label>1pm</label>44 55 58 60 62 65 66 70 72 96</series>
</chart>
```

A box plot per series, side by side. This is the first chart type whose `<series>` holds **raw observations** rather than one value per category, and that turns the axis around: a whole series is now one position on it, which is what every plotting package means by `aes(x = group, y = value)`. So a box chart has no categories — its positions are its series, named under each box by that series' own `<label>` — and writing `categories` on one is reported rather than dropped in silence, since the names are text an author wrote for a reader. `$chart.categories` reports nothing for a box plot for the same reason.

The box runs from the first quartile to the third with the median drawn across it; the whiskers reach the furthest observation within one and a half interquartile ranges of the box, with a cap across each end; and an observation beyond that is drawn as a point of its own. A whisker ends on a datum that is in the data rather than on the fence, and a side whose quartile is already the extreme gets no whisker, since the box's own edge is the mark. A series of one observation, or of one value repeated, draws as a line at that value — every one of the five numbers is there.

The vertical axis is the data's and is not anchored to zero, as a line or scatter chart's is not: a box plot's numbers are positions on a scale rather than lengths measured from a baseline. A box chart draws no legend whichever way `legend` is written, because the names are already under the boxes and a legend would spend width to repeat the axis; `$chart.showLegend` reports that.

Every `<series>` now reports its own summary — `minimum`, `quartile1`, `median`, `quartile3`, `maximum` and `outliers` — whatever chart was drawn from it, so a sentence or an `<answer>` beside the picture can say what the picture shows. These come from the same definition `<summaryStatistics>` uses, extracted so that a table of quartiles and a box plot of the same column cannot disagree on the page. They are interpolated percentiles, not Tukey's hinges, which differ on some sample sizes.

Each box carries its five-number summary as an annotation and each outlier its own, so a box plot is navigable by screen reader like every other chart. They are the first chart annotations that need words to be read at all — five numbers at one position have nothing but their naming to tell them apart — so the wording is a translatable message rather than English built in the worker.

An observation that is not a finite number is left out of the summary rather than read as zero, and the chart says so: a dropped observation moves every quartile of the box drawn from it and leaves nothing on the page to notice.

`<summaryStatistics>` reports the same median it always did on any column of ordinary numbers, and a different one at two edges of the range a number can hold. Its median is now computed by ordering the values and taking the middle one, or the midpoint of the two middle ones — the same value the 50th percentile interpolates to, and unchanged for every column whose values are ordinary. Two things change:

- A column near the top of the range no longer overflows before it halves. The median of a column of `1e308` and `1.5e308` was reported as infinite and is now reported as `1.25e308`.
- Values are ordered by size rather than by a comparison that reads values agreeing to twelve significant digits as equal, so a column of readings that close reports its middle value rather than whichever of them happened to be written first: the median of `1 1.0000000000001 1.00000000000005` was reported as `1` and is now reported as `1.00000000000005`. `quartile1` and `quartile3` still order such a column by that comparison and are as unreliable on it as they were before.

Closes #1880.
