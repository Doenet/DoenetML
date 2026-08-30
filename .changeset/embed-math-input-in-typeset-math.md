---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Render a `<mathInput>` in place inside typeset math.

A math input written inside `<m>`, `<me>`, `<men>`, or an `<mrow>` of an `<md>` is now drawn where it is written, alongside the text and choice inputs that could already be. The motivating case is an aligned `<md>` derivation in which the reader writes the missing step, as mathematics, on the line that step belongs to.

A math input is the one input that grows as the reader types — in both directions, with the caret inside it — which is why it could not be embedded before. The room reserved for the field follows it exactly as it grows, and is not taken back until the value is committed. The expression is re-typeset around it in the same frame as each keystroke when that is cheap enough — which it is for an expression of ordinary size — and a beat behind when it is not, so that a large display does not hold up the typing. The field keeps its place while it grows — in a centred display as well, which is held where it is for as long as the field is being edited, so that the room opens up beside the field rather than the line recentring under the caret, and which is centred again when the value is committed and when the reader leaves the field. The rest of the expression is not held back: a reference such as `$mi.immediateValue` updates with every keystroke inside math as it does anywhere else, and the input keeps its caret while the expression is re-typeset around it. An author who places such a reference *before* the input in its row should expect the input to move over as it is typed into.

`<mathInput>` gains a public `latex` property, the committed value written as LaTeX. This is what a field embedded in an expression contributes to that expression's `latex`, `text`, and `math` — so `<m>x = <mathInput/></m>` reports `x = \sqrt{2}` rather than the plain-text `x = sqrt(2)` it would otherwise have reported — and it is available to authors in its own right, as `<math>` has had it.

A field left empty leaves a blank in those properties, and a PreTeXt export writes it out as a `<fillin>`, exactly as an empty text input already did. Inside an expression the field's visible label is not drawn, since there is nowhere in an equation to put it; the expression names the field to a screen reader instead, unless the author names it with a `<shortDescription>`, a `<label>`, or a `<label for>`. The typeset preview, when an author asks for one, opens above the field rather than beside it, where the rest of the equation is.

Math drawn on a `<graph>` is a single picture with no room for a control, so a math input there renders as it did before, and now warns to say so.
