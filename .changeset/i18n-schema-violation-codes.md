---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Give the language server's schema checks stable diagnostic codes, so the squiggles the editor draws under an unrecognized element, a misplaced one, an unknown attribute, or a value outside its enumeration can be translated and cited.

These were the last author-facing diagnostics composing their English at the point they were raised, with no name a bug report could quote or a host could filter on. Each now carries a code and the values that fill its message in, alongside the English it has always shown, and the same sentences are in the message catalogs for translators.

The check for a name that does not start with a letter shares its code with the parser's identical check rather than taking a second name for one mistake, which also lets the editor collapse the two reports into one entry.

Every message reads exactly as it did before.
