---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more languages of Oceania:
Marshallese (`mh`), Chuukese (`chk`), Pohnpeian (`pon`), Kosraean (`kos`),
Gilbertese (`gil`), Nauruan (`na`), Yapese (`yap`), Palauan (`pau`), Niuean
(`niu`), Tokelauan (`tkl`), Tuvaluan (`tvl`), Rarotongan (`rar`), Wallisian
(`wls`), Rotuman (`rtm`) and Bislama (`bi`). A document declaring one of these
languages now renders its style descriptions, section headings, boolean words,
answer buttons, editor chrome and diagnostics in it instead of falling back to
English. The chemistry element tables are deliberately left out of all fifteen
and still fall back to English.

These are the first catalogs to cover the messages that name a blank inside
typeset math and the warning about an input that cannot be drawn there.

`<document lang>` autocompletes all fifteen. Wallisian is offered as
"Wallisian (Fakaʻuvea)" from a hand-written entry, since CLDR has no name for
the tag in any language.

No existing reader is sent anywhere new: none of the fifteen was previously
folded onto another catalog.

The catalogs are not equally complete, and each says in its own header where it
stands. Nine write their own vocabulary throughout; two write the catalog's
frame in the language around English technical nouns; and four — Nauruan,
Yapese, Palauan and Rotuman — carry basic vocabulary with the technical terms
still kept as declared English loans. Nothing was invented to fill a gap.
