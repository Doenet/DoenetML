---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The panels of a `<sideBySide>` (including each row of an `<sbsGroup>`) now stack, one below another in document order and each as wide as the `<sideBySide>` itself, when the document is narrower than 30em (480px at the default text size), as on a phone held upright. Before, they kept their percentage widths at every size, so on a phone a table beside a graph was cut off and the graph shrank until its own buttons covered its axes. The threshold is measured on the document, not the screen, so a document in a narrow column or iframe stacks too, and it grows with the reader's text size. At 30em and wider the layout is unchanged, a `<sideBySide>` nested in a panel follows the document rather than its panel, and a `<sideBySide>` with one panel keeps its `widths` and `margins` at every width.

Closes #347.
