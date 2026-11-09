---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

What a random choice chooses from now comes only from what the author wrote, and a choice no longer fails by chance.

**Breaking:** a random choice whose parameter reads anything a reader can change is now an error when the document loads, in every variant, and the choice is shown as that error (`doenet-e0070`). Before, it was read once, when the choice was made, so what a choice drew from depended on what the reader had entered by then. This applies to `<select>`, `<selectFromSequence>`, `<selectPrimeNumbers>`, `<selectRandomNumbers>`, `<sampleRandomNumbers>`, `<samplePrimeNumbers>` and `<sampleMultivariateRandomNumber>`, and to an `<option>`'s `selectWeight`. "Can change" means an input, an answer, a slider, or something a reader drags or writes to (a `<number>` a point in a `<graph>` reads, or one an input's `bindValueTo` names), or anything that reads one of these. For example, `<select numToSelect="$n">` with `n` a `<mathInput>` is now an error. The error is placed at the parameter (`numToSelect="$n"`), names the reference and what it reaches, and is reported at load wherever the choice is: in a case not shown, an option not picked, or an iteration not made yet.

A parameter may still read literals, content that can't change, another random choice, a repeat's `indexName` (even when an input decides how many iterations there are), and a repeat's `valueName` when what the repeat iterates over may be read.

A `<selectFromSequence coprime>` or a choice with `excludeCombinations` whose random draws find no valid combination now draws among the valid combinations exactly, so it always makes a selection when one exists. Values whose combinations can't be valid (`6 10 15` with `coprime`, two at a time) are an error in every variant. The info `doenet-i0057` and the "extremely unlikely fluke" errors `doenet-e0052` and `doenet-e0053` are retired. A variant that used to fail this way now makes a selection; no other variant changes.

Part of #2508.
