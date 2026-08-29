---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Render a `<textInput>` or an inline `<choiceInput>` in place inside typeset math.

An input written inside `<m>`, `<me>`, `<men>`, or an `<mrow>` of an `<md>` is now drawn where it is written, inside the MathJax output, instead of being flattened to its current value. The motivating case is an aligned `<md>` derivation where the reader fills in the missing step in the place that step belongs; the rows stay aligned around the input, because the space it needs is measured before the display is typeset.

Only inputs whose size is settled before layout are embedded. A `<mathInput>` is not, because it changes size as the reader types, and it renders as it did before. A `<choiceInput>` that is not `inline` or an `expanded` `<textInput>` is too large to sit in a line of mathematics, a `<textInput>` with a percentage `width` has nothing to measure against, and math drawn on a graph is a single picture with no room for a control; each of those also renders as it did before, and now warns that the input is not being drawn inside the expression.

The public `latex`, `text`, and `math` properties still report a filled-in input's value — for a choice input, the choice it has selected, which previously contributed nothing — so `$m.latex` remains the static rendering of the expression, and an input left empty now leaves a blank there instead of nothing. Previously it contributed nothing at all, which did not leave a gap so much as delete a term: `<m>x = <textInput/> + 3</m>` produced `x =  + 3`, in which the `+` is no longer an operator but a sign. It now produces `x = \underline{\hspace{2em}} + 3`; `text` reads `x = ＿ + 3`, and `math` keeps its shape as `x = ＿ + 3` rather than collapsing to a bare placeholder.

A PreTeXt export writes those blanks out as `<fillin>`, the element PreTeXt's own content model provides for them, so an exported worksheet shows a gap where the reader is meant to write. An input the reader has already filled in exports its value instead.

An embedded input is described to a screen reader by the expression it sits in — `<m>x = <textInput/> + 3</m>` reads as "x equals blank plus 3" — unless the author names it with a `<shortDescription>`, a `<label>`, or a `<label for>`. Its visible label and check-work button are not drawn, since there is nowhere inside an equation to put them; a `<label>`'s text becomes the input's accessible name instead, and a `<shortDescription>` given alongside it remains its description.
