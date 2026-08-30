---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more languages of the Americas:
Kalaallisut (`kl`), Inuktitut (`iu`), Yucatec Maya (`yua`), Qʼeqchiʼ (`kek`),
Garifuna (`cab`), Mískito (`miq`), Papiamentu (`pap`), Sranan Tongo (`srn`),
Jamaican Creole (`jam`), Guadeloupean Creole French (`gcf`), Saint Lucian
Creole French (`acf`), Guianese Creole French (`gcr`), Belize Kriol (`bzj`),
Aukan (`djk`) and Saramaccan (`srm`). A document declaring one of them now
renders its style descriptions, section headings, boolean words, answer
buttons, editor chrome and diagnostics in that language instead of falling
back to English.

Inuktitut is written in Canadian Aboriginal syllabics and has a dual, so a
count in it selects one of three forms rather than one of two. It also leaves the geometry nouns to fall back to English
rather than writing them in roman letters inside a syllabic sentence, so a
style description in Inuktitut is part English by design.

An Inuinnaqtun (`ikt`) reader is served English rather than the Inuktitut
catalog, because Inuinnaqtun is written in roman letters and that catalog is
written in syllabics. Nine of the fifteen are creoles and none of them is
reachable through its lexifier: `gcf` does not answer a request for French,
and French does not answer a request for `gcf`.

All fifteen leave the two chemistry tables to fall back to English, since
school science across these communities is taught in Dutch, Danish, Spanish,
French or English.
