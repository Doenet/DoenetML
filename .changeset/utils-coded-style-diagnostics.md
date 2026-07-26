---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Style-contrast accessibility alerts can now be translated, and the DoenetML
language server no longer carries message catalogs it never reads.

The contrast alerts named the colors they compared — "text color against
background color", " (dark mode)" — by building the sentence out of English
fragments, so no translation could reposition or reword them. The pair and the
mode are now data the message renders, and the dark-mode advice is a variant of
the message rather than a second sentence appended to it.

The language server imports the style utilities for something unrelated and
gained 20 KB gzipped of catalog text as a side effect of that work, with none
of the code that reads it. The catalogs are now declared side-effect-free, which
takes the bundle back to its previous size, and the build fails if they return.
