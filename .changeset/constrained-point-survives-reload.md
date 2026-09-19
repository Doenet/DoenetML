---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A point that has been dragged can be loaded again when it carries a constraint.

A `<point>` with no coordinates of its own, held to a curve, function or other
graphical object by a `<constrainTo>` or an `<attractTo>`, saved a position that
the document could not read back. The reader saw the problem go blank, and
because the position was already saved, it went blank on every later visit too —
there was nothing they could do on the page to recover, while a reader who had
not dragged the point was unaffected.
`<endpoint>` and `<equilibriumPoint>`, which are kinds of point, behaved the
same way.

Saved positions now come back as the kind of value the rest of the document
expects, so the point returns to where it was dragged.

Closes #1939.
