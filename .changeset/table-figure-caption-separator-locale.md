---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Punctuate a table's title and a figure's caption from the document's language.

`<table>` and `<figure>` already named themselves in the document's language, but the `": "` joining that name to the authored title or caption was written into the renderer, so a Spanish activity read **`Figura 2`: pie de foto** — the name from one language and the punctuation from another. The separator is part of the name the catalog composes now, so a language that joins the two differently can say so.

The English text is unchanged. The separator is emphasized along with the name it belongs to, so `<strong>Figure 2</strong>: caption` becomes `<strong>Figure 2: </strong>caption`.
