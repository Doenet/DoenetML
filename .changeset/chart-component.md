---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<chart>`, a chart of a list of values with named categories. `type` picks which chart is drawn; `bar` is the first.

```xml
<chart type="bar" categories="North South East West" displayValues>
  <shortDescription>Population by region</shortDescription>
  <yLabel>people</yLabel>
  <number>41</number><number>63</number><number>18</number><number>78</number>
</chart>
```

One tag with a `type` rather than a tag per chart. A pie chart, a box plot and a scatter plot differ in how the same list of values is drawn rather than in what an author is doing, so the choice belongs in an attribute — where it can also be computed, letting a document chart the same data both ways without duplicating the tag around it.

`type` has **no default**. `<chart>` on its own draws nothing at all and warns that no chart type was named, and a type it does not recognize is reported and then treated the same way. Defaulting to `bar` would let documents come to rely on it, and `bar` is not the chart most authors reach for first.

A rejected attribute value now says which of the two things happened to it. Where the attribute has a default, the message still names the value used in its place — "Invalid value `sideways` for attribute `displayMode`, using value `block`". Where it has none, the attribute is dropped rather than replaced, and the message now says so: "Invalid value `pie` for attribute `type`, ignoring it", where it used to report a fallback to `null` — a value no author could have written. Seven attributes are in that second group, `<chart type>` among them.

Bare numbers are read as values, so `<chart type="bar">41 63 18</chart>` draws three bars without wrapping each in a `<number>`.

Categories are labels rather than values: the bars are evenly spaced whatever a category says, so `categories="1 5 6"` writes 1, 5, 6 under three equally spaced bars. They are read as text, so a number, a word, or a `<tally>`'s own `.categories` all name bars the same way — `<chart type="bar" categories="$counts.categories">$counts</chart>` charts a tally with nothing else to write.

A value that is not a finite number gets no bar, and that is reported as a warning. Its place on the axis is kept, so the remaining bars stay under their own categories rather than shifting along.

The vertical axis scales itself: one tick above the tallest bar so it never touches the frame, and labeled values a whole number of steps from zero, which is the baseline the bars are measured from. `yMin` and `yMax` override it, and may each be set on their own; bars are still measured from zero, so a bound that crosses them cuts them off at the frame and a bar lying entirely outside it does not appear. A value of zero keeps its slot and its category label, so a `<tally>` category nothing landed in does not drop out of the chart.

`size` and `width` and `aspectRatio` size a chart the way they size a `<graph>`, and `barWidth` is the fraction of its slot each bar fills. `values`, `categories`, `yMin`, `yMax`, `barWidth` and `aspectRatio` all read back off the chart, and the last four report **what it was drawn with** — the axis an automatic chart chose for itself, and the fallback used in place of a width or a ratio the chart could not honor.

Every bar carries its category and value as an annotation, so the chart is navigable by screen reader rather than merely present, and a `<shortDescription>` becomes the description of the figure as a whole. The chart renders through PreFigure, whose runtime is fetched the first time a page draws through it. A `<chart>` with no type draws nothing, so it fetches nothing either.

Closes #1833.
