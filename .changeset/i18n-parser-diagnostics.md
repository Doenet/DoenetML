---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Translate the parser's diagnostics — the unclosed tags, mismatched quotes,
invalid names and deprecation notices an author sees before anything runs, and
usually the first Doenet message a beginner ever reads.

A parser error reaches the editor twice: once from the language server and once
as the worker's echo of it. Both copies now carry the same stable code, so the
editor recognizes them as one error and shows the translated one, instead of
the same problem twice in two languages.

The twenty-one hand-written deprecation notices, which differed only in the
attribute names they mentioned, are now one message per shape.
