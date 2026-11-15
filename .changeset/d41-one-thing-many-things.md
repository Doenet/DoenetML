---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Every collection has a `numItems` property: the number of items an index selects among. That is the entries of a list (`<mathList>`, `<pointList>`, …), a `<sequence>`, the random selectors and samplers, the list operators (`<cumulativeSum>`, …), `<functionIterates>`, the components a `<collect>` collects, what a `<sort>` or `<shuffle>` reorders, the iterations of a `<repeat>` or `<repeatForSequence>`, the picks of a `<select>`, and, for a `<conditionalContent>`, 1 while a case is shown and 0 otherwise. It is the collection's own, so it wins over a property of the same name of its items; an item that is itself a collection is reached by index (`$r[2].numItems`). The lists you write keep `numComponents`, and `numPoints`, `numVectors`, `numIntervals` and `numValues` where they had them.

A `<collect>`, `<sort>` or `<shuffle>` of values gives the same properties whichever way it is built. A count or setting it took from the list it is built on now names nothing, with the usual warning, as it does after a `<collect>` of paragraphs: `$c.numPoints` and `$c.numComponents` of a collect of points, `$s.numValues`, `$s.maxNumber` and `$s.unordered` of a sort. Use `numItems`. Any other property after it is still that property of each item (`$c.x` is each point's x).

A collection's settings are its own: `$s.fixed`, `$r.fixed`, `$cc.disabled` and `$pl.fixed` read the select, repeat, conditional content or list itself, not each item, where they used to give each item's. Reach an item's by index (`$pl[2].fixed`).

**Behavior change: `<functionIterates>` shows its iterates.** It is a collection: it shows its iterates separated by commas, where it showed nothing, an index selects an iterate (`$fi[2]`), a property after it is that property of each iterate, and `numItems` counts the iterates. Add `hide` to a `<functionIterates>` that should not be seen. `numIterates`, `iterates`, `finalIterate` and `allIteratesWithInitial` are as before; `$fi.numDimensions` is now each iterate's (`2, 2`, was `2`).

**Behavior change: an index after a `<solveEquations>` names nothing.** It is one thing, not a list. `$s[1]` was the first solution; it is now a blank with a warning suggesting `$s.solutions[1]`, which is the first solution.

A `<ray>` whose endpoint, a point it goes through, or its direction is missing (`through="$nothing"`, `endpoint="$pl[3]"` while `pl` has two points) is missing and not drawn, and is made again once the point is there. So is a `<circle>` or `<regularPolygon>` with a missing `center`, a `<rectangle>` with a missing `center`, and a `<parabola>` with a missing `vertex`. A `<regularPolygon>` or `<rectangle>` with a missing center stopped the document before.
