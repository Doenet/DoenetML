---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A boolean is never read as a number, nor a number as a boolean, unless the author asks: `<number convertBoolean>` is the one place a boolean counts as 1 or 0, and a comparison such as `$n != 0` is how a number decides a boolean. Each other mix is a blank in its place, with a warning when the document loads, wherever it is written, and a type change between them is an error. Ordering a text against a number is warned of too.

- **A boolean where a number or a math is wanted** is a blank, with the warning `doenet-w0202`, which suggests `<number convertBoolean>$b</number>` (written outside the attribute and named, for a boolean in one): a boolean in a `<math>` (`<math>$b + 1</math>` is `＿ + 1`), in a `<number>` or `<integer>` without `convertBoolean` (`<number>$b</number>` is a blank), in a `<mathList>` or `<numberList>`, in `<sum>` and the other math operators, `<isNumber>`, `<count>`, a `<function>`, an `<interval>`, a `<matrix>` row, a `<point>` or `<vector>`, and in a math attribute (`<point x="$b">`, `<sequence from="$b">`). Before, a boolean in a `<math>` or an operator was dropped with `doenet-w0107` ("Invalid children"), and `<number>$b</number>` was `NaN`. A list of booleans, an entry of one, and a repeat's value that is a boolean are read the same way. Where a text is wanted (`<text>$b</text>`, a `<p>`), a boolean is still the word `true` or `false`.
- **A number or a math where a boolean is wanted** is a blank, with `doenet-w0202`, which suggests a comparison: `<boolean>$n</boolean>`, `<boolean>2</boolean>`, an operand of `and`, `or` or `not` (`<boolean>$b and $n</boolean>`), a boolean attribute (`hide="$n"`, `hide="1"`, a `<case>`'s `condition`), a number in a `<booleanList>`, and a number in `<and>` or `<or>`. Before, a nonzero number was silently `true`, and a number in a `<booleanList>`, `<and>` or `<or>` was dropped with `doenet-w0107`. Write `true` or `false` for a literal, and a comparison (`$n > 0`, `$n != 0`) to test a number.
- **A boolean compared with a number** (`<boolean>$b = 1</boolean>`) is a blank, with `doenet-w0202`. `$b = true` compares booleans, as before.
- **`<mathInput bindValueTo="$b">`** of a boolean, and **`<booleanInput bindValueTo="$n">`** of a number, are bound to a blank, with `doenet-w0202`, which suggests the input of the other type. Before, a `<booleanInput>` bound to a number showed a nonzero number as checked, and unchecking it changed nothing.
- **A type change between them is an error** (`doenet-e0065`): `<math extend="$b"/>`, `<number copy="$b"/>` and `<math extend="$bi"/>` of a `<booleanInput>`, with the same suggestion of `<number convertBoolean>`, and `<boolean extend="$n"/>` of a number or a math, which suggests a comparison. Before, they were allowed. A boolean and a text still convert both ways.
- **A boolean in a random choice's parameter** (`<selectFromSequence to="$b+2">`) can't be analysed, `doenet-e0074`, as any parameter that isn't a number is. Through a `<number convertBoolean>` it is read as before.
- **`credit` on an `<award>` or `<choice>` still takes a boolean**: `credit="$b"`, `credit="$n > 2"`, `credit="$b and not $c"` and `credit="true"` give full credit when true and none when false, with no warning, since `credit` is read as a `<number convertBoolean>`.
- **Ordering a text against a number** with `<`, `>`, `<=` or `>=` (`$t > 2`) is never true, and now warns when the document loads (`doenet-w0203`). Nothing is converted, and `=` is unchanged. For a section's `sectionNumber`, a text such as `2.1`, the warning suggests the section's `ownNumber`, its position as a number.
- The editor's schema check flags a `<boolean>` or `<booleanList>` written inside a `<math>` or another container that takes maths, as it did before.
