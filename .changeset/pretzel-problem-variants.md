---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Each variant of a `<pretzel>` whose problems contain random choices, such as a `<selectFromSequence>`, is now a different document. A pretzel's variants combine its problem orders with the random choices in its problems, but only the problem order followed the requested variant: the random choices were picked independently of it, so many variant numbers repeated the same document. For example, a pretzel of two problems with a `<selectFromSequence from="1" to="3"/>` in one statement reported 6 variants, but variants 1–6 gave only 3 distinct documents. They now give all 6.

The variants now count only the content the pretzel shows: the statement and answer of each problem. Random choices elsewhere in a problem, such as in a `<hint>`, and a problem's `<variantControl>` are ignored, as that content is not shown.

A document with such a pretzel can therefore have a different number of variants than before, and a variant number saved for it may now give a different variant.

Closes #2337.
