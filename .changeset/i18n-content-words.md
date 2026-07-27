---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Translate more of the words the core computes into a document: boolean words, the default submit-button labels, and the `if`, `or` and `otherwise` a piecewise function writes around its branch conditions.

A `<boolean>` or `<booleanInput>` in a Spanish activity now reads "verdadero" and "falso" where an author interpolates `$b.text` into their prose. The *value* is untouched: `true` and `false` are DoenetML syntax, so an `<award>` comparing against them, and saved state holding them, work the same in every language. Where a boolean is read back out of text — `$b.text` bound to an input — both spellings are accepted.

An answer's submit button says "Revisar" instead of "Check Work" in a Spanish activity, and the same for a section-wide check-work button. Only the *default* is translated: `submitLabel="Ready?"` is the author's own wording and passes through verbatim in every language, including when it happens to match the English default.

`<intComma>` groups by the document's own conventions rather than always in English — `25.236.501,35` in Spanish or German, `12,34,567` in Hindi. It still groups rather than rounds, so a value written with trailing zeros keeps them.

`<pluralize>` works by running an English model over its text, and there is no equivalent for an arbitrary language. In a document written in another language it now leaves the text alone and says so, rather than silently doing nothing — unless the author supplied a `pluralForm`, which needs no model and is used in every language, with `basedOnNumber` choosing between the two forms. `<lorem>` stays Latin in every language, which is what placeholder text is for.

Numbers inside mathematics keep `.` as their decimal separator in every language. A decimal comma is a real and wanted feature, but it has to arrive on the input side at the same time — until then, changing it would change what a grader compares rather than only how it looks.

An answer's or section's `showCorrectness` and `colorCorrectness` are now properties an author can reference as `$a.showCorrectness` and `$a.colorCorrectness`, reporting the resolved values after any enclosing section's setting, hand-grading and the activity-wide flag are taken into account. The raw attribute values behind them, and the raw value behind a submit label, are no longer reachable under their internal names.

With no locale configured, every one of these reads exactly as it did before.
