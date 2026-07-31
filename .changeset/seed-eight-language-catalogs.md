---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for eight more languages: French, German, Italian, Dutch, Russian, Somali, Chinese, and Hmong Njua.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the ~214 warnings and errors. `documentLocale="de"` and `<document lang="de">` now work with nothing configured, and all eight appear in `<document lang>`'s autocomplete with their names in their own script.

These are **unreviewed machine-generated seeds**, and every file says so in its header. So is Spanish, which shipped first and was never anything else; its four catalogs now carry the same header. English is the source of truth and the only language anyone has read. They are a starting point for the community translation platform (#1521), not finished translations: expect wording to be corrected. Nothing falls back silently — a key a translation is missing renders in English, which is what makes seeding safe.

The style descriptions are not word-for-word translations, because they cannot be. Each language declares the grammatical gender of every noun it describes and inflects its adjectives to agree: German and Russian across three genders, Dutch across *de*- and *het*-words, French and Italian across two, and Chinese, Somali and Hmong Njua across none. German and Russian also carry the case their border clause governs, so "with a thick border" comes out "mit einem dicken Rand" and "с толстой границей" rather than agreeing with the wrong thing.

Somali and Hmong Njua deliberately leave the 118 element names and 12 anion names untranslated rather than invent a chemical nomenclature; those render in English until a chemist who writes the language supplies them.
