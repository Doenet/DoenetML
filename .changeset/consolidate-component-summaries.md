---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/v06-to-v07": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Reword the one-sentence component summaries surfaced by the editor's context-sensitive help and the schema.

- ~234 per-component summaries (the `static componentDocs.summary` on each component class) were reconciled against the prior reference-docs wording. The worker class is now the single source of truth; the alphabetical and by-type reference indexes are generated from it.
- Style is uniform across all 245 components: starts with a capital letter; no trailing period.
- A handful of substantive corrections, most notably `<pretzel>` (which previously described itself as "a figure for visualizing logical compositions of subsets of the reals" — entirely wrong; now describes its actual response-matching behavior) and `<attractToConstraint>` (which had mirrored `<attractTo>`'s description instead of its own).
- The autocomplete-popup hover text, the in-editor help panel, and any other surface that reads `componentDocs.summary` will all show the new wording.
