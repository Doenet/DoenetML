---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A copy of a component that holds a reference to itself, such as `<section name="S2" copy="$S"/>` for a section `S` containing `$S`, or `<point copy="$P"/>` for a point `P` whose label contains `$P`, no longer stops the document from loading with "Seem to have an infinite loop while calculating replacement changes". The document now loads as it does without the copy: the copy shows what the original shows, and the rest of the document renders. A reference that is circular, like `$S` in `S`, is reported as a circular dependency. In a label, where the reference stands for the point's value, the copy's label shows the copy's coordinates.

Closes #2405.
