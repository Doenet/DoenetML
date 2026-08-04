---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Irish, Scottish Gaelic, Welsh, Breton, Icelandic, Faroese, Basque, Catalan, Galician and Maltese.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="cy"` and `<document lang="cy">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

Western Europe was the last of the map with holes in it, and the holes were not small ones: Catalan and Galician between them have more speakers than several languages already here. What the batch is really about, though, is the **Celtic four**. Irish, Scottish Gaelic, Welsh and Breton mark an adjective as heavily as any language in the repository and do it at the *front* of the word rather than the end — a feminine noun softens whatever follows it, so «dearg» is «dhearg», «coch» is «goch», «du» is «zu». The trigger is the noun, and the noun's gender is already a token these messages carry, so all four select on `$gender` alone and not one of them writes a `$role` branch. Welsh goes a step further than the other three: some of its adjectives have a feminine form of their own before the mutation lands, so «gwyn» becomes «gwen» and only then «wen».

The other six are the counterweights. **Icelandic** and **Faroese** are the batch's case languages, and they part company on one noun: both dative clauses land on `-um` in Icelandic because «jaðar» and «bakgrunnur» are masculine, while Faroese «bakgrund» is feminine and takes `-ari`, making it the one catalog here whose two dative branches differ. **Basque** has more cases than either and selects on neither argument, because a Basque case is a suffix on the last word of the whole noun phrase — it lands on «batekin», a word the catalog writes, never on a placeable. **Maltese** is the one Semitic language written in Latin letters, and its feminine is a change of vowels rather than an ending: «aħmar» → «ħamra». **Catalan** and **Galician** are the plain gender-agreeing case, with the adjectives after the noun.

Also the largest spread of plural categories yet in one batch: Welsh has six, Irish, Breton and Maltese five, Scottish Gaelic four. Maltese's are not a scale — eleven to nineteen go back to a singular noun, so `many` there reads like `other` and not like `few`.
