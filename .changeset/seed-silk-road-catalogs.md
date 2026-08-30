---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more languages of the Silk Road:
Crimean Tatar (`crh`), Gagauz (`gag`), Karakalpak (`kaa`), Khakas (`kjh`),
Southern Altai (`alt`), Mazanderani (`mzn`), Gilaki (`glk`), Northern Luri
(`lrc`), Balochi (`bal`), Hazaragi (`haz`), Muslim Tat (`ttt`), Zazaki
(`zza`), Shughni (`sgh`), Dungan (`dng`) and Wakhi (`wbl`). A document
declaring one of them now renders its style descriptions, section headings,
boolean words, answer buttons, editor chrome and diagnostics in that language
instead of falling back to English.

Five of them — `mzn`, `glk`, `lrc`, `bal` and `haz` — are written in the
Perso-Arabic script, so a document declaring one lays out right to left. The
mathematics inside it does not: notation stays left-to-right, as it already
does in Arabic and Hebrew.

The chemistry element tables are left out of twelve of the fifteen and still
fall back to English. The exceptions are `mzn`, `glk` and `lrc`, which carry
the Persian table unchanged, because chemistry in Māzandarān, Gilan and
Lorestan is taught, examined and printed in Persian and that list is the one
those readers actually use. `locales/glk` and `locales/lrc` translate every
key, as `locales/nn` does. `locales/ttt` additionally leaves ten of the longest
diagnostics messages in English and says so in its own header.

`<document lang>` autocompletes all fifteen. Khakas, Wakhi, Dungan, Shughni
and Hazaragi are offered from hand-written entries, since CLDR has no name for
those tags in any language.

Two macrolanguages gain members, so some readers who reached English before
now reach a catalog: a Northern Zazaki (`kiu`) reader reaches `locales/zza`,
and Western (`bgn`) and Eastern (`bgp`) Balochi readers reach `locales/bal`.
Both catalogs' headers say which variety they are written in, so a reader
served through one of those entries may meet spellings they have to adjust to.
No reader is moved off a catalog they already reached.

The catalogs are not equally complete, and each says in its own header where it
stands — `locales/ttt` marks itself the least certain, `locales/sgh` records
that its diagnostics are a Tajik and Russian loan register with a Shughni
frame, and `locales/kjh` records that Khakas has almost no written technical
register to draw on. Nothing was invented to fill a gap.
