---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Swahili, Zulu, Xhosa, Kinyarwanda, Chichewa, Hausa, Yoruba, Igbo, Oromo and Afrikaans.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="sw"` and `<document lang="sw">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

Sub-Saharan Africa was the largest region with no catalog at all, and five of these ten are Bantu — which is what makes the batch interesting rather than routine. A Bantu adjective agrees with its noun's **class**, not with a gender, and `$gender` turned out to carry that unchanged: `noun-gender` answers `c3`, `c5`, `c6`, `c7` or `c9`, and every describing word selects on it. Nothing outside the catalogs had to learn what a noun class is. Swahili puts different prefixes on the same two stems for `mpaka` and `duara` in one sentence — `duara lililojazwa buluu na mpaka mnene mweusi` — and Zulu and Xhosa need two concord tables rather than one, because whether a word takes the adjective concord or the relative concord is a fact about the word: `omkhulu` and `obomvu` describe the same class-3 line with different prefixes.

Hausa is the one with `$gender` in the sense the argument was named for — real masculine and feminine, agreed with a linking `-n`/`-r` — and it selects on it nowhere, because the words it needs are all the invariable `mai …` construction. The genders are written into `noun-gender` anyway, so a translator reaching for `farin`/`farar` later finds them already decided. Afrikaans is the mirror of that: Dutch splits its nouns into de-words and het-words and its catalog forks on every colour, and Afrikaans is that catalog with the split taken out.

Swahili and Kinyarwanda land on opposite sides of the same gap. An attributive colour noun wants an associative particle whose shape comes from the class, and the identical string is also what `backgroundColor` reports standing alone, where the particle would be wrong — and `$role` is `standalone` in both places. Swahili writes the colour bare; Kinyarwanda writes the particle in, because `icyatsi` without it does not read as a colour at all.

Only Afrikaans and Swahili supply the 118 element names and 12 anion names. The other eight join the thirteen catalogs that leave them to English: secondary science across those systems is taught in English, French or Afrikaans, so the fallback is what a learner meets in their own textbook rather than a gap in the translation. That line runs through a language family as well as through a script — Swahili supplies them and Zulu, Xhosa, Kinyarwanda and Chichewa do not.

Chichewa is catalogued as `ny` and shows in the roster as **Nyanja**, which is what CLDR renders that code as; the two names are one language. No locale in this batch needs an alias — `sw-KE`, `sw-TZ`, `af-ZA` and the rest all filter to their catalog on their own.
