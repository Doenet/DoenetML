---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Wolof, Bambara, Akan, Ewe, Lingala, Shona, Southern Sotho, Setswana, Tigrinya and Ganda.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="sn"` and `<document lang="lg">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete, eight of them labelled with their endonym beside the English name.

All ten also carry `deprecated-attribute-to-child`, the diagnostic added alongside them, so no locale in the batch lands already one key behind.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

This is the second sub-Saharan batch, and it goes back for the two largest things the first one left out: **Bantu south of the equator**, which the first reached only through Swahili, Zulu, Xhosa, Kinyarwanda and Nyanja, and **francophone West and Central Africa**, which it did not reach at all.

Five of the ten agree an adjective with its noun's **class**, and they use the `$gender` argument as a class token exactly the way `locales/sw` does — the whole reason that argument was named for a position rather than for a case. What is worth reading is how differently five languages do the same thing:

- **Shona** does not bolt a prefix onto an unchanged stem. In class 5 the stem's own first consonant changes with the prefix, so «-tema» is «dema», «-chena» is «jena» and «-kobvu» is «gobvu». The table cannot be derived from the stems and is written out in the header.
- **Luganda** carries six classes, the widest table here, because its own geometry words land where the others' do not: «olunyiriri», a line, is class 11, and «akasaale», a ray, and «akatonnyeze», a point, are class 12 — the diminutive, which is where a small thing goes whether or not it is small on purpose.
- **Southern Sotho** and **Setswana** additionally need a qualificative *particle* — «mola *o* motenya» — and both leave it out on purpose, because the same string is what `backgroundColor` reports standing alone, where a bare particle would be a fragment. That is the trade `locales/sw` already makes with its associative.
- **Lingala** is the case where the device barely reaches. Its inventory of true adjectives is small and no colour word is in it — most of them are invariable French loans, and the three native ones are cited in one shape — so the concord touches two adjective stems and one participle and no more. Recording that is the point: a smaller table here is a fact about Lingala, not an unfinished one.

**Tigrinya** is the one that uses `$gender` for a gender. It is Semitic, the agreement is internal rather than suffixed — «ጸሊም» → «ጸላም», «ረጒድ» → «ረጓድ» — and it is also the only language in the batch whose adjectives *precede* the noun, so its composition messages keep the English order while the other nine invert it. Its Ge'ez runs left to right, so `direction.ts` needs nothing.

The four West African languages are the batch's counterweight, and they answer one question four ways: **what does a description do when the language inflects nothing?** **Wolof** has noun classes and still ignores `$gender`, because the class in Wolof rides on the determiner and the relative marker and never on the adjective. **Bambara** marks an adjective with the qualifier suffix `-man` rather than agreement. **Akan** and **Ewe** mark nothing at all on the adjective and put it after the noun.

Plurals split the batch too. CLDR gives Wolof and Bambara one category each, and Akan and Ewe have two that no counted message here can use — an Ewe noun takes no plural after a numeral, and the two nouns Akan counts carry their plural prefix in the singular already — so all four drop their selects rather than write a `[one]` that repeats its `[other]`. The five Bantu languages keep theirs and change the noun inside them, except that in Shona and Luganda it is decided per message by the class of the noun being counted: Shona's «edzo» is class 5 and takes «ma-», while «mhinduro» is class 9 and its plural is spelled the same; Luganda's «akabonero» becomes «obubonero», while «okumenya» is a class 15 verbal noun with no plural at all and «amagezi» is class 6 and already plural. So in both, some counted messages keep their selects and the rest drop them.

**Akan needs an alias, and Fante deliberately does not get one.** `ak` is the macrolanguage and the catalog is Asante Twi. `tw` is the retired code for Twi and the tag an author is as likely to type, and `Intl.getCanonicalLocales` leaves it alone rather than rewriting it the way it rewrites `iw` and `in` — so `negotiate.ts` maps `tw` to `ak`, the second entry `LANGUAGE_ALIASES` has ever needed. Fante is left out for the reason Nynorsk is: it is a written standard of its own, and answering `fat` with an Asante Twi catalog would be a substitution rather than a canonicalization. `negotiate.test.ts` holds both halves against the real roster.

**Chemistry.** All ten leave the 118 element names and the 12 anion names to fall back to English, and unlike the batches before them they split no ways at all: every one is the school-system case. Secondary science is taught in English across Ghana, Zimbabwe, Botswana, Lesotho, Uganda, Eritrea and Tigray, and in French across Senegal, Mali and both Congos, so in all ten the fallback *is* the curriculum. That is a fact about ten education ministries rather than about ten languages.

**Naming.** `lg` appears in the roster as **Ganda**, `st` as **Southern Sotho** and `tn` as **Tswana**, because `Intl.DisplayNames` renders them that way and `supportedLocales.ts` is derived rather than hand-written — the same split `ny` already has between Nyanja and Chichewa. All three catalogs' headers say so.

Setswana and Southern Sotho are close enough to raise the question of why they are two files: they are two standard languages with two orthographies and two vocabularies, and `locales/tn` writes «kgotsa», «boammaaruri» and «-hibidu» where `locales/st` writes «kapa», «nnete» and «-fubedu». That is the same reason `hr` is a directory of its own rather than a script of `sr`.
