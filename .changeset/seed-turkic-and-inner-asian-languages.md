---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Armenian, Georgian, Azerbaijani, Kazakh, Kyrgyz, Uzbek, Tajik, Turkmen, Mongolian and Tatar.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="kk"` and `<document lang="kk">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

The Caucasus, Central Asia and the Turkic belt were the largest remaining gap on the map, and the batch is the counterweight to the last one. Where Central and Eastern Europe pulled `$gender` and `$role` apart, seven of these ten select on **neither** — the Turkic languages and Mongolian inflect a great deal and never on the words a style description places, because what carries a clause there is a suffix on the noun and an attributive adjective in front of it does not move. **Armenian** is the same answer from an Indo-European grammar with seven cases.

The two that do fork show the argument working at its narrowest and its furthest. **Georgian** drops an adjective's final -ი in the dative and nowhere else, and only one of the four positions is a dative, so its catalog writes out a single `$role` branch — «წითელი» everywhere but «ყვითელ ფონზე». **Tajik** is Persian in Cyrillic: its adjectives follow the noun, so it reorders the composition messages, and the izafat linking them is written rather than left as an unwritten vowel, which makes it the one catalog anywhere that welds an affix onto a placeable. That is sound for the reason `{ $numSides }-kulmio` is sound in Finnish — adjacency rather than agreement — and the README now says so where the rule is stated.
