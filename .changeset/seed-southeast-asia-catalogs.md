---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen languages of maritime and
mainland Southeast Asia: Buginese (`bug`), Makasar (`mak`), Banjar (`bjn`),
Gorontalo (`gor`), Nias (`nia`), Toba Batak (`bbc`), Iban (`iba`),
Kadazandusun (`dtp`), Pangasinan (`pag`), Chavacano (`cbk`), Tausug (`tsg`),
Maranao (`mrw`), Shan (`shn`), Mon (`mnw`) and S'gaw Karen (`ksw`). A document
declaring one of them now renders its style descriptions, section headings,
boolean words, answer buttons, editor chrome and diagnostics in that language
instead of falling back to English.

Twelve are written in the Latin script and three — Shan, Mon and S'gaw Karen —
in the Myanmar script. All fifteen lay out left to right, so nothing about
direction changes.

The chemistry element tables are left out of all fifteen, so a document in one
of these languages still shows the element names in English. None of the
fifteen is a language chemistry is taught in: secondary science in these
regions runs in Indonesian, Malay, English or Burmese, so there is no settled
list of element names in Buginese or Mon to write down, and an invented one
would be worse than the English. Readers in the English-medium systems get
their own school vocabulary; the rest get a second language rather than a
first. Each catalog's header says which case it is in.

`<document lang>` autocompletes all fifteen. Chavacano, Tausug, Maranao, Mon
and S'gaw Karen are offered from hand-written entries, since CLDR has no name
for those tags in any language; Chavacano is listed as "Chavacano (cbk)"
because both «Chavacano» and «Chabacano» are in live use for it and the
catalog does not choose between them. Two of the fifteen are offered under the
name CLDR gives them rather than the one their catalog writes — "Batak Toba"
for `bbc` and "Central Dusun" for `dtp` — because the autocomplete fills gaps
in CLDR and never overrides it.

Malay gains its members, so many readers who reached English before now reach
a catalog: Brunei Malay (`kxd`), Kedah Malay (`meo`), Pattani Malay (`mfa`),
Central Malay (`pse`), Sabah Malay (`msi`), North Moluccan Malay (`max`)
and Manado Malay (`xmm`) and twenty-five other varieties now reach
`locales/ms`. The list has thirty-three entries; the thirty-third is Standard
Malay (`zsm`) itself, which already reached that catalog because ICU rewrites
the tag. `locales/ms` is Standard Malay, so a reader served through one of the
thirty-two may meet spellings they have to adjust to. A Pattani reader who writes in Jawi is served Rumi.
Indonesian, Minangkabau and Banjar readers are deliberately left out of that
list, because each has a catalog of its own. Coastal Kadazan (`kzj`) readers
reach the new `locales/dtp`. No reader is moved off a catalog they already
reached.

Numbers written into a message render in Latin digits in every language,
including the three written in the Myanmar script, so a digit inside a sentence
matches the count formatted beside it and the mathematics around it.
