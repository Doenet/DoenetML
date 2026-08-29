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
(`wls`), Rotuman (`rtm`) and Bislama (`bi`). A document declaring one of the
eleven catalogs that write their own prose now renders its style descriptions,
section headings, boolean words, answer buttons, editor chrome and diagnostics
in that language instead of falling back to English. The chemistry element
tables are deliberately left out of all fifteen and still fall back to English.

The other four — Nauruan, Yapese, Palauan and Rotuman — carry the language only
in their style descriptions; their chrome, editor and diagnostics messages stand
in English, and each of those files says so in its own header. A reader of one
of the four sees the same screen as before apart from the style descriptions.

These are the first catalogs to carry the messages that name a blank inside
typeset math and the warning about an input that cannot be drawn there.

`<document lang>` autocompletes all fifteen. Wallisian is offered as
"Wallisian (Fakaʻuvea)" from a hand-written entry, since CLDR has no name for
the tag in any language.

No existing reader is sent anywhere new: none of the fifteen was previously
folded onto another catalog.

The catalogs are not equally complete, and each says in its own header where it
stands. Nine write their own vocabulary throughout; two write the catalog's
frame in the language around English technical nouns; and the four named above
reach only their style tables, where the colour, width and shape words are the
language and everything longer than a phrase is still English. Nothing was
invented to fill a gap.
