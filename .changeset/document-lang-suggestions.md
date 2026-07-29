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

They are suggestions, not a constraint, and this is the point: `lang` takes any
BCP-47 tag, and a document in a language nobody has translated the interface
into is not a mistake. Its tag still reaches the rendered `lang` attribute,
where a screen reader picks a voice and the browser hyphenates, with only the
prose the core computes falling back to English. A deployment supplying
catalogs of its own likewise keeps working. So nothing new is flagged: the
editor draws no squiggle under a tag it does not recognize, and the help panel
says "Suggested" rather than "Allowed" so it does not claim a rule that is not
enforced.
