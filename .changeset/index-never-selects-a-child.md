---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

**Breaking:** an index never selects a child of a container (D27 revised). An index after a `<group>` names nothing, and the reference is a blank (`＿`) with the warning `doenet-w0188`, which says how to name the child instead (`$g.b`, or "give it a name"). Before, it selected the child, with the deprecation warning `doenet-w0179`, which is retired. This covers every form a group takes:

- a `<group>` the author wrote, an extend or a `copy` of one, and one reached through `<collect>` or by name (`$g[2]`, `$a.g[2]`, `$c[1][2]`);
- what a `<select>` picked (`$s[1][2]`), what a `<conditionalContent>` shows (`$cc[1][2]`), an iteration of a `<repeat>` or `<repeatForSequence>` (`$r[1][2]`), and an extend of an iteration;
- an index that is not a literal (`$g[$i]`) and one past the end (`$g[5]`).

These are unchanged: an index still selects the entries of a list, the iterations of a repeat, the picks of a select and the items of a `<shuffle>`, `<sort>` or `<collect>`. When an iteration or a pick holds only one list or repeat, an index after it still passes to that (`$r[1][2]`), and now also when it holds only a reference to one (`<option>$l</option>`). An unnamed component in an iteration keeps the id it had (`r:1:2`).

Also fixed:

- An index past a group's items no longer reads into them: `$g[2]` of `<group><math>(4,5,6)</math></group>` was `5`. Fixes #2166.
- An index into a group whose child is a reference not yet expanded (`$g[1]<group name="g">$x</group>`) no longer stops the document from loading. Closes #1942.
- `$st[2]` of a `<setup>` is a blank, where it showed nothing.
- A component named in the arguments of a function reference that names nothing (`$$f(<math name="m">x</math>)` with no `f`) is made, as if written in a `<setup>` at the reference's place (D40): `$m` is `x`, where it was a blank. The arguments are still not shown. Closes #2489.

Closes #2517.
