---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<pretzel>` now warns about a `<problem copy="…">` or `<problem extend="…">` child: `A <problem> that copies or extends another problem is not supported in a <pretzel> and is ignored.` Such a child was already left out of the pretzel's problems, but it was still counted when the pretzel worked out its number of variants. So, for example, a pretzel with one problem and two problem copies reported 6 variants while arranging a single problem. It is no longer counted, so the number of variants matches the problems the pretzel arranges.

Closes #2334.
