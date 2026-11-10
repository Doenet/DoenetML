---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/v06-to-v07": patch
---

**Breaking:** an index never selects a child of a container (D27 revised). An index after a `<group>` names nothing, and the reference is a blank (`＿`) with the warning `doenet-w0188`, which says how to name the child instead (`$g.b`, or "give it a name"). Before, it selected the child. The deprecation warning `doenet-w0179` it gave in unreleased builds is retired. This covers every form a group takes:

- a `<group>` the author wrote, an extend or a `copy` of one, and one reached through `<collect>` or by name (`$g[2]`, `$a.g[2]`, `$c[1][2]`);
- what a `<select>` picked (`$s[1][2]`), what a `<conditionalContent>` shows (`$cc[1][2]`), an iteration of a `<repeat>` or `<repeatForSequence>` (`$r[1][2]`), and an extend of an iteration;
- an index that is not a literal (`$g[$i]`) and one past the end (`$g[5]`).

These are unchanged: an index still selects the entries of a list, the iterations of a repeat, the picks of a select and the items of a `<shuffle>`, `<sort>` or `<collect>`. When an iteration or a pick holds only one list or repeat, an index after it still passes to that (`$r[1][2]`), and also when it holds only a reference to one (`<option>$l</option>`). An unnamed component in an iteration keeps the id it had (`r:1:2`).

Also fixed:

- An index past a group's items no longer reads into them: `$g[2]` of `<group><math>(4,5,6)</math></group>` was `5`. Fixes #2166.
- An index into a group whose child is a reference not yet expanded (`$g[1]<group name="g">$x</group>`) no longer stops the document from loading. Closes #1942.
- `$st[2]` of a `<setup>` is a blank, where it showed nothing.
- The v0.6 to v0.7 converter leaves a `<copy componentIndex>` into a `<group>` as it was, with the diagnostic `copy/unresolved-referent`, as `$g[2]` would name nothing. A `componentIndex` into a `<select>` or a list is converted as before (`$s[1]`, `$q[2]`).
- A component named in the arguments of a function reference that names nothing (`$$f(<math name="m">x</math>)` with no `f`) is made, as if written in a `<setup>` at the reference's place (D40): `$m` is `x`, where it was a blank. A name the same as another in the same scope is ambiguous (`doenet-w0105`), as one written in a `<setup>` is. The arguments are still not shown. Closes #2489.

An index past the dimensions of a value, or into a value with no entries, names nothing with the warning `doenet-w0100` in more places (#2478):

- an index into an entry of a `<numberList>`, `<textList>` or `<booleanList>`, and into the pick of a `<selectFromSequence>`, `<selectPrimeNumbers>`, `<selectRandomNumbers>` or a sampler (`$nl[2][1]`, `$s[1][1]`), where it named nothing silently, as `$n[1]` of a `<number>` does;
- an extra index on an entry of an array property named directly (`$line.point1[2][1]`, `$f.maximumLocations[1][1]`), where the extra index was dropped, as `$line.points[1][2][1]` does;
- an extra index on an array property of a list entry (`$pl[2].xs[1][1]`), where it gave `doenet-w0180`.

A write through any of these is refused. Also, `$pl[2].value[$i]` of a `<pointList>` is the same as `$pl[2].value[1]` when `i` is 1, where it named nothing, and `<group extend="$r[1]"/>` of an iteration that does not exist when the document loads follows the iteration when it appears, as after a reload, where an index after it named nothing.

Closes #2517. Closes #2478.
