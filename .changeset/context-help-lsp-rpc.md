---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix the editor's context-sensitive help panel for property refs whose path has two or more navigation segments (e.g. `$rep[1].point1.x`).

The editor's help logic used to run against a local `AutoCompleter` with no Rust resolver attached, so multi-segment refs silently fell to a JS-only fallback that only walked the first path segment and could surface misleading help — or, for unindexed traversal through a `takesIndex` composite like `$rep.myMath`, surface help that the runtime would actually error on.

Help derivation now lives in the LSP worker, which already has the Rust resolver attached for diagnostics and completions. The editor sends a small `doenet/contextHelp` / `doenet/contextHelpForCompletion` request and renders the response. Multi-part chains resolve correctly through the real reference graph; resolver-suppressed cases (`$rep.myMath` without an index) correctly return no help.

User-visible improvements:
- `$rep[1].myMath.x` now shows `<math> property x` instead of "Help for multi-part references is not yet supported."
- `$rep.myMath` (unindexed access through a `takesIndex` composite) no longer surfaces misleading help — the panel correctly blanks, matching what the runtime would error on.
- `$valueName` / `$indexName` references inside a `<repeat>` / `<repeatForSequence>` now surface the binding in the help panel — matching what the autocomplete dropdown offers. The panel notes which repeat introduced the name and whether it's the value or the index.
- Editor bundle drops the schema map + `AutoCompleter` + `computeContextHelp*` modules; the LSP worker is now the single source of truth for help derivation.

During the rust-core boot window (~300–800 ms on first load), ref-resolution positions briefly show no help; element/attribute/snippet help works as soon as the LSP initialises.
