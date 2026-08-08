---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add a message catalog for Klingon, the roster's first constructed language.

`documentLocale="tlh"` and `<document lang="tlh">` work with nothing configured, and Klingon reaches `<document lang>`'s autocomplete. `tlh` is a registered IANA primary subtag, so it negotiates like any other individual language; `tlh-Piqd` reaches the Latin catalog, since Unicode does not encode pIqaD.

This is an **unreviewed machine-generated seed**, and every file says so in its header. It is also the first catalog that is partial for a lexical rather than a curricular reason: Klingon's published lexicon has no mathematics register, so there is no word for *circle*, *polygon*, *attribute* or *reference*. It translates 149 of the 562 keys and leaves the rest to English rather than inventing roots, which is what makes seeding safe here as everywhere else.

Markers and regions now build their one-colour description through the same message a stroke does. Every catalog writes that branch as the identity, so no language's output changes.
