---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<spreadsheet>` now shows which of its cells are header cells and which cannot be edited.

`header` on a `<row>` inside a `<spreadsheet>` draws that row's cells in bold — the
attribute already marked a header row inside a `<tabular>`, but a spreadsheet ignored it.
It is emphasis only: a header row is edited like any other, and it is left on the ordinary
cell background so that it is not confused with the grid's own `A`, `B`, `C` and `1`, `2`,
`3` labels.

```xml
<spreadsheet minNumRows="3" minNumColumns="3">
  <row header><cell>Name</cell><cell>Type</cell></row>
  <row><cell>Gandalf</cell><cell>wizard</cell></row>
</spreadsheet>
```

`fixed` on a `<cell>` now makes the grid refuse the edit rather than take it back. The cell
is greyed and clicking it opens no editor, though it can still be selected and copied. Until
now a fixed cell looked and behaved like any other until the user pressed enter, at which
point their typing reverted with nothing said. `fixed` on a `<row>` covers that row's cells,
and `fixed` on the `<spreadsheet>` itself makes the whole grid read-only, including the
positions no `<cell>` fills.

Marking up the text inside a cell — `<em>`, `<alert>` — still has no effect, since a cell
contributes only its text to the grid. `header` is how a row is set apart.

A header row is announced as a header, not only drawn as one: its cells carry the
`columnheader` role, which is what a `<tabular>` says by rendering a header cell as a `<th>`.
Handsontable draws every data cell as a `<td>`, so without it a screen reader met a header row
as ordinary data.

PreTeXt export marks an authored header row with `header="yes"`, alongside the generated
`A`, `B`, `C` row that already carried it — PreTeXt allows a `<tabular>` more than one header
row. It is necessarily coarser than the grid, since `header` belongs to the row: a header row
narrower than the grid marks its empty remainder too.
