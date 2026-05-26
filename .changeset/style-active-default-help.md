---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor context-help panel for per-component style attributes (`<point markerStyle="…">`, `<line lineWidth="…">`, etc.) and for attributes inside a `<styleDefinition>` now surfaces an **Active default** row in addition to the schema's static **Default**. The value reflects whatever styleDefinition resolution would yield at the cursor's scope — author-defined `<styleDefinition>` blocks (in ancestor `<setup>` containers) merged on top of the built-in numbered presets — and is annotated with the styleNumber it came from.

Inside a `<styleDefinition>`, the active default excludes the styleDefinition itself so authors see what their *peers* (other styleDefinition siblings) and the built-in preset would contribute for that styleNumber. This makes it obvious whether you're starting a new styleNumber from the preset or layering onto an existing definition.

Resolution is fully static: the LSP walks the parsed DAST and applies the same merge rules the worker uses for `selectedStyle`. No worker round-trip, no extra cache invalidation. Dynamic `styleNumber` (e.g. `styleNumber="$n"`) falls back to the styleNumber=1 preset since the LSP doesn't evaluate macros — same trade-off the issue calls out.
