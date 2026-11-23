---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<boolean>` whose content holds a boolean–number mix, or compares something that names nothing, is now a blank, not `false`, so an answer no longer credits the response "false" for it. `<number convertBoolean>` counts every boolean in its content, more mixes are found when the document loads, and a boolean can't be made from a label.

- **Logic holding a mix is a blank** (`＿`): `<boolean>$b = 1</boolean>`, `<boolean>$n + 0</boolean>`, and logic built on them, such as `not ($b = 1)` or a `<when>` condition. Before, each was `false` (and `not ($b = 1)` `true`), so `<answer><booleanInput/><award>$b = 1</award></answer>` gave full credit for the response "false". A reference to such a `<boolean>` is a blank too.
- **A comparison with a missing operand is a blank** too: `<boolean>$nothing = 1</boolean>`, `$nothing != 1`, `not ($nothing = 1)` and a comparison of two missing values are `＿`, where before they were `false` (or `true`, for `!=` and `not`). So an answer whose condition compares something that names nothing, or a value that has none yet (a `<choiceInput>`'s `selectedIndex` before a choice), no longer gives credit, for the response "false" either. An input left blank is not missing: `$mi != x` is still true while `mi` is empty, in a `<number convertBoolean>` and a `credit` too.
- **In a `<number convertBoolean>`, and so in `credit`, a boolean compared with a number compares 1 or 0**: `<number convertBoolean>$b = 1</number>` and `credit="$b = 1"` are 1 when `b` is true (before, a blank), and `$n = true` compares `n` with 1. Each now gets a warning, `doenet-w0208`, suggesting a plainer form that means the same (`$b` for `$b = 1`, `not $b` for `$b = 0`, `$n != 1` for `$n != true`).
- **`<number convertBoolean>` counts every boolean in its content** as 1 or 0: `<number convertBoolean>$b + 1</number>` is `2` when `b` is true (before, `NaN`), and `<number convertBoolean>($n > 1) + $b</number>` adds a comparison and a boolean. Content that is all literal counts its booleans too: `<number convertBoolean>(1 < 2) + 1</number>` is `2` (before, `0`). Anything else is read as a `<number>` reads it: `<number convertBoolean>2x</number>` is `NaN` (before, `0`). A missing operand makes it a blank: `<number convertBoolean>$nothing</number>` was `1`. An `<award>`'s or a `<choice>`'s `credit` is such a number, so `credit="$nothing"` (a reference to nothing) now gives no credit; before, it gave full credit.
- **More mixes are warned of at load** (`doenet-w0203`), each a blank: a number compared with `true` or `false` (`<boolean>$n = true</boolean>`, with its own message), a boolean in arithmetic inside a comparison (`<boolean>$b + 1 = 2</boolean>`), a mix inside logic that is compared (`$bi = not ($b = 1)`), and a boolean beside other values in a `<group>` inside a `<math>` (before, the boolean was dropped with `doenet-w0107`).
- **A tag written where a mix is keeps its own value**: in `<math><boolean name="q">true</boolean> + 1</math>`, the math is `＿ + 1` as before, but `$q` elsewhere is now `true` rather than a blank.
- **`<boolean extend="$l"/>` of a `<label>` is an error** (`doenet-e0065`), as for any other pair of unrelated types: a boolean is made only from a text, and a label is not one. Before, it was `false` with no message. A label can still be made a `<text>`.
