---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An index selects the entries of a value, the same way for every component whose value has them: the coordinates of a `<point>`, `<vector>` or `<coords>`, the entries of a `<math>` or `<mathInput>` whose value is a tuple or vector, and the rows of a matrix.

- **A matrix is indexed by row.** `$A[2]` of a `<matrix>`, a `<matrixInput>`, or a `<math>` or `<mathInput>` whose value is a matrix is its second row, as a 1×n matrix, and `$A[2][1]` is the entry in row 2 and column 1. An index on a `<matrix>` used to be ignored, showing the whole matrix, and one on a `<matrixInput>` showed nothing. A write through the index, such as `<mathInput bindValueTo="$A[1][2]"/>`, changes that entry.
- **`$m.value[2]` is the same as `$m[2]`**, where it used to show nothing and warn.
- **A single expression has no entries.** `$m[1]` of `<math>5</math>` now names nothing and warns, where it used to show `5`, the same as `$n[1]` of a `<number>` and `$t[1]` of a `<text>`, which now give that same warning in place of saying that an index cannot select anything in them. Nor does an entry that is a single expression: `$m[1][1]` of `<math>(8, 9)</math>` names nothing and warns, where it used to show `8`. An index into a `<mathInput>` with nothing entered yet is not warned of. When a value changes shape, an index names an entry or nothing as it changes, silently, like an index past the end.
- **An index on a `<spreadsheet>`** warns with the reference to write instead: `$ss[1][2]` says to write `$ss.cells[1][2]`.
- **Indices pass through the entries of a list.** `$r[2][1]` of a `<repeat>` or `<repeatForSequence>` of points is the first coordinate of the second point, as `$pl[2][1]` of a `<pointList>` is; it used to name nothing. `$ml[2][1]` of a `<mathList>` whose second entry is a matrix is its first row, and `$ml[2][1]` of one whose second entry is a single expression is a blank, where it used to be that entry, as an index past the end of an entry already was. An index into an entry is warned of as on a component: `$pl[2].coords[1]` names nothing and warns, where it showed the whole coordinates, and `$pl[1].xs[0]` and `$l[1][0]` warn that they name nothing.
- **A pick or iteration holding only a reference to a list** passes an index on to the list without a deprecation warning, as one holding the list itself does: `$s[1][2]` of `<select name="s"><option>$l</option></select>` is entry 2 of `l`. An index past the end of the list is silent; past the iterations of a referenced repeat it says how many there are. A pick holding a reference to one component (`<option>$m</option>`) still warns that `$s[1][1]` selects a child.
