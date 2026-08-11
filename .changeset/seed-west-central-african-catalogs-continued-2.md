---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for ten more languages: Baoulé (`bci`), Bini
(`bin`), Bulu (`bum`), Jola-Fonyi (`dyo`), Efik (`efi`), Ewondo (`ewo`),
Kpelle (`kpe`), Loma (`lom`), Susu (`sus`) and Urhobo (`urh`). A document
declaring one of these languages now renders its style descriptions, section
headings, boolean words, answer buttons, editor chrome and diagnostics in it
instead of falling back to English. The chemistry element tables are
deliberately left out of all ten and still fall back to English.

Every string is machine-generated and has not been read by a speaker; each
catalog says so in its header. Several of the ten — Ewondo, Bulu, Bini,
Urhobo, Jola-Fonyi, Susu, Kpelle and Loma — carry an additional honest
confidence caveat in their headers: low online lexical coverage for these
languages means heavier reliance on English or French loanwords, and Loma in
particular is the least digitized language seeded so far. Correcting any of
this needs no permission.
