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

`type` is now an override rather than a requirement, for when the look is misleading — `007 008` counts the numbers 7 and 8, and `type="text"` keeps the leading zeros. It still governs only bare strings; a referenced component keeps the type it already has.

A `type` naming something that is not one of the four is now reported and then **dropped**, so it behaves exactly as if it had not been written. It used to be replaced with `math`, which is how `<tally type="txt" categories="apple fig">` came to make every category `NaN` and then report that a category had been named twice.

Two diagnostics are retired in place and one is added: `doenet-w0013` asked for a type nothing needs any more, and `doenet-w0014` named a `math` fallback that no longer happens. `doenet-w0145` replaces the second and says what now occurs.

Affects `<sort>`, `<shuffle>`, `<sortIndices>`, `<tally>`, `<argMin>`, `<argMax>`, `<indexOf>` and `<searchSorted>`. Of those, only `<sort>` and `<shuffle>` have shipped, and for them the change reaches only markup that produced nothing before.
