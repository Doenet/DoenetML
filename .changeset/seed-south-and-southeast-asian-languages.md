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

This batch completes the major languages of Indian schooling and adds the three of mainland and maritime Southeast Asia that a Doenet activity is likeliest to be read in. Seven of the ten count in their own digits by CLDR's reckoning and none of them writes numbers that way here, which is the digit policy that had to land first.

Gujarati and Punjabi are the ones that exercise the agreement machinery. Gujarati has three genders and inflects for none of the clause positions, so a border reads `જાડી કાળી` in both — what its `$role` fork buys is agreement with `કિનારી` rather than with the shape the border surrounds. Punjabi falls the opposite way round from Hindi: its feminine `ਕਿਨਾਰੀ` spells the border alike in both positions while its masculine `ਪਿਛੋਕੜ` sends the background colour oblique, so `ਪੀਲਾ` standing alone becomes `ਪੀਲੇ ਪਿਛੋਕੜ ਉੱਤੇ` inside the sentence. The other eight inflect none of this; Thai, Malay and Filipino put their adjectives after the noun, and the rest keep the English order and postpose the adposition instead.

Filipino is catalogued as `fil`, and `tl` reaches it without an alias because `Intl.Locale` canonicalizes the deprecated code before negotiation sees it — `negotiate.test.ts` now holds that against the real roster. Punjabi is `pa` in Gurmukhi, following the rule that a directory is named for a script only where two scripts of one language are translated separately.

Kannada, Punjabi and Filipino leave the 118 element names and 12 anion names untranslated, joining Somali, Hmong Njua, Amharic, Assamese, Nepali, Burmese, Pashto, Sindhi, Uyghur and Vietnamese. Kannada has two nomenclatures a textbook may draw on in one chapter and picking either would misreport the other; Punjabi's secondary chemistry moves to English terminology; and Philippine science is taught in English from the intermediate grades, so there the English fallback is already the curriculum. Tamil, Telugu, Malayalam, Gujarati, Odia, Thai and Malay do have a settled set and supply it — so Tamil and Kannada part company here despite neighbouring school systems, which is exactly why they are two catalogs.
