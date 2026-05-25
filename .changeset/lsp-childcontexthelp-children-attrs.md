---
"@doenet/doenetml": patch
"@doenet/lsp-tools": patch
"@doenet/static-assets": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: extend `childContextHelp` alias resolution beyond documentation so the LSP validates the alias target's children, attribute set, and per-attribute enumerated values — not just its help text.

Before, `<row>` inside `<matrix>` (and `<column>` inside `<matrix>`) was validated against the tabular `<row>` schema even though the runtime sugars it into `<matrixRow>` (a `MathList`). The reference examples in `row_matrix.mdx` and `column_matrix.mdx` triggered spurious diagnostics:

- `Element <math> is not allowed inside of <row>.`
- `Element <row> doesn't have an attribute called unordered/maxNumber/mergeMathLists/asList/displayDigits/...`

Element completion and attribute-name completion in the same context offered the wrong sets, and the attribute-value dropdown read its values list from the canonical entry even when the description popup had already resolved to the alias entry. Three surfaces, one root cause: `parentChildMap` / `nodeAttributeMap` / the in-tag attribute-value branch all consulted the canonical schema entry without checking the parent's `childContextHelp`.

Changes:

- **Schema generator** (`get-schema.ts`): `AliasedSchemaElement` now carries `children` and `acceptsStringChildren`, populated from the alias target's own child groups (`determineChildren`). Confirmed: `aliasedElements.matrixRow.children` now contains `math` (and the rest of the `MathList`-accepting set) and `acceptsStringChildren` is `true`.
- **LSP** (`auto-completer/index.ts`): `isAllowedChild`, `isAllowedAttribute`, and `getAttributeAllowedValues` each accept the relevant parent context and route through `resolveEffectiveSchemaElement` when the parent declares a `childContextHelp` redirect. `_getAllowedChildren` takes the same path so in-tag `<` completions inside the alias context offer the alias's children. The attribute-name normalization map (`schemaAttributesLowerToUpper`) is seeded from both canonical and alias attribute lists so a name that exists only on an alias still passes through normalization rather than short-circuiting as `UNKNOWN_NAME`.
- **`getSchemaViolations`** threads grandparent / parent context through so child-relationship and attribute diagnostics see the alias-aware schema.
- **`get-completion-items.ts`**: the `body`/`<` and `openTagName` branches pass parent context to `_getAllowedChildren`; the openTag/attributeName branch reads attribute names from the alias-aware `helpEntry`; the attribute-value branch reads both `allowedAttributes` and the per-attribute `values` / `autocompleteValues` from the alias-aware effective entry — closing #1092.
- The agree-by-construction guarantee carries over: the dropdown, in-tag completion, the documentation popup, and the schema-violation diagnostics all consume the same `resolveEffectiveSchemaElement` output for a given parent/child pair.

Runtime cleanup is intentionally deferred (tracked in #1186). The `Row.js` / `Column.js` workaround attributes (`functionSymbols`, `referencesAreFunctionSymbols`, `splitSymbols`, `parseScientificNotation`) stay where they are because `convertNormalizedDast` validates attributes before sugar fires — removing them would make `<row functionSymbols="h">` inside `<matrix>` throw `Invalid attribute` before being sugared (covered by `matrix.test.ts` "functionSymbols"). The TODO comments on those workarounds are updated to point at #1186, which proposes moving the matrix sugar to the parser's `pluginComponentSugar` so the rename happens before attribute validation; then the declarations can be removed from `Row.js` / `Column.js` entirely (they're already on `MatrixRow` / `MatrixColumn` via `MathList` inheritance).

Tests:

- `packages/static-assets/test/get-schema-top-level.test.ts` — 2 new tests pinning that `aliasedElements.matrixRow` / `matrixColumn` carry `children` (includes `math`) and `acceptsStringChildren: true`.
- `packages/lsp-tools/test/doenet-auto-schema-check.test.ts` — 8 new tests across two `describe` blocks: a focused fixture covering alias-permitted child / attribute / value paths and canonical fallback, plus end-to-end smoke against `doenetSchema` driving the exact `<matrix><row><math>` and `<matrix><row unordered>` shapes from the docs that motivated the bug.
- `packages/lsp-tools/test/doenet-auto-complete.test.ts` — 8 new tests covering alias-aware `<` (body) completion, `openTagName` completion, attribute-name completion, and attribute-value completion (including per-value descriptions from `autocompleteValues`), plus canonical-fallback assertions and end-to-end smoke against `doenetSchema`.

All 369 tests in `lsp-tools` and 29 in `static-assets` pass.

Closes #1174 and #1092.
