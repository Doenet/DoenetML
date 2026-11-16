---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A name in a `<variantControl>`'s `variantsToInclude` or `variantsToExclude` that is not a variant no longer stops the document from loading. The name is ignored, with an error at the attribute (`doenet-e0078`), and the other names are used: "`variantsToInclude` names `grape`, which is not a variant of this document. Its 3 variants are named `apple`, `banana`, `cherry`. The name is ignored." When `variantsToInclude` names no variant at all, every variant is included. Before, the document failed to load with the untranslated message "Cannot include variant grape as grape is a not variant name". This holds for the `<variantControl>` of a document and of a `<problem>` or other section.

Names are compared without case, as before. With unique variants, a document has no more variants than it has unique ones, so a name past them (`c`, when there are two unique variants) is now not a variant, with the same error. Before, such a name was dropped from `variantsToInclude` silently, and when it was the only name the document failed to load; in `variantsToExclude` it did nothing, silently. For a document that loaded before, which variants it has and which variant each variant index gives are unchanged.
