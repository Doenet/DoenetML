---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Three more places show a blank `＿` where they showed `NaN` or a partial point (D40, VAL-5).

- **A `<number>` in a `<repeat>` or `<repeatForSequence>` computed from an entry past the end of a list** is `＿`, not `NaN`: `<repeatForSequence from="1" to="3" indexName="i"><number>$l[$i] + 1</number></repeatForSequence>` with `<numberList name="l">10 20</numberList>` shows `11, 21, ＿`, and a reference to the third iteration (`$r[3]`) is missing, never equal to anything. It shows the same whether or not the repeat holds its iterations as a list.
- **A tag of a property that holds no value is missing whenever it has none**, also when it had a value when the tag was made: with `<image name="im" aspectRatio="2">` and an input bound to `$im.aspectRatio` that is then cleared, `<math extend="$im.aspectRatio"/>`, `<number extend="$im.aspectRatio"/>`, `<text>$im.aspectRatio</text>`, a `<number>` computed from it and the bound input show `＿`, where they showed `NaN`, and are drawn as a blank. They hold the value again once the property has one. A `copy` made while the property had a value keeps it, as before.
- **A `<point>` or `<vector>` whose content is only a reference that names nothing**, such as `<point>$pl[$i]</point>` while `i` is past the end of `pl` or `<point>$nothing</point>`, **or a blank entry of a list** (`<point>$pl[2]</point>` of `<pointList name="pl">(1,2) $nothing</pointList>`), is missing: shown as `＿`, not drawn in a graph, and never equal to anything, where it was a point with a blank coordinate, such as `(＿, 0)`, that was drawn. It is a point again once the reference names a point.

Closes #2544.
