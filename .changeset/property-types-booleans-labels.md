---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A slider's `items` is a list, and a reference to a label keeps its markup through a copy of an input or a write.

- **`$slider.items` is a list**: a `<numberList>`, or a `<textList>` for a `type="text"` slider. It was declared one number, so a reference to it showed `NaN`.
- **`$P.scales` of a point is no longer a property.** It held the enclosing graph's scales, for constraints, and showed `NaN`. A reference to it now names nothing, with the usual warning; use the graph's `xScale` and `yScale`.
- **`$ti2.label` of a copy of an input keeps its markup** (`<textInput name="ti2" extend="$ti"/>` with no `<label>` of its own): it is a linked copy of `ti`'s `<label>` child, as `$ti.label` is, where before it was a new label made from the label's text.
- **A label held in markup can be changed** through its owner's `label` (`<updateValue target="$ti.label">`, a bound input): when the `<label>` holds only an `<em>`, a `<q>` or other inline markup, the new text is written into the markup's content, which keeps the markup. A `<label>` with several children still refuses the write, as a `<text>` with several children does. The same holds wherever such markup is written: a `<text>` holding only `<em>Hi</em>`, bound to a `<textInput>`, now takes the new text into the `<em>`, where before it refused.
- `$l.value` of a `<label>` is the label's text, with math kept as math, as before; this is now documented and tested.
