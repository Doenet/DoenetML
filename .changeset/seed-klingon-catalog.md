---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add a message catalog for Klingon, the roster's first constructed language.

`documentLocale="tlh"` and `<document lang="tlh">` work with nothing configured, and Klingon reaches `<document lang>`'s autocomplete. `tlh` is a registered IANA primary subtag, so it negotiates like any other individual language; `tlh-Piqd` reaches the Latin catalog, since Unicode does not encode pIqaD.

This is an **unreviewed machine-generated seed**, and every file says so in its header. It is also the first catalog that is partial for a lexical rather than a curricular reason: Klingon's lexicon is closed — every word in it is one Marc Okrand has published — so words such as *parabola*, *attribute* and *variant* simply do not exist. It translates 160 of the 562 keys, using Okrand's published geometry vocabulary where it exists («gho» circle, «mey'» polygon, «chav» function) and leaving the rest to English rather than inventing roots, which is what makes seeding safe here as everywhere else.

Markers and regions now build their one-colour description through the same message a stroke does. Every catalog writes that branch as the identity, so no language's output changes.
