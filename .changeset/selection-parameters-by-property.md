---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fewer false errors from the check that a random selection's parameters can't be changed by a reader (`doenet-e0070`, SEL-1), and no extra warning on a selection in error.

- **A property is read by what decides it**, not as the whole component. A section's `sectionNumber` is decided by where the section is, so `$sec.sectionNumber` of a `<section>` holding an input is no longer an error; it is one when an input decides its `includeParentNumber`, or how many sections come before it (a `<conditionalContent>` or repeat holding a section, before it among the sections it is numbered with, or before a parent whose number it includes). A graph's properties are decided by its attributes, and its axes (`xMin`, `xMax`, `yMin`, `yMax`, `xScale`, `yScale`, and `aspectRatio` with `identicalAxisScales`) by a reader who pans or zooms, so `$g.xMax` is an error unless the graph, and every graph linked to it by an extend, has `fixAxes` (or is `fixed`); `$g.aspectRatio` of a graph with a draggable point in it is fine. Any other property still reads the whole component: `$sec.creditAchieved` of a section holding an answer stays an error.
- **A reference to a property of a selection in error** (`$s.value`, `<number extend="$s.value"/>`), or of any other component in error, no longer also warns `doenet-w0104`: the error is reported once, where it is (DIAG-4, DIAG-5).
