---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Seed unreviewed message catalogs for four more African languages: Mende
(`men`), Umbundu (`umb`), Kimbundu (`kmb`) and Zarma (`dje`). A document
declaring one of these languages now renders its style descriptions, section
headings, boolean words, answer buttons, editor chrome and diagnostics in it
instead of falling back to English. The chemistry element tables are
deliberately left out of all four and still fall back to English.

Every string is machine-generated and has not been read by a speaker; each
catalog says so in its header. Correcting one needs no permission.

Zarma is a member of the Songhay macrolanguage, so readers arriving under
`ddn`, `hmb`, `khq`, `ses`, `tda` or `twq` now reach it as well. A bare `son`
is deliberately still served English: CLDR has no opinion about which Songhay
variety it means, so choosing one would be a guess rather than a published
fact.

Umbundu and Kimbundu are the first catalogs in the roster centred on Angola,
and Mende the third for a language of Sierra Leone.
