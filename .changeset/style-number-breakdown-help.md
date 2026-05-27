---
"@doenet/doenetml": patch
"@doenet/lsp-tools": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: the context-help panel now surfaces the full **Resolved style** breakdown for the active styleNumber, building on the per-attribute "Active default" row added in #1200.

Triggers:

- Cursor on the `styleNumber` attribute of a graphical component — the breakdown is filtered to the style key prefixes the component declares (marker* for `<point>`, line* for `<line>` / `<vector>` / `<ray>` / `<lineSegment>` / `<polyline>` / `<parabola>`, line* + fill* for `<polygon>` / `<curve>`). Color attributes for each detected prefix come along even though they're `<styleDefinition>`-only (no per-component override), since the issue asks for "style attributes that are relevant for the component" rather than just the override surface.
- Cursor on any attribute inside a `<styleDefinition>` — the breakdown lists every populated style key for the active styleNumber, since the author is editing the styleDefinition itself.
- Cursor on a `<styleDefinition>` tag name itself (opening or closing) — the breakdown is shown alongside the element description, so landing on the tag is as useful as landing on any of its attributes.

The breakdown reflects ancestor `<styleDefinition>` blocks and runtime per-block derivation (`addMissingChildStyleColorFields` / `deriveMissingStyleWords`), so what the panel shows is what the runtime will render. Color values are paired with their derived word and painted in the resolved color, matching the "Active default" row.

Resolution remains fully static — no worker round-trip. Dynamic `styleNumber` (e.g. `styleNumber="$n"`) falls back to styleNumber=1, same trade-off the existing active-default surface accepts.

Closes #1204.
