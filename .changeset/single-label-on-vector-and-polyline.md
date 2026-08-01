---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graphs: a labeled `<vector>` or `<polyline>` draws its label only once, instead of repeating it on every draggable handle.

A `<vector><label><m>x^2</m></label></vector>` in a graph drew three copies of its label: the intended one beside the arrow, plus one at the head and one at the tail. A `<polyline>` did the same at each vertex. Only the component's own copy was typeset, so with a `<m>` label the extra copies appeared as raw LaTeX — `\(x^2\)`.

The extra copies came from the invisible points each renderer creates as drag handles. Those points inherit the component's attributes, including its label text, and the instruction that switched the label back off was being silently dropped. `<vector>`, `<lineSegment>` and `<polyline>` now build their drag handles from one shared helper, so the suppression can no longer go missing from one of them.
