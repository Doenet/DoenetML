---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<legend>` honors its `layer` attribute and can draw an opaque box behind itself.

Every piece of a legend — its swatches and its labels — is now drawn at the
DoenetML `layer` the legend asks for, offset the same way the rest of a graph's
contents are. `<legend layer="3">` therefore sits above a `layer="2"` rectangle,
where before it was painted underneath one. A legend now defaults to `layer="1"`
rather than `layer="0"`, so that it still sits above everything on the default
layer, as its labels and marker swatches did before.

The new `boxed` attribute draws an opaque box behind the legend, so a curve
passing behind it is hidden rather than tangled up with the labels. The box
paints the graph's background color, or the `backgroundColor` of the legend's
`<styleDefinition>` when one is set, and is bordered so it reads as a panel in
both light and dark presentation.

Legend labels now follow the theme, and the legend's `<styleDefinition>`, rather
than being painted black whatever the theme was: they read white on a dark canvas
and take the style definition's `textColor` when one is set, so an author who
paints the box a color of their own can name the text color that reads against it.

A `<legend>` inside a `<graph>` also honors `hide` at last: it was drawn whether
or not it was hidden, which `boxed` would have made plain, since a hidden legend
would still have painted an opaque box over the graph.

Legend labels are also kept on one line. A label too long for the room beside
its swatch used to wrap, which made it taller than the single row the legend
gives each entry — overlapping the entry below it and overflowing the box drawn
around them. It now runs past the graph's edge instead.

Closes #1717.
