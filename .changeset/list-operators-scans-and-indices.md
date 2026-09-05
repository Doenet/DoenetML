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

**Cumulative scans** map a list to another list of the same length: `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`, `<cumulativeMax>`, and `<differences>` (which is one shorter, and undoes `<cumulativeSum>` apart from its first value). They accumulate numerically when every input is a number and symbolically otherwise, so `<cumulativeSum>x y z</cumulativeSum>` gives `x, x+y, x+y+z`. The result is an ordinary list: `$cum[3]`, `<sum>$cum</sum>` and `<numberList>$cum</numberList>` all work on it, and rounding attributes pass through to each value.

**Index-returning operators** report a position rather than a value: `<argMin>`, `<argMax>`, `<indexOf>`, `<searchSorted>` and `<sortIndices>`. Indices are 1-based to match `$list[1]`, and `0` means "no such element". These are not math-only — they order values exactly as `<sort>` does, comparing numerically when every value is numeric and alphabetically otherwise, so `<indexOf type="text" target="Cal">$names</indexOf>` searches a `<textList>` as readily as `<argMin>` scans a `<numberList>`.

The `target` of `<indexOf>` and `<searchSorted>` is a *list*, and the result has one position per target, in the manner of `np.searchsorted(a, v)` with an array `v` and R's `match()`. A single target still reads as a single index — it renders inline and indexes another list, so `$pop[$which]` works as before — but a thousand targets are searched by one operator rather than a thousand. Each result is still its own `<math>`, so the results scale with the targets; what does not scale is the searching. That is what makes these usable on the output of `<sampleRandomNumbers>`: searching a large sample by wrapping it in a `<repeat>` builds a whole operator, with its own dependencies and its own result, for every draw, and stops being practical long before the sample is big enough to be interesting.

The index family is worth more than its parts because DoenetML already indexes by reference, so a returned index composes with every list in the document:

```xml
<numberList name="scores">72 91 65 88</numberList>
<textList name="names">Ann Bob Cal Dee</textList>
<argMax name="best">$scores</argMax>
<p>Top scorer: $names[$best]</p>
```

`<sortIndices>` extends `<sort>` and accepts everything it accepts, including `sortByProp`, so `$names[$perm[1]]` sorts one list by another list's ordering — which `<sort>` alone cannot express, since it returns the values it sorted and discards where they came from.

Together, the two families make sampling from a weighted population a matter of three lines: accumulate the weights, draw uniformly from the total, and look up which bucket each draw landed in. Raising `numSamples` here changes nothing but the number of results.

```xml
<numberList name="pop">30 45 12 60</numberList>
<cumulativeSum name="cum">$pop</cumulativeSum>
<number name="total"><sum>$pop</sum></number>
<sampleRandomNumbers name="draws" type="discreteUniform" from="1" to="$total" numSamples="500" />
<searchSorted name="which" target="$draws">$cum</searchSorted>
```

The value extraction that decides how `<sort>` compares its children now lives in one shared place, so `<sortIndices>` and the index operators agree with `<sort>` by construction rather than by coincidence.

Sharing it also fixes a second bug, in `<sort>` and `<shuffle>`: an explicit `type` used to be forced onto reference children as well as bare strings, which fused a referenced list into the single string it renders as. `<sort type="text">$names Zoe</sort>` sorted the two values `"Ann, Cal, Bob"` and `"Zoe"` rather than the four names, and `<shuffle type="text">$names Zoe</shuffle>` had only two things to shuffle. A reference already carries a type of its own, so it is now passed through untouched and `type` applies only to the bare strings it was meant for. The one behavior this removes is coercion of a reference to a different type — `<sort type="number">$aTextComponent</sort>` no longer reads that component as a number.

Sharing it also fixes a bug in `<sort>` itself, so `<sort type="boolean">` now renders differently than before: `type="boolean"` has always been an accepted type, but a boolean child had no comparable value and was silently skipped, so `<sort type="boolean">true false</sort>` rendered nothing at all. Boolean children are now ordered as text, which puts `false` before `true` — the same order `<indexOf>` uses when its `target` is a boolean. `<shuffle type="boolean">` was never affected, since it rearranges its children without comparing them.

Two ways of getting a 0 out of an index operator say so, since neither is a position and the result alone does not distinguish them. Omitting `target` on `<indexOf>` or `<searchSorted>` is a warning — no document written that way can ever produce an answer. Having no values at all to look through is an info message, since a list driven by an input can legitimately be empty for a while. A target that is simply absent from the list is *not* reported: that 0 is what `<indexOf>` is for, and a `target` bound to an input would otherwise raise one message for every value typed on the way to the right one. Nor is an empty *list* of targets reported — it produces no positions, which is the honest answer to a question about nothing.

The `type` attribute of `<sort>`, `<shuffle>` and the five index operators now declares the values it accepts — `number`, `math`, `text` and `boolean` — so the editor offers them, the reference pages list them with descriptions, and writing anything else is flagged rather than only warned about once the document runs. The set is unchanged; it was simply never declared.

Finally, the reference pages for `<sort>`, `<shuffle>` and the sequence components (`<sequence>`, `<selectFromSequence>`, `<repeatForSequence>`, `<animateFromSequence>`) now open on the handful of attributes that actually define what the component does, rather than on an undifferentiated list. `<sort>`'s three ways of choosing what to compare are gathered under a "Sort order" heading of their own.

Closes #1816. Closes #1817. Closes #1823. Closes #1831.
