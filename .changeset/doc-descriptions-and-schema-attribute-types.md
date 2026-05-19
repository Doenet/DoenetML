---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Use schema descriptions in the generated documentation and give schema attributes their own type.

Each schema attribute now carries a `type` derived from its own declaration: `createComponentOfType`/`createPrimitiveOfType` (with the `string` primitive surfaced as `text`), `keyword` when the attribute enumerates valid values, and `reference` for reference-creating attributes — or `referenceOrText` when such an attribute also sets `allowStrings` (e.g. `<ref to>`, which accepts a URL string in addition to a component reference). Previously an attribute's type was inferred only from a same-named property, so attributes without one (e.g. `<answer>`'s `type`, `showCorrectness`, `colorCorrectness`) had no type.

The reference documentation now renders the attribute, property, and attribute-value descriptions (and component summaries) that were already used for editor context-help and autocomplete.

The unused `description` attribute of `<answer>` is excluded from the schema, so it no longer appears in autocomplete or RelaxNG validation.
