---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Report the answers, not the weights, on a section-wide check-work button whose answers all carry `weight="0"`.

A container worth no points is credited in full — that is how a reader gets credit for a document that asks nothing of them, and how a section with no answers stops blocking a `<cascade>`. A section whose answers all carry `weight="0"` was falling under that rule, so its `sectionWideCheckWork` button turned green and read "Correct" however the answers had been filled in, and colored every answer under it green. The button and the coloring now weigh those answers equally: a wrong answer reads "Incorrect", one right of two reads "50% Correct".

Scores are unchanged. A section holding no answers is still credited in full, a zero-weight answer beside a weighted one still counts for nothing, and the credit reported for the section, for the document, and to a `<cascade>` deciding whether to advance is exactly what it was.
