---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<collect>` of numbers, maths, texts, booleans or intervals, and a `<sort>` or `<shuffle>` whose values are all numbers, all maths, all texts or all booleans, now keep their values in one component, drawn as before, instead of making a copy of each value. A value written as text, as in `<sort>3 1 2</sort>`, makes no component at all. Such documents create fewer components, and a change that reorders a `<sort>`, such as typing into an input it sorts, is faster. Each value is still shown as its source shows it (its display settings, style, `renderMode`, and hidden when its source is), a property of one such as `$c[2].anchor` is its source's, and a value written to one, as through `<mathInput bindValueTo="$s[1]"/>`, goes to its source. A `<shuffle>` gives the same order for each variant as before. One drawn in a `<graph>`, or a `<sort>` mixing numbers and maths, makes copies as before. Three uses differ. A list among the components a `<collect>` gathers counts as its values, one by one, for `maxNumber` and for an index such as `$c[3]`; it counted as one item. `<collect extend="$c"/>` now shows the collected values; it showed nothing. These components now have the properties `numComponents` and `numValues`, the number of values.
