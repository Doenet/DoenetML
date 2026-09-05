---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add list operators: cumulative scans and index-returning operators.

Every math operator in DoenetML reduced a list to a single value — `<sum>`, `<min>`, `<mean>` and the rest. Nothing turned a list into another list, and nothing reported a *position* within a list. That left ordinary tasks with no reasonable expression: a running total had to be hand-rolled with `<repeat>`, and "which entry is this?" could not be asked at all.

Ten new components, in two families.

**Cumulative scans** map a list to another list of the same length: `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`, `<cumulativeMax>`, and `<differences>` (which is one shorter, and inverts `<cumulativeSum>`). They accumulate numerically when every input is a number and symbolically otherwise, so `<cumulativeSum>x y z</cumulativeSum>` gives `x, x+y, x+y+z`. The result is an ordinary list: `$cum[3]`, `<sum>$cum</sum>` and `<numberList>$cum</numberList>` all work on it, and rounding attributes pass through to each value.

**Index-returning operators** report a position rather than a value: `<argMin>`, `<argMax>`, `<indexOf>`, `<searchSorted>` and `<sortIndices>`. Indices are 1-based to match `$list[1]`, and `0` means "no such element". These are not math-only — they order values exactly as `<sort>` does, comparing numerically when every value is numeric and alphabetically otherwise, so `<indexOf type="text" target="Cal">$names</indexOf>` searches a `<textList>` as readily as `<argMin>` scans a `<numberList>`.

The index family is worth more than its parts because DoenetML already indexes by reference, so a returned index composes with every list in the document:

```xml
<numberList name="scores">72 91 65 88</numberList>
<textList name="names">Ann Bob Cal Dee</textList>
<argMax name="best">$scores</argMax>
<p>Top scorer: $names[$best]</p>
```

`<sortIndices>` extends `<sort>` and accepts everything it accepts, including `sortByProp`, so `$names[$perm[1]]` sorts one list by another list's ordering — which `<sort>` alone cannot express, since it returns the values it sorted and discards where they came from.

Together, the two families make sampling from a weighted population a matter of three lines: accumulate the weights, draw uniformly from the total, and look up which bucket the draw landed in.

```xml
<numberList name="pop">30 45 12 60</numberList>
<cumulativeSum name="cum">$pop</cumulativeSum>
<number name="total"><sum>$pop</sum></number>
<sampleRandomNumbers name="u" type="discreteUniform" from="1" to="$total" numSamples="1" />
<searchSorted name="which" target="$u">$cum</searchSorted>
```

The value extraction that decides how `<sort>` compares its children now lives in one shared place, so `<sortIndices>` and the index operators agree with `<sort>` by construction rather than by coincidence.

Closes #1816. Closes #1817.
