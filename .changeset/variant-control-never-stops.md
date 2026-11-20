---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<variantControl>` no longer stops a document from loading. Each case that did is now an error at the attribute, and the document loads with a fallback:

- Names that exclude every variant (`numVariants="2" variantsToExclude="a b"`, or `variantsToInclude="a" variantsToExclude="a"`) are an error (`doenet-e0087`), and every variant is included. Before, the document failed with "No variants selected based on variantsToInclude, variantsToExclude, and the number of variants available".
- A name repeated in `variantNames`, compared without case (`variantNames="x X y"`), is an error (`doenet-e0086`), and the first is kept: here the variants are named `x`, `y`, and then `c`. Before, the document failed with "Duplicate variant names specified".
- An empty `variantsToInclude=""` is an error (`doenet-e0072`), and the attribute is ignored. Before, the document failed with "Cannot specify a blank variantsToInclude attribute of a variantControl".
- A reference (`$v`) in any attribute of a `<variantControl>` is ignored, with an error at the attribute (`doenet-e0085`), and what is written beside it is kept: a document's variants are decided before anything else in it, so a reference can't be read there. Before, a reference in `variantsToInclude`, `variantsToExclude` or `variantNames` made the document fail to load; one in `numVariants` or `uniqueVariants` made the whole `<variantControl>` an error, with the untranslated message "Invalid reference in a primitive attribute", so its other attributes were ignored too; and one in `seeds` gave the warning "Invalid format for attribute seeds", yet was still taken as one of the seeds.

A `<problem>`'s or other section's `<variantControl>` is now followed wherever the section is, and its variants are unique just as they would be in a document with unique variants. Before, that held only when the variants of the document, and of every section around the problem, were unique. When they weren't (`uniqueVariants="false"`, a randomization whose variants can't be counted, or too many variants to be unique), what happened depended on where the count of variants stopped:

- If it stopped before the problem (`uniqueVariants="false"` on the document's or a surrounding section's `<variantControl>`, or a randomization before the problem that couldn't be counted), the problem's `<variantControl>` was ignored, along with any error in it: its variants came from those around it.
- If it reached the problem (too many variants, or a randomization after the problem that couldn't be counted), the problem had the variants its `<variantControl>` says, but two of them could show the same content.

This changes which content such a problem shows in a given variant of the document. Where its `<variantControl>` was ignored, other random choices in the same document or section, before or after the problem, can change too, as the problem now picks its variant from the same random sequence. An attempt saved before the change still shows the content it was saved with.

Closes #2579.
