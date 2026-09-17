---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<spreadsheet>` now shows which of its cells are header cells and which cannot be edited.

`header` on a `<row>` inside a `<spreadsheet>` draws that row's cells in bold, against the
same shading the grid uses for its `A`, `B`, `C` and `1`, `2`, `3` labels — the attribute
already marked a header row inside a `<tabular>`, but a spreadsheet ignored it. It is
emphasis only: a header row is edited like any other.

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

A header row also carries through to PreTeXt export, emphasized the same way a spreadsheet's
row labels already were.
