---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<barChart>`, a chart of a list of values with named categories.

DoenetML has had no chart component since `<chart>` was removed. A histogram could be approximated with `<repeat>` and `<rectangle>` inside a `<graph>` — the reference pages still show that pattern — but it costs one reactive component and one SVG node per bar, and its axis can only *number* the bars: `<graph>` has no support for custom axis ticks, so naming them means placing every name yourself as a second row of anchored labels.

```xml
<barChart categories="North South East West" type="text" displayValues>
  <shortDescription>Population by region</shortDescription>
  <yLabel>people</yLabel>
  <number>41</number><number>63</number><number>18</number><number>78</number>
</barChart>
```

Together with the counting operators, a whole sampling simulation is four components, however large the sample:

```xml
<sampleRandomNumbers name="draws" type="discreteUniform" from="1" to="$total" numSamples="500" />
<searchSorted name="which" target="$draws">$cum</searchSorted>
<tally name="counts" categories="1 2 3 4">$which</tally>
<barChart categories="$labels" type="text">$counts</barChart>
```

**It renders through PreFigure rather than the graph renderer.** That is what makes the categorical axis possible — PreFigure's `<tick-mark>` places arbitrary text at an arbitrary axis position, where its own `hlabels` is a numeric `(start, step, end)` triple that cannot carry names. It also means the whole chart compiles to one drawing however many bars it has, and that every bar carries its category and value as an annotation, so the chart is navigable by screen reader instead of merely present; a `<shortDescription>` becomes the description of the figure as a whole. The cost is that the PreFigure runtime is fetched the first time a page uses it — pages with no chart fetch nothing.

The vertical axis scales itself: one tick above the tallest bar so it never touches the frame, labeled values on multiples of the step so each is a whole number of steps from zero — the baseline the bars are measured from — rather than from the bottom of the box, and the same treatment below the axis when a value is negative. The step is settled against the box that ends up being drawn rather than the data alone, and it stays at whole numbers only while the values are whole numbers — so a chart of counts is never labeled in halves and a chart of proportions is never labeled only at 0 and 1. `yMin` and `yMax` override the bounds, unless what they ask for is not a finite range to draw in. An empty chart still draws a box one tick tall rather than collapsing, and a value of zero keeps its slot and its category label rather than being skipped — so a `<tally>` category nothing landed in does not drop out of the chart and shift the others along.

Two pieces of `<graph>` were factored out rather than copied, since `<barChart>` frames itself the same way:

- `utils/componentSize` — the `size`/`width` preset pair. `<image>` and `<video>` have a pair of the same shape but a different definition (theirs consult a `<graph>` ancestor's scale), so they are deliberately left alone.
- `utils/axisLabel` — the `<xLabel>`/`<yLabel>` child wiring, which `Graph.js` previously spelled out twice, once per axis.

The bar geometry lives in its own renderer-neutral state variable and the PreFigure XML is a thin serialization of it, so if PreFigure's compile-per-change ever proves too slow for a chart that resamples, a plain SVG renderer can go behind the same component without changing anything an author writes.

Horizontal bars are not implemented; `<barChart>` declares no attribute for them rather than a half-working one.
