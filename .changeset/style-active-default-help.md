---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The editor's context-help panel for style attributes — per-component overrides like `<point markerStyle="…">` and attributes inside a `<styleDefinition>` — now surfaces an **Active default** row in addition to the schema's static **Default**. The value is what `selectedStyle` resolves to at the cursor's scope: the in-scope `<styleDefinition>` blocks run through the same merge and per-block derivation passes the worker applies at runtime, including the built-in numbered presets as the seed. Annotated with the styleNumber the value came from.

Inside a `<styleDefinition>`, the active default excludes the queried attribute from the current block so authors see what their *peers* (other styleDefinition siblings) and the built-in preset would contribute for that styleNumber. This makes it obvious whether you're starting a new styleNumber from the preset or layering onto an existing definition.

Resolution is fully static — no worker round-trip, no extra cache invalidation. Dynamic `styleNumber` (e.g. `styleNumber="$n"`) falls back to the styleNumber=1 preset since the LSP doesn't evaluate macros — same trade-off the issue calls out.
