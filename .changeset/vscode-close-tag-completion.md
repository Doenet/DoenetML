---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Fix stale VS Code tag/snippet autocomplete ranges.

When typing a closing tag in the editor (for example `</te|` inside `<text>`),
the close-tag completion now stays in sync with the full partially typed prefix
and accepting it replaces that whole prefix. This avoids VS Code/native-LSP
flows that could previously duplicate the `/` or leave the already-typed suffix
behind when completing a close tag.

The same refresh logic now also keeps `<`-triggered snippet completions in sync
with the typed prefix, including the prefigure `annotations-skeleton` snippet,
so accepting those items no longer leaves stale typed characters behind either.
