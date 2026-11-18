---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Copies and extends: a matrix's math, a substitute's type and child, a function's formula written as a reference, and what is shown when what a copy is made from changes.

- **A `<matrix>` uses one `<math>` child, the last one written.** `<matrix><math>$A</math><math>$B</math></matrix>` is `B`, with the new warning `doenet-w0194`, where it was a 1×1 matrix holding the product `A B`. A `<math>` beside `<row>` or `<column>` children is ignored with the same warning, where it was ignored silently. So a `<math>` written on a `copy` of a matrix replaces its source's: `<matrix copy="$M"><math>$A - $B</math></matrix>` is `A − B`, where it was ignored with `doenet-w0190`, and so does plain text or a reference written on it (`<matrix copy="$M">$B</matrix>`). On an `extend` it is still ignored, with `doenet-w0169`. Plain text in a matrix (`<matrix>1 2</matrix>`) is one `<math>`, as before.
- **`type` written on a `copy` of a `<substitute>`** reads the source's content, `match` and `replacement` as that type: `<substitute copy="$t" type="math"/>` of a text substitute, and the reverse, load and substitute, where they stopped the document from loading. A value written to a `<substitute>` with no `match` (as by `<mathInput bindValueTo="$s"/>`) is written to its content, where it was lost.
- **A child written on a `copy` of a `<substitute>`** replaces its source's: `<substitute copy="$s">x+2</substitute>` substitutes into `x+2`, where it kept the source's content silently.
- **A `<function>` whose formula is a reference** (`<function name="f">$m</function>`) has it recognized as its formula: a formula written on its copy replaces it, and one written on its extend is ignored with `doenet-w0169`, where the copy kept the source's formula and the extend ignored it with no warning. A reference written on a copy (`<function copy="$g">$m3</function>`) replaces the source's formula too. A reference written on a copy of another tag is matched the same way, as what it names: `<curve copy="$c">$f</curve>` of a curve with `through` points ignores the function `$f` with `doenet-w0190`, where it was unused with no warning.
- **A `<repeat>`, `<select>`, `<collect>`, `<sort>` or other tag that makes its content itself, written with `extend` or `copy` of a property** (`<repeat extend="$s.value"/>`) or of an entry (`$l[2]`), is the error `doenet-e0071`, which says to write the reference bare. Of a property holding several values, such as `$s.value`, it showed nothing, with no error; of one holding one value, or of an entry, it was the error `doenet-e0065`.
- **A component in error beside others in a `<group>`** is left out of a tag made from the group also when it appears later: `<point extend="$g"/>` of a group holding a math and a `<conditionalContent>` that comes to show a `<repeat for="">` stays the math's point, where it became `(0, 0)`.
- **`<point extend="$ci"/>` of a `<choiceInput>`** is missing (`＿`), with the new info `doenet-i0061`, while no choice is selected or more than one is, where it was `(0, 0)` or the first selected. With a text among the choices it is the error `doenet-e0065` when the document loads, also while nothing is selected.

Part of #2546.
