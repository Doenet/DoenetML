---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Answers that check inputs placed elsewhere in the document, as assignments that put their inputs in the text do, load faster and use less memory. The saving is in the references inside an `<award>` that its `<answer>` records as responses: those in `<answer><award><when>$mi = x</when></award></answer>` when the answer has no input of its own, and those an award names in `referencesAreResponses`. In one such assignment, loading took 12% less time, and the loaded document 18% less memory.

Answers record the same responses, with the same types, and award the same credit, with one rare exception (#2151). An `<award extend>` whose own `referencesAreResponses` names an entry its source award reads by an index that changes (`$l[$i]`) now ignores that name throughout, as it already did when the source answer had an input of its own. Before, the answer began recording only that entry once the index changed.
