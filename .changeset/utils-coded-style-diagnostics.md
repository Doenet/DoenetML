---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Style-contrast accessibility alerts can now be translated.

The contrast alerts named the colors they compared — "text color against
background color", " (dark mode)" — by building the sentence out of English
fragments, so no translation could reposition or reword them. The pair and the
mode are now data the message renders, and the dark-mode advice is a variant of
the message rather than a second sentence appended to it.

Translating them gives the style utilities a runtime dependency on the message
catalogs, and the DoenetML language server — embedded in the code editor as
well as in the VS Code extension — imports those utilities for something
unrelated. That would have added 20 KB gzipped of catalog text to it with none
of the code that reads it. The catalogs are declared side-effect-free instead,
so the language server is unchanged byte for byte, and a new build check fails
if they ever arrive.
