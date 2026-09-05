---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference to a list keeps the list's commas, and the whitespace an author writes around the items of a list no longer lands in front of a comma.

`$r[1]` and `$g` showed `1234` where the composite they name showed `1, 2, 3, 4`, in the rendered list and in `text` alike. A reference that lands on a composite copies its replacements, and did so recursively down to plain components — which is what makes `$mp[1]` reach the point inside a repeat item rather than the `<setup>` beside it — but recursing that far also flattened away every composite in between, and with it the `asList` that made the replacements a list. The recursion now stops at a composite that can be a list of its own, so the reference copies that composite and the list survives; composites that cannot be a list are still recursed through, so what a reference resolves to is unchanged.

Whitespace at the end of a list item no longer lands in front of the comma that follows it. `<group asList><group><number>1</number> </group><group><number>2</number> </group></group>` read `1 , 2` and now reads `1, 2`.

The whitespace an author puts between the items of a list group is where the commas go, in `text` as in the rendered list. `<group asList><number>1</number> <number>2</number></group>` had a `text` of `1, , 2`; it now reads `1, 2`, and an empty composite among the items, such as a sequence of length zero, changes nothing.

Underneath, the commas were being worked out four times over from the same data — once for the renderers, once for `text`, once for the string a `<math>` parses, and once for the FlatDast the prototype renderers read. Those four now share one implementation of the grouping, so where the commas go is decided once for all of them.
