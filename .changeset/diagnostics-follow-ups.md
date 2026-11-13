---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

More reference cycles are reported when the document loads, as a "circular dependency" error at each reference on the cycle, in every case and variant, while the rest of the document renders. Before, each stopped the document, or gave an error only once a reader reached it. Among them: an attribute a math, boolean, list or `<evaluate>` is made from that refers to the component (`<math name="m" simplify="$m=1">`, `$$f($n)` in `n`); an index written as a number into a `<repeat>`, `<select>`, `<conditionalContent>`, `<shuffle>` or `<sort>` in its own content (`$r[1]` in the template of `r`); a point copied as content in its own label (`<label><p>$P</p></label>`); a text or boolean list holding an index into itself as an entry; an answer's current response read in its own award; an input prefilled from the entry of a list that is the input; a case's condition reading a name its `<conditionalContent>` declares; and a `<collect>` of values whose source holds it or an index into it.
