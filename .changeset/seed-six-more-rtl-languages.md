---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Persian, Hebrew, Urdu, Pashto, Sindhi and Uyghur, which with Arabic completes the set of right-to-left languages DoenetML is translated into.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="he"` and `<document lang="he">` work with nothing configured, and all six reach `<document lang>`'s autocomplete with their names in their own script.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English.

Direction turns out to be the only thing these six have in common. Hebrew counts in three plural categories and agrees its adjectives with the noun they follow; Persian agrees nothing with anything and has no gender at all; Urdu, Pashto and Sindhi put their adjectives in front of the noun and inflect them again in front of a postposition — Urdu and Sindhi in both genders, Pashto only in the feminine — so Urdu's catalog is closer to Hindi's than to Arabic's; Uyghur is Turkic and marks its cases with suffixes, which is a different reason for the same restructuring Arabic needed — an affix cannot be attached to an interpolated value, so the message names what the value is or reaches for a word that can stand beside it.

Pashto, Sindhi and Uyghur leave the 118 element names and 12 anion names untranslated, joining Somali, Hmong Njua, Amharic, Assamese, Nepali and Burmese: there is no settled chemical nomenclature in any of the three to seed from, and the English fallback is what a student meets in a textbook. Persian, Hebrew and Urdu do have one and supply it — so the line runs through the Arabic script rather than around it.
