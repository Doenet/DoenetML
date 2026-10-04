---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Answers that check inputs placed elsewhere in the document, as assignments that put their inputs in the text do, load faster and use less memory. The saving is in the references inside an `<award>` that its `<answer>` records as responses: those in `<answer><award><when>$mi = x</when></award></answer>` when the answer has no input of its own, and those an award names in `referencesAreResponses`. In one such assignment, loading took 12% less time, and the loaded document 18% less memory.

Answers award the same credit, and record the same responses with the same types, with two exceptions. An answer that records as a response a reference to an entry that is not there, such as `$l[$i]` with `$i` past the end of a `<numberList>` or a `<choiceInput>`'s `selectedIndex` before a choice, now always records it as one empty response, so the number of responses no longer depends on where the answer is or on whether the entry is there. Before, it recorded nothing inside a `<group>`, a repeat or a copy, nor for a reference directly in an `<award>` or in an operator such as `<sum>` or `<and>`, and recorded an empty text for one in a `<text>`. This holds for the lists whose entries always have one type, such as `<numberList>`, `<mathList>` and `<textList>`; an entry of a `<sequence>`, a `<collect>` or a list in a copied `<module>` is recorded as before. The other exception is rare (#2151). An `<award extend>` whose own `referencesAreResponses` names an entry its source award reads by an index that changes (`$l[$i]`) now ignores that name throughout, as it already did when the source answer had an input of its own. Before, the answer began recording only that entry once the index changed.
