---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give the physical-side attributes on inputs and tabulars a logical `start`/`end` vocabulary.

`labelPosition` on `<textInput>`, `<mathInput>`, `<booleanInput>`, `<choiceInput>`, `<matrixInput>` and `<fractionInput>` now takes `start` and `end` instead of `left` and `right`. The label sits beside the input in DOM order, which mirrors with the writing direction, so under `dir="rtl"` the old names said the opposite of where the label went.

The tabular border attributes — `left`, `right`, `top` and `bottom` on `<cell>`, `<row>` and `<tabular>`, inherited from PreTeXt — become `startBorder`, `endBorder`, `topBorder` and `bottomBorder`, and are drawn with logical CSS so they follow the writing direction rather than staying pinned to a physical edge. `halign` takes `start` and `end` alongside `center` and `justify`.

`resultsLocation` on `<codeEditor>` and the host-facing `viewerLocation` prop take `start`/`end` too. The editor and viewer panels are placed in DOM order and already mirrored with the writing direction, the way panes conventionally do in a right-to-left interface; only the names claimed otherwise. Hosts passing `left`/`right` to `viewerLocation` keep the layout they had.

Documents using the old names and values keep working: they are migrated with a deprecation warning naming the replacement. `labelPosition` on graph components such as `<point>` and `<line>` is unchanged — it places a label in coordinate space, which does not mirror.
