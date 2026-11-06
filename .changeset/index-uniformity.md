---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An index is applied the same way everywhere (D27). Some documents now show something different, as listed.

- **An extend or copy of an iteration indexes as the iteration**: with `<group name="g" extend="$r[1]"/>` of a `<repeat>` whose iterations each hold one `<repeat>`, `$g[2]` is `$r[1][2]`, iteration 2 of the inner repeat, where it named nothing.
- **An index past a value's dimensions names nothing, with the warning `doenet-w0100`**, where the extra index was dropped: `$P[1][1]` of a `<point>`, `$v[1][1]` of a `<vector>`, `$M[1][2][3]` of a `<matrix>` or `<matrixInput>`, `$P.xs[1][1]`. The same holds for an index past the dimensions of any array property, such as `$poly.vertices[1][2][1]`, `$f.maxima[1][2][1]` or `$ss.cells[1][1][1]`. An index into a property of every entry of a list that isn't an array also names nothing with `doenet-w0100`, as `$P.coords[1]` does. Before, `$l.coords[1]` ignored the index and showed every entry. `$l.value[2]` of a list is now `$l[2]`, entry 2, as `$m.value[2]` is `$m[2]`, where it also showed every entry.
- **An index selects an entry at every level that has one**: `$m[1][2]` of `<math>((1,2),(3,4))</math>` is `2`, where it named nothing, and `$l[1][1][2]` of a `<mathList>` whose first entry is a matrix is the matrix entry. A write through such an index changes that entry.
- **An index into a scalar entry of a list of maths names nothing, with `doenet-w0100`**, as `$m[1]` of `<math>5</math>` does: `$l[2][1]` of `<mathList>1 2</mathList>`. An index past the end of an entry names nothing, silently: `$tl[1][3]` of `<tupleList>(1,2) (3,4)</tupleList>`. Both are missing, and a write through them is refused, where it replaced the entry or lengthened it. A write of a row of a matrix entry through an index (`$l[1][2]`) now changes that row, keeping its length, as for a `<matrix>`.
- **An index never reaches the `<setup>` a `<repeat>` adds to an iteration for its `valueName` and `indexName`**: with `<repeat name="r" valueName="v">$l</repeat>`, `$r[1][4]` past the three entries of `l` names nothing, silently, and `$r[1][4].v` is not the value of `v`. An index past the content of an iteration that holds something other than one list or repeat (`$r[1][2]` of `<repeat><text>$v</text></repeat>`) names nothing with the warning `doenet-w0104`, as an index past the children of a `<group>` does.

Closes #2438.
