---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference written as a related tag is made from the value of what it references, so it shows that value converted instead of the tag's default (D26, D37, REF-5).

- **An input written as a related tag is made from its value.** `<point extend="$mi"/>` of a `<mathInput>` holding `(1,2)` is the point `(1, 2)`, and dragging it edits `mi`; it showed `(0, 0)`. `<text extend="$mi"/>`, `<math extend="$ti"/>`, `<number extend="$ti"/>`, `<boolean extend="$ti"/>` of a `<textInput>`, and `<math extend="$bi"/>`, `<text extend="$bi"/>`, `<number extend="$bi"/>` of a `<booleanInput>` show the input's value too, where they showed `＿`, an empty text, `NaN` or `false`, most with an "invalid children" warning (`doenet-w0107`).
- **A boolean is `1` or `0` as a number or a math.** `<number extend="$b"/>` and `<math extend="$b"/>` of a `<boolean>` that is true are `1`, and writing `0` or `1` to them sets the boolean. They showed `NaN` and `＿`. Also, `<number convertBoolean>$b</number>`, holding one boolean, can now be changed: `1` and `0` set the boolean to true and false.
- **A `<boolean>` made from a text is true or false while the text is that word**, in any case. `<boolean extend="$t"/>` of a `<text>` holding `true` is true; it was always false. While the text is any other word it is missing, with the info `doenet-i0053`, and writing to the boolean writes the word back.
- **A property, and the selected value of a `<choiceInput>`, are checked against their value.** `<point extend="$P.x"/>` is missing, with `doenet-i0053`, as `$P.x` is never a tuple; it was a point whose value was a number. A point made from one coordinate, such as `<point extend="$c.throughPoints[1][1]"/>`, is missing too: to use the coordinate as a value, write `<math extend="$c.throughPoints[1][1]"/>`. `<point extend="$ci"/>` of a `<choiceInput>` of maths is missing when the selection is not a tuple as the point is made. A value read from an input or a property is checked again as it changes, except the selection of a `<choiceInput>`, which is checked only when the tag is made.
- **The one component a composite holds is found through references in it.** `<point extend="$cc"/>` of a `<conditionalContent>` whose case holds `$m`, or holds another `<conditionalContent>`, `<point extend="$g"/>` of a group holding `$cc`, and `<vector extend="$h"/>` of a group holding `<point extend="$cc[1]"/>` show that component converted, `(1, 2)`, and follow it as cases switch or its value changes; they showed `(0, 0)` or `(1, 0)`. While it holds nothing, as when the nested `<conditionalContent>` has no case true, the tag is missing with the info `doenet-i0055`, which a tag made from a case that holds nothing, or from a group of empty groups, now gets too.
- **A `<subsetOfRealsInput>` can be bound and extended.** `<mathInput bindValueTo="$sori"/>` and `<mathInput bindValueTo="$sori.subsetValue"/>` edit the input, and an unnamed `<subsetOfReals extend="$sori"/>` renders. Each failed to load ("object is not a tree node"). An answer records a `<subsetOfReals>` written or extended among its responses as its subset, as it does `$sori`; it recorded it as a math.

Closes #2440, #2429 and #2437.
