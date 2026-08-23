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
contents are. `<legend layer="3">` therefore sits above a `layer="2"` rectangle
instead of underneath it, as it did before. A legend now defaults to `layer="1"`
so that it still sits above everything on the default layer, which is where the
JSXGraph defaults used to put it.

The new `boxed` attribute draws an opaque box behind the legend, so a curve
passing behind it is hidden rather than tangled up with the labels. The box
paints the graph's background color, or the `backgroundColor` of the legend's
`<styleDefinition>` when one is set, and is bordered so it reads as a panel in
both light and dark presentation.

Closes #1717.
