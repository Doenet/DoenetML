---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Keep the whole check-work widget in one language.

The button rested on a label in the document's language and then reported "Correct", "37% Credit" or "Response Saved" in the reader's, so an activity declaring `lang="es"` read with `uiLocale="en"` said "Revisar" and then "Correct" on the same control.

The button, its verdict, the attempts-remaining message beside it and the validation state announced on the input now all follow the document. An author can name that button from their own prose — "Pulsa el botón $ans.submitLabel" — and a sentence that names the button has to name what the button actually says, so the label, the prose pointing at it, and the verdict are all one language.

Nothing changes when the reader's language and the document's agree. Where they differ the whole widget is now the document's — including when an activity declares no language at all, which counts as English: a reader who set `uiLocale="es"` used to see a Spanish "Correcto" beside an English "Check Work", and now sees the control wholly in English. One language on one control is the trade.

Error boxes still follow the reader: a diagnostic is addressed to whoever is looking at the screen, and no authored prose ever refers to one.
