---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/v06-to-v07": patch
---

**Breaking:** an index never selects a child of a container (D27 revised). A `<group>`, a pick, a case or an iteration whose whole content is **one component** stands for that component and passes the index on to it, and the component decides what the index means. Any other group names nothing after an index: the reference is a blank (`＿`) with the warning `doenet-w0188`, which says how many components the group holds and how to name the child instead (`$g.b`, or "give it a name"). Before, an index selected the child. The deprecation warning `doenet-w0179` it gave in unreleased builds is retired.

- **One component takes the index.** With `<group name="g"><math>(1,2,3)</math></group>`, `$g[2]` is `2`; with `<group name="g">$nl</group>`, `$g[2]` is entry 2 of `nl`; with `<option><point>(7,8)</point></option>`, `$s[1][1]` is `7`; with `<group name="g">$r</group>`, `$g[2]` is iteration 2 of `r`; with `<group name="g">$cc</group>`, `$g[1]` is the case `cc` shows, and so it is for a group holding `$g`. A component with nothing to index gives a warning: `doenet-w0100` for a `<number>` holding one number or for text, `doenet-w0180` for a `<p>`. A further index goes on into what the first one reached: with `<group name="g">$ml</group>` of a `<mathList>` of tuples, `$g[2][1]` is the first entry of the second tuple. A write through the index changes the entry (`<mathInput bindValueTo="$g[2]"/>`). Blank text and a `<setup>` don't count; any other text does, so `<group>Value: $nl</group>` holds two.
- **Several components name nothing**, in every form a group takes: a `<group>` the author wrote, an extend or a `copy` of one, and one reached through `<collect>` or by name (`$g[2]`, `$a.g[2]`, `$c[1][2]`); what a `<select>` picked (`$s[1][2]`), what a `<conditionalContent>` shows (`$cc[1][2]`), an iteration of a `<repeat>` or `<repeatForSequence>` (`$r[1][2]`), and an extend of an iteration; and an index that is not a literal (`$g[$i]`) or one past the end (`$g[5]`).

These are unchanged: an index still selects the entries of a list, the iterations of a repeat, the picks of a select and the items of a `<shuffle>`, `<sort>` or `<collect>`. When an iteration or a pick holds only one list or repeat, an index after it still passes to that (`$r[1][2]`), and also when it holds only a reference to one (`<option>$l</option>`). An unnamed component in an iteration keeps the id it had (`r:1:2`).

Ids change in one case: the iterations of a repeat that is a group's whole content can now take their id from the group (`g:1` rather than `r:1`, and `e:1` rather than `e.r:1` for an extend `e` of that group), since `$g[1]` names them too; this id is also the `rootName` that an answer's `submitted` event reports.

Also fixed:

- An index after a group is never passed to several of its items as a property. A group holding two components names nothing after an index, and one holding one passes the index to it, so `$g[2]` of `<group><math>(4,5,6)</math></group>` is `5` by that rule, and of `<group><math>(4,5,6)</math><number>9</number></group>` names nothing. Fixes #2166.
- An index into a group whose child is a reference not yet expanded (`$g[1]<group name="g">$x</group>`) no longer stops the document from loading; the index passes to what `$x` names. Closes #1942.
- `$st[2]` of a `<setup>` is a blank, where it showed nothing.
- The v0.6 to v0.7 converter writes a `<copy componentIndex="1">` into a `<group>` holding one component as the bare reference `$g`, which stands for that component (`$g[1]` would index into it). v0.6 counted `componentIndex` with the composites in the group expanded, but kept a nested group, or a copy of one, as one component, so a group holding one nested group counts as holding one, and a group holding a `<sequence>`, a `<map>` or a copy of a sequence does not. Any other `componentIndex` into a `<group>` is left as it was, with the diagnostic `copy/unresolved-referent`, as `$g[2]` would name nothing or something of another type. A `componentIndex` into a `<select>` or a list is converted as before (`$s[1]`, `$q[2]`).
- A component named in the arguments of a function reference that names nothing (`$$f(<math name="m">x</math>)` with no `f`) is made, as if written in a `<setup>` at the reference's place (D40): `$m` is `x`, where it was a blank. A name the same as another in the same scope is ambiguous (`doenet-w0105`), as one written in a `<setup>` is. The arguments are still not shown. Closes #2489.

An index past the dimensions of a value, or into a value with no entries, names nothing with the warning `doenet-w0100` in more places (#2478):

- an index into an entry of a `<numberList>`, `<textList>` or `<booleanList>`, and into the pick of a `<selectFromSequence>`, `<selectPrimeNumbers>`, `<selectRandomNumbers>` or a sampler (`$nl[2][1]`, `$s[1][1]`), where it named nothing silently, as `$n[1]` of a `<number>` does;
- an extra index on an entry of an array property named directly (`$line.point1[2][1]`, `$f.maximumLocations[1][1]`), where the extra index was dropped, as `$line.points[1][2][1]` does (a property that stands for an array's first entry still takes an index among the entries, so `$ode.numericalSolution[2]` is the second solution, as before; so does that first entry named directly, so `$P.x1[2]` is `x2`, as before);
- an extra index on an array property of a list entry (`$pl[2].xs[1][1]`), where it gave `doenet-w0180`.

A write through any of these is refused. Also, `$pl[2].value[$i]` of a `<pointList>` is the same as `$pl[2].value[1]` when `i` is 1, where it named nothing, and `<group extend="$r[1]"/>` of an iteration that does not exist when the document loads follows the iteration when it appears, as after a reload, where an index after it named nothing.

Closes #2517. Closes #2478.
