---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Every list now treats an entry whose source is written with `hide` the same way. Before, a `<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<intervalList>` or `<tupleList>` showed such an entry anyway. A `<pointList>` or `<vectorList>` hid it in its graph, but showed it wherever the list or the entry was referenced. Now, as `<sort>`, `<shuffle>` and `<collect>` already did:

- the hidden entry is not shown, and so is not in the text of what holds the list;
- `$l[1].hide` is the entry's source's own `hide`, and `$l[1].hidden` is true when that is, or when the list is hidden;
- a reference to the entry (`$l[1]`), or to the whole list (`$l`), keeps the entry hidden;
- the entry still counts for indices, so `$l[2]` is still the second entry, and wherever the list is used as a value: `<math>$l</math>` includes it.

This also holds for an entry inside a `<sort>` or `<group>` written in a list.

`$l.hide` of a `<collect>`, `<sort>` or `<shuffle>` is now the list's own `hide`, not each entry's. The `hide` of a `<collect>` no longer becomes the `hide` of each entry: `<collect hide>` hides the collect, but `$c[1]` placed elsewhere is shown, as `$l[1]` of any hidden list is. A `<collect>` written with `hide="false"` no longer shows the entries whose sources are hidden, as a `<sort hide="false">` never did: a list's `hide` acts on its entries as a container's does. To show such entries, write a reference that sets `hide` itself, such as `<repeat for="$c" valueName="t"><text extend="$t" hide="false"/></repeat>`.

An unlinked copy of one entry (`<math copy="$l[1]"/>`) is hidden if the entry was hidden when the copy was made, and keeps that through a save and reload, even if the reader has since hidden or shown the entry's source. Before, a copy of a `<collect>` entry made while its source was shown came back hidden after the reader hid the source and reloaded.

Closes #2265.
