---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Report an index that names nothing the same way however it is written. An index of 0 or a negative index, such as `$l[0]` or `$l[-1]`, now gets the same warning as `$l[$i]` when `i` is 0: "No referent found for reference", quoting the whole reference. It used to get a warning with no code that quoted only `$l`. The same goes for `$P.xs[0]`, which gave no warning, and for `<math extend="$l[0]"/>`. An index past the end, such as `$l[10]`, still shows nothing without a warning, since a list's length can change.

An index on a property that is not a list, such as `$n.value[1]` for a `<number>`, now shows nothing. It used to show the number's value while warning that the index could not be used. Likewise, an `<updateValue>` or `<animateFromSequence>` whose `target` has such an index now changes nothing and warns that its target is invalid. It used to change the whole property.

A name that names nothing (`$nothing`) or more than one thing now gets a coded warning that quotes the whole reference, such as `$nothing.x[2]` rather than `$nothing.x`.

Closes #2407.
