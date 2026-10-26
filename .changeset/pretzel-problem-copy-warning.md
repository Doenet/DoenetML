---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<pretzel>` now warns about a `<problem copy="…">` or `<problem extend="…">` child: `A <problem> that copies or extends another problem is not supported in a <pretzel> and is ignored. Write the problem out inside the <pretzel>.` Such a child was already left out of the pretzel's problems, but it was still counted when the pretzel worked out its number of variants, as were any random choices, such as a `<selectFromSequence>`, written inside a `<problem extend>`. So, for example, a pretzel with one problem and two problem copies reported 6 variants while arranging a single problem. Neither is counted now, so the number of variants matches the problems the pretzel arranges.

A document with such a pretzel can therefore have fewer variants than before, and a variant number saved for it may now give a different variant.

Closes #2334.
