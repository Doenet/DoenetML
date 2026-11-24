---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A tag made with `extend`, `copy` or `copyWithState` from something it can't be is now an error when the document loads, where several such tags loaded silently:

- **A `<group>` made from a collection is an error** (`doenet-e0065`): `<group extend="$r"/>` of a `<repeat>`, `<repeatForSequence>`, a list (`<mathList>`, `<pointList>`, …), `<sequence>`, `<collect>`, `<sort>`, `<shuffle>`, or a `<select>` or other chooser that picks several. Before, one made from a repeat or a select of several showed nothing, with no message, and one made from a list or a collect acted as the list. The message names the forms that work: `<group>$r</group>`, a group holding the collection, and `<repeat extend="$r"/>`, the same collection again. A `<group>` made from a group, an iteration (`$r[1]`), a pick, a `<conditionalContent>` or a one-pick `<select>` is unchanged.
- **A `<repeat>`, `<select>`, `<collect>`, `<sort>` or other tag that makes its content itself, made from anything but the same tag, is `doenet-e0071`** however the source is written: `<repeat extend="$n"/>` of a `<number>` and `<repeat extend="$r[1]"/>` of an iteration were `doenet-e0065`, which named the source's type as though another type might work. It is now reported when the document loads also in a case that isn't true yet.
- **`<sampleRandomNumbers extend="$s"/>` of a `<selectRandomNumbers>` is `doenet-e0071`**, as the reverse already was, in place of a misleading "invalid children" warning. So is `<sequence extend="$s"/>` of a `<selectFromSequence>`.
- **An index into a `<conditionalContent>` is type-checked when the document loads**: `<point extend="$cc[1]"/>` of cases holding a text, and `<boolean extend="$cc[1]"/>` of cases holding a math, are `doenet-e0065`, as without the index. Before, they were `(0, 0)` and a boolean, silently.
- **A `<math>` made from an iteration, or a group, holding a `<mathList>` of several entries is `doenet-e0064`**, as `<math extend="$ml"/>` already was: `<math extend="$r[1]"/>` of `<repeat name="r" for="1">$ml</repeat>` showed a blank with no message.
