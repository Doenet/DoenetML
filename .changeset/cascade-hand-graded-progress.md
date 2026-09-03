---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `handGraded` answer no longer stops a `<cascade>`, and no longer holds a
section's title banner gray.

A hand-graded answer keeps a credit of 0 until an instructor grades it, which
happens well after the reader is done with the document. A cascade step
containing one therefore never reached full credit, and the reader was left
there with no way forward however much they wrote.

Such an answer now counts as complete as soon as the reader submits a response
that is not blank; submitting an untouched input does not count. The same rule
colors the title banner of a `boxed` or `collapsible` section, so a section
whose questions have all been answered shows as completed rather than waiting
for a grade the reader cannot see.

The new `completedColorRequiresCredit` attribute opts a section's banner back
into waiting for the real credit, and is inherited by the sections within it.
It affects only the color, never when a cascade advances. Either way the
reported `creditAchieved` is unchanged — a hand-graded answer is still awaiting
its grade.
