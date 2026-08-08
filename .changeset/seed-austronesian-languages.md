---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Ilocano, Waray, Hiligaynon, Kapampangan, Bikol, Balinese, Minangkabau, Acehnese, Madurese, Tetum, Tongan, Fijian, Tahitian, Chamorro and Tok Pisin.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ilo"` and `<document lang="to">` work with nothing configured, and all fifteen reach `<document lang>`'s autocomplete.

The batch takes the roster across the Philippines, the Indonesian archipelago, Timor-Leste, Polynesia, Micronesia and Papua New Guinea, and it brings the first Bikol macrolanguage fold: `bcl`, `bto`, `cts` and the other members reach the Central Bikol catalog rather than falling to English.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.
