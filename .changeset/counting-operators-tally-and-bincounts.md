---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add counting operators: `<tally>` and `<binCounts>`.

`<count>` reports how many values a list holds. These two answer the more ordinary question asked of data — *how many of each?* — which is the second half of any sampling activity: with them, you can say not only which subpopulation every individual landed in but how many landed in each.

**`<tally>`** counts how many times each category appears. It is type-generic, comparing values exactly as `<sort>` does, so it counts a `<textList>` as readily as a `<numberList>`.

```xml
<textList name="fruit">apple fig apple pear fig apple</textList>
<tally name="t">$fruit</tally>   <!-- 3, 2, 1 over apple, fig, pear -->
```

Name the categories with `categories` to fix which are counted and in what order; omit it and the categories are the distinct values present, in sorted order — sorted rather than first-seen, so the same data reads the same way however it arrived. Either way they read back as `.categories`, so a table or a chart is driven off the same component that did the counting. Declaring them is also what keeps a slot for the categories nothing matched: `<tally categories="1 2 3 4">` over a sample that never produced a 3 still reports a 0 in third place, so the counts stay lined up with the categories they are counts of.

A category is read to match the values, so there is nothing to declare for it: `categories="apple fig"` counts words, `categories="true false"` counts booleans, and `categories="1/2 1"` counts halves, each still labeling its count as it was written. `type` is what bare string children are read as — `<tally type="text">apple fig apple</tally>` — and, written out, it also decides how `categories` is read.

**`<binCounts>`** counts how many values fall into each interval between the cut points given by `bins`, which is what a histogram of a continuous quantity needs. `n + 1` cut points define `n` intervals, and they read back as `.binEdges`, so whatever displays the counts can say what interval each covers. Bare numbers are read as values, the way `<sum>` reads them, so `<binCounts bins="0 1 2">0 1/2 1 3/2 2</binCounts>` counts five of them.

A value landing exactly on a cut point has to be counted on one side or the other, and there is no universal convention — NumPy, matplotlib and Julia close bins on the left; R, pandas and Excel close them on the right. `closed` chooses, and defaults to `"left"` (`[a, b)`), matching the class intervals of most statistics textbooks. Whichever way it points, **the outermost cut point is always included**, so neither the smallest nor the largest value is silently dropped. A value outside the outermost cut points falls in no bin, and so does a `<number>` whose content does not parse, so `<binCounts>` counts need not sum to the size of the sample. A value that is not numeric *by type* is a different matter: a text or a boolean is something no pair of cut points could ever hold, so rather than dropping it and reporting counts that quietly mean less than they say, `<binCounts>` warns and reports 0 for every bin.

Both are composites that create their counts fresh as `<number>` components, so `$counts[2]`, `<sum>$counts</sum>` and `<numberList>$counts</numberList>` all work on the result, and a count reads as a number wherever one is expected, including as a path index. Bins that do not describe a set of intervals, values matching none of the declared categories, and a `categories` that names the same category twice are all reported rather than left silent.

Together with the operators already in place, a sampling simulation takes the same handful of tags whatever the size of the sample — no `<repeat>` over the draws, and one count per category however many were drawn:

```xml
<numberList name="pop">30 45 12 60</numberList>
<cumulativeSum name="cum">$pop</cumulativeSum>
<number name="total"><sum>$pop</sum></number>

<sampleRandomNumbers name="draws" type="discreteUniform" from="1" to="$total" numSamples="500" />
<searchSorted name="which" target="$draws">$cum</searchSorted>
<tally name="counts" categories="1 2 3 4">$which</tally>
```

The same answer is available in one step as `<binCounts bins="0 $cum" closed="right">$draws</binCounts>`, without the intermediate list of subpopulation indices — use whichever you also want to show.

Closes #1832.
