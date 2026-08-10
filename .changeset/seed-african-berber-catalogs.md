---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for twelve African and Berber languages: Northern Sotho, Swati, Venda, Tsonga, Kikuyu, Bemba, Luo, Sango, Fula, Kabyle, Standard Moroccan Tamazight and Tachelhit.

`documentLocale` and `<document lang>` work for all twelve with nothing configured, and each reaches `<document lang>`'s autocomplete. Northern Sotho, Swati, Venda and Tsonga complete South Africa's spoken official languages, which now all have catalogs. Fula is an ISO 639-3 macrolanguage, so Maasina, Adamawa, Nigerian and the other Fulfulde codes reach its Pulaar catalog too. Tifinagh is new to the roster with Tamazight and Tachelhit and needed nothing from `direction.ts`, since it runs left to right; Kabyle is in Latin letters, because that is what CLDR fills a bare `kab` in as, and a reader arriving under `ff-Adlm`, `kab-Tfng` or `shi-Latn` reaches the catalog and gets the script it is written in.

These are **unreviewed machine-generated seeds**, and every file says so in its header. All twelve leave the two chemistry tables to English, and unlike recent batches they split no ways at all: every one is the school-system case, across a row of education ministries that teach secondary science in English, Afrikaans, Portuguese, French or Arabic. Afrikaans, in the same South African classrooms, supplies the whole table — which is a fact about the medium of instruction rather than about either language.
