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
- A reference (`$v`) in any attribute of a `<variantControl>` is ignored, with an error at the attribute (`doenet-e0085`), and what is written beside it is kept: a document's variants are decided before anything else in it, so a reference can't be read there. Before, a reference in `variantsToInclude`, `variantsToExclude` or `variantNames` made the document fail to load; one in `numVariants` or `uniqueVariants` made the whole `<variantControl>` an error, with the untranslated message "Invalid reference in a primitive attribute", so its other attributes were ignored too; and one in `seeds` dropped the attribute with the warning "Invalid format for attribute seeds".

A `<problem>`'s or other section's `<variantControl>` is now followed in a document whose own variants aren't unique (`uniqueVariants="false"`, a randomization whose variants can't be counted before the section, or too many variants to be unique). Before, with `uniqueVariants="false"` or a randomization that couldn't be counted, it was ignored, along with any error in it: the problem's variants came from the document's, not from its `<variantControl>`. With too many variants, the problem had the variants its `<variantControl>` says, but they weren't unique: two of them could show the same content. Now the problem has the variants its `<variantControl>` says, and each gives the same content as it would in a document with unique variants. This changes which content such a problem shows in a given variant of the document.

Closes #2579.
