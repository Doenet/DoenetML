---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for twelve more languages, all written in
Cyrillic and all spoken in the Russian Federation: Bashkir (`ba`), Chuvash
(`cv`), Yakut (`sah`), Tuvan (`tyv`), Buryat (`bua`), Kalmyk (`xal`), Udmurt
(`udm`), Komi (`kv`), Erzya (`myv`), Mari (`chm`), Ossetian (`os`) and Chechen
(`ce`). A document declaring one of these languages now renders its style
descriptions, section headings, boolean words, answer buttons, editor chrome
and diagnostics in it instead of falling back to English. The chemistry element
tables are deliberately left out of all twelve and still fall back to English.

Three of the twelve are ISO 639-3 macrolanguages, so a reader arriving under a
member code now reaches the catalog rather than English: Mongolia and China
Buriat (`bxm`, `bxu`) reach Buryat, Komi-Permyak (`koi`) reaches Komi, and Hill
Mari (`mrj`) reaches Mari. Each of those catalogs is written in one standard —
Russia Buriat, Komi-Zyrian, Meadow Mari — and says so in its own header.

Every string is machine-generated and has not been read by a speaker; each
catalog says so in its header. Five carry an additional confidence caveat —
`locales/cv`, `locales/tyv`, `locales/udm`, `locales/xal` and `locales/ce` —
and two of those are worth naming: `locales/xal` (Kalmyk) is the least certain
of the twelve, and `locales/ce` (Chechen) is the one catalog that agrees words
with a noun class and is honest that it could verify the class markers but not
the class of every noun it needed. Correcting any of this needs no permission.
