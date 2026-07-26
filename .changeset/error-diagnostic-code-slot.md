---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: stop the hover from showing one problem twice, and let error messages
be translated like every other diagnostic.

Errors raised while the source is being turned into components are thrown, not
built, and the `_error` component they become had nowhere to keep the code
naming the situation — so an error was the one diagnostic that could only ever
reach the reader in English. It now carries the code and its arguments through,
and the invalid-component-type, repeated-attribute and invalid-attribute errors
are translatable.

That also fixes what would have surfaced as duplicate squiggle text: the LSP
merges the parser's copy of a diagnostic with the worker's echo of it, and once
the echo is rendered in the reader's language the two are no longer the same
string. They are now matched by their code, falling back to the message for
diagnostics that don't have one yet.
