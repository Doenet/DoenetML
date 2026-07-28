---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Write the word a sectional block calls itself in the document's language: section, example, problem, part, proof, solution, answer, hint, and the rest.

The heading a section builds around that word moves with it. "Section 2: Limits" used to be assembled by concatenation — the word, a space, the number, then a colon or a period before the title — which is English order and English punctuation written into the code. It is now one message per shape, so a translation can order and punctuate each one on its own terms.

The word is keyed by the element an author writes rather than by an internal class name, so `<subsection>` and `<subsubsection>` share the word for section, and a block whose name the author set with `renameTo` keeps their word in every language.

An unnumbered block such as `<proof>`, asked to include its number, used to render the word "null" where the number would have gone. It now renders no number, which is what it has.

A block whose `renameTo` is empty, or is nothing but spaces, likewise renders no name, rather than the space and colon that used to be written around the word that isn't there.

Apart from those, a document that declares no language reads exactly as it did before.
