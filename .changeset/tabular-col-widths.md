---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<tabular>` accepts `<col>` components, which set a column's width, alignment, and borders.

A `<tabular>` divided its width evenly among its columns and gave an author no way to say otherwise, so a column of two-digit numbers was drawn as wide as a column of sentences. `<col>` is the same answer PreTeXt gives, with the same four settings: `width`, `halign`, `topBorder`, and `endBorder`. The `<col>` components go before the rows, one per column, left to right; a table may declare fewer than it has columns, and the columns past the last one are left alone.

A column's `width` is a percentage of the width of the `<tabular>`. A number of pixels works in the viewer, but only a percentage means anything to PreTeXt, so a percentage is what the documentation asks for.

`halign` and the two borders are overrides rather than defaults for the whole table, and they resolve the way PreTeXt resolves them: a `<cell>` uses its own setting first, then its `<row>`'s, then its column's, then the `<tabular>`'s. So a `<col halign="end">` right-aligns a column of numbers without touching the rest of the table, and a single `<cell endBorder="none">` still leaves a gap in a rule its column drew. A `<cell colSpan="…">` covers more than one column, so it aligns with the first column it covers and takes its `endBorder` from the last, where its trailing edge actually falls.

Conversion to PreTeXt now carries the whole of a `<tabular>` across, not only its contents. Before this, `<tabular>`, `<row>` and `<cell>` reached the exporter through the pass-through fallback, which dropped every attribute: width, alignment, header rows, `colSpan` and all four borders were lost. They are now written in PreTeXt's own spelling — the borders as `top`/`bottom`/`left`/`right`, `halign="start"`/`"end"` as `"left"`/`"right"` — with each setting emitted on the element that established it rather than repeated on everything beneath it. Two things still do not cross: a `<tabular height>`, which PreTeXt has no attribute for, and a width given in pixels rather than as a percentage.
