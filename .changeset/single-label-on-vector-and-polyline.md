---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graphs: a labeled `<vector>` or `<polyline>` draws its label once again, instead of repeating it on every draggable handle.

A `<vector name="v"><label><m>x^2</m></label></vector>` in a graph drew three copies of its label: the intended one beside the arrow, plus one at the head and one at the tail. `<polyline>` did the same at each vertex. Only the component's own copy was typeset, so with a `<m>` label the extra copies appeared as raw LaTeX — `\(x^2\)`.

Both renderers build the invisible drag handles by copying the component's own JSXGraph attributes, which include its label text, and then switching the label back off. The two spellings of that attribute — `withlabel` in the shared attribute builder, `withLabel` in the override — became distinct object keys, and JSXGraph resolves such a clash in favor of the one written first, so the override was silently dropped and each handle kept the label.
