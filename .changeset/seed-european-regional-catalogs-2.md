---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more regional and minority
languages of Europe: Aragonese (`an`), Extremaduran (`ext`), Ladino (`lad`),
Mirandese (`mwl`), Walloon (`wa`), Arpitan (`frp`), Norman (`nrf`), Lombard
(`lmo`), Emilian (`egl`), Ladin (`lld`), Cornish (`kw`), Manx (`gv`), Bavarian
(`bar`), Northern Frisian (`frr`) and Romani (`rom`). A document declaring one
of them now renders its style descriptions, section headings, boolean words,
answer buttons, editor chrome and diagnostics in that language instead of
falling back to English.

All fifteen are written in the Latin script and lay out left to right — which
took a fix rather than nothing. CLDR maximizes `lad` to the Hebrew script
Judeo-Spanish was written in for four centuries, so a Ladino document would
have laid a Latin catalog out right to left; `directionOf` now follows the
script a catalog is actually written in for a bare tag, while a tag that names
its script, such as `lad-Hebr`, still gets that script's direction.

Twelve of the fifteen put a shape's adjectives behind its noun, so an Aragonese
document reads «linia gorda discontinua roya» where a Bavarian one reads «dicke
gstrichlte rode Linie». Fourteen agree those adjectives with the noun's gender:
twelve by an ending, and Cornish and Manx by an initial mutation instead —
«tew» before a masculine noun and «dew» before a feminine one. Northern Frisian
writes one invariant form, which is Mooring's grammar rather than a gap in the
seed.

Five of the fifteen have plural rules of their own in CLDR, which no recent
batch could say. Cornish reaches all six plural categories from ordinary counts
and its catalog writes four of them by name; Walloon's singular covers zero as
well as one; Manx and Ladin each declare a `many` no count in a Doenet document
reaches — Manx's belongs to counts written with a decimal fraction and Ladin's
only to exact whole millions — and neither catalog writes a branch for it.

The chemistry element tables are left out of all fifteen, so a document in one
of these languages still shows the element names in English. Thirteen are the
school-system case — chemistry is taught in Spanish, Portuguese, French,
Italian, German or English wherever these languages are spoken, and each
catalog's header names which. Ladino and Romani are the two whose speakers are
spread across several school systems, so there is no single language to point
at.

`<document lang>` autocompletes all fifteen. Norman and Ladin are offered from
hand-written entries, since CLDR gives neither tag an English name or an
endonym — though it does have plural rules for Ladin, and an Italian name.

These are machine-generated seeds pending review by speakers (#1521), and each
file's header says so and names where it is weakest. Ten of the fifteen are
Romance languages sitting beside a national Romance language whose words are
one respelling away, so every header names the written standard it follows —
the Academia de l'Aragonés proposal, OSCEC, Aki Yerushalayim, the Convenção
Ortográfica, *rifondou walon*, ORB, Jèrriais, classical Milanese, Bolognese,
Ladin Dolomitan, the Cornish Standard Written Form, traditional Manx
orthography, Central Bavarian, Mooring and the Romani Union alphabet — and says
what it borrowed and from where.

Numbers written into a message render in Latin digits in every one of the
fifteen, so a digit inside a sentence matches the count formatted beside it.
