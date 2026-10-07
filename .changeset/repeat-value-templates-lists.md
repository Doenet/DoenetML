---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>` or `<repeatForSequence>` whose template is one `<math>` or `<number>`, such as `<repeatForSequence from="1" to="$n" valueName="i"><number>$i^2</number></repeatForSequence>`, now keeps its values in one component, shown as before, instead of making a copy of its template for each value. Such documents create fewer components. This applies when what the template reads is the repeat's value or index, an entry of a list at the index (`$l[$i]`), the value of a `<repeat for="$l">` over one list, or a value outside the repeat; otherwise the repeat works as before. A value written to one of its values, as through `<mathInput bindValueTo="$r[2]"/>`, goes where it went before: to what the template reads, or to that value's own copy of the template's text. One thing differs: `<collect componentType="math">` no longer finds, in such a repeat of `<number>`s, the `<math>` that a `<number>` like `<number>$v+1</number>` makes around its content, so it collects nothing there; `componentType="number"` collects the values as before.
