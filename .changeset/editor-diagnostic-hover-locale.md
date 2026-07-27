---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Show the editor's diagnostic tooltips in the reader's language: the message, the severity heading above it, and the accessibility headings.

Hovering a squiggle was the last place a diagnostic stayed English no matter who was reading. The checks the language server runs as you type — an unrecognized element, one in a parent that doesn't accept it, an unknown attribute, a value outside its enumeration — now read in the same language as the Diagnostics tab beside them.

The lint panel and what a screen reader announces follow the same text, so no surface of one diagnostic disagrees with another. A document that declares its own language is read in that language here too, the same as everywhere else the reader's language is left unset.

With no locale configured anywhere, every tooltip reads exactly as it did before.
