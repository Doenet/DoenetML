---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for twelve South Asian languages: Sanskrit, Maithili, Bhojpuri, Konkani, Dogri, Bodo, Manipuri, Santali, Kashmiri, Dhivehi, Tibetan and Dzongkha.

`documentLocale` and `<document lang>` work for all twelve with nothing configured, and each reaches `<document lang>`'s autocomplete. Konkani and Dogri are ISO 639-3 macrolanguages, so Maharashtrian Konkani (`knn`) and Kangri (`xnr`) reach their catalogs too. Five scripts arrive with the batch — Ol Chiki, Meetei Mayek's Bengali-script sibling, Thaana, Tibetan and Perso-Arabic Kashmiri — and Kashmiri and Dhivehi bring the roster's right-to-left catalogs to ten, needing nothing from `direction.ts`.

These are **unreviewed machine-generated seeds**, and every file says so in its header. All twelve leave the two chemistry tables to English, for three different reasons the headers set out: most are the school-system case, Tibetan is the Khmer case of having the names but no single convention to reproduce, and Kashmiri's header additionally records that its adjectives should agree for gender and this seed does not attempt it.
