---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeatForSequence>` with `fixed="false"`, its own or an ancestor's, again lets a reader change each iteration's `valueName` and `indexName`. For example, dragging a point at `($v, $$f($v))` moves it along the function's graph, as in earlier versions. A value dragged to an iteration's value is kept while the repeat's `from`, `step`, `type` and `exclude` stay the same, as for a `<sequence fixed="false">`. A value dragged to an iteration's index is kept from then on. Both are saved, and both are kept while the iteration is hidden because the repeat has fewer iterations, and shown again with it. The same goes for the `indexName` of a `<repeat>`.
