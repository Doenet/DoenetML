---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Show the `<select>` family's error boxes in the reader's language.

`<select>`, `<selectFromSequence>` and `<selectPrimeNumbers>` replace themselves with a red box when nothing can be selected, and that box was built from a finished English sentence. It was the last error box that stayed English on a page rendering in any other language.

The twenty-two messages behind it now carry the same stable codes every other diagnostic does, with Spanish translations alongside. Two failures that read as one — a sequence whose values all share a factor, and a sequence that ran out of draws looking for a coprime pair — are separate codes, because they are separate situations.

The English text of every box is unchanged, except that a count of a thousand or more is now written the way the reader's language writes numbers — "Cannot select 1,500 components" rather than "1500".
