---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fewer false errors from the check that a random selection's parameters can't be changed by a reader (`doenet-e0070`, SEL-1), and no extra warning on a selection in error.

- **A property is read by what decides it**, not as the whole component. A section's `sectionNumber` is decided by where the section is and the attributes written on it, so `$sec.sectionNumber` of a `<section>` holding an input is no longer an error. A graph's properties are decided by its attributes, and its axes (`xMin`, `xMax`, `yMin`, `yMax`, `xScale`, `yScale`) by a reader who pans or zooms, so `$g.xMax` is an error unless the graph has `fixAxes` (or is `fixed`), and `$g.aspectRatio` of a graph with a draggable point in it is fine. Any other property still reads the whole component: `$sec.creditAchieved` of a section holding an answer stays an error.
- **A component dragged in a graph only to place it** (a `<number>`, `<math>`, `<text>`, `<label>` or `<image>`) changes its `anchor`, not its value. So a `<number>` placed in a graph, or a number a `<math>` in a graph reads, is no longer an error; `$n.anchor`, a number written in a text's `anchor`, and a number a draggable point reads still are. This also makes what such a component reads count as decided by the DoenetML for the level of other diagnostics (DIAG-2).
- **A reference to a property of a selection in error** (`$s.value`, `<number extend="$s.value"/>`) no longer also warns `doenet-w0104`: the error is reported once, where it is (DIAG-4, DIAG-5).
