---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix matrix, vector, and tuple arithmetic losing an entry whose value works out to one.

Subtracting a matrix that has an entry of `-1`, as in `<math simplify>$A + $B - $C</math>`, gave a wrong answer or no answer at all. Distributing the minus sign over the entries turned that entry into the product `(-1)(-1)`, which simplified to an empty product rather than to `1`, so the entry dropped out of the sum. Where the rest of that entry's sum was negative, the entry silently came out one too small; where it was positive, evaluating the expression failed outright and the document reported an internal error. Subtracting tuples and vectors with an entry of `-1` behaved the same way.
