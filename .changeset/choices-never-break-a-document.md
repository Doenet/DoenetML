---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A random choice no longer stops a document from loading, and whether it is an error no longer depends on the variant (D38, DIAG-7).

- **A `<select>` whose options are written with `copy` loads and picks among them**, as among written ones (B39). It failed to load when every option was a copy, and when only some were, the variant never picked a copied one. Such a select doesn't count its options when the document's variants are counted, and says so with the new info `doenet-i0056`. The document's variants are then no longer counted either, so in such a document a variant number can pick differently than before, in its other choices too.
- **Choices the requested variant gives that don't fit are ignored**, with the new info `doenet-i0057`, and the tag makes its own choices, fixed for the variant, as `<shuffle>` already does. This happens when a variant was saved before the document changed, such as a `numToSelect` raised from 2 to 4. A `<select>` and a `<selectRandomNumbers>` threw, so the document failed to load. A `<selectFromSequence>` or `<selectPrimeNumbers>` showed an error and selected nothing (`doenet-e0037`–`e0040`, `doenet-e0048`–`e0050`, which are no longer reported).
- **A selection that a value decides can't be made is missing, with an info, not an error.** `<selectFromSequence from="1" to="$a" numToSelect="3"/>`, with `a` from another random choice, gave an error in the variants where `a` was below 3 and none in the others. It now selects nothing in those variants and reports `doenet-e0036` as an info. The same holds for `<select numToSelect="$n">` with too few options (`doenet-e0035`; the select shows a blank, `＿`), for `<selectPrimeNumbers>` (`doenet-e0047`, `doenet-e0051`), and for the `coprime`, `exclude` and `excludeCombinations` failures of `<selectFromSequence>` (`doenet-e0041`–`e0046`). When every attribute deciding it is written without a reference, and every option of a `<select>` is written in it, it is still an error, in every variant. The two "extremely unlikely fluke" failures (`doenet-e0052`, `doenet-e0053`) depend only on the variant, so they are always infos.
- **A selection that couldn't be made no longer breaks the document when it is given back**: when the document is reloaded with the variant it saved, or the select is copied with `copy`. A `<selectFromSequence>` or `<selectPrimeNumbers>` whose failure is found after its range is counted (such as `coprime` or `exclude`) threw, so the document failed to load. A `<select>` that failed doesn't report `doenet-i0057` either, since its variant gave no choices.

Closes #2389 and #2448.
