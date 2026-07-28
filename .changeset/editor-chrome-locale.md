---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Render the editor's own chrome in the reader's language.

The viewer chrome was translated; the editor's was not, so a reader who set `uiLocale="es"` — or opened a document declaring `<document lang="es">` — got a Spanish document inside an English editor. It showed worst in the Diagnostics panel, where a translated message sat beside an untranslated `Line #2`.

The footer, the diagnostics and responses panels, the variant picker, the accessibility button and the update button all follow the same language now, and that language is the one the viewer resolved rather than the one the surrounding host chrome uses — so the two halves of the editor can never disagree. Spanish translations ship with it.
