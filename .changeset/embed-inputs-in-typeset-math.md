---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Render a `<textInput>` or an inline `<choiceInput>` in place inside typeset math.

An input written inside `<m>`, `<me>`, `<men>`, or an `<mrow>` of an `<md>` is now drawn where it is written, inside the MathJax output, instead of being flattened to its current value. The motivating case is an aligned `<md>` derivation where the reader fills in the missing step in the place that step belongs; the rows stay aligned around the input, because the space it needs is measured before the display is typeset.

Only inputs whose size is settled before layout are embedded. A `<mathInput>` is not, because it changes size as the reader types; neither is a non-`inline` `<choiceInput>` or an `expanded` `<textInput>`, which are too large to sit in a line of mathematics. Those still render as they did before, and now warn that they are not being drawn inside the expression.

The public `latex`, `text`, and `math` properties still report a filled-in input's value, so `$m.latex` remains the static rendering of the expression — and an input left empty now leaves a blank there instead of nothing. Previously it contributed nothing at all, which did not leave a gap so much as delete a term: `<m>x = <textInput/> + 3</m>` produced `x =  + 3`, in which the `+` is no longer an operator but a sign. It now produces `x = \underline{\hspace{2em}} + 3`; `text` reads `x = ＿ + 3`, and `math` keeps its shape as `x = ＿ + 3` rather than collapsing to a bare placeholder.

A PreTeXt export writes those blanks out as `<fillin>`, the element PreTeXt's own content model provides for them, so an exported worksheet shows a gap where the reader is meant to write. An input the reader has already filled in exports its value instead.

An embedded input is described to a screen reader by the expression it sits in — `<m>x = <textInput/> + 3</m>` reads as "x equals blank plus 3" — unless the author gives it a `<shortDescription>` or `<label>`. Its visible label and check-work button are not drawn, since there is nowhere inside an equation to put them.
