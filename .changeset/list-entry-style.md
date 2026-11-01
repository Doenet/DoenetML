---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A list's `styleNumber` now fills in the style of each entry whose source sets none, and no longer overrides a style the source sets. This holds for every kind of list, for the entry as it is drawn, as `$l[1]`, and as a component made from it (`<point extend="$l[1]"/>`):

- `<collect styleNumber="2">` keeps the style of a collected component written with its own `styleNumber`. Before, it drew every collected component in style 2. A collected component that has a style only from where it sits (a `<graph styleNumber="4">`) still takes the collect's.
- A `<collect>`, `<sort>` or `<shuffle>` that takes its style from where it sits (`<p styleNumber="2">`) draws each entry whose source sets a style in that source's style.
- An authored list (`<mathList>`, `<numberList>`, `<pointList>`, …) draws an entry written with its own `styleNumber` in that style, and in the list's style otherwise. Before, a `<mathList>`, `<numberList>` or `<textList>` drew every entry in the list's style. `$l[1]` and `<point extend="$pl[1]"/>` now take the entry's style, where before they took neither the entry's nor the list's.
- When neither the list nor the entry's source sets a style, a component made from the entry takes the style of where it is, as it does for a `<mathList>` or `<pointList>`. Before, an extend of an entry of a `<collect>`, `<sort>` or `<shuffle>` took style 1.

`styleNumber` written on an `extend` of an `<intersection>` now applies to the intersection points, as it does on a `copy` and on an `extend` of a `<group>`.

Closes #2219. Closes #2374.
