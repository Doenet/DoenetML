---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for six more West and Central African
languages: Kongo (`kg`), Fon (`fon`), Nigerian Pidgin (`pcm`), Krio (`kri`),
Kabiyè (`kbp`) and Temne (`tem`). A document declaring one of these languages
now renders its style descriptions, section headings, boolean words, answer
buttons, editor chrome and diagnostics in it instead of falling back to English.
The chemistry element tables are deliberately left out of all six and still fall
back to English.

Every string is machine-generated and has not been read by a speaker; each
catalog says so in its header. Correcting one needs no permission.

Kongo is a macrolanguage, so a reader arriving under `kwy`, `ldi`, `kng` or
`kon` now reaches it as well. Kituba (`ktu`, `mkw`) is deliberately *not* folded
onto Kongo: it is a creole of Kikongo rather than a variety of it, and a Kituba
reader would be served a different language.

Kabiyè has no CLDR language name, so it takes a `LOCALE_NAME_FALLBACKS` entry
and appears as "Kabiye (Kabɩyɛ)" in `<document lang>`'s autocomplete and context
help rather than as the bare code "kbp".
