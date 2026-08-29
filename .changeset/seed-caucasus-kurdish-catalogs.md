---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more languages of the Caucasus and
the Kurdish-speaking world: Abkhaz (`ab`), Adyghe (`ady`), Kabardian (`kbd`),
Avar (`av`), Lezgian (`lez`), Dargwa (`dar`), Lak (`lbe`), Tabasaran (`tab`),
Ingush (`inh`), Karachay-Balkar (`krc`), Kumyk (`kum`), Nogai (`nog`), Talysh
(`tly`), Kurmanji Kurdish (`ku`) and Central Kurdish (`ckb`). A document
declaring one of these languages now renders its style descriptions, section
headings, boolean words, answer buttons, editor chrome and diagnostics in it
instead of falling back to English. The chemistry element tables are
deliberately left out of all fifteen and still fall back to English.

Central Kurdish is written in the Perso-Arabic script and renders right to
left, the eleventh such catalog. Kurmanji beside it is Latin and renders left
to right, and a reader arriving under a Southern Kurdish code (`sdh`) or the
ISO 639-3 code for Kurmanji (`kmr`) now reaches it rather than English; a
Sorani reader keeps reaching the Sorani catalog rather than being folded onto
Kurmanji.

Two of the fifteen are locales CLDR has no name for, so Lak and Tabasaran now
supply their own names to `<document lang>`'s autocomplete instead of appearing
as bare codes.

Every string is machine-generated and has not been read by a speaker; each
catalog says so in its header. Three carry an additional confidence caveat
worth naming: `locales/tly` (Talysh) is the least certain of the fifteen,
`locales/dar` (Dargwa) records that seven of its colour words are still
Russian, and `locales/nog` (Nogai) records that its editor vocabulary is
largely coined. Correcting any of this needs no permission.
