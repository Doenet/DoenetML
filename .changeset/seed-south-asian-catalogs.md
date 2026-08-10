---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for twelve South Asian languages: Sanskrit, Maithili, Bhojpuri, Konkani, Dogri, Bodo, Manipuri, Santali, Kashmiri, Dhivehi, Tibetan and Dzongkha.

`documentLocale` and `<document lang>` work for all twelve with nothing configured, and each reaches `<document lang>`'s autocomplete. Konkani and Dogri are ISO 639-3 macrolanguages, so Maharashtrian Konkani (`knn`) and Kangri (`xnr`) reach their catalogs too. Three scripts are new to the roster — Ol Chiki for Santali, Thaana for Dhivehi and Tibetan for both Tibetan and Dzongkha — and Kashmiri and Dhivehi bring the right-to-left catalogs to ten, needing nothing from `direction.ts`. Manipuri is written in Bengali letters rather than Meetei Mayek, because that is what CLDR fills a bare `mni` in as; its header says so and says a `mni-Mtei` catalog beside it is owed.

These are **unreviewed machine-generated seeds**, and every file says so in its header. All twelve leave the two chemistry tables to English, for five different reasons the headers set out: seven are the school-system case, Bodo and Sanskrit have no settled list of all 118 to seed from, Santali has neither the schooling that reaches the table nor a list behind it, Dhivehi has both halves at once, and Tibetan alone has the names but no single convention to reproduce — while Dzongkha, in the same script, is partial for the opposite reason. Kashmiri's header additionally records that its adjectives should agree for gender and that this seed does not attempt it.
