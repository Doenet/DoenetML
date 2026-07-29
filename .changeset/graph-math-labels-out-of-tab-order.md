---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop math inside a graph from taking a keyboard tab stop.

A graph is presented to assistive technology as a single image named by its `<shortDescription>`, so nothing drawn inside it is separately reachable. MathJax, though, marks every expression it renders as focusable, which put a tab stop on each math label in the graph — `<graph><label><m>A</m></label></graph>` made keyboard users stop on an `A` that is not in the accessibility tree and does nothing when focused.

Math rendered inside a graph is now skipped when tabbing, along with the rest of the graph's contents. Math elsewhere on the page is unchanged, and the graph's own keyboard-navigable objects still take focus as before.

Closes #1538.
