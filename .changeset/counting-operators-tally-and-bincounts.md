---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add counting operators: `<tally>` and `<binCounts>`.

DoenetML could reduce a list to one value, scan it into another list, and report positions within it, but it could not answer the most ordinary question anyone asks of data: *how many of each?* `<count>` reports how many values there are in total; nothing reported how many there were of each kind. That left the second half of a sampling activity with no expression — you could draw a sample and say which subpopulation every individual landed in, but not how many landed in each.

**`<tally>`** counts how many times each category appears. It is type-generic, comparing values exactly as `<sort>` does, so it counts a `<textList>` as readily as a `<numberList>`.

```xml
<textList name="fruit">apple fig apple pear fig apple</textList>
<tally name="t" type="text">$fruit</tally>   <!-- 3, 2, 1 over apple, fig, pear -->
```

Name the categories with `categories` to fix which are counted and in what order; omit it and the categories are the distinct values present, in sorted order — sorted rather than first-seen, so the same data reads the same way however it arrived. Either way they are readable back as `.categories`, so a table or a chart is driven off the same component that did the counting. Declared categories read back in the type they were *written* as, so `<tally type="boolean" categories="true false">` labels its counts `true, false` rather than the `1, 0` a numeric reading would give.

Declaring the categories is what keeps a slot for the ones nothing matched. `<tally categories="1 2 3 4">` over a sample that never produced a 3 still reports a 0 in third place, so the counts stay lined up with the categories they are counts of.

**`<binCounts>`** counts how many values fall into each interval between the cut points given by `bins`, which is what a histogram of a continuous quantity needs. `n + 1` cut points define `n` intervals.

A value landing exactly on a cut point has to be counted on one side or the other, and there is no universal convention — NumPy, matplotlib and Julia close bins on the left; R, pandas and Excel close them on the right. `closed` chooses, and defaults to `"left"` (`[a, b)`), matching NumPy and the class intervals of most statistics textbooks. Whichever way it points, **the outermost cut point is always included**, so neither the smallest nor the largest value is silently dropped: this is NumPy's rule for its last bin and R's `include.lowest` for its first, applied symmetrically.

Both are composites that create their counts fresh, so the result is an ordinary list — `$counts[2]`, `<sum>$counts</sum>` and `<numberList>$counts</numberList>` all work on it.

Together with the operators already in place, a sampling simulation takes the same handful of tags whatever the size of the sample — no `<repeat>` over the draws, and one count per category however many were drawn:

```xml
<numberList name="pop">30 45 12 60</numberList>
<cumulativeSum name="cum">$pop</cumulativeSum>
<number name="total"><sum>$pop</sum></number>

<sampleRandomNumbers name="draws" type="discreteUniform" from="1" to="$total" numSamples="500" />
<searchSorted name="which" target="$draws">$cum</searchSorted>
<tally name="counts" categories="1 2 3 4">$which</tally>
```

Every draw is still a component of its own, and so is the subpopulation index `<searchSorted>` reports for it; what does not grow with the sample is the markup and the list of counts. Because every draw lands in exactly one subpopulation, the counts always sum to `numSamples`. The same answer is available in one step as `<binCounts bins="0 $cum" closed="right">$draws</binCounts>`, without the intermediate list of subpopulation indices — use whichever you also want to show.

Five situations are reported rather than left silent. `<tally>` raises info when values matched none of the *declared* categories and so were counted nowhere — info rather than a warning, since a list fed by an input legitimately holds non-categories while a student is typing, and the diagnostics queue is append-only. `<binCounts>` warns when `bins` is missing, when it holds fewer than the two cut points an interval needs, when a cut point is not a number or is smaller than the one before it (a bin running backwards has no count; two equal cut points are accepted, and name an empty bin between other bins — at either end the always-included outermost cut point wins, so `bins="0 1 1"` counts a value of `1` in the last bin rather than nowhere), and when its values are not all numeric.

The counts are `<number>` components, so `$counts[2]`, `<sum>$counts</sum>` and `<numberList>$counts</numberList>` all work on them, and a count reads as a number wherever one is expected — including as a path index. Numbers rather than the maths that `<cumulativeSum>` and its family create: a count is a non-negative integer whatever it counted, so there is no input for which one could be a math expression, and `<sortIndices>` reports its indices the same way.

Two things `<binCounts>` deliberately says nothing about: a value falling outside the outermost cut points, and a value that is not a number at all — a `<number>` whose content does not parse, which is dropped before the sort so it cannot disturb the count of its neighbors. Both are documented behavior, so `<binCounts>` counts need not sum to the size of the sample. `<tally>` makes no category for a value that is not a number either — a `NaN` equals nothing, not even another `NaN` — so with inferred categories it goes uncounted and unmentioned, while with declared categories it is simply one more value matching none of them and falls under the info above. Otherwise `<tally>` with inferred categories counts every value it can compare.

Closes #1832.
