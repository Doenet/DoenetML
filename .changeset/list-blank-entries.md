---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Lists: a missing entry is a blank entry, and a reference to one entry of a list follows that entry.

- **A missing entry is a blank entry (D40).** In a list of values (`<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, and a `<collect>`, `<sort>` or `<shuffle>` of values), a reference that names nothing is an entry shown as `＿`, where the list skipped it: `<mathList>$l[5] 2</mathList>` past the end of `l` is `＿, 2`, not `2`, and so are `<mathList>$nothing 2</mathList>` and a `<number>$nothing</number>` among a list's children. A list tag of an index that names nothing, such as `<numberList extend="$l[$i]"/>` past the end of `l`, holds one blank entry, where it was empty. A reference to a blank entry, and a tag of one (`<number extend="$a[1]"/>`), is missing, so it shows `＿` and never equals anything. A blank entry takes no write, and is made from its reference again once that names something. A list of points or vectors still skips such a reference, as a point has no blank to draw.
- **A reference to one entry of a list is fixed as the entry's source is.** `<math extend="$c[1]"/>` of a `<collect>`, `$c[1]` drawn in a graph, and `<math extend="$pl[1].x"/>` of a `<pointList>` are fixed, and fixed in place, when the component the entry comes from is, where only a reference to a whole point was. So is a `copy` of such an entry, taking what is written on that component.
- **A list `extend` through a path such as `$r[1].ml`** takes all the attributes of the list it names (`hide`, `fixed`, `displayDigits`), where it took only `unordered`, and follows them when the path comes to name another list. A `copy` of it pastes that list.
- **An item of a `<collect>`** carries the `simplify` of the math it collected to a tag of it (`<math extend="$c[1]"/>`), as it carries `styleNumber` and `renderMode`.
- **A label written through an entry** (`<textInput bindValueTo="$c[1].label"/>` of a `<collect>` or `<pointList>`) is written to the point the entry comes from.
- **A point made from an entry of a list** (`<point extend="$l[1]"/>`) follows the entry as it changes to a tuple and back, as one made from a `<math>` does.
- **A `<repeat>` of a `<point>` with one coordinate** (`<point>(<math>($v, 2)</math>)</point>`) takes that coordinate's value as its coordinates when referenced as a whole (`$r` is `(1, 2), (2, 2)`), where it was `1, 2`.

Closes #2221, #2239 and #2244. The list part of #2461, and items 1–3 of #2521.
