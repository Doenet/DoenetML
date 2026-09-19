---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<sort>` no longer rebuilds its results every time its input changes order.

A `<sort>` over values that a reader can change — points they drag, numbers they
type — threw away everything it had produced and built it again on each change,
and everything reading the sorted list had to find its components afresh. It now
moves the results it already has into their new order, which it can do whenever
the same things are being sorted. A document that sorts forty dragged values
spends about a quarter less time per drag; the deeper cost of rearranging a
parent's children is untouched, so the saving is larger where more reads the
sorted list.

Sorting a changed set of values — one added, one removed — rebuilds as before.
