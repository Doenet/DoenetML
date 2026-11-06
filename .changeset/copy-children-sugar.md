---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Coordinates written as a child of a point `copy` or `extend` now set its coordinates, as `xs` does. Before, `<point copy="$P">(3,4)</point>` and `<point extend="$P">(3,4)</point>` were at `P`'s coordinates, and the `(3,4)` was ignored, with an "invalid children" warning; now each is at (3,4), as `<point copy="$P" xs="3 4"/>` is, at load and after `P` is dragged. More generally, the children written on a `copy` or `extend` now get the sugar of the tag's type before they are added, as the children of a tag written on its own do. So `<vector copy="$v">(3,4)</vector>` is (3,4) and `<sum copy="$s">3</sum>` adds 3 to the sum, where each child was ignored in the same way. A child the copy does not read once it is sugared, as `x^3` in `<function copy="$f">x^3</function>`, which becomes the function's `<math>`, is now ignored as that `<math>` written out is, with no warning.

Closes #2395.
