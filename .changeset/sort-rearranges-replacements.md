---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<sort>` no longer rebuilds its results every time its input changes order.

A `<sort>` over values that a reader can change — points they drag, numbers they
type — threw away everything it had produced and built it again whenever the
order changed, and everything reading the sorted list had to find its components
afresh. It now moves the results it already has into their new order, which it
can do whenever the same things are being sorted. In a document that sorts forty
dragged values, a drag that carries one of them past its neighbor costs a
fraction of what it did, and the more of the document reads the sorted list the
larger that difference is.

A value that lands most of the way across the list in a single step is the
exception, and `<sort>` takes the old route for it: what a rearrangement saves
is the results that stay where they are, so once most of them would move there
is nothing left to save and rebuilding is the cheaper of the two.

Sorting a changed set of values — one added, one removed — rebuilds as before.
