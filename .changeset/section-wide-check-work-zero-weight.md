---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Report the answers, not the weights, on a section-wide check-work button whose answers all carry `weight="0"`.

A container that is worth no points is credited in full — that is how a reader gets credit for opening a document that asks nothing of them, and how a section with no answers stops blocking the rest of a `<cascade>`. A section whose answers all carry `weight="0"` was falling under the same rule, so its `sectionWideCheckWork` button turned green and said "Correct" as soon as it was pressed, and colored every answer under it green, no matter what the reader had entered — next to inputs the reader could see were wrong.

The button and the coloring now ask a separate question from the score: when nothing in the section carries weight, the answers are weighed equally, so the verdict follows the responses. A wrong answer reads "Incorrect", one right of two reads "50% Correct". Nothing else moves. A section holding no answers is still credited in full; a zero-weight answer beside a weighted one still counts for nothing; and the credit reported for the section, for the document, and to a `<cascade>` deciding whether to advance is exactly what it was.
