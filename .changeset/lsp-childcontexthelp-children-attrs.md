---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: extend `childContextHelp` alias resolution beyond documentation so the LSP validates the alias target's children, attribute set, and per-attribute enumerated values — not just its help text.

Before, `<row>` and `<column>` inside `<matrix>` were validated against the tabular `<row>` / `<column>` schemas even though the runtime sugars them into `<matrixRow>` / `<matrixColumn>` (a `MathList`). Authoring the docs examples produced spurious diagnostics (`Element <math> is not allowed inside of <row>.`, `<row> doesn't have an attribute called unordered/maxNumber/…`), element and attribute-name completion offered the wrong sets, and the attribute-value dropdown read its enumeration from the canonical entry.

Now child-element validation, attribute-name validation, attribute-value enumeration, and the corresponding completion branches all consult the alias-aware schema entry when a parent declares a `childContextHelp` redirect, sharing the same `resolveEffectiveSchemaElement` lookup as the documentation popup.
