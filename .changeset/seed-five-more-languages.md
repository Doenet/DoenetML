---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Bangla, Assamese, Marathi, Nepali and Burmese.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="bn"` and `<document lang="bn">` work with nothing configured, and all five reach `<document lang>`'s autocomplete with their names in their own script.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

All five count in their own digits by CLDR's reckoning, and none of them writes numbers that way here — that is the digit policy that had to land first, and it is why this batch could be seeded at all.

Marathi is the fullest test yet of the agreement machinery: three genders where Hindi has two, and an oblique adjective before a postposition, so a border reads `जाड काळी` standing alone and `जाड काळ्या किनारीसह` inside the clause. Nepali, written in the same script, forks neither way — its adjectives mark gender only for animate nouns and never go oblique. Bangla, Assamese and Burmese inflect none of this, and put their postpositions behind the noun where English puts them in front.

Assamese, Nepali and Burmese leave the 118 element names and 12 anion names untranslated, joining Somali, Hmong Njua and Amharic: there is no settled chemical nomenclature in any of the three to seed from, and the English fallback is what a student meets in a textbook. Bangla and Marathi do have one and supply it — so Bangla and Assamese part company here despite sharing a script, which is exactly why they are two catalogs.
