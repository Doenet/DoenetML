---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for eleven West and Central African languages: Rundi, Nyankole, Luba-Lulua, Kituba, Mooré, Dagbani, Dyula, Mandinka, Ga, Tiv and Kanuri.

`documentLocale` and `<document lang>` work for all eleven with nothing configured, and each reaches `<document lang>`'s autocomplete. Kanuri is an ISO 639-3 macrolanguage, so the Manga, Bilma and Tumari codes reach its Central Kanuri catalog too; `man`, the Manding macrolanguage, is the first this repository has catalogs for three *members* of rather than for itself, and it reaches Mandinka because CLDR's likely-subtags resolves a bare `man` to the Gambia. Rundi's directory is named `rn` and needs no alias, since `Intl.getCanonicalLocales` already rewrites `run` to it. A Manga Kanuri reader arriving under `kby-Arab` reaches the catalog and gets Latin, which is the same debt `ha-Arab` and `ff-Adlm` already carry.

Locales that CLDR has no name for are now labelled with a name instead of with their own code in `<document lang>`'s autocomplete and context help. That covers `dag`, `ktu` and `mnk` from this batch — now "Dagbani (Dagbanli)", "Kituba (Kikongo ya leta)" and "Mandinka (Mandinkakaŋo)" — and also fixes `nah`, added in an earlier batch, which had the same gap and now reads "Nahuatl (Nāhuatl)".
