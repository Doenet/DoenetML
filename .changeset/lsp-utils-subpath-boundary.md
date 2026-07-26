---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: cut the bundled DoenetML language server roughly in half.

The server reached `@doenet/utils` through its root barrel for a single
function, dragging math-expressions, the AST helpers and the URL utilities into
the bundle alongside it. Those math-input function-name helpers now have an
entry point of their own, taking the built server from 2.3 MB to 1.1 MB
minified (640 KB to 317 KB gzipped). The server ships inline inside the code
editor, so every package that embeds the editor downloads and parses that much
less before the first cursor-help request can be answered.
