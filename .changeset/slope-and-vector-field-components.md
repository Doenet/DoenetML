---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add `<slopeField>` and `<vectorField>` graphical components for drawing direction fields on a `<graph>`.

`<slopeField>y - x</slopeField>` draws the slope field of a differential equation as tick marks on a lattice; `<vectorField>(y, -x)</vectorField>` draws a two-output function as arrows, either scaled by magnitude or normalized to show direction alone. Both take their function either as a bare expression child, which is read as a function of both `x` and `y`, or from a `<function>` referenced with the `function` attribute, which may take one input or two. The lattice they are sampled on is set by `dx`, `dy`, `xoffset` and `yoffset`, which mirror `<pegboard>`'s attributes of the same names, along with `markLength` (measured in pixels) and `maxMarks`.

Authors previously built these by nesting `<repeatForSequence>` to emit one `<lineSegment>` per lattice point, which does not scale: the reactive core has to evaluate several math expressions per mark and JSXGraph creates an SVG element for each one. A field of a few hundred marks built that way takes about 16 seconds to appear; `<slopeField>` draws a field of comparable density in about 1 second, using a constant number of SVG nodes instead of one per mark, because the whole field is a single curve whose coordinate arrays carry NaN pen-ups between marks.

Two things follow from doing the geometry in the renderer that the hand-built version could not do. The field re-tiles from the live bounding box as the graph is panned or zoomed, rather than being pinned to a hard-coded range; and marks are sized in pixels, so they stay the same length and show the true visual angle even when the axes are not equally scaled — the hand-built version was only correct under `identicalAxisScales`. `maxMarks` bounds the work by coarsening the lattice when zoomed out, rather than leaving the mark count unbounded.
