---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Render a `<mathInput>` in place inside typeset math.

A math input written inside `<m>`, `<me>`, `<men>`, or an `<mrow>` of an `<md>` is now drawn where it is written, alongside the text and choice inputs that could already be. The motivating case is an aligned `<md>` derivation in which the reader writes the missing step, as mathematics, on the line that step belongs to.

A math input is the one input that grows as the reader types — in both directions, with the caret inside it — which is why it could not be embedded before. Rather than re-typesetting the expression around each new size, the room reserved for the field is given out in steps that several keystrokes fit inside, and is not taken back until the value is committed. The field keeps its place while it grows, so the expression makes room around it rather than sliding out from under the caret. Everything else in the expression is held still for as long as an embedded input is being used — a text or choice input as well as a math field — and catches up as soon as the reader commits a value: presses Enter, picks from the list, or moves on. The input keeps its caret while the expression catches up around it.

`<mathInput>` gains a public `latex` property, the committed value written as LaTeX. This is what a field embedded in an expression contributes to that expression's `latex`, `text`, and `math` — so `<m>x = <mathInput/></m>` reports `x = \sqrt{2}` rather than the plain-text `x = sqrt(2)` it would otherwise have reported — and it is available to authors in its own right, as `<math>` has had it.

A field left empty leaves a blank in those properties, and a PreTeXt export writes it out as a `<fillin>`, exactly as an empty text input already did. Inside an expression the field's visible label and check-work button are not drawn, since there is nowhere in an equation to put them; the expression names the field to a screen reader instead, unless the author names it with a `<shortDescription>`, a `<label>`, or a `<label for>`. The typeset preview, when an author asks for one, opens above the field rather than beside it, where the rest of the equation is.

Math drawn on a `<graph>` is a single picture with no room for a control, so a math input there renders as it did before, and now warns to say so.
