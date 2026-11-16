---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `<award>` or a `<choice>` can only be copied (D42). **This is a breaking change for authors:** `<award extend="$aw"/>`, `<award copyWithState="$aw"/>`, `<choice extend="$c"/>` and `<choice copyWithState="$c"/>` are now an error at load (`doenet-e0078`), shown in place of the award or choice, wherever it is, and the message suggests `<award copy="$aw"/>`. An award's `awarded` and a choice's `submitted` record the last submission of the answer or choice input holding it, so an extend, which shares that record, and a `copyWithState`, which starts from another one, mean nothing. Before, an extend behaved as a copy. Rewrite each to `copy`, which writes the award or choice again here: a tolerance ladder in one answer, an award or a choice defined in a `<setup>` and reused, or a choice reused with another `credit`.

Unchanged: a bare `$aw` (the award's value), `<answer extend>`, an award inside an extend of the answer or section holding it, and an award or choice outside an answer or choice input, which gets no warning.

An `<answer>` holding `<award copy="$aw"/>` now adds the input the award written out gets. Before, an answer couldn't see what a copy held, so one holding a copied award and no input of its own added a `<mathInput>`: a second, stray input beside the one its condition reads, or a math input where the award compares text. A copied award in an answer with no input of its own now records the references it reads as responses, as the written-out award does, and the source award's `referencesAreResponses` counts as if written on the copy.
