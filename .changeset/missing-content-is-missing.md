---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

More missing values are shown as a blank, `＿`, and never equal anything (D40).

- **A `<number>`, `<integer>`, `<boolean>`, `<function>` or shape whose content is only a missing reference is missing**, where it held the value of the empty tag: `<number>$nothing</number>` and `<number>$l[$i]</number>` past the end of `l` show `＿`, not `NaN`, `<boolean>$nothing</boolean>` shows `＿`, not `false`, and `<function>$nothing</function>` shows `＿`, not `0`. A `<circle>`, `<polygon>`, `<curve>` or other shape whose content is only a missing reference isn't drawn in a graph. A reference to one of these is missing too, so `$n = $n` is false, and so is a tag of it or of a property of it (`<number extend="$n"/>`, `<math extend="$n"/>`, `<number extend="$n.value"/>`). It is made from its content again once the reference names something, and the tags follow it; a `copy` made while it is missing stays missing. Where the blank is part of an expression it takes part, as before: `<number>$nothing + 1</number>` is still `NaN`, and `<boolean>$nothing = 1</boolean>` is false. Operators such as `<and>` and `<sum>` still take a missing operand as a blank.
- **A tag of a property entry with no value is missing while it has none**, where it held `NaN`, `""` or, for a `<math>`, a blank drawn as a math: `<number extend="$P.z"/>` of a point in the plane, `<number extend="$f.minimumValue1"/>` of a function with no minimum, `<text extend="$ci.selectedValue"/>` before a choice, and `<math extend="$ans.submittedResponse"/>` before a submission show `＿` and never equal anything. Once the entry has a value, the tag shows it. A tag of an array (`$f.minima`) still holds its entries, possibly none.
- **In a `<text>`, a reference to one thing that makes nothing is a blank, as it is in a `<p>` and a `<math>`**: `<text>$c.maxNumber</text>` of a `<collect>` with no limit, `<text>$r[3]</text>` of a repeat with two iterations, `<text>$f.minimumValue1</text>`, and `<text>$g.maths</text>` of a group none of whose members has a `maths` property show `＿`, and `<text>x $c.maxNumber y</text>` is `x ＿ y`, where they showed nothing. In a `<math>` and a comparison such a reference is missing, so it never equals anything. A property that none of a collection's members has is a blank in a `<p>` too, with its warning: `$g.maths` of that group, `$pl.bad` of a `<pointList>`, and `$cc.notThere` of a `<conditionalContent>` show `＿`, where they showed nothing.

Closes #2487, and the part of #2461 for components that aren't lists.
