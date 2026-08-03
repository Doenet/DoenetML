---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia, Thai, Malay and Filipino.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ta"` and `<document lang="ta">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own script.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

This batch covers the major languages of Indian schooling and adds the three of mainland and maritime Southeast Asia that a Doenet activity is likeliest to be read in. Eight of the ten have a script of digits recorded for them in CLDR — Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia and Thai — and none of them writes a number that way here, which is the digit policy that had to land first.

Gujarati and Punjabi are the ones that exercise the agreement machinery. Gujarati has three genders, so a border reads `જાડી કાળી` — feminine, agreeing with `કિનારી` rather than with the shape the border surrounds — and a filled circle is `ભરેલું વાદળી વર્તુળ`, neuter, in the same sentence. It agrees on gender alone: it has an oblique, but every clause position its adjectives reach lands on a feminine noun or on none at all, so no position spells the word differently. Punjabi falls the opposite way round from Hindi: its feminine `ਕਿਨਾਰੀ` spells the border alike in both positions while its masculine `ਪਿਛੋਕੜ` sends the background colour oblique, so `ਪੀਲਾ` standing alone becomes `ਪੀਲੇ ਪਿਛੋਕੜ ਉੱਤੇ` inside the sentence — one clause position out of the four, which is the whole of Punjabi's `$role` fork. Both name the fill so that its colour has a noun of the right gender to agree with: a dotted blue circle reports its fill as `ટપકાં વાળી વાદળી ભરણી`. The other eight inflect none of this; Thai, Malay and Filipino put their adjectives after the noun, and the rest keep the English order and postpose the adposition instead. Tamil and Telugu mark a fill pattern with a free participle rather than a bound postposition, because joining one to a word the catalog never sees would have to reshape that word's ending.

Filipino is where a plural category is least like a count. CLDR splits `fil` by the linker a numeral takes — `one` is every number whose Tagalog word ends in a vowel and takes `-ng`, and `other` is 4, 6, 9 and anything ending in them, which take the separate `na` — so `one` catches five and `other` catches four. Every message that stands a count in front of a noun selects on it for that linker. Filipino marks number itself with the free word `mga` instead, and a message that wants a singular selects `[1]` by number.

The seven catalogs of India call a `<label>` a label rather than a name, following the four already here that do: `name` is a DoenetML attribute these same messages talk about, and "must have a short description or a name" sends an author to the wrong one.

Filipino is catalogued as `fil`, and `tl` reaches it without an alias because `Intl.Locale` canonicalizes the deprecated code before negotiation sees it — `negotiate.test.ts` now holds that against the real roster. Punjabi is `pa` in Gurmukhi, following the rule that a directory is named for a script only where two scripts of one language are translated separately.

Kannada, Punjabi and Filipino leave the 118 element names and 12 anion names untranslated, joining Somali, Hmong Njua, Amharic, Assamese, Nepali, Burmese, Pashto, Sindhi, Uyghur and Vietnamese. Kannada has two nomenclatures a textbook may draw on in one chapter and picking either would misreport the other; Punjabi's secondary chemistry moves to English terminology; and Philippine science is taught in English from the intermediate grades, so there the English fallback is already the curriculum. Tamil, Telugu, Malayalam, Gujarati, Odia, Thai and Malay do have a settled set and supply it — so Tamil and Kannada part company here despite neighbouring school systems, which is exactly why they are two catalogs.
