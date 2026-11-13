---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Copies and extends of composites: what is written on them applies, or is reported.

- **`condition` written on a `copy` of a `<conditionalContent>`** is the condition of its source's one case, so `<conditionalContent copy="$c" condition="true"/>` shows `$c`'s content, where it showed nothing. On a copy of a `<conditionalContent>` with several cases, it is ignored with warning `doenet-w0079`.
- **`valueName` and `indexName` written on a `copy` of a `<repeat>` or `<repeatForSequence>`** name that copy's values and indices, both in what it copies and in children written in it: `<repeatForSequence copy="$r" valueName="u"><number>2$u</number></repeatForSequence>` doubles each value, where it showed `NaN` or the first value each time.
- **`replacement` written on a `copy` of a `<substitute>`** is of the substitute's `type`, so a math copy loads and a text copy shows `z+1`, where the math one failed to load and the text one showed `NaN+1`.
- **A child written on a `copy` or `extend` that the component would not use** gives a warning: on an extend, `doenet-w0169`, and on a copy, the new `doenet-w0190`. This covers a `<math>` beside a `<matrix>`'s rows, a `<curve>`'s functions beside its `through` points, and the value of an input written on its extend. A `<function>`'s formula, a `<matchesPattern>`'s expression and an `<orbitalDiagram>`'s diagram written on a copy apply, as the last one written; on an extend they are ignored. `<point copy="$pl[1]">(7,8)</point>` is at (7,8), where it kept the list entry's coordinates.
- **A `<sequence>` written with `extend` or `copy` of something other than a sequence** no longer stops the document from loading. It is the new error `doenet-e0071` when it is made from a property (`$s.value`), from an iteration holding more than a sequence, or from anything else that is not one sequence, as are `<sampleRandomNumbers>`, `<selectPrimeNumbers>`, `<samplePrimeNumbers>`, `<sampleMultivariateRandomNumber>` and `<sortIndices>`, each of which makes its values from its attributes. Through an index that names nothing, it is missing (`＿`).
- **`<point extend="$ci"/>` of a `<choiceInput>`** is decided again as the selection changes: missing, with `doenet-i0053`, while the selected choice is not a tuple, and the point again when it is, as for a `<mathInput>`.
- **An attribute written empty that needs a value** (`<repeat for="">`) is the coded error `doenet-e0072`, which says to write a value. A component in error beside one math in a `<group>` is missing, so `<point extend="$g"/>` is made from the math, where it was `(0, 0)`.

Closes #2217. Closes #2211. Closes #2216. Closes #2486. Closes #2501. Closes #2488.
