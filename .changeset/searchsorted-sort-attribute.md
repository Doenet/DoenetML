---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<searchSorted>` can search a list that is not sorted.

`<searchSorted>` answers where a value belongs in a list that is already in
ascending order, and declines a list that is not. An author whose list is
unsorted had to sort it first and hand the result over:

```doenet
<sort name="sorted">$values</sort>
<searchSorted target="$targets">$sorted</searchSorted>
```

Writing `sort` on the operator says the same thing in one step:

```doenet
<searchSorted sort target="$targets">$values</searchSorted>
```

The answers are the same either way, and `side` still chooses which end of a
run of equal values is reported. The values themselves stay in the order they
were written: `sort` says where the target belongs, not what the list looks
like. Without the attribute nothing changes.

In a document where the values move — points a reader drags, numbers they
type — the shorter form is also much quicker, because the separate `<sort>`
produced a component for every value and everything reading it had to follow
them.

One difference worth knowing: where the values are compared as numbers, one
that is not a number at all takes no part in the ordering. Without `sort` it
keeps its place in the list and the answer counts around it; with `sort` it is
left out, since a value with no place in the order has no place to keep.
