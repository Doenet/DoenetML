---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Write the names the chemistry components generate in the document's language: all 118 element names, the name an ion takes, and the message shown where a symbol names nothing.

Symbols, formulas, and anything an author's `<award>` compares against by value are unchanged. Only what is displayed as prose moves. An element's periodic group, its phase at STP and its metal category read as words but are compared as values — `$atom.groupName = Noble Gas` — so they stay as the atom database spells them in every language.

An ion's name is now looked up rather than derived. English builds an anion's name by stripping a trailing "ine" and adding "ide", with a small table for the words that rule does not fit — that is English morphology, and no other language derives its anion names that way. Each language supplies its own names instead. A transition metal's oxidation state keeps its Roman numeral, which is international, but where it sits and how it is punctuated is now the catalog's to say.

A document that declares no language reads exactly as it did before.
