---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Number `<problems>` and `<exercises>` among the divisions, and stop the containers that show no number from taking one.

A document numbers its figures and tables in one sequence and its divisions in another. Five components were taking a number out of the figure-and-table sequence: `<problems>` and `<exercises>`, which showed the number they took, and `<cascade>`, `<externalContent>` and `<standinForFutureLayoutTag>`, which had no use for one and left a gap. The first figure inside a `<cascade>` read "Figure 2", and every figure and table after any of the five was one too high.

`<problems>` and `<exercises>` now number themselves among their sibling divisions, the way `<section>` and `<problem>` already did — a `<problems>` between two `<section>`s is "Problems 2", not a number out of the figure sequence, and the `<section>` after it is now Section 3. They keep `renameTo`, which the divisions they group do not have, and they gain `includeParentNumber`, which those divisions do have.

The three containers now take no number at all, and pass the enclosing section's enumeration through in place of one. A figure that is the first numbered thing in a document is Figure 1 however many containers enclose it, and a division written inside one with `includeParentNumber` (the default for `<section>`) is prefixed with the number of the section its author sees around the container rather than with a number the container had taken. Sections in a `<cascade>` that wraps the document are numbered 1, 2, … rather than 1.1, 1.2, ….
