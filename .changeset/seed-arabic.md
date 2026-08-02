---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add a message catalog for Arabic, the first language DoenetML is translated into that is written right to left.

It covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ar"` and `<document lang="ar">` work with nothing configured, and Arabic reaches `<document lang>`'s autocomplete under its own name. The page turns around with it: the words are Arabic and the layout runs the way they are read, while graphs, equations and math input stay left to right inside it.

This is an **unreviewed machine-generated seed**, and every file says so in its header. Nothing falls back silently: a key the translation is missing renders in English.

Arabic counts a phrase six ways where English counts it two, and is the first catalog to need a dual: a count of exactly two selects a form carrying no number at all, and none, three to ten, eleven to ninety-nine and everything above take four further forms of their own. Its adjectives follow the noun and agree with it in gender, so a styled line describes itself as `خط أحمر متقطع سميك`. Where English welds a preposition to an interpolated value, the Arabic message names what the value is instead, since a one-letter preposition cannot be attached to an argument.

Element and anion names are included: Arabic has a settled chemical nomenclature, and it is the one a student meets in their own textbook.
