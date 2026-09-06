---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<summaryStatistics>` now summarizes values written in the document, and is available to authors.

It was excluded from the schema, autocomplete and the reference docs, with a comment saying it would stay that way "until the data-source story is implemented" — its only input was a column of a `<dataFrame>`, and a data frame could only load a CSV over a URL. So it could not see data that lives in the document, which is where a simulation's data lives.

The data-source story has a much smaller answer than a data-frame platform: **the data can just be in the document.**

```xml
<numberList name="scores">72 91 65 88 79 91 84</numberList>

<summaryStatistics name="stats">$scores</summaryStatistics>

<p>The mean is $stats.mean and the median is $stats.median.</p>
```

Every statistic is a readable property as well as a table cell, so a sentence and the table cannot disagree. Values that are not numbers count as missing and are left out, which is why `count` reports how many values were usable rather than how many were given.

**The `source`/`column` data-frame path is removed rather than kept.** It could not have worked: `sourceName` depended on a `dependencyType` of `attributeTargetComponentNames`, declared through an attribute option `createTargetComponentNames`, and neither name exists anywhere else in the codebase — no dependency type is registered under it. Because `sourceName` was defined unconditionally, *every* use of `<summaryStatistics>` threw while its dependencies were built, whether or not a `source` was given. The component has never run. Summarizing a data frame can come back with the data-frame story, written against dependency types that exist; `<dataFrame>` itself is untouched and still excluded.

Three further things that could only surface once the component ran at all:

- The statistics are plain numbers, but they were passed to `roundForDisplay`, which takes and returns math-expressions — it threw, and would have handed the renderer an `Expression` to put in a table cell. They are now lifted into an expression for rounding and rendered back to a string.
- `count` was rounded along with everything else, so `displayDigits="3"` would have reported 1234 observations as 1230. A count is an exact tally and is no longer rounded. Rounding applies only to the table; the properties keep full precision.
- An empty list reached `sum`, which reduces without an initial value, and `Math.min`, which answers `Infinity` for nothing. Reachable now that children supply the data — a `<repeat>` that produced nothing — so every statistic but `count` reports nothing rather than failing.

Also removed: `byCategoryColumn`, an attribute that was declared but never implemented; and the renderer's `width`/`height` styling, read from state variables the component does not define, so both were always `undefined`. The caption no longer names a column, since there is no longer a column to name.

The `statisticsToDisplay` values — `default`, `all`, and the twelve statistics — now reach autocomplete and the reference page, which the component's own comment noted they did not.
