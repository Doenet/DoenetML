---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add message catalogs for Ukrainian, Czech, Slovak, Greek, Romanian, Hungarian, Finnish, Swedish, Danish and Norwegian Bokmål, which fills in Northern and Eastern Europe alongside the Western European languages DoenetML already had.

Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="uk"` and `<document lang="el">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete under their own names.

These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English.

All ten supply the element and anion names, so no locale in this batch is partial.

`no` reaches the Bokmål catalog as well as `nb` does. It is the macrolanguage tag, so no directory is named for it, but it is what a hand-typed `<document lang="no">` says and what several browsers still send — and filtering negotiation would otherwise have answered it with English. Nynorsk (`nn`) still falls back to English, being a written standard of its own rather than a spelling of this one.

What these ten have in common is a constraint the right-to-left work met first: an affix cannot be attached to an interpolated value. Hungarian and Finnish weld case endings whose shape depends on the word they land on, Romanian's definite article is a suffix, and Czech and Slovak vocalize a preposition according to what follows it — so several messages are restructured rather than translated in place, and `packages/i18n/README.md` now writes the constraint down once for every language rather than as a right-to-left curiosity.
