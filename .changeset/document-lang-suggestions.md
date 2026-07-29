---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Offer the languages DoenetML has translations for as autocomplete and help for `<document lang>`.

Typing `lang="` in the editor now lists each language by tag, named in English
and in itself — `es` as "Spanish (español)" — and the context-help panel shows
the same list under "Suggested values". The list comes from the catalogs in the
repository, so a language added later appears in both places without anyone
maintaining a second copy of it.

They are suggestions, not a constraint. `lang` still takes any BCP-47 tag, and
a document in a language nobody has translated the interface into is not a
mistake: its tag reaches the rendered `lang` attribute, where a screen reader
picks a voice and the browser hyphenates, with only the prose the core computes
falling back to English. So the editor draws no squiggle under a tag it does
not recognize, and the help panel says "Suggested values" rather than "Allowed
values" so it does not claim a rule nothing enforces.
