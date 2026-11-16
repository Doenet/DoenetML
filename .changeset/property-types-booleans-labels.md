---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A boolean is `1` or `0` inside a math or a number, a slider's `items` is a list, and a reference to a label keeps its markup through a copy of an input or a write.

- **A `<boolean>` inside a `<math>` is `1` or `0`** (REF-5), as it already was in `<math extend="$b"/>`. `<math>$b+1</math>` with `b` true is `1+1`, and `<number>$b+1</number>` is `2`; before, the boolean was dropped with a `doenet-w0107` warning ("Invalid children"), so they were `+1` and `1`. The same holds wherever a math is read from what is written: a `<point>`'s coordinates, a `<mathList>`, a `<numberList>`, an `<integer>`, `<sum>` and the other math operators, a repeat's `valueName` that holds a boolean, and the entries of a `<booleanList>` (`<math>$bl</math>` is `1, 0`). A `<number>` holding only a boolean (`<number>$b</number>`) is `1` or `0`, where it was `NaN` unless it had `convertBoolean`. A missing boolean is a blank (`NaN` in a `<number>`). Writing `1` or `0` into such a math or number (from a `<mathInput>` bound to `<math>$b</math>` or `<number>$b</number>`, or one with `bindValueTo="$b"`) sets the boolean to true or false. Other places that take a math now read a boolean too: `<isInteger>$b</isInteger>` and `<isNumber>$b</isNumber>` are `true`, `<count>` counts booleans, and a math or number attribute such as `<point x="$b">` or `<sequence from="$b">` is `1` or `0`, where each warned before. Where a text is wanted (`<text>$b</text>`, a `<p>`), a boolean is still the word `true` or `false`.
- **`$slider.items` is a list**: a `<numberList>`, or a `<textList>` for a `type="text"` slider. It was declared one number, so a reference to it showed `NaN`.
- **`$P.scales` of a point is no longer a property.** It held the enclosing graph's scales, for constraints, and showed `NaN`. A reference to it now names nothing, with the usual warning; use the graph's `xScale` and `yScale`.
- **`$ti2.label` of a copy of an input keeps its markup** (`<textInput name="ti2" extend="$ti"/>` with no `<label>` of its own): it is a linked copy of `ti`'s `<label>` child, as `$ti.label` is, where before it was a new label made from the label's text.
- **A label held in markup can be changed** through its owner's `label` (`<updateValue target="$ti.label">`, a bound input): when the `<label>` holds only an `<em>`, a `<q>` or other inline markup, the new text is written into the markup's content, which keeps the markup. A `<label>` with several children still refuses the write, as a `<text>` with several children does.
- `$l.value` of a `<label>` is the label's text, with math kept as math, as before; this is now documented and tested.
