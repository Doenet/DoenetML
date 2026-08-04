---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Khmer, Lao, Sinhala, Javanese, Sundanese, Cebuano, Malagasy, Māori, Samoan and Hawaiian.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="km"` and `<document lang="haw">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete, named there the way CLDR names them.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

The batch closes the last large gaps in Asia and opens the Pacific. **Khmer** and **Lao** are isolating languages that inflect nothing at all and write no space inside a phrase, so their descriptions close up flush around every placeable; **Sinhala** marks case with a postposition that never touches the adjective in front of it, which is why it takes no `$role` branch for a reason English does not have. **Javanese** and **Sundanese** each had to choose a speech level, since a catalog cannot leave that open, and both are written at their unmarked everyday level throughout — ngoko for Javanese, loma for Sundanese — with the choice recorded in every file header. **Cebuano** turns on its linker «nga», which joins a noun to each of its adjectives, and on the fact that CLDR's plural rule for it (inherited from Filipino's, which splits on a numeral's linker) does not apply, because a Cebuano numeral takes the invariable «ka». **Malagasy**, **Māori**, **Samoan** and **Hawaiian** all put the adjective after the noun and mark number on the article rather than on the noun, so none of them selects on a count.

Only Javanese and Sundanese supply the 118 element names, taking the Indonesian scientific vocabulary their schools teach chemistry in while keeping their own words for the substances known long before the elements were — «wesi», «beusi», «walirang», «warangan». The other eight leave those 130 keys to fall back to English, each catalog stating its own reason.
