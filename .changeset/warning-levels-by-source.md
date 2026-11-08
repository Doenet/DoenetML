---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A diagnostic caused by a value that can change is now an info rather than a warning, and it lasts only while the value causes it, so that a warning means the DoenetML should change and a document waiting for its reader to fill in an input gives infos, not warnings, for these checks. The same check is still a warning when what causes it is decided by the DoenetML: written as a literal, or a reference to something that can't change. No diagnostic codes change.

A value can change when it comes from an input, an `<answer>`, a random choice, the case that is shown, or something the reader can write to: what an input's `bindValueTo` names, the `target` of an `<updateValue>`, `<animateFromSequence>` or `<callAction>`, and anything in a `<graph>` that isn't `fixed` or, for a point, line or other shape, given `fixLocation`, which the reader can drag, with what it references (not an index, such as `n` in `bindValueTo="$l[$n]"`, which is only read); what a cell of a `<spreadsheet>` that isn't `fixed` references, which an edit to the cell writes to; and whether a hint, solution or section is open or a video is playing. This includes content that isn't shown yet and each iteration of a `<repeat>`. A reference to something that can't change, such as `bins="$edges"` of a `<numberList name="edges">0 5 2</numberList>`, gives a warning, as the literal would.

- **An index from a value that names nothing:** `$l[$i]` or `$r[$i]` while `i` is blank or 0 gives an info when `i` can change, such as an input, which goes away once `i` names an entry. `$l[0]` is still a warning, and so is `$l[$i]` with `<number name="i">0</number>`.
- **An index into a value that is a single expression:** `$m[2]` is an info when `m`'s value can change, such as one that comes from an input. It is a warning when the value can't change, as in `<math name="m">5</math>`.
- **Geometry, functions and other math built from values:** for example, a `<circle>` or `<function>` through a point that uses a blank input, a `<line>` or `<ray>` whose points or dimensions come from inputs, a function `domain`, an `<odeSystem>`'s variables, `<solveEquations>`, `<eigenDecomposition>` and `<matchesPattern>` (`doenet-w0002`–`w0004`, `w0006`, `w0008`, `w0017`, `w0027`, `w0031`, `w0035`–`w0040`, `w0042`, `w0045`–`w0048`, `w0054`, `w0056`–`w0059`, `w0082`, `w0117`, `w0122`).
- **Sampling from parameters that come from values:** for example, `<sampleRandomNumbers type="gaussian" standardDeviation="$s"/>` while `s` is blank (`doenet-w0051`, `w0052`, `w0126`–`w0133`, `w0135`–`w0137`, `w0165`, `w0166`).
- **Charts, counts and index operators of values:** for example, a bar chart of a value from an input that is not a number, a chart `type`, `bins` or `barWidth` from a value, or `<searchSorted>` of values that are out of order while a student types (`doenet-w0134`, `w0139`–`w0144`, `w0146`, `w0148`–`w0161`, `w0164`). Their infos (`doenet-i0049`, `i0050`, `i0052`) now also go away when their condition ends.
- **A `<collect>` from content that isn't shown:** `<collect from="$cc.S"/>` while the case holding `S` isn't active gives an info when the case's condition can change (`doenet-w0072`), and a warning when it can't, as for `condition="false"`, whatever writes to the case's content. A `from` that names nothing is still a warning. So is a `componentType` that names no type, unless it comes from a value (`w0073`).
- **The target of an `<updateValue>` or `<animateFromSequence>` that holds nothing now**, such as a composite with no replacements or a list with no entries, gives an info when what it holds can change, such as a case whose condition comes from an input (`doenet-w0043`). It is a warning when it can't, as for `condition="false"` or an empty `<mathList>`, and a missing target is still a warning.
- **A graph's `grid`, bounds, `width` or `aspectRatio` from a value** that is invalid gives an info (`doenet-w0062`–`w0064`, `w0118`, `w0119`, `w0174`). A `grid` from a reference was silent before.

- **A select that can't select because of a reference to something that can't change** is now an error when the document loads, as when the attribute is written as a literal: for example, `<selectFromSequence to="2" numToSelect="$n"/>` with `<number name="n">3</number>`. One that reaches an input or another random choice still leaves the selection missing with an info (`doenet-e0032`, `e0035`, `e0036`, `e0041`–`e0047`, `e0051`).

- **Brackets that don't balance in a list written as text** (`doenet-i0058`) are an info only in a list of texts, such as `<textList>a) apple, b) banana</textList>`, where they are valid text. In any other list, such as `<mathList>(1, 2</mathList>`, or the options of a `<select>` or the `for` of a `<repeat>` of maths (their default type), they are a warning.

A copy of a component reports at the same level as its source.

Closes #2422.
