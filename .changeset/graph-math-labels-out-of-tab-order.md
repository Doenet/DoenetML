---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop math inside a graph from taking a keyboard tab stop.

A graph is presented to assistive technology as a single image named by its `<shortDescription>` — or hidden entirely, when it is `decorative` — so a label drawn inside it is not separately reachable. MathJax, though, marks every expression it renders as focusable, which put a tab stop on each math label in the graph: `<graph><label><m>A</m></label></graph>` made keyboard users stop on an `A` that is not in the accessibility tree and does nothing when focused.

Math drawn inside a graph is now skipped when tabbing. Math elsewhere on the page is unchanged, as are the graph's own keyboard-navigable objects and any input or button anchored in it — those still take focus as before.

Closes #1538.
