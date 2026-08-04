---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Bulgarian, Croatian, Serbian, Slovenian, Macedonian, Albanian, Lithuanian, Latvian, Estonian and Belarusian.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="hr"` and `<document lang="hr">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

Central and Eastern Europe and the Balkans were the largest remaining gap on the map, and what makes the batch interesting is that it pulls `$gender` and `$role` apart. Every inflecting catalog before this one needed both at once, so nothing had yet shown that they are independent. Here **Estonian** has fourteen cases and no gender whatsoever — it forks on `$role` alone, and its `noun-gender` answers a single constant the way English's does — while **Bulgarian** and **Macedonian** have three genders and no cases at all, so they fork on `$gender` alone and consult `$role` nowhere. Neither catalog needed a change outside itself, which is the argument working as designed.

The remaining seven use both. Croatian, Serbian, Slovenian and Belarusian each pick their own nouns for the two clause heads and so land on four different arrangements: Croatian's border is masculine `rub` and Serbian's feminine `ивица`, so the same instrumental is `-im` in one and `-ом` in the other; Slovenian's text and background are *both* neuter where Croatian's and Serbian's split across two genders. Lithuanian's four heads are all masculine and its clauses need no gender fork; Latvian splits them across two genders and needs a different case in each, and marks its background with a bare genitive that happens to be spelled like the nominative feminine — a branch written out anyway so a correction to one does not silently move the other.

**Albanian** is the odd one and the batch's counterpart to Yoruba and Igbo: it puts its describing words after the noun, so `style-with-noun` and `style-filled-with-noun` reorder rather than substituting into the English frame. Its agreement is carried by a proclitic article — `i`, `e`, `të` — rather than by an ending, and half its colour vocabulary is unarticulated loans (`blu`, `gri`, `kafe`, `rozë`) that select on nothing at all. Which words fork is a fact about the word, not about the position.

Slovenian is the first catalog anywhere here to need CLDR's `two`: it has a living dual, so two attempts are `2 poskusa` and neither the singular nor any plural will serve. **Latvian** is the first to need `zero`, which does not mean "none" — it covers every number ending in 0 and the whole of the teens. Both still spell out `[0]` by number, because the English wording changes for zero as well as the noun and a category cannot say that. Croatian, Serbian and Lithuanian carry three categories, Belarusian four, and the other four two.

All ten supply the 118 element names and 12 anion names, so the count of deliberately partial catalogs stays at twenty-one: every one of these school systems teaches chemistry in its own language with settled nomenclature.

Serbian is catalogued as `sr` in Cyrillic, which is what CLDR fills a bare `sr` in as; a reader arriving under `sr-Latn` reaches it and gets Cyrillic, the same asymmetry `pa-Arab` already has. No locale in this batch needs an entry in `LANGUAGE_ALIASES` — `sh`, the retired Serbo-Croatian code, is canonicalized to `sr-Latn` by `Intl.getCanonicalLocales` on its own and lands there too.
