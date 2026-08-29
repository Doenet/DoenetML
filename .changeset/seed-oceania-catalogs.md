---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for eleven more languages of Oceania:
Marshallese (`mh`), Chuukese (`chk`), Pohnpeian (`pon`), Kosraean (`kos`),
Gilbertese (`gil`), Niuean (`niu`), Tokelauan (`tkl`), Tuvaluan (`tvl`),
Rarotongan (`rar`), Wallisian (`wls`) and Bislama (`bi`). A document declaring
one of them now renders its style descriptions, section headings, boolean
words, answer buttons, editor chrome and diagnostics in that language instead
of falling back to English. The chemistry element tables are deliberately left
out of all eleven and still fall back to English.

These are the first catalogs to carry the messages that name a blank inside
typeset math and the warning about an input that cannot be drawn there.

`<document lang>` autocompletes all eleven. Wallisian is offered as "Wallisian
(Fakaʻuvea)" from a hand-written entry, since CLDR has no name for the tag in
any language.

No existing reader is sent anywhere new: none of the eleven was previously
folded onto another catalog.

The catalogs are not equally complete, and each says in its own header where it
stands. Nine write their own vocabulary throughout, and two write the catalog's
frame in the language around English technical nouns. Nothing was invented to
fill a gap.
