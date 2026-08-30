---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for fifteen more regional languages of
Europe, five Germanic, five Romance and five Slavic: Norwegian Nynorsk (`nn`),
Scots (`sco`), Swiss German (`gsw`), Colognian (`ksh`) and Limburgish (`li`);
Friulian (`fur`), Venetian (`vec`), Ligurian (`lij`), Piedmontese (`pms`) and
Neapolitan (`nap`); Upper Sorbian (`hsb`), Lower Sorbian (`dsb`), Kashubian
(`csb`), Silesian (`szl`) and Rusyn (`rue`). A document declaring one of them
now renders its style descriptions, section headings, boolean words, answer
buttons, editor chrome and diagnostics in that language instead of falling
back to English.

Norwegian Nynorsk is complete, the periodic table included. The other fourteen
leave the chemistry element tables out and still fall back to English for
them; each catalog's header says why in its own words.

`<document lang>` autocompletes all fifteen, and CLDR has a name for every one
of them, so no hand-written roster entry was needed.

No existing reader is sent anywhere new. `no` still resolves to Bokmål: a
reader who says only `no` has not said which written standard they read, and
pointing it at the new Nynorsk catalog would be a substitution rather than a
canonicalization.

Eight of the fifteen have CLDR plural data and use it; the other seven write
no category branch at all, because nothing could select one correctly. Upper
and Lower Sorbian write a living grammatical dual, and Colognian a `zero`, both
selected by their own CLDR rules.
