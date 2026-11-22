---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Names are matched exactly in a few more places (D51, D62), and two silent or uncoded cases now have a diagnostic:

- **An attribute written twice in the same case** (`<math simplify="full" simplify="none">`) uses the first and ignores the others, each with the new warning `doenet-w0201` at the repeated attribute. Before, the last one was used, silently.
- **A value that names a tag or a property is a name**, matched exactly. `<collect componentType="Point">` and `<sort sortByProp="X">` (of points) are applied as `point` and `x` for now, with `doenet-w0197`, the warning an attribute in another case gets, saying it will be an error in a later release. Before, `componentType` was matched without case, silently, and `sortByProp="X"` left the items unsorted, with `doenet-w0198`. A `componentType` that comes from a reference (`componentType="$t"`, with `t` the text `Point`) is matched exactly too, with no fallback: it collects nothing, with `doenet-w0073` suggesting the spelling, where before it collected the points, silently. Keywords in values (`simplify="FULL"`, `hide="True"`) stay case-insensitive.
- **`sortByProp` on bare text** (`<sort sortByProp="x">3 1 2</sort>`) that names no property of the pieces is `doenet-w0198` at load, as it is for items written as tags.
- **An attribute read as text, written with a reference** (`<sort sortByProp="$t">`, `<sort type="$t">`) is the new error `doenet-e0090` at the attribute, saying to write its value as text, also on a tag written with `extend` or `copy` (`<sort extend="$s" sortByProp="$t"/>`). Before, it was an uncoded error at the component, and with `extend` or `copy` the whole document failed to load.
- **The editor** matches tag names exactly, as the document does: `<MATH>` gets "Element `<MATH>` is not a recognized Doenet element. Did you mean `<math>`?" (`doenet-w0112`), where before it was checked as `<math>`, with no warning. An attribute in another case (`<graph XMIN="-5"/>`), or a module's declared attribute in another case, gets `doenet-w0197` in the editor, as in the document, where before it was accepted silently.

Part of #2627 (items 9–13).
