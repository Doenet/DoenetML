---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add list operators: cumulative scans and index-returning operators.

Ten new components in two families. Until now every math operator reduced a list to a single value — `<sum>`, `<min>`, `<mean>` — so nothing turned a list into another list, and nothing reported a *position* within one.

**Cumulative scans** map a list to another of the same length: `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`, `<cumulativeMax>`, and `<differences>`, which is one shorter and undoes `<cumulativeSum>` apart from its first value. They accumulate numerically when every input is a number and symbolically otherwise, so `<cumulativeSum>x y z</cumulativeSum>` gives `x, x+y, x+y+z`. The result is an ordinary list: `$cum[3]`, `<sum>$cum</sum>` and `<numberList>$cum</numberList>` all work on it, and rounding attributes pass through to each value.

**Index-returning operators** report a position rather than a value: `<argMin>`, `<argMax>`, `<indexOf>`, `<searchSorted>` and `<sortIndices>`. Indices are 1-based to match `$list[1]`, and `0` means "no such element". They order values exactly as `<sort>` does: numerically when every value is numeric, alphabetically otherwise. Because DoenetML already indexes by reference, a returned position composes with any list in the document: with `<argMax name="best">$scores</argMax>`, the top scorer is `$names[$best]`. `<sortIndices>` accepts everything `<sort>` accepts, including `sortByProp`, so `$names[$perm[1]]` orders one list by another list's ordering.

The `target` of `<indexOf>` and `<searchSorted>` is a *list*, and the result has one position per target. A single target still reads as a single index, so `$pop[$which]` works as before, but a thousand targets are searched by one operator rather than a thousand. That is what makes sampling from a weighted population three lines, where a `<repeat>` stops being practical long before the sample is interesting:

```xml
<numberList name="pop">30 45 12 60</numberList>
<cumulativeSum name="cum">$pop</cumulativeSum>
<number name="total"><sum>$pop</sum></number>
<sampleRandomNumbers name="draws" type="discreteUniform" from="1" to="$total" numSamples="500" />
<searchSorted name="which" target="$draws">$cum</searchSorted>
```

Two existing behaviors change. `<sort>` and `<shuffle>` no longer force an explicit `type` onto reference children, which used to fuse a referenced list into the single string it renders as: `<sort type="text">$names Zoe</sort>` now sorts four names rather than the two values `"Ann, Cal, Bob"` and `"Zoe"`. The one thing this removes is coercing a reference to a different type. And `<sort type="boolean">true false</sort>`, which silently rendered nothing at all, now orders booleans as text, putting `false` before `true`.

Getting a `0` out of an index operator is reported when it means the question could not be answered: omitting `target` is a warning, and having no values to look through is an info message. A target simply absent from the list is not reported — that `0` is what `<indexOf>` is for.

The `type` attribute of `<sort>`, `<shuffle>` and the five index operators now declares the values it accepts — `number`, `math`, `text` and `boolean` — so the editor offers them and anything else is flagged as it is written. The set is unchanged; it was simply never declared. `<sort>`, `<shuffle>` and the sequence components (`<sequence>`, `<selectFromSequence>`, `<repeatForSequence>`, `<animateFromSequence>`) now highlight the few attributes that define what they do, so the editor and the reference pages lead with those.

Closes #1816. Closes #1817. Closes #1823. Closes #1831.
