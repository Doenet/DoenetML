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
are translatable wherever diagnostics are shown — the Diagnostics panel, the
editor hover, and a host's `setDiagnosticsCallback`. The error box drawn in the
document itself still reads in English; that is a separate step.

That also fixes what would have surfaced as duplicate squiggle text: the LSP
merges the parser's copy of a diagnostic with the worker's echo of it, and once
the echo is rendered in the reader's language the two are no longer the same
string. A record is now matched by its message and, when it has one, also by
its code plus the arguments filling it in — agreeing on either makes it the
same diagnostic, so a copy that has a code and one that doesn't still collapse
while they agree on the English. The arguments are part of the match because a
code names a message template rather than one occurrence of it: a single
component can report the same code twice with different values, and both still
reach the author.
