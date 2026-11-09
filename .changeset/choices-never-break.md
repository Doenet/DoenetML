---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

What a random selection chooses from now comes only from what the author wrote, and a choice no longer fails by chance.

**Breaking:** a random selection whose parameter reads anything a reader can change is now an error when the document loads, in every variant, and the selection is shown as that error (`doenet-e0070`). Before, a select read it once, when it chose, so what it drew from depended on what the reader had entered by then. This applies to `<select>`, `<selectFromSequence>`, `<selectPrimeNumbers>` and `<selectRandomNumbers>`, and to an `<option>`'s `selectWeight`. "Can change" means an input, an answer, a slider, a sampler (`<sampleRandomNumbers>`, `<samplePrimeNumbers>`, `<sampleMultivariateRandomNumber>`, which can be resampled), or something a reader drags or writes to (a `<number>` a point in a `<graph>` reads, or one an input's `bindValueTo` names), or anything that reads one of these. The samplers themselves are unchanged: they may read inputs, and draw again when what they read changes. For example, `<select numToSelect="$n">` with `n` a `<mathInput>` is now an error. The error is placed at the parameter (`numToSelect="$n"`), names the reference and what it reaches, and is reported at load wherever the choice is: in a case not shown, an option not picked, or an iteration not made yet. A choice that extends or copies one in error (`<selectFromSequence extend="$s"/>`) shows the same error. What is written inside a choice in error, such as the content of a `<select>`'s options, is not made, so a reference to it finds nothing. A choice in error no longer counts toward the document's variants, so in a document that has one, the other random choices may select different values for the same variant number than before, and the number of variants may change.

A parameter may still read literals, content that can't change, another random selection, a repeat's `indexName` (even when an input decides how many iterations there are), and a repeat's `valueName` when what the repeat iterates over may be read.

A `<selectFromSequence>` or `<selectPrimeNumbers>` whose random draws find no valid selection (with `coprime` or `excludeCombinations`, or, extremely rarely, a `<selectFromSequence>` with neither) now draws among the valid ones exactly, so it always makes a selection when one exists. Values with no common factor but no coprime combination (`6 10 15` with `coprime`, two at a time) are now an error (`doenet-e0045`) in every variant, where before they were an info and selected nothing. The info `doenet-i0057` and the "extremely unlikely fluke" errors `doenet-e0052` and `doenet-e0053` are retired. A variant whose draws used to fail now makes a selection; a variant whose draws succeeded selects the same values as before.

Part of #2508.
