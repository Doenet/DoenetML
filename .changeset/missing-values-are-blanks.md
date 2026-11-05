---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A missing value is shown as a blank, `＿`, and a tag whose source is missing is itself missing (D37). This is a backward-incompatible change to what documents show for missing values.

- **A reference to one thing that names nothing shows `＿`**, where it showed nothing: `$l[$i]` and `$s[$k]` out of range, an iteration a `<repeat>` doesn't have, a property the referent doesn't have (`$n.nonexistent`, with its warning), a typo (`$nothing`, with its warning), `$ans.submittedResponse` before a submission, `$ci.selectedValue` before a choice, and a name in a `<conditionalContent>` case that isn't active. A reference to a collection as a whole (`$r` or `$r.y` of a `<repeat>`, `$g` of a `<group>`, a list) still shows its members, possibly none. A blank is announced as "blank" to a screen reader, and is not drawn in a graph.
- **A tag whose source is missing is missing, whatever it adds**: `<math extend="$nothing">+1</math>`, `<text extend="$nothing">hi</text>`, `<p extend="$r[$i]">note</p>` while the index names nothing, and `<point extend="$m"/>` while `m` isn't a tuple show `＿`, without their children, and a `<mathInput extend="$nothing"/>` shows no input box. A missing point in a graph isn't drawn. A missing tag is not `<T/>`: a reference to it, or to a property of it (`$m.value`), is missing too, and it never equals anything. `hide` still hides it. It is made again from its source, with its children, once the source is there.
- **The tag reports what the bare reference reports, at the same level.** A reference in `extend` or `copy` that names nothing or is ambiguous (`doenet-w0104`, `doenet-w0105`), names a property the type doesn't have (`doenet-w0104`), has a literal index past the picks (`doenet-w0181`), or names something a branch lacks (`doenet-w0183`) is a warning, with the tag missing, where it was an error shown in the tag's place. A `<conditionalContent>` with no `<else>`, or a case or option holding nothing, is no longer an error on a scalar tag made from it (the `noElse` reason of `doenet-e0064` is gone): the tag is missing while it holds nothing, with the new info `doenet-i0055`. The infos for an index that names nothing (`doenet-i0054`) and a value that doesn't convert (`doenet-i0053`) now say the tag is missing. Types that don't fit stay errors.
- **An operator takes a missing operand as a blank**, as `<math>` does, where it left it out: `<sum>$l[$i] 3</sum>` is `＿ + 3` while the entry is missing, not `3`. A boolean operator takes it as not true.

Closes #2456.
