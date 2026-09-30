---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The `credit` of an `<award>` or a `<choice>` is now capped to 0 to 1, and `$aw.credit` and `$choice.credit` report the capped value. A credit above 1 counts as 1, and a negative or non-numeric credit as 0.

- Selecting a `<choice credit="2">` now gives the answer a credit of 1, where it used to give 2.
- In a `selectMultiple` choice input, a choice with credit above 1 now counts as one of the correct choices.
- With `colorInputsSeparately`, an input answered by an award with credit above 1 is now colored as fully correct, not partly correct.
- Submitting a choice with a negative credit now shows that choice's own feedback, where before the previous submission's feedback stayed in place.
- With `disableWrongChoices`, a submitted choice with non-numeric credit is now disabled like any other wrong choice.
