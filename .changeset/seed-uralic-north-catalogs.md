---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more Uralic languages of northern
Europe and Siberia: Southern Sami (`sma`), Lule Sami (`smj`), Inari Sami
(`smn`), Skolt Sami (`sms`), Kildin Sami (`sjd`), Veps (`vep`), Livvi-Karelian
(`olo`), Karelian (`krl`), Võro (`vro`), Meänkieli (`fit`), Moksha (`mdf`),
Komi-Permyak (`koi`), Hill Mari (`mrj`), Khanty (`kca`) and Mansi (`mns`). A
document declaring one of these languages now renders its style descriptions,
section headings, boolean words, answer buttons, editor chrome and diagnostics
in it instead of falling back to English. The chemistry element tables are
deliberately left out of all fifteen and still fall back to English.

Two of the new catalogs change where an existing reader is sent. A
Komi-Permyak (`koi`) reader was previously served the Komi-Zyrian catalog and a
Hill Mari (`mrj`) reader the Meadow Mari one, because each is a member of a
macrolanguage the roster had a catalog for; both now reach their own catalog
instead. Readers arriving under the other members of those macrolanguages
(`kpv`, `mhr`) are unaffected, and a Moksha (`mdf`) reader who previously
reached English now reaches Moksha.

Two contrast warnings now reach the reader in the language they were written
for. `style-definition-insufficient-contrast` selects a branch by a symbolic
key the core passes in, and Meänkieli's catalog had translated two of those
keys along with the prose around them, so a text-on-background and a
text-on-canvas warning both fell through to the wrong branch; both select
correctly again. A Efik reader gets the same repair in
`variant-attribute-wrong-type-for-sequence`, whose catalog had dropped the
"a number" branch entirely and answered "an integer" for both — that one
predates this batch and is fixed here because the check that found it is new.

Four of the fifteen are locales CLDR has no name for, so Kildin Sami,
Livvi-Karelian, Khanty and Mansi now supply their own names to
`<document lang>`'s autocomplete instead of appearing as bare codes.

Every string is machine-generated and has not been read by a speaker; each
catalog says so in its header. Five carry an additional confidence caveat worth
naming: `locales/kca` (Khanty) and `locales/mns` (Mansi) record that much of
their editor and diagnostics vocabulary is coined rather than attested, and
that a further set of words — "error", "line", "page", "figure" and the
school-genre section names — is still unadapted Russian because the seed could
establish no Khanty or Mansi form,
`locales/sjd` (Kildin Sami) is the least certain of the five Sami catalogs,
`locales/vro` (Võro) records that two of its messages read with the wrong case
and that its word for a right-hand side is probably the word for "good", and
`locales/mdf` (Moksha) names the six Erzya residues it still carries — the
ablative ending, the abessive ending, the word for "equal", everything derived
from the word for "many", the demonstrative and the word for a part — where the
seed could not establish the Moksha form. Nine other catalogs now record, in
the same way, a word of their own that carries two concepts at once and that
the seed could not split.
Correcting any of this needs no permission.
