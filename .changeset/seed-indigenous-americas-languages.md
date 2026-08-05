---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Haitian Creole, Quechua, Guarani, Aymara, Nahuatl, Kʼicheʼ, Mapudungun and Ojibwe.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="qu"` and `<document lang="ht">` work with nothing configured, and all eight reach `<document lang>`'s autocomplete.

These are the roster's first languages indigenous to the Americas, and they close the one whole continent a 124-locale roster had nothing from.

Fix a fallback bug they uncovered: `qu`, `ay`, `gn`, `nah` and `oj` are ISO 639-3 macrolanguages, and CLDR's likely-subtags folds exactly one member of a macrolanguage to it and leaves the rest unresolvable. A reader arriving under `quh` (Bolivian Quechua), `ojb` (Northwestern Ojibwa) or `gui` (Bolivian Guarani) was served English even where a catalog for their macrolanguage existed. Negotiation now folds every ISO 639-3 member onto the macrolanguage its catalog is named for.
