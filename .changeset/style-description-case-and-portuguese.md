---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix the German and Russian style descriptions that were inflected for the wrong position, and add a Portuguese catalog.

Style descriptions handed adjectives one token, the gender of the noun they describe. That is enough while a phrase is rendered in one place, but three of them are rendered in two — a border's adjectives, the background colour, and the text colour beside it — and a language that inflects for case needs a different form in each. German and Russian had to spend their one token on a case and were wrong in the other position:

- `borderStyleDescription` read `dicken` and `толстой` instead of `dicker` and `толстая`
- `textStyleDescription` read `roter auf gelber Hintergrund` instead of `rot auf gelbem Hintergrund`, and `красный на жёлтый фоне` instead of `красный на жёлтом фоне`

Descriptions now carry the syntactic position alongside the gender, so a catalog can select on both. The positions are named rather than the cases, because which case a position governs is the translation's business. A language with no case ignores the new argument, so English, Spanish, French, Italian, Dutch, Chinese, Japanese, Korean, Vietnamese, Indonesian, Somali and Hmong Njua are byte-identical.

Portuguese joins the catalogs, covering all four namespaces at full coverage. It is Brazilian, which is what a bare `pt` means; `pt-AO` and `pt-MZ` reach it too, and a European `pt-PT` could be added later without disturbing it. Its border is feminine where Spanish's is masculine, so the border clause reads `com uma borda grossa`.

Like the others, it is an **unreviewed machine-generated seed** and says so in every file's header.
