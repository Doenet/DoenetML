---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Read a list operator's bare string children as what they look like, instead of refusing them.

`<sort>d a b</sort>` rendered nothing at all. So did `<tally>apple fig apple</tally>`, `<shuffle>d a b</shuffle>`, and every other component that reads its children as a list of comparable values. Each reported that a `type` attribute was required, ignored the string, and produced an empty result — for markup that says exactly what it means.

They are now read by their content: every whitespace-separated piece naming a number makes the list numeric, and anything else makes it text.

```xml
<sort>10 2 1</sort>          <!-- 1, 2, 10   — ordered by value -->
<sort>d a b</sort>           <!-- a, b, d    — ordered alphabetically -->
<sort>10 2 x</sort>          <!-- 10, 2, x   — one word, so all text -->
<tally>apple fig apple</tally>
```

This is the rule the values already followed when they arrived as components: `allAreNumeric` is true only when every value is numeric, and a single text among numbers sends the whole list to a text comparison. Applying it to bare strings means an author who writes `1 10 3` and an author who references a `<numberList>` get the same answer.

A piece names a number when Doenet's own math parser works one out of it, so `1/2`, `2^3`, `sqrt(4)`, `pi` and `min(1,2)` all count, and `x`, `2x`, `true` and `NaN` do not. JavaScript's numeric literals are not consulted, so `1e5` and `0x10` are words here: scientific notation has to be asked for and is spelled with a capital `E`, and hexadecimal is not DoenetML notation at all. An author who wants an exponent read writes `<mathList parseScientificNotation="true">1E3 2 5E2</mathList>` and references it.

`type` is now an override rather than a requirement, for when the look is misleading — `007 008` counts the numbers 7 and 8, and `type="text"` keeps the leading zeros. It still governs only bare strings; a referenced component keeps the type it already has.

A `type` naming something that is not one of the four is now reported and then **dropped**, so the string children are read exactly as they would be with no `type` at all. It used to be replaced with `math`, so `<tally type="txt">apple fig apple</tally>` read its three words as maths and reported its categories as `a p p l e` and `f i g`. This covers the string children only: `categories` and `target` resolve an invalid `type` separately and still replace it, so `<tally type="txt" categories="apple fig">` counts nothing either way.

Two diagnostics are retired in place and one is added: `doenet-w0013` asked for a type nothing needs any more, and `doenet-w0014` named a `math` fallback that no longer happens. `doenet-w0145` replaces the second and says what now occurs.

Affects `<sort>`, `<shuffle>`, `<sortIndices>`, `<tally>`, `<argMin>`, `<argMax>`, `<indexOf>` and `<searchSorted>`. Only `<sort>` and `<shuffle>` have shipped, and two existing documents change:

- One that mixes a reference with a bare string. `<sort>$mi 3</sort>` used to sort the reference alone and drop the `3`; it now sorts both.
- One with a `type` that is not one of the four. Those strings used to be read as maths, so `<sort type="txt">1/2 2 1</sort>` rendered `1/2, 1, 2` and now renders `0.5, 1, 2`, and `<sort type="letters">d a b</sort>` produces text rather than maths, so `.latex` on an item no longer resolves. Both already reported the type as invalid.
