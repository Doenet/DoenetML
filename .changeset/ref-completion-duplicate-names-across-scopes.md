---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: Fix missing property autocomplete and context help for references to a name that is reused across sibling scopes.

Given two `<exercise>` sections that each contain a `<point name="P">`, `$P.styleDescription` resolved correctly at runtime, but typing `$P.` in the editor offered no property suggestions and the context-help panel said nothing about `styleDescription`. Both features now describe the point inside the same `<exercise>` as the reference, matching what the document renders.

Both features share one resolver lookup, which used to begin its search above the enclosing `<exercise>`, where both points named `P` are in view; the ambiguous name left the editor with nothing to offer. The lookup now starts from inside the enclosing element, the same place a bare `$P` reference was already resolved from.
