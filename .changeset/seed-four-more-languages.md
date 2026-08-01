---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Japanese, Korean, Vietnamese and Indonesian.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ja"` and `<document lang="ja">` work with nothing configured, and all four reach `<document lang>`'s autocomplete with their names in their own script.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

All four have a single plural category and no adjective agreement, so the style descriptions needed word order rather than inflection. Japanese and Korean put modifiers before the noun; Vietnamese and Indonesian put them after, as Spanish does. Japanese spells every style word as a noun and joins them with の, because an i-adjective would be ungrammatical in the one branch that has no noun to modify.

Vietnamese deliberately leaves the 118 element names and 12 anion names untranslated. Its school chemistry has moved from the transliterated names to the IUPAC forms, which are the English words already shipped, so the fallback is what the current curriculum uses; the older names can be added as keys by anyone who wants them.
