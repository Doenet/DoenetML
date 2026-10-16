---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeatForSequence>` with `fixed="false"`, its own or an ancestor's, again lets a reader change each iteration's `valueName` and `indexName`. For example, dragging a point at `($v, $$f($v))` moves it along the function's graph, as in earlier versions. A value dragged to an iteration's value is kept while the repeat's `from`, `step`, `type` and `exclude` stay the same, as for a `<sequence fixed="false">`. A value dragged to an iteration's index is kept from then on. Both are saved, and both are kept while the iteration is hidden because the repeat has fewer iterations, and shown again with it. The same goes for the `indexName` of a `<repeat>`.

With `fixed="false"`, a coordinate that reads the value together with another value that can change, such as the first coordinate of `($v + $a, 1)` with a `<number name="a">`, no longer passes a drag to `$a`: both could take it, so neither does, as for an entry of a `<sequence fixed="false">`. The same goes for a value typed into a `<mathInput>` bound to a `<math>$v + $a</math>`.
