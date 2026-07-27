---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Write the words a `<table>`, a `<figure>`, and a `<paginatorControls>` name themselves with in the document's language.

"Table 2" and "Figure 3" are one message each rather than a word with a number stuck on the end, so a language that orders or punctuates them differently can say so.

The paginator's "Page 3 of 5" is now composed as a whole sentence in the document's language. It used to be half worker and half renderer — the word came from the document, the "of" joining the counts was English written into the viewer and unreachable — so a translated activity read "Página 3 of 5".

`previousLabel`, `nextLabel`, and `pageLabel` follow the document when the author leaves them unset, and pass through untouched when the author writes them — including when what they wrote is the English default.

A document that declares no language reads exactly as it did before.
